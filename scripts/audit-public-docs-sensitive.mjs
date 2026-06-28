#!/usr/bin/env node
/**
 * Fail CI if public-docs content contains internal/sensitive patterns.
 * See scripts/content-classification.csv and apps/public-docs/docs/PLAN-content-separation.md
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = join(root, "apps/public-docs/src/content/docs");

/** @type {Array<{ name: string; pattern: RegExp }>} */
const forbidden = [
  { name: "wrangler secret", pattern: /wrangler\s+secret/i },
  { name: "workers.dev admin URL", pattern: /\.workers\.dev/i },
  { name: "nl-api worker", pattern: /\bnl-api-/i },
  { name: "nl-portal worker", pattern: /\bnl-portal-/i },
  { name: "system admin api key", pattern: /SYSTEM_ADMIN_API_KEY/i },
  { name: "web admin api key", pattern: /WEB_ADMIN_API_KEY/i },
  { name: "editor admin api key", pattern: /EDITOR_ADMIN_API_KEY/i },
  { name: "devdocs.newsfork.com", pattern: /devdocs\.newsfork\.com/i },
  { name: "legacy user-manual path", pattern: /\/user-manual\//i },
  { name: "legacy system-architecture path", pattern: /\/system-architecture\//i },
  { name: "legacy reference path", pattern: /\/reference\/(ai-native|git-branch|fork-news)/i },
];

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "moved") continue;
      files.push(...walk(full));
    } else if (/\.(md|mdx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

/** @type {Array<{ file: string; rule: string; match: string }>} */
const violations = [];

for (const file of walk(docsRoot)) {
  const content = readFileSync(file, "utf8");
  for (const { name, pattern } of forbidden) {
    const m = content.match(pattern);
    if (m) {
      violations.push({
        file: file.replace(root + "/", ""),
        rule: name,
        match: m[0],
      });
    }
  }
}

if (violations.length > 0) {
  console.error("❌ public-docs sensitive content audit failed:\n");
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file} → "${v.match}"`);
  }
  console.error(`\n${violations.length} violation(s). Move content to core-platform/docs/devdocs.`);
  process.exit(1);
}

console.log("✅ public-docs sensitive content audit passed.");
