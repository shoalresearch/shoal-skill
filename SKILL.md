---
name: shoal
description: Use Shoal via the connected MCP server or the Shoal REST API to look up crypto intelligence and manage webhooks.
metadata:
  tags: shoal, api, signal, radar, crypto, intelligence, mcp
  userInvocable: true
---

## What is Shoal

Shoal is a crypto intelligence API that tracks 5,000+ organizations across signal and radar events. Signal events are high-conviction, scored intelligence. Radar events are broader market-moving activity. Both are clustered from multiple source posts.

Products: **Shoal Intel** (scored signals API), **Shoal Research** (custom reports), **Shoal Media** (content/interviews).

## Preferred execution path

1. If Shoal MCP tools are available in the client, use them first.
2. If Shoal MCP is not connected, tell the user to connect the remote MCP server at `https://api.shoal.xyz/mcp`.
3. Only fall back to raw REST calls when the user explicitly wants HTTP examples or MCP is unavailable.

Do not ask the user to paste a raw API key into the MCP auth screen. The live Shoal MCP uses app-based OAuth through `app.shoal.xyz`.

## Setup

### Remote MCP (recommended)

Server URL: `https://api.shoal.xyz/mcp`

OAuth discovery:

```text
https://api.shoal.xyz/.well-known/oauth-authorization-server
https://api.shoal.xyz/.well-known/oauth-protected-resource/mcp
```

Auth flow:

1. Start MCP auth from the client with the Shoal server URL above.
2. The browser is redirected to `app.shoal.xyz`.
3. The user signs in to Shoal if needed.
4. Shoal checks that the signed-in account already has a valid API key with remaining quota.
5. Shoal issues MCP access without exposing the raw API key to the MCP client.

Important:

- The user must already have a Shoal API key on their account.
- That API key must still have quota remaining.
- MCP usage is charged and tracked against the same Shoal API key allocation as normal API usage.
- If Shoal MCP tools are present, prefer them over CLI or direct HTTP.

### Legacy local CLI + stdio MCP

Use this only when you intentionally want a local key-based setup instead of the hosted Shoal MCP.

```bash
npm install -g shoal-cli
shoal auth YOUR_API_KEY
claude mcp add --transport stdio shoal -- shoal-mcp
```

### REST API

Base URL: `https://api.shoal.xyz/v1`

Auth header: `Authorization: Bearer <api_key>`

Rate limit: 100 requests/minute per key. Headers `X-RateLimit-Limit` and `X-RateLimit-Remaining` on every response. 429 returns `Retry-After`.

Use REST directly only when:

- the user explicitly asks for HTTP examples
- you need curl snippets
- Shoal MCP is not available in the environment

Quick curl examples:

```bash
curl -s -H "Authorization: Bearer $SHOAL_API_KEY" \
  'https://api.shoal.xyz/v1/search?query=arbitrum&limit=10&since=2026-03-01T00:00:00Z'

curl -s -H "Authorization: Bearer $SHOAL_API_KEY" \
  'https://api.shoal.xyz/v1/signal/top?limit=10'

curl -s -H "Authorization: Bearer $SHOAL_API_KEY" \
  'https://api.shoal.xyz/v1/organizations/byOrganizationName?name=Ethereum'
```

## MCP tool reference

Current remote Shoal MCP tools:

```text
shoal_search
shoal_get_top_signal_events
shoal_get_all_signal_events
shoal_get_signal_by_organization_id
shoal_get_signal_by_category
shoal_get_all_radar_events
shoal_get_radar_by_organization_id
shoal_get_radar_by_category
shoal_get_all_organizations
shoal_get_organization_by_id
shoal_get_organization_by_name
shoal_get_organization_signal_history
shoal_get_brief
shoal_get_brief_batch
shoal_get_categories
shoal_get_usage_stats
shoal_list_webhooks
shoal_create_webhook
shoal_get_webhook
shoal_update_webhook
shoal_delete_webhook
```

When Shoal MCP is connected:

- Use the MCP tool names above instead of inventing raw endpoint calls.
- Do not request API credentials from the user.
- Treat MCP results as already authenticated Shoal API responses.
- Webhook management is supported through MCP as well as REST.

## API Reference

### Organizations

```
GET /v1/organizations/all?limit=50&offset=0
GET /v1/organizations/byOrganizationId?id=526&include=radar,signal&includeLimit=5
GET /v1/organizations/byOrganizationName?name=Ethereum
GET /v1/organizations/:id/signal-history?days=30
```

