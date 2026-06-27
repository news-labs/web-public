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

## 2026-01-29

### Starlight Infrastructure and Initial Design Document

- **Starlight Infrastructure Setup**: Install Astro Starlight in the project's `docs/` folder. Configure multilingual structure using the default language `ko` and additional languages `en`.
- **Directory Architecture**: `docs/src/content/docs/` Apply IA below.
  - Create folders: `v1/api/`, `v1/guides/`, `user-manual/`, `archive/whitepaper/` (per locale: ko/en).
- **Initial Design Document**: Add `v1/guides/personalization-engine-design.md`.
  - Topic: Newsfork News personalization engine(Weight-based algorithm and pipeline design).
  - Content: User click-based interest extraction, Redis caching strategy.
  - Includes Mermaid.js data flow diagram (graph TD).
  - Frontmatter: status`draft`, version`1.0.0`.
