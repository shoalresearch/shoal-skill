# Shoal Skill and Claude Code Plugin

This repo provides two Shoal integrations for Claude Code:

- `shoal-skill` npm package for installing the Shoal skill directly
- `shoal` Claude Code plugin, distributed through a plugin marketplace in this repository

## Hosted MCP

Shoal's hosted MCP server is:

```text
https://api.shoal.xyz/mcp
```

Authentication happens through `app.shoal.xyz`. The account must already have a valid API key with remaining quota.

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

## Skill-Only Install

Install from npm:

```bash
npx shoal-skill@latest
```

Or:

```bash
npm install -g shoal-skill
shoal-skill
```

## Docs

- MCP docs: https://docs.shoal.xyz/integrations/mcp
- API docs: https://docs.shoal.xyz