### Signal (high-conviction scored events)

```
GET /v1/signal/top?limit=10                          # Top by score (default: last 24h)
GET /v1/signal/all?since=2026-03-01T00:00:00Z        # since REQUIRED
GET /v1/signal/byOrganizationId?id=526&since=...
GET /v1/signal/byCategory?category=partnership&since=...
```

### Radar (broader market activity)

```
GET /v1/radar/all?since=2026-03-01T00:00:00Z         # since REQUIRED
GET /v1/radar/byOrganizationId?id=526&since=...
GET /v1/radar/byCategory?category=security_incident&since=...
```

### Search

```
GET /v1/search?query=hack&limit=10&since=...
```

Equivalent MCP tool: `shoal_search`

### Brief (consolidated intelligence)

```
GET /v1/brief?id=526&since=2026-03-01T00:00:00Z&limit=5&compact=true
GET /v1/brief/batch?ids=526,100,200&since=...&limit=5&compact=true   # max 25 IDs
```

Equivalent MCP tools: `shoal_get_brief`, `shoal_get_brief_batch`

### Webhooks

```
POST   /v1/webhooks         {"url":"https://...","event_types":["radar","signal"]}
GET    /v1/webhooks
GET    /v1/webhooks/:id
PATCH  /v1/webhooks/:id     {"url":"...","event_types":[...],"active":false}
DELETE /v1/webhooks/:id
```

Max 5 webhooks per key. Secret returned only at creation. Deliveries signed with HMAC-SHA256 (`X-Shoal-Signature: sha256=<hex>`). Must respond 2xx within 10s. Retries: 15s, 1m, 5m, 30m (5 attempts). Auto-disabled after 50 consecutive failures.

### Usage

```
GET /v1/usage   # returns { today, thisWeek, thisMonth }
```

Equivalent MCP tool: `shoal_get_usage_stats`

### Categories

```
GET /v1/categories
```

Common categories: `partnership`, `regulation_legal`, `security_incident`, `product_development`, `market_update`.

## Pagination

All list endpoints: `limit` max 50, `offset` max 500. For deeper paging, use cursor-based pagination:

1. First request returns `next_cursor` in the response
2. Pass `cursor=<next_cursor>` on the next request (keep same `since`)
3. Continue until `next_cursor` is null
4. Cursors are opaque base64url tokens. Do not construct or parse them.

## Polling pattern

```
1. GET /v1/signal/all?since=2026-03-01T00:00:00Z
2. Note the newest latestPostTimestamp from the response
3. Next poll: since=<that timestamp>
4. Empty data[] = nothing new. Recommended interval: 60s.
```

## Data models

```
Organization: { id, label, aliases[] }
RadarEvent / SignalEvent: { id, title, eventCategory, eventSubcategory, globalSummary, bulletSummary[], eventOwner[], eventParticipants[], posts[], latestPostTimestamp, signal }
Entity: { id, label, type, aliases[] }
Post: { id, content, url, timestamp }
```

Signal events require >= 2 posts and include a quantified signal score.

## CLI commands

```bash
shoal auth <key>                  # Save API key
shoal search "query" -l 10 -s 7d # Search across all events
shoal signal top -l 10            # Top signals
shoal signal all -s 2h            # Signals from last 2 hours
shoal signal org <id> -s 1d       # Signals for org, last day
shoal signal category <cat>       # Signals by category
shoal signal history <id> -d 30   # Daily signal/radar counts
shoal radar all -s 24h            # All radar, last 24h
shoal radar org <id>              # Radar for org
shoal radar category <cat>        # Radar by category
shoal orgs search <name>          # Search organizations
shoal orgs get <id> -i radar,signal  # Org detail with embeds
shoal categories                  # List categories
shoal brief org <id> -s 7d       # Intelligence brief
shoal brief batch 526,100 -s 7d  # Batch briefs (max 25)
shoal webhooks list               # List webhooks
shoal webhooks create <url> -e radar,signal
shoal webhooks get <id>
shoal webhooks update <id> --no-active
shoal webhooks delete <id>
shoal usage                       # API usage stats
```

The `-s/--since` flag accepts ISO timestamps or shorthand: `30m`, `2h`, `1d`, `7d`.

## Common workflows

