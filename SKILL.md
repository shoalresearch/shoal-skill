---
name: shoal
description: Use Shoal through the hosted MCP server or the Shoal API to resolve canonical crypto entities, inspect relationships, traverse timelines, and manage delivery workflows.
metadata:
  tags: shoal, api, mcp, signal, radar, crypto, intelligence, entities
  userInvocable: true
---

## What Shoal is

Shoal is a crypto intelligence API and MCP surface built around canonical entities, event timelines, and relationship traversal.

Primary product shape:

- canonical entity resolution
- scoped signal and radar event access
- entity relationships, references, media, and research
- briefs, webhooks, usage, and export workflows

## Important distinction

Shoal skills are not MCP tools.

- The skill is the instruction layer.
- The MCP server provides the callable tools.
- Prefer MCP tools when they are available.
- Only fall back to raw REST or CLI when the user explicitly asks for them or MCP is unavailable.

## Preferred execution path

1. If Shoal MCP tools are available in the client, use them first.
2. Prefer the hosted Shoal MCP server at `https://api.shoal.xyz/mcp`.
3. Only use direct REST examples when the user explicitly wants HTTP examples.
4. Only use the local CLI or local stdio MCP when the hosted MCP route is not available or the user explicitly asks for a key-based local setup.

Do not ask the user to paste a raw API key into the hosted MCP auth screen. Hosted Shoal MCP uses app-based OAuth through `app.shoal.xyz`.

## Hosted MCP setup

Server URL:

```text
https://api.shoal.xyz/mcp
```

OAuth discovery:

```text
https://api.shoal.xyz/.well-known/oauth-authorization-server
https://api.shoal.xyz/.well-known/oauth-protected-resource/mcp
```

Hosted auth flow:

1. Start MCP auth from the client with the Shoal server URL above.
2. The browser is redirected to `app.shoal.xyz`.
3. The user signs in to Shoal.
4. Shoal validates that the account has a valid API key with remaining quota.
5. Shoal grants MCP access without exposing the raw key to the client.

Important:

- The user must already have a Shoal API key on their account.
- That key must still have quota remaining.
- Some hosted Shoal surfaces may also be payment-gated or plan-gated.

## Local fallback setups

### CLI

```bash
npm install -g shoal-cli
shoal auth YOUR_API_KEY
shoal setup
shoal latest --window 24h
```

### Local stdio MCP

```bash
shoal setup
```

Use local key-based setup only when the hosted MCP route is unavailable or the user explicitly wants a local API-key workflow.

## How to use Shoal correctly

For new integrations and analysis, prefer the entity-first flow:

1. resolve a name or alias into a canonical entity
2. inspect relationships and references
3. traverse that entity's timeline
4. fetch media or research content when needed
5. use compatibility organization routes only when a legacy flow still depends on them

When the user says things like:

- "look up Ethereum"
- "find the right entity"
- "show me who is connected to X"
- "give me recent signal on X"
- "give me the timeline for X"

Start with canonical entity resolution and continue from there.

## Common MCP capabilities

Tool availability depends on the authenticated account and whether the client is connected to the hosted Shoal MCP or a local stdio Shoal MCP.

Current common tool families include:

- entity resolution and entity lookup
- entity relationships and references
- entity timeline
- signal and radar feeds
- briefs
- categories and usage
- webhook management
- on some setups, entity media, entity research, and export jobs

Do not invent endpoint calls when the MCP tool already exists in the client.

## REST guidance

Base URL:

```text
https://api.shoal.xyz/v1
```

Auth header for direct API use:

```text
Authorization: Bearer <api_key>
```

Use REST directly only when:

- the user explicitly asks for HTTP examples
- MCP is unavailable
- the user needs curl snippets or direct backend integration details

Entity-first examples:

```bash
curl -s -H "Authorization: Bearer $SHOAL_API_KEY" \
  'https://api.shoal.xyz/v1/entities/byName?name=Ethereum&limit=5'

curl -s -H "Authorization: Bearer $SHOAL_API_KEY" \
  'https://api.shoal.xyz/v1/entities/23151/relationships?limit=10'

curl -s -H "Authorization: Bearer $SHOAL_API_KEY" \
  'https://api.shoal.xyz/v1/timeline/byOrganizationId?id=23151&since=2026-04-01T00:00:00Z&limit=10'
```

## Current recommended use cases

### Entity resolution

Use Shoal to resolve a user-provided name or alias into the stable Shoal entity before doing anything else.

### Relationship traversal

Use entity relationships to move from a protocol to its foundation, related institutions, or adjacent entities.

### Timeline analysis

Use the scoped entity timeline for recent merged event history. Prefer this over broad replay unless the user explicitly needs a wider historical export surface.

### Content inspection

Use entity-linked media and research content when the user wants interviews, media references, or research-specific material for one entity.

### Operational workflows

Use webhooks and export jobs only when the user is clearly asking for delivery or bulk extraction workflows.

## Compatibility note

The `/v1/organizations/*` routes remain available, but they are compatibility surfaces. New workflows should prefer canonical entity resolution and entity-scoped traversal.
