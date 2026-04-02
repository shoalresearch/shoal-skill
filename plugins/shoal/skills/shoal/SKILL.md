---
name: shoal
description: Use the hosted Shoal MCP connector in Claude Code to search crypto intelligence, monitor organizations, and review usage.
metadata:
  tags: shoal, mcp, crypto, intelligence, signal, radar
  userInvocable: true
---

## Preferred execution path

1. If Shoal MCP tools are available, use them first.
2. Prefer the hosted Shoal MCP server at `https://api.shoal.xyz/mcp`.
3. Only fall back to raw REST examples when the user explicitly asks for HTTP or the connector is unavailable.

Do not ask the user to paste a raw API key into Claude Code for hosted MCP auth. Shoal uses app-based OAuth through `app.shoal.xyz`.

## Authentication

Shoal MCP for Claude Code uses the hosted server:

```text
https://api.shoal.xyz/mcp
```

The user is redirected to `app.shoal.xyz`, signs in, and approves access. The account must already have a valid API key with remaining quota.

## Tool availability

The exact Shoal tool set depends on the authenticated account's plan.

Common tools include:

```text
shoal_search
shoal_get_top_signal_events
shoal_get_signal_by_organization_id
shoal_get_signal_by_category
shoal_get_radar_by_organization_id
shoal_get_radar_by_category
shoal_get_organization_by_id
shoal_get_organization_by_name
shoal_get_organization_signal_history
shoal_get_categories
shoal_get_usage_stats
```

Higher-tier accounts may also see:

```text
shoal_get_brief
shoal_get_brief_batch
shoal_get_all_signal_events
shoal_get_all_radar_events
shoal_get_all_organizations
shoal_list_webhooks
shoal_create_webhook
shoal_get_webhook
shoal_update_webhook
shoal_delete_webhook
```

## Usage guidance

- Prefer filtered and summary-oriented Shoal tools over bulk feeds unless the user explicitly needs bulk access.
- Treat `all/*` and webhook workflows as higher-tier surfaces.
- `shoal_get_usage_stats` returns request counts plus monthly budget information.
- For detailed setup or REST examples, see `https://docs.shoal.xyz/integrations/mcp`.
