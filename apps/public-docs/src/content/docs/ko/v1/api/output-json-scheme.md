---
title: Output JSON Scheme
description: Research → Seed 파이프라인 출력 JSON 구조
sidebar:
  order: 5
---

## Overview

Research → Seed 파이프라인은 **5단계 다단계 탐색**을 통해 `source_domain`에서 `entry_url`을 발견하고, Output JSON을 생성합니다.

## Pipeline Stages

```
[1] Well-known RSS Feeds (11개 표준 경로)
   ↓ (없으면)
[2] Sitemap.xml 분석 (뉴스/미디어 URL 추출)
   ↓ (없으면)
[3] Robots.txt 힌트 (Sitemap/Allow 경로)
   ↓ (없으면)
[4] HTML 패턴 탐색 (RSS 링크, 네비게이션)
   ↓ (없으면)
[5] 수동 검토 필요 (자동화 한계)
```

## Output JSON Structure

```json
{
  "meta": {
    "generated_at": "2026-01-24T14:23:45.777Z",
    "total_seeds": 6,
    "pipeline_version": "2.0",
    "generator": "newsfork-seed-discovery"
  },
  "seeds": [
    {
      "id": "sg-mom-001",
      "source_domain": "mom.gov.sg",
      "entry_url": "https://www.mom.gov.sg/newsroom.xml",
      "nature": "news",
      "fetch": {
        "type": "html",
        "selectors": {
          "container": "main, .content, .news-content"
        }
      },
      "url_patterns": ["..."],
      "schedule": "*/30 * * * *",
      "priority": 9,
      "trust_tier": "tier1",
      "status": "draft",
      "metadata": {
        "discovery_confidence": 0.85,
        "nature_detection": {
          "method": "url_pattern",
          "confidence": 0.9
        }
      }
    }
  ]
}
```

## Content Nature 자동 판별

| URL 패턴 | Nature | 신뢰도 |
|----------|--------|--------|
| /newsroom/ | news | 90% |
| /press/ | press_release | 85% |
| /faq/ | faq | 80% |
| /guide/ | guide | 80% |

## Research vs Seed 역할 분리

- **Research**: "어디를 볼지" 발견 (URL 목록만)
- **Seed**: "어떻게 가져올지" 계약 (nature 판별 + 수집 전략)
