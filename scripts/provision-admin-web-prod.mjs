#!/usr/bin/env node
/**
 * Provision Cloudflare production resources for Web Admin portal.
 *
 * Usage: node scripts/provision-admin-web-prod.mjs [--apply-migrations]
 * Requires CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const wranglerFile = join(root, "workers/admin-web-api/wrangler.prod.jsonc");
const wranglerCwd = join(root, "workers/admin-web-api");

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const applyMigrations = process.argv.includes("--apply-migrations");

const D1_NAME = "nl-web-db-admin";

if (!TOKEN || !ACCOUNT_ID) {
  console.error("Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID");
  process.exit(1);
}

function run(cmd, opts = {}) {
  console.log(`→ ${cmd}`);
  return execSync(cmd, {
    cwd: opts.cwd ?? wranglerCwd,
    encoding: "utf8",
    stdio: "inherit",
  });
}

async function cfJson(path) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  });
  const body = await res.json();
  if (!body.success) throw new Error(JSON.stringify(body.errors ?? body));
  return body;
}

async function getOrCreateD1() {
  const { result } = await cfJson(`/accounts/${ACCOUNT_ID}/d1/database`);
  const existing = result.find((db) => db.name === D1_NAME);
  if (existing) {
    console.log(`✅ D1 ${D1_NAME} (${existing.uuid})`);
    return existing.uuid;
  }
  execSync(`pnpm exec wrangler d1 create ${D1_NAME}`, { cwd: wranglerCwd, stdio: "inherit" });
  const { result: after } = await cfJson(`/accounts/${ACCOUNT_ID}/d1/database`);
  const created = after.find((db) => db.name === D1_NAME);
  if (!created) throw new Error(`D1 ${D1_NAME} not found after create`);
  console.log(`✅ D1 ${created.uuid}`);
  return created.uuid;
}

function patchWranglerProd(d1Id) {
  let content = readFileSync(wranglerFile, "utf8");
  content = content.replaceAll("PLACEHOLDER_PROD", d1Id);
  writeFileSync(wranglerFile, content);
  console.log(`📝 patched ${wranglerFile}`);
}

async function main() {
  console.log("\n🚀 Web Admin production provisioning\n");
  run("node scripts/preflight-cloudflare.mjs", { cwd: root });

  const d1Id = await getOrCreateD1();
  patchWranglerProd(d1Id);

  if (applyMigrations) {
    run(`pnpm exec wrangler d1 migrations apply ${D1_NAME} --remote -c wrangler.prod.jsonc`);
  }

  console.log("\n✅ Provision complete.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
