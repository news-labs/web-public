# Cloudflare docs infrastructure setup

Checklist for Newsfork docs on Cloudflare Pages (`nl-*` naming).

## Resources

| Resource | Type | URL |
| --- | --- | --- |
| `nl-marketing-web` | Pages | https://nl-marketing-web.pages.dev |
| `nl-public-docs` | Pages | https://nl-public-docs.pages.dev |
| `nl-internal-docs` | Pages (internal) | https://nl-internal-docs.pages.dev |
| `nfdocs` | Pages (deprecated) | redirect to `docs.newsfork.com` |

Legacy (remove after cutover): `nf-web-public`, `nf-devdocs`, `nf-public-docs`, `nf-public-legal`.

`news-labs-web-public-docs-router-prod` Worker: **deleted** (unified docs on `nl-public-docs`).

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

Creates `nl-marketing-web`, `nl-public-docs`, and `nl-internal-docs` (if missing), builds, deploys, and attempts custom domains.

Activate custom domains (DNS + validation):

```bash
pnpm run activate:pages-domains
```

Requires API token **Zone → DNS → Edit** for `newsfork.com`. See `~/.config/news-labs/cloudflare.env.example`.

## Manual dashboard steps

### 1. docs.newsfork.com → nl-public-docs

1. **Workers & Pages** → **nl-public-docs** → **Custom domains** → `docs.newsfork.com`
2. Wait until status is **Active** (proxied CNAME is created automatically)

### 2. devdocs.newsfork.com → nl-internal-docs

1. Remove domain from `nf-devdocs` if attached
2. **nl-internal-docs** → **Custom domains** → `devdocs.newsfork.com`
3. Cloudflare Access — see [core-platform/docs/devdocs/CLOUDFLARE_ACCESS.md](../core-platform/docs/devdocs/CLOUDFLARE_ACCESS.md)

### 3. www.newsfork.com → nl-marketing-web

1. Remove domain from `nf-web-public`
2. Remove overlapping `nl-marketing-web` **Worker** routes if present
3. **nl-marketing-web** Pages → **Custom domains** → `www.newsfork.com`

### 4. Legacy redirects

| Legacy | Action |
| --- | --- |
| `nfdocs.pages.dev/*` | `/* https://docs.newsfork.com/:splat 301` |
| `nf-web-public`, `nf-devdocs` | Delete or redirect after cutover |

## CI deploy (production)

| Workflow | Target |
| --- | --- |
| `deploy-www.yml` | `nl-marketing-web` |
| `deploy-public-docs.yml` | `nl-public-docs` |
| `core-platform/deploy-devdocs.yml` | `nl-internal-docs` |

## Site structure

```
docs.newsfork.com/                    → nl-public-docs (EN + ko locale)
docs.newsfork.com/ko/getting-started/ → Korean user docs
devdocs.newsfork.com/                 → nl-internal-docs (Access protected)
www.newsfork.com/                     → nl-marketing-web
```

Content: `apps/public-docs/src/content/docs/` (web-public), `docs/devdocs/src/content/docs/` (core-platform).

See also [CLOUDFLARE_DASHBOARD_AUDIT.md](./CLOUDFLARE_DASHBOARD_AUDIT.md).
