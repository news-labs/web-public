#!/usr/bin/env node
/**
 * Idempotent Cloudflare setup for News-Labs public docs site.
 * Uses CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID from direnv.
 *
 * Requires token permissions: Account / Cloudflare Pages (Edit).
 * Zone DNS custom domain attachment may require dashboard steps — see
 * docs/CLOUDFLARE_DOCS_SETUP.md
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

const PROJECTS = [
  { name: "nf-public-docs", dist: "apps/public-docs/dist", build: "pnpm --filter public-docs run build" },
];

const PUBLIC_DOCS_DOMAIN = "docs.newsfork.com";

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

function run(cmd, cwd = ROOT) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

async function ensurePagesProject(name) {
  const list = await cf(`/accounts/${ACCOUNT_ID}/pages/projects`);
  if (!list.body.success) {
    throw new Error(`List projects failed: ${JSON.stringify(list.body.errors)}`);
  }
  const exists = list.body.result?.some((p) => p.name === name);
  if (exists) {
    console.log(`✅ Pages project exists: ${name}`);
    return;
  }
  console.log(`Creating Pages project: ${name}`);
  run(`wrangler pages project create ${name} --production-branch main`);
}

async function deployPages(name, distRel) {
  const dist = join(ROOT, distRel);
  if (!existsSync(dist)) {
    console.log(`Building before deploy (${distRel} missing)...`);
    run(PROJECTS.find((p) => p.name === name)?.build || "pnpm --filter public-docs run build");
  }
  run(`wrangler pages deploy ${distRel} --project-name=${name} --commit-dirty=true`);
}

async function ensureCustomDomain(projectName, domain) {
  const { body } = await cf(`/accounts/${ACCOUNT_ID}/pages/projects/${projectName}/domains`);
  if (!body.success) {
    console.log(`⚠️  Could not list domains for ${projectName}: ${JSON.stringify(body.errors)}`);
    return;
  }
  const domains = body.result || [];
  const existing = domains.find((d) => d.name === domain);
  if (existing) {
    console.log(`ℹ️  ${projectName} domain: ${domain} (${existing.status || "unknown"})`);
    return;
  }
  console.log(`Adding ${domain} to ${projectName}...`);
  const add = await cf(`/accounts/${ACCOUNT_ID}/pages/projects/${projectName}/domains`, {
    method: "POST",
    body: JSON.stringify({ name: domain }),
  });
  if (!add.body.success) {
    console.log(`⚠️  Could not add ${domain}: ${JSON.stringify(add.body.errors)}`);
  }
}

async function printManualSteps() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Manual steps (API token lacks Zone / Zero Trust permissions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Remove legacy docs-router Worker route (if still attached)
   Dashboard → Workers & Pages → news-labs-web-public-docs-router-prod
   → Settings → Domains & Routes → Delete route: docs.newsfork.com/*

2. Confirm docs.newsfork.com custom domain on nf-public-docs
   Dashboard → Workers & Pages → nf-public-docs → Custom domains
   → Confirm docs.newsfork.com (creates proxied DNS)

3. Deprecate legacy Pages projects (optional)
   - nf-public-legal → redirect or delete after cutover
   - nfdocs → deploy redirect-only _redirects to docs.newsfork.com

4. devdocs.newsfork.com (internal platform docs)
   Dashboard → Workers & Pages → nf-devdocs → Custom domains

5. Cloudflare Access for devdocs (Zero Trust)
   Dashboard → Zero Trust → Access → Applications → devdocs.newsfork.com

See docs/CLOUDFLARE_DOCS_SETUP.md for full checklist.
`);
}

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error("❌ Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (source ~/.config/news-labs/cloudflare.env)");
    process.exit(1);
  }

  console.log("🔍 Running preflight...");
  run("node scripts/preflight-cloudflare.mjs");

  for (const project of PROJECTS) {
    await ensurePagesProject(project.name);
    await deployPages(project.name, project.dist);
    await ensureCustomDomain(project.name, PUBLIC_DOCS_DOMAIN);
  }

  await printManualSteps();
  console.log("\n✅ Automated Cloudflare docs setup complete.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
