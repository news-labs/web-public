#!/usr/bin/env node
/**
 * Ensures labs-core is available for @core-labs/admin-shell file: dependency.
 * Local: expects ../../labs-core relative to web-public (news-labs org layout).
 * CI: clones LABS_CORE_REPO when admin-web-portal exists and labs-core is missing.
 */

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const adminAppPkg = join(repoRoot, "apps/admin-web-portal/package.json");
const labsCorePath = resolve(repoRoot, "../../labs-core");
const adminShellPath = join(labsCorePath, "packages/admin-shell");

if (!existsSync(adminAppPkg)) {
  process.exit(0);
}

if (existsSync(adminShellPath)) {
  console.log("labs-core admin-shell present:", adminShellPath);
  process.exit(0);
}

const repo = process.env.LABS_CORE_REPO ?? "news-labs/labs-core";
const token = process.env.LABS_CORE_CHECKOUT_TOKEN ?? process.env.GITHUB_TOKEN;

console.log(`Cloning ${repo} → ${labsCorePath}`);
const cloneUrl = token
  ? `https://x-access-token:${token}@github.com/${repo}.git`
  : `https://github.com/${repo}.git`;
execSync(`git clone --depth 1 "${cloneUrl}" "${labsCorePath}"`, { stdio: "inherit" });

if (!existsSync(adminShellPath)) {
  console.error(`Cloned ${repo} but admin-shell package missing at ${adminShellPath}`);
  process.exit(1);
}

console.log("labs-core ready for pnpm install");
