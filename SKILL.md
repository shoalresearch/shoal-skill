---
name: shoal
description: Look up intelligence on a company using the Shoal API.
metadata:
  tags: shoal, api, signal, radar, crypto, intelligence, mcp
  userInvocable: true
---

## What is Shoal

Shoal is a crypto intelligence API that tracks 5,000+ organizations across signal and radar events. Signal events are high-conviction, scored intelligence. Radar events are broader market-moving activity. Both are clustered from multiple source posts.

Products: **Shoal Intel** (scored signals API), **Shoal Research** (custom reports), **Shoal Media** (content/interviews).

## Setup

### CLI + MCP (recommended for AI agents)

```bash
npm install -g shoal-cli
shoal auth YOUR_API_KEY
claude mcp add --transport stdio shoal -- shoal-mcp
```

The MCP server exposes 19 tools (signal_top, signal_all, signal_org, signal_category, signal_history, radar_all, radar_org, radar_category, orgs_search, orgs_get, search, categories, brief_org, brief_batch, webhooks_list, webhooks_create, webhooks_get, webhooks_update, webhooks_delete, usage).

### REST API

Base URL: `https://api.shoal.xyz/v1`

Auth header: `Authorization: Bearer <api_key>`

Rate limit: 100 requests/minute per key. Headers `X-RateLimit-Limit` and `X-RateLimit-Remaining` on every response. 429 returns `Retry-After`.

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
GET /v1/search?q=hack&limit=10&since=...
```

### Brief (consolidated intelligence)

```
GET /v1/brief?id=526&since=2026-03-01T00:00:00Z&limit=5&compact=true
GET /v1/brief/batch?ids=526,100,200&since=...&limit=5&compact=true   # max 25 IDs
```

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
1. `orgs_search` by name to get the org ID
2. `brief_org` with the ID and a recent `since` for a consolidated snapshot
3. If you need more detail, `signal_org` or `radar_org` for the full event list

### "What are the top signals right now?"
1. `signal_top` with limit 10-20

### "Monitor an org for new activity"
1. Set up a webhook: `webhooks_create` with the org's events
2. Or poll: `signal_org` + `radar_org` with advancing `since` timestamps

### "Compare activity across orgs"
1. `brief_batch` with comma-separated IDs (max 25) and `compact=true` to reduce payload

## Gotchas

- `/radar/all` and `/signal/all` REQUIRE `since` parameter. Other filtered endpoints make it optional.
- `offset` max is 500. Use cursor pagination for deeper results.
- Webhook secrets are only returned at creation time. Store them immediately.
- Cursor tokens are tied to the `since` value that produced them. Changing `since` invalidates the cursor.
- The API is hosted on Vercel serverless functions. No WebSocket support; use webhooks for real-time.
