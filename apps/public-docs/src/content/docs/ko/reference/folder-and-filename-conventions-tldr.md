---
title: Folder and Filename Conventions TL;DR
description: 폴더·파일명 정의 요약 (30년차 아키텍트 관점)
sidebar:
  order: 1
---

## TL;DR

> **"폴더는 파티션 규칙을 단일화하되, 파일명은 '불변 스냅샷 vs 계약 객체'에 따라 다르게 가져가야 한다."**

- ✅ **폴더 구조 규칙은 Research 방식으로 전면 통일**
- ❌ **파일 네이밍까지 전부 날짜 기반으로 통일하면 안 됨**

## Folder Naming (단일화)

```
<root>/
└── country=<ISO2>/
    └── category=<logical_category>/
        └── content=<news|faq|policy|guide>/
            └── date=YYYY-MM-DD/
```

- GitHub / R2 / 향후 Data Lake 동일
- key=value 파티션 **강제**

## File Naming (유형별)

| 데이터 유형 | 파일명 규칙 | 저장소 |
|------------|-------------|--------|
| Research Dataset | YYYY-MM-DD.json | GitHub |
| Seed Contract | v1.json, v2.json | GitHub |
| robots.txt | date=YYYY-MM-DD/robots.txt | R2 |
| sitemap.xml | date=YYYY-MM-DD/sitemap.xml | R2 |
| homepage.html | date=YYYY-MM-DD/homepage.html | R2 |
| 기사 HTML | ❌ 저장 금지 | — |

## domain_id / seed_id 표준

### domain_id

```
<authority>:<country>:<registered_domain>
```

- _Example_: `gov:sg:ica.gov.sg`, `ngo:intl:who.int`

### seed_id

```
<domain_id>::<content_type>
```

- _Example_: `gov:sg:ica.gov.sg::news`
- content_type: news, press_release, faq, guide, policy

### 핵심 원칙

- ID는 **짧고, 의미 있고, 변하지 않게**
- 버전 / 날짜 / URL은 **속성으로 분리**
- ID ↔ 폴더 구조는 **항상 역변환 가능**
