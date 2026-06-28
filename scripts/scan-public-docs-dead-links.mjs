#!/usr/bin/env node
/**
 * Scan public-docs for dead internal links to removed paths.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = join(root, "apps/public-docs/src/content/docs");

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (/\.(md|mdx)$/.test(entry)) files.push(full);
  }
  return files;
}

/** @type {RegExp[]} */
const badLinkPatterns = [
  /\/user-manual\//,
  /\/reference\/(ai-native|git-branch|fork-news|folder-and)/,
  /\/v1\/guides\/system-architecture\//,
  /\/manual-setup\//,
  /\/project-overview\//,
  /devdocs\.newsfork\.com/,
];

/** @type {Array<{ file: string; link: string }>} */
const issues = [];

for (const file of walk(docsRoot)) {
  if (file.includes("/moved/")) continue;
  const content = readFileSync(file, "utf8");
  const links = content.match(/\]\([^)]+\)/g) ?? [];
  for (const raw of links) {
    const href = raw.slice(2, -1).split("#")[0];
    if (!href.startsWith("/")) continue;
    for (const pattern of badLinkPatterns) {
      if (pattern.test(href)) {
        issues.push({ file: file.replace(root + "/", ""), link: href });
      }
    }
  }
}

if (issues.length > 0) {
  console.error("❌ Dead link scan failed:\n");
  for (const i of issues) console.error(`  ${i.file} → ${i.link}`);
  process.exit(1);
}

console.log("✅ Public-docs dead link scan passed.");
