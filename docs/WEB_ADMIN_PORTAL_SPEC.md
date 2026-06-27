# News-Labs Web Admin Portal

Product spec for the multi-tenant web operations console at `nl-web-admin-portal`.

See the approved plan (2026-06-27) for full IA, personas, GitHub template GitOps model, and phased roadmap.

## Scope

- **Web Admin** (`web-public/apps/admin-web-portal`): Web Master, UI Designer, SEO Editor
- **System Admin** (`infra-control-plane/admin-system`): Platform Ops — separate portal

## Key principles

1. Tenant-first: Brand → Region → Locale context bar on every page
2. Metadata at scale: 100k+/day static pages — meta only in admin UI
3. Templates in Git: HTML/CSS/layout via GitHub CI; content in R2 + D1
4. CP as source of truth: `/api/v1/diaspora/*` proxied to `nl-cp-api`

## Navigation groups

Dashboard (pinned) · Sites · Design · Content · SEO · Publishing · Analytics · Integrations

## Implementation status

| Phase | Status |
|-------|--------|
| Phase 0 — navGroups, TenantContextBar, CP proxy, site_templates | Implemented |
| Phase 1 — Brands/Regions/Locales, SEO, publishing, history | Implemented |
| Phase 2 — Design tokens, media, GitHub CI | Implemented |
| Phase 3 — Analytics, content index pagination | Implemented |
