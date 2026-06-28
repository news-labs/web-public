# Legacy Cloudflare Pages — deprecation

After `nl-*` cutover is verified, deprecate these projects in the Cloudflare dashboard.

## Cleanup status (2026-06-28)

| Status | Item |
| --- | --- |
| Done | Removed dev/stg Wrangler configs and deploy workflows across news-labs |
| Done | Prod-only deploy workflows (`deploy-prod.yml`, updated `deploy.yml`) |
| Done | labs-core cleanup scripts + `docs/runbooks/worker-cleanup.md` |
| Pending | Run `cleanup-nonprod-workers.mjs --dry-run` then `--apply` after inventory review |
| Pending | Run `cleanup-nonprod-bindings.mjs` after Worker/Pages cleanup |
| Pending | Remove legacy Pages projects listed below from Cloudflare dashboard |

## Legacy projects

| Legacy project | Replacement | Action |
| --- | --- | --- |
| `nf-web-public` | `nl-marketing-web` | Remove custom domains; delete or redirect |
| `nf-devdocs` | `nl-internal-docs` | Remove `devdocs.newsfork.com`; delete |
| `nf-public-docs` | `nl-public-docs` | Delete if created |
| `nf-public-legal` | `nl-public-docs` | Delete or redirect |
| `nfdocs` | `nl-public-docs` | Keep redirect: `/* https://docs.newsfork.com/:splat 301` |
| `news-labs-web-public-docs-router-prod` | **Deleted** — unified docs on `nl-public-docs` |
| `nl-hub-pages-news-site-dev` | `nl-hub-news-site` | Delete after hub prod verified |
| `nl-hub-pages-news-site-stg` | `nl-hub-news-site` | Delete after hub prod verified |

## nfdocs redirect

[`newsfork-seeds/docs/public/_redirects`](../../newsfork/newsfork-seeds/docs/public/_redirects):

```
/*  https://docs.newsfork.com/:splat  301
```

Redeploy `nfdocs` via `workflow_dispatch` on newsfork-seeds if needed.

## nl-marketing-web Worker

If a **Worker** named `nl-marketing-web` exists alongside Pages `nl-marketing-web`, remove Worker routes that overlap `www.newsfork.com` before attaching the domain to Pages.