### "What's happening with X?"
1. If MCP is available, use `shoal_get_organization_by_name` to get the org ID.
2. Use `shoal_get_brief` with a recent `since` for a consolidated snapshot.
3. If you need more detail, use `shoal_get_signal_by_organization_id` or `shoal_get_radar_by_organization_id`.
4. If MCP is unavailable, use the equivalent REST endpoints.

### "What are the top signals right now?"
1. Prefer `shoal_get_top_signal_events` with limit 10-20.

### "Monitor an org for new activity"
1. Set up a webhook with `shoal_create_webhook`.
2. Or poll with `shoal_get_signal_by_organization_id` and `shoal_get_radar_by_organization_id` using advancing `since` timestamps.

### "Compare activity across orgs"
1. Use `shoal_get_brief_batch` with up to 25 IDs and `compact=true` to reduce payload.

### "Find ALL events about a topic" (exhaustive search)

Search returns max 20 results per query and matches on keywords, so a single query WILL miss events. You MUST fan out aggressively. A lazy single-query search is unacceptable when the user asks for "all" or "every" event.

**Step 1: Fan out with 10-20 parallel searches using synonyms and related terms.**

Every concept has multiple phrasings. Run ALL of them in parallel:

| Topic | Search queries to run (ALL of these, not just one) |
|-------|---------------------------------------------------|
| MCP | `"MCP"`, `"MCP server"`, `"MCP integration"`, `"MCP launch"`, `"Model Context Protocol"`, `"MCP tools"`, `"MCP agent"` |
| CLI | `"CLI"`, `"CLI launch"`, `"command line"`, `"open-source CLI"`, `"developer CLI"`, `"terminal tool"` |
| Skills | `"skills"`, `"AI skills"`, `"agent skills"`, `"skills launch"`, `"skills hub"`, `"Claude skill"`, `"skill integration"` |
| AI agents | `"AI agent"`, `"agent framework"`, `"autonomous agent"`, `"agent kit"`, `"agentic"`, `"agent launch"`, `"agent platform"` |
| Wallets | `"wallet"`, `"wallet launch"`, `"agent wallet"`, `"wallet standard"`, `"wallet kit"` |
| Payments | `"payment"`, `"micropayment"`, `"x402"`, `"pay per request"`, `"agent payment"`, `"agent commerce"` |

**Step 2: Category sweep for anything the text search missed.**

Search only matches keywords. Category endpoints return ALL events of that type. For launch/tool queries:
```bash
curl -s -H "Authorization: Bearer $SHOAL_API_KEY" 'https://api.shoal.xyz/v1/radar/byCategory?category=product_development&since=2026-03-01T00:00:00Z&limit=50'
curl -s -H "Authorization: Bearer $SHOAL_API_KEY" 'https://api.shoal.xyz/v1/signal/byCategory?category=product_development&since=2026-03-01T00:00:00Z&limit=50'
```
Page through with cursors if there are more. Filter the results locally for your keywords.

**Step 3: Deduplicate by event `id`.** Multiple queries WILL return overlapping results. Collect everything, deduplicate, then filter.

**Step 4: Present results grouped by topic in separate tables, sorted by date descending.**

Format:
```
MCP Launches
| Date   | Company              | Event                                            |
|--------|----------------------|--------------------------------------------------|
| Mar 27 | Pendle               | Launches Pendle Skills and MCP for AI agents      |
| Mar 26 | DefiLlama            | Launches MCP for AI agents with 23 tools          |
...

CLI Launches
| Date   | Company              | Event                                            |
...

Skills Launches
| Date   | Company              | Event                                            |
...
```

**Rules:**
- When the user says "all" or "every", you MUST run at least 10 parallel searches. No shortcuts.
- Always include a category sweep as a safety net.
- If a single search returns 20 results (the max), there are likely more — add more query variants.
- Group results by the user's requested categories, not by API response.
- Include ALL matching events, even tangential ones. Let the user decide what's relevant.
- Show company/org name from `eventOwner`, not from participants.

## Gotchas

- Shoal MCP auth is account-based. Users without an existing Shoal API key with remaining quota cannot complete MCP authorization.
- Shoal MCP usage still counts against the same API key allocation as direct REST usage.
- `/radar/all` and `/signal/all` REQUIRE `since` parameter. Other filtered endpoints make it optional.
- `offset` max is 500. Use cursor pagination for deeper results.
- Webhook secrets are only returned at creation time. Store them immediately.
- Cursor tokens are tied to the `since` value that produced them. Changing `since` invalidates the cursor.
- The API is hosted on Vercel serverless functions. No WebSocket support; use webhooks for real-time.
