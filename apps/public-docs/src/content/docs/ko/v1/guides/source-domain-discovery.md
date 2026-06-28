---
title: Source Domain to Source URL Discovery Strategy
description: source_domain에서 source_url 자동 발견 전략
sidebar:
  order: 5
---

## Conclusion

> **단일 방법은 없다. "단계적 탐색 + 신뢰도 우선순위"가 정답이다.**

**Fallback이 있는 다단계 파이프라인**으로 설계해야 합니다.

## Discovery Pipeline (권장 순서)

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

→ **성공한 첫 지점이 source_url**

## 1. Well-known Feed 경로 (최우선, 80% 해결)

### 표준 경로

```
https://{domain}/rss
https://{domain}/rss.xml
https://{domain}/feed
https://{domain}/feeds/news.xml
https://{domain}/news/rss
https://{domain}/press/rss
```

### 정부/공공기관 특화

```
/rss/news
/newsroom/rss
/press-releases/rss
/media-centre/rss
```

### 판단 기준

- HTTP 200
- `Content-Type: application/xml` 또는 `rss+xml`
- `<item>` 또는 `<entry>` 존재

## 2. Sitemap.xml 분석

- `https://{domain}/sitemap.xml`
- Sitemap 내 `/news`, `/press`, `/media`, `/announcements` 포함 URL 우선

## 3. Robots.txt 힌트

- `Sitemap:` 항목
- `Allow:` 된 `/news`, `/press` 경로

## 4. HTML Pattern 탐색 (최후의 자동 단계)

- `https://{domain}/`에서 `<nav>`, `<footer>` 링크 수집
- anchor text 기준 필터링 (News, Press, Media 등)

## 5. Search Engine 보조 (반자동)

- `site:{domain} (news OR press OR announcement)`
- Seed 후보 제안용, 자동 등록 ❌

## Seed 저장 결과 예시

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

## 절대 하지 말아야 할 방식 ❌

- domain 전체 크롤링
- Google 결과 그대로 자동 등록
- HTML 파싱을 기본값으로 설정
- source_url 없이 seed 생성
