# Docs layout — Vouus parity (Newsfork)

Reference: [docs.vouus.com](https://docs.vouus.com/) (Layout A splash + Layout B 2:5:2 detail).

This document describes the two-tier layout used by **docs.newsfork.com** (`apps/public-docs`) and **devdocs.newsfork.com** (`core-platform/docs/devdocs`). Keep both sites in sync when editing shared shell components.

## Layout A — Main (splash)

- **Frontmatter:** `template: splash` + `hero` (tagline, actions)
- **Pages:** `/`, `/ko/` (public-docs), `/` (devdocs)
- **Chrome:** Header only — no left sidebar, no right TOC, no breadcrumb
- **Body:** Hero band + Overview + Quick links (+ optional CardGrid)

## Layout B — Standard / detail

- **Frontmatter:** default template; `title` + optional `description`, `sidebar.order`
- **Chrome:** Header + 20rem left nav + PageTitle H1 + breadcrumb + 20rem right TOC (≥72rem)
- **Body:** Start with paragraph or `##` headings — do not add `#` H1 in markdown (PageTitle renders frontmatter `title`)

## Shared components (sync checklist)

When changing layout chrome, diff these files across both repos:

| File | public-docs | devdocs |
|------|-------------|---------|
| `PageFrame.astro` | `apps/public-docs/src/components/` | `docs/devdocs/src/components/` |
| `Header.astro` | same | same |
| `TwoColumnContent.astro` | same | same |
| `PageSidebar.astro` | same | same |
| `PageTitle.astro` | same | same |
| `custom.css` | `src/styles/` | `src/styles/` |

**PageFrame invariant:** read `hasSidebar` from `Astro.locals.starlightRoute` (not `Astro.props`). Starlight sets `data-has-sidebar` on `<html>` from the route; using `Astro.props` leaves the left nav empty while padding remains.

## Site-specific differences

| Item | public-docs | devdocs |
|------|-------------|---------|
| Accent | `#0ea5e9` (sky) | same |
| Header nav | Getting Started / Guides / API | Manual / Platform / Runbook / Public docs |
| Ask Help links | User-facing quick links | Platform, runbook, security, public docs |
| JSON-LD | Yes (`PageFrame`) | No |

## Verification

- Layout A: `<html data-has-hero>` — no `#starlight__sidebar`, no right TOC
- Layout B: `<html data-has-sidebar data-has-toc>` — visible PageTitle H1, left nav, "On this page"

See also: `.cursor/rules/70-docs-starlight.mdc`.
