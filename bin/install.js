#!/usr/bin/env node

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillSource = join(__dirname, "..", "SKILL.md");
const skillDir = join(homedir(), ".claude", "skills", "shoal");
const skillDest = join(skillDir, "SKILL.md");

try {
  const content = readFileSync(skillSource, "utf-8");

  mkdirSync(skillDir, { recursive: true });
  writeFileSync(skillDest, content);

  console.log(`
  Shoal skill installed.

  You can now use /shoal in Claude Code for entity-first
  Shoal MCP, API, and CLI guidance.

  Docs: https://docs.shoal.xyz
`);
} catch (err) {
  console.error(`Failed to install skill: ${err.message}`);
  process.exit(1);
}
