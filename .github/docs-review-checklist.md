## Documentation PR checklist

Use when changing `apps/public-docs/src/content/docs/**`:

- [ ] **Audience**: Is this for external API developers or end users (legal/FAQ/pricing)? If not, put it in `core-platform/docs/devdocs` instead.
- [ ] **Secrets / infra**: No `wrangler secret`, Worker names (`nl-*`), admin URLs, or binding keys.
- [ ] **Links**: No links to `/user-manual/`, `/reference/` (removed), or `/v1/guides/system-architecture/`.
- [ ] **Locales**: EN change has a matching `ko/` page when the page exists in both locales.
- [ ] **Audit**: `node scripts/audit-public-docs-sensitive.mjs` passes locally.
- [ ] **Classification**: New page added to `scripts/content-classification.csv` if non-obvious.

Internal docs PR checklist (`core-platform/docs/devdocs/**`):

- [ ] Cloudflare Access remains required; do not weaken `robots.txt` / `_headers` / meta noindex on devdocs.
- [ ] Cross-link to public API docs on docs.newsfork.com where external integrators need entry points.
