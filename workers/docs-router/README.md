# docs.newsfork.com Worker router (deprecated)

> **Deprecated.** User docs are now served directly from the `nf-public-docs` Pages project at `docs.newsfork.com`. Remove the Worker route `docs.newsfork.com/*` after cutover.

This Worker previously split traffic:

| Path | Origin | Pages project |
| --- | --- | --- |
| `/legal/*` | `LEGAL_DOCS_ORIGIN` | `nf-public-legal` |
| `/*` | `API_DOCS_ORIGIN` | `nfdocs` |

See [docs/CLOUDFLARE_DOCS_SETUP.md](../../docs/CLOUDFLARE_DOCS_SETUP.md) for the current setup.
