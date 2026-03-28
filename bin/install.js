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

  You can now use /shoal in Claude Code to get full API,
  CLI, and MCP guidance for the Shoal intelligence API.

  Docs: https://docs.shoal.xyz
`);
} catch (err) {
  console.error(`Failed to install skill: ${err.message}`);
  process.exit(1);
}
