#!/usr/bin/env node
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const workerCwd = join(root, "workers/admin-web-api");
const configFile = "wrangler.prod.jsonc";

if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) process.exit(1);
if (process.env.CI !== "true") {
  console.error("Prod secrets: CI only");
  process.exit(1);
}

const secrets = [
  ["GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID],
  ["GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET],
  ["INTERNAL_SIG_SECRET", process.env.INTERNAL_SIG_SECRET],
  ["WEB_ADMIN_API_KEY", process.env.WEB_ADMIN_API_KEY],
  ["GITHUB_TOKEN", process.env.GITHUB_TOKEN],
];

function putSecret(name, value) {
  if (!value) {
    console.warn(`⚠  skip ${name}`);
    return;
  }
  execSync(`pnpm exec wrangler secret put ${name} -c ${configFile}`, {
    cwd: workerCwd,
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    env: process.env,
  });
}

execSync("node scripts/preflight-cloudflare.mjs", { cwd: root, stdio: "inherit" });
for (const [n, v] of secrets) putSecret(n, v);
console.log("✅ Web Admin secrets done");
