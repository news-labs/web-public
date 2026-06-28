#!/usr/bin/env node
/**
 * One-time migration: copy internal public-docs pages to core-platform devdocs.
 * Run from web-public repo root after reviewing content-classification.csv.
 */
import { cpSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webPublicRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const devdocsContent = resolve(
  webPublicRoot,
  "../core-platform/docs/devdocs/src/content/docs",
);

const publicDocs = join(webPublicRoot, "apps/public-docs/src/content/docs");

/** @type {Array<{ src: string; dest: string }>} */
const copies = [
  // Architecture → products/seeds/architecture/
  {
    src: "v1/guides/system-architecture/engine-based-architecture-v6.md",
    dest: "products/seeds/architecture/engine-v6.md",
  },
  {
    src: "v1/guides/system-architecture/queues-domain-fanout-and-worker-roles.md",
    dest: "products/seeds/architecture/queue-fanout.md",
  },
  {
    src: "v1/guides/system-architecture/seed-engine-workflow.md",
    dest: "products/seeds/architecture/seed-engine-workflow.md",
  },
  {
    src: "v1/guides/system-architecture/r2-raw-prod-model.md",
    dest: "products/seeds/architecture/r2-raw-prod.md",
  },
  {
    src: "v1/guides/system-architecture/raw-prod-input-output-datasets.md",
    dest: "products/seeds/architecture/raw-prod-datasets.md",
  },
  {
    src: "v1/guides/system-architecture/news-pool-structure-and-collection-guide.md",
    dest: "products/seeds/architecture/news-pool.md",
  },
  {
    src: "v1/guides/system-architecture/personalization-engine-design.md",
    dest: "products/seeds/architecture/personalization.md",
  },
  {
    src: "v1/guides/system-architecture/distributed-build-and-edge-caching-architecture.md",
    dest: "products/seeds/architecture/edge-caching.md",
  },
  {
    src: "v1/guides/system-architecture/error-handling-design.md",
    dest: "products/seeds/architecture/error-handling.md",
  },
  {
    src: "v1/guides/system-architecture/technology-stack-definition-and-developer-guide.md",
    dest: "products/seeds/architecture/tech-stack.md",
  },
  {
    src: "v1/guides/system-architecture/json-structure-design.md",
    dest: "products/seeds/architecture/json-structure-design.md",
  },
  {
    src: "v1/guides/system-architecture/fork-news-seed-data.md",
    dest: "products/seeds/architecture/fork-news-seed-data.md",
  },
  {
    src: "v1/guides/system-architecture/source-domain-to-source-url-discovery.md",
    dest: "products/seeds/architecture/source-domain-discovery.md",
  },
  // Seeds ops → engineering/seeds-ops/
  { src: "user-manual/environment.md", dest: "engineering/seeds-ops/environment.md" },
  { src: "user-manual/deployment.md", dest: "engineering/seeds-ops/deployment.md" },
  { src: "user-manual/local-testing.md", dest: "engineering/seeds-ops/local-testing.md" },
  {
    src: "user-manual/local-runnable-project-structure.md",
    dest: "engineering/seeds-ops/project-structure.md",
  },
  {
    src: "user-manual/test-and-deployment.md",
    dest: "engineering/seeds-ops/test-and-deploy.md",
  },
  {
    src: "user-manual/translation-pipeline.md",
    dest: "engineering/seeds-ops/translation-pipeline.md",
  },
  { src: "v1/guides/test.md", dest: "engineering/seeds-ops/testing.md" },
  { src: "v1/guides/upload-to-r2.md", dest: "engineering/seeds-ops/upload-to-r2.md" },
  {
    src: "v1/guides/r2-operations-standard.md",
    dest: "engineering/seeds-ops/r2-operations.md",
  },
  {
    src: "v1/guides/automated-translation-pipeline-design.md",
    dest: "engineering/seeds-ops/translation-pipeline-design.md",
  },
  // Reference → engineering/development-workflow/
  {
    src: "reference/ai-native-cursor-git-sop.md",
    dest: "engineering/development-workflow/ai-native-cursor-git-sop.md",
  },
  {
    src: "reference/git-branch-usage.md",
    dest: "engineering/development-workflow/git-branch-usage.md",
  },
  // Strategy
  {
    src: "reference/fork-news-competitive-analysis.md",
    dest: "internal/strategy/fork-news-competitive-analysis.md",
  },
  // KO-only experiment
  {
    src: "ko/v1/guides/github-scan-poc.md",
    dest: "internal/experiments/github-scan-poc.md",
  },
];

let copied = 0;
for (const { src, dest } of copies) {
  const from = join(publicDocs, src);
  const to = join(devdocsContent, dest);
  if (!existsSync(from)) {
    console.warn(`skip (missing): ${src}`);
    continue;
  }
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
  copied++;
  console.log(`copied: ${src} → ${dest}`);
}

console.log(`\n✅ Copied ${copied} files to devdocs.`);
