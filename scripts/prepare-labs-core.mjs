#!/usr/bin/env node
/**
 * Ensures @core-labs/admin-shell is available for admin-web-portal.
 *
 * Local: expects sibling `infra-control-plane` (or legacy `labs-core`) under the
 * news-labs org folder — matches `file:../../../infra-control-plane/packages/admin-shell`.
 * CI: clones LABS_CORE_REPO into that sibling path when missing.
 */

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const adminAppPkg = join(repoRoot, "apps/admin-web-portal/package.json");

/** Sibling checkout path used by package.json file: dependency. */
const infraControlPlanePath = resolve(repoRoot, "../../infra-control-plane");
const legacyLabsCorePath = resolve(repoRoot, "../../labs-core");

function adminShellAt(root) {
  return join(root, "packages/admin-shell");
}

if (!existsSync(adminAppPkg)) {
  process.exit(0);
}

for (const root of [infraControlPlanePath, legacyLabsCorePath]) {
  if (existsSync(adminShellAt(root))) {
    console.log("admin-shell present:", adminShellAt(root));
    process.exit(0);
  }
}

// Prefer infra-control-plane (package.json file: dep). Legacy labs-core repo is retired.
const repo = process.env.LABS_CORE_REPO || "news-labs/infra-control-plane";
const token = process.env.LABS_CORE_CHECKOUT_TOKEN ?? process.env.GITHUB_TOKEN;
const cloneTarget = infraControlPlanePath;

console.log(`Cloning ${repo} → ${cloneTarget}`);
const cloneUrl = token
  ? `https://x-access-token:${token}@github.com/${repo}.git`
  : `https://github.com/${repo}.git`;
execSync(`git clone --depth 1 "${cloneUrl}" "${cloneTarget}"`, { stdio: "inherit" });

if (!existsSync(adminShellAt(cloneTarget))) {
  console.error(`Cloned ${repo} but admin-shell package missing at ${adminShellAt(cloneTarget)}`);
  process.exit(1);
}

console.log("admin-shell ready for pnpm install");
