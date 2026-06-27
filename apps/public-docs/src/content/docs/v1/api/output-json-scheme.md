---
title: Output JSON Scheme
description: Research → Seed pipeline output JSON structure
sidebar:
  order: 5
translatedFromHash: 82e47b9b2c471d8062186cdd6fcfdf3e5573620ae50542922bf631da7aaa964c
---

## Overview

The Research → Seed pipeline discovers `entry_url` from `source_domain` through a **5-stage multi-step exploration** and generates Output JSON.

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

## Content Nature Automatic Classification

| URL Pattern | Nature | Confidence |
|----------|--------|--------|
| /newsroom/ | news | 90% |
| /press/ | press_release | 85% |
| /faq/ | faq | 80% |
| /guide/ | guide | 80% |

## Research vs Seed Role Separation

- **Research**: Discover "where to look" (URL list only)
- **Seed**: Contract "how to retrieve" (nature identification + collection strategy)
