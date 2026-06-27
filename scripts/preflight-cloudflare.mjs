#!/usr/bin/env node
/**
 * BYOC preflight — token permissions + account guard before Cloudflare deploy.
 * Required env: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
 * Optional: CF_WORKERS_SUBDOMAIN (enables workers subdomain guard)
 */

import { assertProductionAccount } from "./account-guard.mjs";

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

async function check(name, url, expectedStatus = 200) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (res.status === expectedStatus) {
    console.log(`✅ ${name}`);
    return true;
  }
  console.error(`❌ ${name} — HTTP ${res.status}`);
  const body = await res.text();
  console.error(`   Response: ${body.slice(0, 200)}`);
  return false;
}

console.log("🔍 Cloudflare preflight\n");

await assertProductionAccount(TOKEN, ACCOUNT_ID);

const checks = await Promise.all([
  check("Token valid", "https://api.cloudflare.com/client/v4/user/tokens/verify"),
  check("Account accessible", `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}`),
  check("Pages permission", `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects`),
]);

if (!checks.every(Boolean)) {
  console.error("\n❌ Preflight failed.\n");
  process.exit(1);
}

console.log("\n✅ All preflight checks passed.\n");
