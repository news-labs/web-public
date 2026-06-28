---
title: Source Domain to Source URL Discovery Strategy
description: strategies for automatically discovering source_url from source_domain
sidebar:
  order: 5
translatedFromHash: b25effc2265d2fceaec67759f1f345ecb56d75e8b735859dc116136098fedecb
---

## Conclusion

> **There is no single method. "Stepwise exploration + confidence-based prioritization" is the correct approach.**

Design it as a **multi-stage pipeline with fallback**.

## Discovery Pipeline (Recommended Order)

 ```
source_domain
   ↓
[1] Well-known Feeds
   ↓ (없으면)
[2] Sitemap 분석
   ↓ (없으면)
[3] Robots.txt 힌트
   ↓ (없으면)
[4] HTML Pattern 탐색
   ↓ (없으면)
[5] Search Engine 보조 탐색
``` 

→ **The first successful point is the source_url**

## 1. Well-known Feed Path (Highest Priority, Resolves 80%)

### Standard Path

 ```
https://{domain}/rss
https://{domain}/rss.xml
https://{domain}/feed
https://{domain}/feeds/news.xml
https://{domain}/news/rss
https://{domain}/press/rss
``` 

### Government/Public Institution Specialized

 ```
/rss/news
/newsroom/rss
/press-releases/rss
/media-centre/rss
``` 

### Judgment Criteria

- HTTP 200
- `Content-Type: application/xml` or `rss+xml` 
- `<item>` or `<entry>` Existence

## 2. Sitemap.xml Analysis

- `https://{domain}/sitemap.xml` 
- URLs containing `/news` , `/press` , `/media` , `/announcements` within Sitemap are prioritized

## 3. Robots.txt Hints

- `Sitemap:` entries
- `Allow:` paths such as `/news` , `/press` are considered

## 4. HTML Pattern Exploration (Final Automated Step)

- `https://{domain}/` to `<nav>` , `<footer>` Link Collection
- Filtering by Anchor Text (News, Press, Media, etc.)

## 5. Search Engine Assistance (Semi-Automated)

- `site:{domain} (news OR press OR announcement)` 
- For Seed Candidate Suggestions, Automatic Registration ❌

## Seed storage result example

 ```json
{
  "source_domain": "mom.gov.sg",
  "source_url": "https://www.mom.gov.sg/rss/news",
  "fetch_type": "rss",
  "discovery_method": "well_known",
  "discovered_at": "2026-01-21T02:00:00Z",
  "confidence": 0.95
}
``` 

## Methods to absolutely avoid ❌

- Crawling entire domains
- Automatic registration of raw Google results
- Setting HTML parsing as default
- Creating seeds without source_url
