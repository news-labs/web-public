---
title: Fork-News Seed Data
description: Seed 필수 필드 정의 (Minimum Viable Seed)
sidebar:
  order: 9
---

## Seed의 역할

> **Seed는 콘텐츠가 아니라 "수집 계약(Contract)"이다.**  
> Seed는 _어디서_, _무엇을_, _어떤 조건으로_ 가져올지를 정의한다.

- Seed에는 **기사 내용·요약·HTML** ❌  
- 대신 **출처·법적 조건·수집 방식·분류 기준** ✅

## 필수 필드 요약

| 구분 | 필드명 | 타입 | 설명 |
|------|--------|------|------|
| Identity | seed_id | string | Seed 고유 ID (불변) |
| | name | string | 출처 표시명 (관리·로그용) |
| Source | source_url | string | 수집 시작 URL (RSS/API/HTML) |
| | source_domain | string | 도메인 (중복·신뢰 관리용) |
| Collection | fetch_type | enum | rss \| api \| html |
| | schedule | string | Cron 표현식 |
| Content Nature | content_type | enum | news \| faq \| guide \| directory \| notice |

## 설계 원칙

- **KISS, Static-First, License-First, API-First**
- "있으면 좋은 것"은 배제, **수집·운영·법적 판단에 필수인 최소 집합**만 포함

## Related Documents

- [JSON Structure Design](/ko/v1/guides/json-structure-design/) — Dataset·Seed 스키마 상세
- [Category Reference](/ko/v1/api/category-reference/) — content_type·nature 정의
