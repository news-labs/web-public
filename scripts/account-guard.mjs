#!/usr/bin/env node
/**
 * Cloudflare account guard — blocks deploys to wrong accounts.
 * See labs-core/policies/org-account-isolation-policy.md
 */

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const EXPECTED_SUBDOMAIN = process.env.CF_WORKERS_SUBDOMAIN;
const BLOCKED = new Set(
  (process.env.CF_BLOCKED_ACCOUNT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

export async function assertProductionAccount(token, accountId) {
  if (!token || !accountId) {
    console.error("❌ CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required.");
    process.exit(1);
  }

  if (BLOCKED.has(accountId)) {
    console.error("❌ BLOCKED Cloudflare account:", accountId);
    process.exit(1);
  }

  if (!EXPECTED_SUBDOMAIN) {
    console.warn("⚠️  CF_WORKERS_SUBDOMAIN not set — skipping workers subdomain guard.");
    return;
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const body = await res.json();
  if (!body.success) {
    console.error("❌ Could not verify workers subdomain:", JSON.stringify(body.errors));
    process.exit(1);
  }

  const subdomain = body.result?.subdomain;
  if (subdomain !== EXPECTED_SUBDOMAIN) {
    console.error(`❌ Wrong Cloudflare account: subdomain is "${subdomain}"`);
    console.error(`   Expected "${EXPECTED_SUBDOMAIN}" (CF_WORKERS_SUBDOMAIN).`);
    process.exit(1);
  }

  console.log(`✅ Account guard: ${subdomain}.workers.dev`);
}

if (process.argv[1]?.endsWith("account-guard.mjs")) {
  await assertProductionAccount(TOKEN, ACCOUNT_ID);
}
