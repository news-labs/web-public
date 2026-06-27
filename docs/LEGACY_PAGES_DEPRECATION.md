# Legacy Cloudflare Pages — deprecation

After `nl-*` cutover is verified, deprecate these projects in the Cloudflare dashboard.

| Legacy project | Replacement | Action |
| --- | --- | --- |
| `nf-web-public` | `nl-marketing-web` | Remove custom domains; delete or redirect |
| `nf-devdocs` | `nl-internal-docs` | Remove `devdocs.newsfork.com`; delete |
| `nf-public-docs` | `nl-public-docs` | Delete if created |
| `nf-public-legal` | `nl-public-docs` | Delete or redirect |
| `nfdocs` | `nl-public-docs` | Keep redirect: `/* https://docs.newsfork.com/:splat 301` |
| `news-labs-web-public-docs-router-prod` | **Deleted** — unified docs on `nl-public-docs` |

## nfdocs redirect

[`newsfork-seeds/docs/public/_redirects`](../../newsfork/newsfork-seeds/docs/public/_redirects):

```
/*  https://docs.newsfork.com/:splat  301
```

Redeploy `nfdocs` via `workflow_dispatch` on newsfork-seeds if needed.

## nl-marketing-web Worker

If a **Worker** named `nl-marketing-web` exists alongside Pages `nl-marketing-web`, remove Worker routes that overlap `www.newsfork.com` before attaching the domain to Pages.
