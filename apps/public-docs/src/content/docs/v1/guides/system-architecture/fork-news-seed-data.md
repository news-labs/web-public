---
title: Fork-News Seed Data
description: Define the Seed required field (Minimum Viable Seed)
sidebar:
  order: 9
translatedFromHash: 290e13794300474456f8aa2cde6d47b15af30caa834455298f034d7fea05fa52
---

## The Role of Seed

> **Seed is not content, but a "collection contract."**  
> Seed defines _where_, _what_, and _under what conditions_ to fetch.

- Seed contains **article content·summary·HTML** ❌  
- Instead, it contains **source·legal terms·collection method·classification criteria** ✅

## Required Field Summary

| Category | Field Name | Type | Description |
|------|--------|------|------|
| Identity | seed_id | string | Seed unique ID (immutable) |
| | name | string | Source display name (for management/logging) |
| Source | source_url | string | Collection start URL (RSS/API/HTML) |
| | source_domain | string | Domain (for duplicate/trust management) |
| Collection | fetch_type | enum | rss \| api \| html |
| | schedule | string | Cron expression |
| Content Nature | content_type | enum | news \| faq \| guide \| directory \| notice |

## Design Principles

- **KISS, Static-First, License-First, API-First**
- Exclude "nice-to-have" features; include only the **minimal set essential for collection, operation, and legal judgment**

## Related Documents

- [JSON Structure Design](./json-structure-design/) — Dataset·Seed schema details
- [Category Reference](/ko/v1/api/category-reference/) — content_type·nature definitions
