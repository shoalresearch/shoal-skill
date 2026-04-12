---
name: shoal
description: Use the hosted Shoal MCP connector to resolve canonical crypto entities, inspect relationships, and traverse intelligence timelines.
metadata:
  tags: shoal, mcp, crypto, intelligence, entities, signal, radar
  userInvocable: true
---

## Preferred execution path

1. If Shoal MCP tools are available, use them first.
2. Prefer the hosted Shoal MCP server at `https://api.shoal.xyz/mcp`.
3. Only fall back to raw REST or local CLI examples when the user explicitly asks for them.

Do not ask the user to paste a raw API key into Claude Code for hosted MCP auth. Hosted Shoal MCP uses app-based OAuth through `app.shoal.xyz`.

## Authentication

Hosted Shoal MCP flow:

1. Connect `https://api.shoal.xyz/mcp`
2. Complete OAuth through `app.shoal.xyz`
3. Shoal verifies the account has a valid API key with remaining quota
4. MCP access is granted without exposing the raw key to the client

## Current workflow model

Shoal is entity-first.

For most requests:

1. resolve a canonical entity
2. inspect relationships or references
3. fetch timeline, signal, radar, media, or research for that entity
4. use organization routes only for compatibility

## Tool guidance

Exact tool names vary between the hosted Shoal MCP and local stdio Shoal MCP setups, but current tool families include:

- entity resolution and entity lookup
- entity relationships and references
- entity timeline
- signal and radar feeds
- briefs
- categories and usage
- webhook management
- on some setups, entity media, entity research, and export jobs

When the hosted tools are available:

- prefer canonical entity workflows over organization-first workflows
- prefer scoped timeline and entity traversal over bulk feed polling
- prefer filtered surfaces over `all/*` routes unless the user explicitly needs bulk access

## Use-case focus

Use Shoal MCP for:

- resolving fuzzy names like `Ethereum Foundation`, `ETH Treasury`, or `Mantle`
- finding what entity a user actually means
- traversing who is related to an entity
- pulling recent high-signal or timeline data for one entity
- reviewing entity-linked media or research content
- managing webhooks and usage when the user is operating an integration
