#!/usr/bin/env node
/**
 * Activate nl-* Pages custom domains by upserting DNS CNAME records and
 * retrying Pages domain validation.
 *
 * Requires API token permissions:
 * - Account → Cloudflare Pages → Edit
 * - Zone → DNS → Edit (newsfork.com)
 */

import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ZONE_ID = process.env.CF_NEWSFORK_ZONE_ID || "8af5c30a23be13bf2a9a598863baf846";

const DOMAIN_TARGETS = [
  {
    project: "nl-public-docs",
    fqdn: "docs.newsfork.com",
    recordName: "docs",
    target: "nl-public-docs.pages.dev",
  },
  {
    project: "nl-internal-docs",
    fqdn: "devdocs.newsfork.com",
    recordName: "devdocs",
    target: "nl-internal-docs.pages.dev",
  },
  {
    project: "nl-marketing-web",
    fqdn: "www.newsfork.com",
    recordName: "www",
    target: "nl-marketing-web.pages.dev",
  },
  {
    project: "nl-account-web",
    fqdn: "account.newsfork.com",
    recordName: "account",
    target: "nl-account-web.pages.dev",
  },
];

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

async function checkDnsWritePermission() {
  const probe = await cf(`/zones/${ZONE_ID}/dns_records`, {
    method: "POST",
    body: JSON.stringify({
      type: "TXT",
      name: "_nl-pages-dns-probe",
      content: "probe",
      ttl: 1,
    }),
  });
  if (probe.body.success) {
    const id = probe.body.result?.id;
    if (id) {
      await cf(`/zones/${ZONE_ID}/dns_records/${id}`, { method: "DELETE" });
    }
    return true;
  }
  const code = probe.body.errors?.[0]?.code;
  return code !== 10000;
}

async function listDns(name) {
  const { body } = await cf(
    `/zones/${ZONE_ID}/dns_records?name=${encodeURIComponent(name)}&per_page=50`,
  );
  return body.success ? body.result || [] : [];
}

async function upsertCname(fqdn, recordName, target) {
  const existing = await listDns(fqdn);
  const cname = existing.find((r) => r.type === "CNAME");
  const payload = {
    type: "CNAME",
    name: recordName,
    content: target,
    proxied: true,
    ttl: 1,
  };

  if (cname) {
    if (cname.content === target && cname.proxied) {
      console.log(`✅ DNS already correct: ${fqdn} → ${target}`);
      return true;
    }
    console.log(`Updating DNS: ${fqdn} ${cname.content} → ${target}`);
    const { body } = await cf(`/zones/${ZONE_ID}/dns_records/${cname.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!body.success) {
      console.error(`❌ DNS update failed for ${fqdn}:`, body.errors);
      return false;
    }
    return true;
  }

  console.log(`Creating DNS: ${fqdn} → ${target}`);
  const { body } = await cf(`/zones/${ZONE_ID}/dns_records`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!body.success) {
    console.error(`❌ DNS create failed for ${fqdn}:`, body.errors);
    return false;
  }
  return true;
}

async function retryPagesValidation(project, fqdn) {
  const { body } = await cf(
    `/accounts/${ACCOUNT_ID}/pages/projects/${project}/domains/${encodeURIComponent(fqdn)}`,
    { method: "PATCH" },
  );
  if (!body.success) {
    console.log(`⚠️  Validation retry for ${fqdn}:`, body.errors);
    return null;
  }
  return body.result;
}

async function getDomainStatus(project, fqdn) {
  const { body } = await cf(`/accounts/${ACCOUNT_ID}/pages/projects/${project}/domains`);
  if (!body.success) return null;
  return body.result?.find((d) => d.name === fqdn);
}

async function waitForActive(project, fqdn, maxAttempts = 18) {
  for (let i = 0; i < maxAttempts; i++) {
    const domain = await getDomainStatus(project, fqdn);
    const status = domain?.status || "unknown";
    console.log(`   ${fqdn}: ${status}`);
    if (status === "active") return true;
    if (i === 0 || i % 3 === 0) {
      await retryPagesValidation(project, fqdn);
    }
    await sleep(10000);
  }
  return false;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printManualDns() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Manual DNS (token lacks Zone → DNS → Edit)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dashboard → newsfork.com → DNS → Records:

| Type  | Name     | Content                    | Proxy |
|-------|----------|----------------------------|-------|
| CNAME | docs     | nl-public-docs.pages.dev   | ON    |
| CNAME | devdocs  | nl-internal-docs.pages.dev   | ON    |
| CNAME | www      | nl-marketing-web.pages.dev   | ON    |

Then: Workers & Pages → each nl-* project → Custom domains → Activate

Or add Zone DNS Edit to your API token and re-run:
  pnpm run activate:pages-domains
`);
}

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error("❌ Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID");
    process.exit(1);
  }

  console.log("🔍 Running preflight...");
  execSync("node scripts/preflight-cloudflare.mjs", { cwd: ROOT, stdio: "inherit" });

  const canDns = await checkDnsWritePermission();
  if (!canDns) {
    console.error("\n❌ API token cannot write DNS for newsfork.com (Zone → DNS → Edit required).\n");
    printManualDns();
    process.exit(1);
  }

  console.log("\n📡 Upserting DNS CNAME records...\n");
  for (const entry of DOMAIN_TARGETS) {
    const ok = await upsertCname(entry.fqdn, entry.recordName, entry.target);
    if (!ok) process.exit(1);
  }

  console.log("\n⏳ Waiting for Pages custom domains to become active...\n");
  let allActive = true;
  for (const entry of DOMAIN_TARGETS) {
    const active = await waitForActive(entry.project, entry.fqdn);
    if (!active) {
      allActive = false;
      console.log(`⚠️  ${entry.fqdn} not active yet — check Dashboard → ${entry.project} → Custom domains`);
    } else {
      console.log(`✅ ${entry.fqdn} is active`);
    }
  }

  if (!allActive) {
    console.log("\nDNS is set; SSL may still be provisioning. Re-run this script in a few minutes.\n");
    process.exit(1);
  }

  console.log("\n✅ All nl-* custom domains are active.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
