# Cloudflare dashboard audit — nl Pages migration

Audit baseline: 2026-06-27. Updated after automated deploy.

## Deployed nl-* Pages projects

| Project | pages.dev | Content pages | Deploy status |
| --- | --- | --- | --- |
| `nl-marketing-web` | https://nl-marketing-web.pages.dev | marketing-web (17 routes) | Deployed |
| `nl-public-docs` | https://nl-public-docs.pages.dev | public-docs (100 pages, EN + ko) | Deployed |
| `nl-internal-docs` | https://nl-internal-docs.pages.dev | devdocs (46 pages) | Deployed |

## Custom domains (API attach — pending DNS cutover)

Domains registered on nl-* projects but **pending** until CNAME moves from legacy targets:

| Domain | nl-* project | Status |
| --- | --- | --- |
| `www.newsfork.com` | `nl-marketing-web` | pending |
| `docs.newsfork.com` | `nl-public-docs` | pending |
| `devdocs.newsfork.com` | `nl-internal-docs` | pending |

**Operator action**: Confirm nl-* custom domains are Active. Legacy `nf-*` Pages can be deleted after cutover.

| `news-labs-web-public-docs-router-prod` | **Removed** — Worker not on account; repo `workers/docs-router` deleted |

## Legacy resources (deprecate)

| Name | Action |
| --- | --- |
| `nf-web-public` | Delete after www cutover |
| `nf-devdocs` | Delete after devdocs cutover |
| `nfdocs` | Keep redirect to docs.newsfork.com |
| `news-labs-web-public-docs-router-prod` | **Deleted** (2026-06-27) |
| `nl-marketing-web` Worker | Remove routes overlapping www |

See [LEGACY_PAGES_DEPRECATION.md](./LEGACY_PAGES_DEPRECATION.md).

## Verification (pages.dev)

```bash
curl -I https://nl-public-docs.pages.dev/getting-started/
curl -I https://nl-internal-docs.pages.dev/platform/overview/
curl -I https://nl-marketing-web.pages.dev/
curl -I https://nl-public-docs.pages.dev/ko/getting-started/
```

## CI targets (post-migration)

| Workflow | Project |
| --- | --- |
| `deploy-www.yml` | `nl-marketing-web` |
| `deploy-public-docs.yml` | `nl-public-docs` |
| `deploy-devdocs.yml` | `nl-internal-docs` |

Setup script: `pnpm run setup:cloudflare-docs` (web-public).
