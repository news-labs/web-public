#!/usr/bin/env node
/**
 * Idempotent Cloudflare setup for News-Labs nl-* Pages projects.
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
const CORE_PLATFORM = join(ROOT, "..", "core-platform");
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

const WEB_PUBLIC_PROJECTS = [
  {
    name: "nl-marketing-web",
    dist: "apps/marketing-web/out",
    build: "pnpm --filter marketing-web run build",
    domain: "www.newsfork.com",
  },
  {
    name: "nl-public-docs",
    dist: "apps/public-docs/dist",
    build: "pnpm --filter public-docs run build",
    domain: "docs.newsfork.com",
  },
];

const INTERNAL_DOCS_PROJECT = {
  name: "nl-internal-docs",
  dist: join(CORE_PLATFORM, "docs/devdocs/dist"),
  buildRel: "docs/devdocs",
  domain: "devdocs.newsfork.com",
};

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
  execSync(cmd, { cwd, stdio: "inherit", env: process.env });
}

function wrangler(cmd, cwd = ROOT) {
  run(`pnpm --filter public-docs exec wrangler ${cmd}`, cwd);
}

const INTERNAL_DOCS_ROOT = join(CORE_PLATFORM, "docs/devdocs");

function wranglerCorePlatform(cmd) {
  run(`pnpm exec wrangler ${cmd}`, INTERNAL_DOCS_ROOT);
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
  wrangler(`pages project create ${name} --production-branch main`);
}

async function deployWebPublic(project) {
  const dist = join(ROOT, project.dist);
  if (!existsSync(dist)) {
    console.log(`Building before deploy (${project.dist} missing)...`);
    run(project.build);
  }
  wrangler(
    `pages deploy ${dist} --project-name=${project.name} --commit-dirty=true`,
  );
}

async function deployInternalDocs() {
  const dist = INTERNAL_DOCS_PROJECT.dist;
  if (!existsSync(dist)) {
    console.log("Building internal docs before deploy...");
    run("bash scripts/build-dev-docs.sh", CORE_PLATFORM);
  }
  wranglerCorePlatform(
    `pages deploy ${INTERNAL_DOCS_PROJECT.dist} --project-name=${INTERNAL_DOCS_PROJECT.name} --commit-dirty=true`,
  );
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

1. Confirm custom domains on nl-* Pages are Active (see docs/CLOUDFLARE_DOCS_SETUP.md)

2. Deprecate legacy nf-* Pages: nf-web-public, nf-devdocs, nfdocs

Note: news-labs-web-public-docs-router-prod Worker removed (repo + Cloudflare account).

See docs/CLOUDFLARE_DOCS_SETUP.md and docs/CLOUDFLARE_DASHBOARD_AUDIT.md
`);
}

async function main() {
  if (!TOKEN || !ACCOUNT_ID) {
    console.error(
      "❌ Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (source ~/.config/news-labs/cloudflare.env)",
    );
    process.exit(1);
  }

  console.log("🔍 Running preflight...");
  run("node scripts/preflight-cloudflare.mjs");

  for (const project of WEB_PUBLIC_PROJECTS) {
    await ensurePagesProject(project.name);
    await deployWebPublic(project);
    if (project.domain) {
      await ensureCustomDomain(project.name, project.domain);
    }
  }

  await ensurePagesProject(INTERNAL_DOCS_PROJECT.name);
  await deployInternalDocs();
  await ensureCustomDomain(INTERNAL_DOCS_PROJECT.name, INTERNAL_DOCS_PROJECT.domain);

  await printManualSteps();
  console.log("\n✅ Automated nl-* Pages setup complete.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
