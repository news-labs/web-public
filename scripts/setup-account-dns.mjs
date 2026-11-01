#!/usr/bin/env node
/**
 * Idempotent DNS for account.newsfork.com → nl-account-web Pages.
 * Required for hub push account link (hub-callback on account host).
 * Requires API token with Zone DNS Edit on newsfork.com + Pages Edit.
 */

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ZONE_NAME = "newsfork.com";
const HOSTNAME = "account.newsfork.com";
const PAGES_PROJECT = "nl-account-web";
const CNAME_TARGET = `${PAGES_PROJECT}.pages.dev`;
const RECORD_NAME = "account";

async function cf(path, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await res.json();
  return { ok: res.ok, status: res.status, body };
}

async function getZoneId() {
  const { body } = await cf(`/zones?name=${ZONE_NAME}`);
  if (!body.success || !body.result?.[0]?.id) {
    throw new Error(`Zone not found: ${ZONE_NAME}`);
  }
  return body.result[0].id;
}

async function ensureCname(zoneId) {
  const list = await cf(
    `/zones/${zoneId}/dns_records?type=CNAME&name=${encodeURIComponent(HOSTNAME)}`,
  );
  if (!list.body.success) {
    throw new Error(`List DNS failed: ${JSON.stringify(list.body.errors)}`);
  }

  const existing = list.body.result?.[0];
  if (existing?.content === CNAME_TARGET && existing.proxied) {
    console.log(`✅ CNAME already set: ${HOSTNAME} → ${CNAME_TARGET}`);
    return existing;
  }

  if (existing) {
    console.log(`Updating CNAME ${HOSTNAME} → ${CNAME_TARGET}`);
    const update = await cf(`/zones/${zoneId}/dns_records/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        type: "CNAME",
        name: RECORD_NAME,
        content: CNAME_TARGET,
        proxied: true,
      }),
    });
    if (!update.body.success) {
      throw new Error(`Update DNS failed: ${JSON.stringify(update.body.errors)}`);
    }
    console.log(`✅ Updated CNAME ${HOSTNAME}`);
    return update.body.result;
  }

  console.log(`Creating CNAME ${HOSTNAME} → ${CNAME_TARGET}`);
  const create = await cf(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: JSON.stringify({
      type: "CNAME",
      name: RECORD_NAME,
      content: CNAME_TARGET,
      proxied: true,
      comment: "News-Labs account portal (nl-account-web Pages) — hub push callback",
    }),
  });
  if (!create.body.success) {
    throw new Error(`Create DNS failed: ${JSON.stringify(create.body.errors)}`);
  }
  console.log(`✅ Created CNAME ${HOSTNAME}`);
  return create.body.result;
}

async function ensurePagesDomain() {
  const list = await cf(`/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains`);
  if (!list.body.success) {
    throw new Error(`List Pages domains failed: ${JSON.stringify(list.body.errors)}`);
  }

  const existing = list.body.result?.find((d) => d.name === HOSTNAME);
  if (existing) {
    console.log(`ℹ️  Pages domain ${HOSTNAME}: ${existing.status}`);
    return existing;
  }

  console.log(`Adding ${HOSTNAME} to ${PAGES_PROJECT}...`);
  const add = await cf(`/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains`, {
    method: "POST",
    body: JSON.stringify({ name: HOSTNAME }),
  });
  if (!add.body.success) {
    // 8000012 often means already attached
    const code = add.body.errors?.[0]?.code;
    if (code === 8000012 || String(add.body.errors?.[0]?.message || "").includes("already")) {
      console.log(`ℹ️  Pages domain already attached: ${HOSTNAME}`);
      return null;
    }
    throw new Error(`Add Pages domain failed: ${JSON.stringify(add.body.errors)}`);
  }
  console.log(`✅ Added Pages domain ${HOSTNAME}`);
  return add.body.result;
}

async function retryValidation() {
  const { body } = await cf(
    `/accounts/${ACCOUNT_ID}/pages/projects/${PAGES_PROJECT}/domains/${encodeURIComponent(HOSTNAME)}`,
    { method: "PATCH" },
  );
  if (!body.success) {
    console.log(`⚠️  Validation retry: ${JSON.stringify(body.errors)}`);
    return;
  }
  console.log(`ℹ️  Validation retried; status=${body.result?.status ?? "?"}`);
}

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error("❌ Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID");
    process.exit(1);
  }
  if (process.env.CI !== "true") {
    console.error("❌ Prod DNS: CI only (set CI=true in GitHub Actions)");
    process.exit(1);
  }

  const zoneId = await getZoneId();
  await ensureCname(zoneId);
  await ensurePagesDomain();
  await retryValidation();
  console.log(`\n✅ account DNS setup done for ${HOSTNAME} → ${CNAME_TARGET}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
