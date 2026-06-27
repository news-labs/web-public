# docs.newsfork.com router — deprecated

> **Deprecated.** User docs are served from the `nl-public-docs` Pages project at `docs.newsfork.com`. Remove the Worker route `docs.newsfork.com/*` after cutover.

## Historical routing

| Path | Proxied to | Legacy project |
| --- | --- | --- |
| `/legal/*` | `LEGAL_DOCS_ORIGIN` | `nl-public-docs` |
| `/*` | `API_DOCS_ORIGIN` | `nfdocs` |

Do not deploy this Worker. Use GitHub Actions workflows for `nl-public-docs` instead.
