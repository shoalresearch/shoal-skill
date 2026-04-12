#!/usr/bin/env node

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillSource = join(__dirname, "..", "SKILL.md");
const claudeHome = process.env.CLAUDE_HOME || join(homedir(), ".claude");
const codexHome = process.env.CODEX_HOME || join(homedir(), ".codex");
const installTargets = [
  join(claudeHome, "skills", "shoal"),
  join(codexHome, "skills", "shoal"),
];

try {
  const content = readFileSync(skillSource, "utf-8");

  for (const skillDir of installTargets) {
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, "SKILL.md"), content);
  }

  console.log(`
  Shoal skill installed.

  Installed to:
    ~/.claude/skills/shoal
    ~/.codex/skills/shoal

  You can now use /shoal in Codex and Claude Code for
  entity-first Shoal MCP, API, and CLI guidance.

  Docs: https://docs.shoal.xyz
`);
} catch (err) {
  console.error(`Failed to install skill: ${err.message}`);
  process.exit(1);
}
