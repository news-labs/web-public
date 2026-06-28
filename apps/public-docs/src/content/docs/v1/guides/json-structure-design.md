---
title: JSON Structure Design
description: Research Dataset and Seed schema design summary
sidebar:
  order: 7
translatedFromHash: 5db8ae9699a097b150f4d54c5b6ba608da8d13372d6e5de6998e2298cacf1ffe
---

## Research Dataset vs Seed 

 - **Research Dataset:** Contains only discovered facts (Evidence). Not a Seed.
- **Seed:** A **contract** defining "where · how · under what conditions · how often to collect."

## Recommended Dataset Structure (Final)

- **meta:** country, category, date, generated_at, generator
- **stats:** total_domains, alive_domains, avg_response_time_ms
- **domains:** domain_id, source_domain, discovered, content_nature_inference, policy_hints, semantic_profile, relationships

### Essential Completion Points

- **domain_id:** Stable ID (e.g., `gov:sg:mom.gov.sg`). Used as GraphDB/VectorDB node key.
- **content_nature_inference:** Specify that it is an inference result (nature, confidence, method, evidence).
- **policy_hints:** robots_allow_crawling, sitemap_present, suspected_license, etc.
- **relationships:** Edge hints for GraphDB (GOVERNED_BY, affiliation, etc.).

## Seed Schema (seed.schema.json) Core

- **required:** meta, source, fetch, policy, lifecycle
- **meta:** seed_id, version, country, category, created_at, status
- **source:** domain_id, source_domain, source_urls (Map: news, faq, guide…), language, trust_tier
- **fetch:** type (rss | html | api), Options per RSS/HTML/API
- **policy:** crawl_allowed (must be human-approved), robots_url, sitemap_url, license
- **lifecycle:** source_dataset, approved_by, approved_at

## ID Rules

- **domain_id:** `{authority}:{country}:{registrable_domain}` (e.g., gov:sg:mom.gov.sg)
- **seed_id:** `{domain_id}::{content_type}` (e.g., gov:sg:mom.gov.sg::news)
- **version:** Only reflects contract changes. Increment integer. Increment by +1 when URL/selector/schedule changes.

## Operational Principles

- Research: Facts + Inference. Seed: Decisions + Contracts.
- crawl_allowed requires **human approval**.
- Seeds prohibit embedding. Perform at article stage.
