# docs.newsfork.com ↔ devdocs content separation

Implemented 2026-06-28. Full planning context is in the Cursor plan artifact; this file is the repo-local summary.

## Sites

| Site | Project | Audience |
| --- | --- | --- |
| [docs.newsfork.com](https://docs.newsfork.com) | `nl-public-docs` | External API developers, legal/end-user |
| [devdocs.newsfork.com](https://devdocs.newsfork.com) | `nl-internal-docs` | Internal engineers (Cloudflare Access) |

## Public-docs sidebar (after separation)

- Start Here: Getting Started, API Quickstart
- v1 API
- Guides (integration only — no system-architecture)
- Legal, Company, Resources, Changelog

## Migrated to devdocs

- `products/seeds/architecture/*` — engine, queues, R2, workflows
- `engineering/seeds-ops/*` — environment, deployment, testing
- `engineering/development-workflow/*` — git/cursor SOP (from reference/)
- `internal/strategy/*`, `internal/experiments/*`

Classification: [`scripts/content-classification.csv`](../../scripts/content-classification.csv)

## Enforcement

```bash
node scripts/audit-public-docs-sensitive.mjs
```

Runs in `.github/workflows/deploy-public-docs.yml` before build.

## Retired URLs

Old paths redirect to `/moved/internal/` (no devdocs URL in public HTML). See `public/_redirects`.
