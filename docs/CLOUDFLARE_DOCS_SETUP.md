# Cloudflare docs infrastructure setup

Checklist for the unified Newsfork user docs site on Cloudflare Pages.

## Resources

| Resource | Type | URL |
| --- | --- | --- |
| `nf-public-docs` | Pages | https://nf-public-docs.pages.dev |
| `nf-devdocs` | Pages (internal) | https://nf-devdocs.pages.dev |
| `nfdocs` | Pages (deprecated) | https://nfdocs.pages.dev → redirects to docs.newsfork.com |
| `nf-public-legal` | Pages (deprecated) | replaced by `nf-public-docs` |
| `news-labs-web-public-docs-router-prod` | Worker (deprecated) | remove `docs.newsfork.com/*` route |

## Prerequisites

```bash
cd ~/develop/news-labs/web-public
direnv allow   # or: source ~/.config/news-labs/cloudflare.env
node scripts/preflight-cloudflare.mjs
```

## Automated setup

```bash
pnpm run setup:cloudflare-docs
```

Creates the `nf-public-docs` Pages project (if missing), deploys `public-docs`, and attempts to attach `docs.newsfork.com`.

For **devdocs**, from `core-platform`:

```bash
pnpm run build:docs
cd docs/devdocs && wrangler pages deploy dist --project-name=nf-devdocs
```

## Manual dashboard steps

### 1. docs.newsfork.com (Pages custom domain)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. Open **nf-public-docs**
3. **Custom domains** → **Set up a custom domain**
4. Enter `docs.newsfork.com` (proxied CNAME is created automatically)
5. Wait until status is **Active**

Verify:

```bash
curl -I https://docs.newsfork.com/
curl -I https://docs.newsfork.com/getting-started/
curl -I https://docs.newsfork.com/legal/privacy/
curl -I https://docs.newsfork.com/v1/api/seeds-api/
```

### 2. Remove legacy docs-router Worker route

The router split legal vs API docs before the unified site. After `nf-public-docs` is active:

1. **Workers & Pages** → **news-labs-web-public-docs-router-prod**
2. **Settings** → **Domains & Routes**
3. Delete route: `docs.newsfork.com/*`

Do **not** delete the route until the Pages custom domain is Active.

### 3. Legacy redirects

| Legacy origin | Action |
| --- | --- |
| `nfdocs.pages.dev/*` | Deploy `_redirects`: `/* https://docs.newsfork.com/:splat 301` |
| `nf-public-legal.pages.dev/*` | Delete project or redirect to `docs.newsfork.com` |
| `docs.newsfork.com/legal/` | Served by `public-docs/public/_redirects` → `/` |

### 4. devdocs.newsfork.com (Pages custom domain)

1. **Workers & Pages** → **nf-devdocs** → **Custom domains**
2. Add `devdocs.newsfork.com` (proxied CNAME is created automatically)
3. Wait until status is **Active**

### 5. Cloudflare Access (internal devdocs)

Zero Trust must be enabled on the account first.

1. **Zero Trust** → enable Access (one-time)
2. **Access** → **Applications** → **Add an application**
3. Type: **Self-hosted**
4. Domain: `devdocs.newsfork.com`
5. Policy: **Allow** — emails `@news-labs.org` and/or GitHub org `news-labs`
6. Save

See also [core-platform/docs/devdocs/CLOUDFLARE_ACCESS.md](../../core-platform/docs/devdocs/CLOUDFLARE_ACCESS.md).

### 6. API token permissions (optional, for full automation)

Edit token at [Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens):

| Permission | Scope |
| --- | --- |
| Account → Cloudflare Pages | Edit |
| Zone → DNS | Edit (`newsfork.com`) |

Store token in `~/.config/news-labs/cloudflare.env` — never commit to git.

## CI deploy (production)

Production deploys run via GitHub Actions only:

| Workflow | Target |
| --- | --- |
| `deploy-public-docs.yml` | `nf-public-docs` |
| `core-platform/deploy-devdocs.yml` | `nf-devdocs` |

Required GitHub secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`  
Optional var: `CF_WORKERS_SUBDOMAIN` (preflight account guard)

## Site structure

```
docs.newsfork.com/                    → public-docs home (Starlight splash)
docs.newsfork.com/getting-started/    → user onboarding
docs.newsfork.com/v1/api/*            → API reference
docs.newsfork.com/v1/guides/*         → integration guides
docs.newsfork.com/user-manual/*       → user manual
docs.newsfork.com/legal/*             → privacy, terms, policies
docs.newsfork.com/company/*           → about, contact
docs.newsfork.com/resources/*         → FAQ, glossary
```

Content source: `apps/public-docs/src/content/docs/` in this repo (English only; Korean i18n planned).
