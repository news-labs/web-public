---
title: Changelog
description: Newsfork documentation and design change history
version: 1.0.0
lastUpdated: 2026-01-29
status: published
sidebar:
  order: 99
translatedFromHash: aeb1fbd05c44f91a7eb550d77f6706267254b6bf218cc6bd5e1c4ddb7ea80327
---

---

## 2026-06-28

### Public vs internal docs separation

- Moved internal architecture, deployment, environment, and reference docs to devdocs (Access-gated).
- Replaced Manual Setup with [API Quickstart](/api-quickstart/).
- Public site now covers external API reference, integration guides, legal, pricing, and FAQ only.
- Added CI audit: `scripts/audit-public-docs-sensitive.mjs`.

## 2026-01-29

### Starlight Infrastructure and Initial Design Document

- **Starlight Infrastructure Setup**: Install Astro Starlight in the project's `docs/` folder. Configure multilingual structure using the default language `ko` and additional languages `en`.
- **Directory Architecture**: `docs/src/content/docs/` Apply IA below.
  - Create folders: `v1/api/`, `v1/guides/` (per locale: ko/en).
- **Initial Design Document**: Add personalization engine design (later moved to internal devdocs).
