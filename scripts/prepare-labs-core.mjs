#!/usr/bin/env node
/**
 * Ensures @core-labs/admin-shell for admin-web-portal.
 * package.json: file:../../../infra-control-plane/packages/admin-shell
 * → clone/link sibling infra-control-plane next to this repo checkout.
 */

import { existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const adminAppPkg = join(repoRoot, "apps/admin-web-portal/package.json");
const infraControlPlanePath = resolve(repoRoot, "../infra-control-plane");
const adminShellPath = join(infraControlPlanePath, "packages/admin-shell");
const otpMarker = join(adminShellPath, "src/components/auth/otp-login-card.tsx");

if (!existsSync(adminAppPkg)) process.exit(0);

const needsRefresh = !existsSync(otpMarker);
if (existsSync(adminShellPath) && !needsRefresh) {
  console.log("admin-shell present:", adminShellPath);
  process.exit(0);
}

if (needsRefresh && existsSync(infraControlPlanePath)) {
  console.log("Refreshing infra-control-plane admin-shell (OTP marker missing)");
  rmSync(infraControlPlanePath, { recursive: true, force: true });
}

const repo = process.env.LABS_CORE_REPO || "news-labs/infra-control-plane";
const token = process.env.LABS_CORE_CHECKOUT_TOKEN ?? process.env.GITHUB_TOKEN;
const cloneUrl = token
  ? `https://x-access-token:${token}@github.com/${repo}.git`
  : `https://github.com/${repo}.git`;

console.log(`Cloning ${repo} → ${infraControlPlanePath}`);
execSync(`git clone --depth 1 "${cloneUrl}" "${infraControlPlanePath}"`, { stdio: "inherit" });

if (!existsSync(join(adminShellPath, "src/index.ts"))) {
  console.error(`Cloned ${repo} but admin-shell missing at ${adminShellPath}`);
  process.exit(1);
}

console.log("admin-shell ready for pnpm install");
