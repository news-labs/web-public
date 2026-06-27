---
title: JSON Structure Design
description: Research Dataset 및 Seed 스키마 설계 요약
sidebar:
  order: 7
---

## Research Dataset vs Seed

- **Research Dataset:** 발견된 사실(Evidence)만 담음. Seed가 아님.
- **Seed:** "어디를 · 어떻게 · 어떤 조건으로 · 얼마나 자주 수집할 것인가"에 대한 **계약**.

## Dataset 구조 권장 (완성형)

- **meta:** country, category, date, generated_at, generator
- **stats:** total_domains, alive_domains, avg_response_time_ms
- **domains:** domain_id, source_domain, discovered, content_nature_inference, policy_hints, semantic_profile, relationships

### 필수 보완 포인트

- **domain_id:** Stable ID (예: `gov:sg:mom.gov.sg`). GraphDB/VectorDB 노드 키로 사용.
- **content_nature_inference:** 추론 결과임을 명시 (nature, confidence, method, evidence).
- **policy_hints:** robots_allows_crawling, sitemap_present, suspected_license 등.
- **relationships:** GraphDB용 엣지 힌트 (GOVERNED_BY, affiliation 등).

## Seed Schema (seed.schema.json) 핵심

- **required:** meta, source, fetch, policy, lifecycle
- **meta:** seed_id, version, country, category, created_at, status
- **source:** domain_id, source_domain, source_urls (Map: news, faq, guide…), language, trust_tier
- **fetch:** type (rss | html | api), rss/html/api별 옵션
- **policy:** crawl_allowed (반드시 사람 승인), robots_url, sitemap_url, license
- **lifecycle:** source_dataset, approved_by, approved_at

## ID 규칙

- **domain_id:** `{authority}:{country}:{registrable_domain}` (예: gov:sg:mom.gov.sg)
- **seed_id:** `{domain_id}::{content_type}` (예: gov:sg:mom.gov.sg::news)
- **version:** 계약 변경만 표현. 정수 증가. URL/selector/schedule 변경 시 +1.

## 운영 원칙

- Research: 사실 + 추론. Seed: 결정 + 계약.
- crawl_allowed는 **반드시 사람 승인**.
- Seed는 임베딩 금지. 기사 단계에서 수행.
