# Cloudflare dashboard audit — nl Pages migration

Audit date: 2026-06-27. Baseline from operator dashboard before `nl-*` cutover.

## Active resources (pre-migration)

| Name | Type | Git | Notes |
| --- | --- | --- | --- |
| `nf-web-public` | Pages | No | Target: replace with `nl-marketing-web` |
| `nf-devdocs` | Pages | No | Target: replace with `nl-internal-docs` |
| `nfdocs` | Pages | No | Redirect-only to `docs.newsfork.com` |
| `nl-marketing-web` | Worker | — | **Conflict risk** with Pages `nf-web-public`; remove Worker routes before Pages cutover |
| `news-labs-web-public-docs-router-prod` | Worker | — | **Remove** `docs.newsfork.com/*` route before `nl-public-docs` custom domain |
| `nf-public-docs` / `nl-public-docs` | Pages | — | **Missing** — public-docs content never deployed |

## Target state

| Pages project | Custom domain | Source |
| --- | --- | --- |
| `nl-marketing-web` | `www.newsfork.com` | `web-public/apps/marketing-web` |
| `nl-public-docs` | `docs.newsfork.com` | `web-public/apps/public-docs` |
| `nl-internal-docs` | `devdocs.newsfork.com` | `core-platform/docs/devdocs` |

## Cutover order

1. Create `nl-*` Pages projects and deploy via GitHub Actions (`workflow_dispatch`).
2. Attach custom domains on new projects.
3. Remove `docs.newsfork.com/*` from `news-labs-web-public-docs-router-prod`.
4. Remove `www.newsfork.com` from `nf-web-public`; remove `devdocs.newsfork.com` from `nf-devdocs`.
5. Audit `nl-marketing-web` Worker routes — delete if overlapping www.
6. Deprecate `nf-web-public`, `nf-devdocs`, `nfdocs` (redirect or delete).

## Verification

```bash
curl -I https://docs.newsfork.com/getting-started/
curl -I https://devdocs.newsfork.com/platform/overview/
curl -I https://www.newsfork.com/
curl -I https://nfdocs.pages.dev/
```
