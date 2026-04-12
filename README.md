# Shoal Skill and Claude Code Plugin

This repo provides two Shoal integrations for Claude Code:

- `shoal-skill` npm package, which installs the Shoal skill into your local Claude Code skills directory
- `shoal` Claude Code plugin, which points Claude Code at Shoal's hosted MCP server and bundles the same skill guidance

Skills are not MCP tools. The skill tells Claude Code how to use the available Shoal MCP tools correctly.

## Recommended setup

Use the hosted Shoal MCP server:

```text
https://api.shoal.xyz/mcp
```

Authentication happens through `app.shoal.xyz` using Shoal's hosted OAuth flow. The account must already have a valid API key with remaining quota.

For new workflows, Shoal is entity-first:

1. resolve a canonical entity
2. inspect relationships or references
3. traverse entity timeline, media, or research
4. use org routes only for compatibility

## Claude Code Plugin Marketplace

Add the marketplace:

```text
/plugin marketplace add shoalresearch/shoal-skill
```

Install the plugin:

```text
/plugin install shoal@shoalresearch-tools
```

Reload plugins:

```text
/reload-plugins
```

The plugin bundles:

- the hosted Shoal MCP connector
- the Shoal skill

## Skill-only install

Install from npm:

```bash
npx shoal-skill@latest
```

Or:

```bash
npm install -g shoal-skill
shoal-skill
```

## Current use cases the skill is optimized for

- resolve canonical crypto entities from fuzzy names or aliases
- pull entity relationships and references
- traverse scoped timelines for one entity
- inspect entity-linked media and research content
- fetch signal, radar, category, and brief surfaces
- manage webhook and export workflows when the account plan allows them

## Docs

- MCP docs: https://docs.shoal.xyz/integrations/mcp
- CLI docs: https://docs.shoal.xyz/guides/cli
- API docs: https://docs.shoal.xyz
