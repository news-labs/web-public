#!/usr/bin/env node
/**
 * Remove internal pages from public-docs after devdocs migration.
 */
import { rmSync, existsSync, cpSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "apps/public-docs/src/content/docs");

/** @type {string[]} */
const removePaths = [
  // system-architecture (all — split pages recreated under v1/guides/)
  "v1/guides/system-architecture",
  "ko/v1/guides/system-architecture",
  // user-manual
  "user-manual",
  "ko/user-manual",
  // reference
  "reference",
  "ko/reference",
  // guides internal
  "v1/guides/test.md",
  "v1/guides/upload-to-r2.md",
  "v1/guides/r2-operations-standard.md",
  "v1/guides/automated-translation-pipeline-design.md",
  "ko/v1/guides/test.md",
  "ko/v1/guides/upload-to-r2.md",
  "ko/v1/guides/r2-operations-standard.md",
  "ko/v1/guides/automated-translation-pipeline-design.md",
  "ko/v1/guides/github-scan-poc.md",
  // orphans
  "project-overview.md",
  "ko/project-overview.md",
  "manual-setup.md",
  "ko/manual-setup.md",
];

/** Split pages: copy to v1/guides before removing system-architecture */
const splitPublic = [
  {
    src: "v1/guides/system-architecture/json-structure-design.md",
    dest: "v1/guides/json-structure-design.md",
  },
  {
    src: "v1/guides/system-architecture/fork-news-seed-data.md",
    dest: "v1/guides/fork-news-seed-data.md",
  },
  {
    src: "v1/guides/system-architecture/source-domain-to-source-url-discovery.md",
    dest: "v1/guides/source-domain-discovery.md",
  },
  {
    src: "ko/v1/guides/system-architecture/json-structure-design.md",
    dest: "ko/v1/guides/json-structure-design.md",
  },
  {
    src: "ko/v1/guides/system-architecture/fork-news-seed-data.md",
    dest: "ko/v1/guides/fork-news-seed-data.md",
  },
  {
    src: "ko/v1/guides/system-architecture/source-domain-to-source-url-discovery.md",
    dest: "ko/v1/guides/source-domain-discovery.md",
  },
];

for (const { src, dest } of splitPublic) {
  const from = join(docs, src);
  const to = join(docs, dest);
  if (existsSync(from)) {
    mkdirSync(dirname(to), { recursive: true });
    cpSync(from, to);
    console.log(`split copy: ${src} → ${dest}`);
  }
}

let removed = 0;
for (const rel of removePaths) {
  const target = join(docs, rel);
  if (!existsSync(target)) {
    console.warn(`skip (missing): ${rel}`);
    continue;
  }
  rmSync(target, { recursive: true, force: true });
  removed++;
  console.log(`removed: ${rel}`);
}

console.log(`\n✅ Removed ${removed} paths from public-docs.`);
