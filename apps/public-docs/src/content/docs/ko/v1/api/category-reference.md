---
title: Category Reference
description: API 공통 카테고리 및 규격 참조
sidebar:
  order: 4
---

## Overview

Category는 **콘텐츠의 성격(What it is)**을 나타냅니다. 출처(Source)가 아니라 다루는 정보의 본질 기준으로 정의합니다.

---

## Main Categories (Research & Seed 공통)

| Category | 의미 정의 | 포함되는 콘텐츠 |
| :--- | :--- | :--- |
| **news** | 시의성 있는 공식/비공식 발표 | 정책 발표, 공지, 보도자료 |
| **policy** | 제도·법·규정 그 자체 | 법률 개정, 행정 지침 |
| **guide** | 설명·안내 목적 콘텐츠 | How-to, 절차 안내 |
| **faq** | Q&A 구조 정보 | FAQ, Help, Support |
| **data** | 수치·통계·원시 데이터 | 통계청, 보고서 |
| **research** | 학술·리서치 | 논문, 백서 |
| **announcement** | 단순 공지 | 이벤트, 일정 |
| **directory** | 목록형 정보 | 기관 리스트, 연락처 |
| **opinion** | 해설·칼럼 | 기고문, 분석 |
| **alert** | 긴급/주의 정보 | 재난, 경보 |

Seed 단계에서 `nature`를 위 값 중 하나 이상으로 확정합니다.

---

## Government / Organization은 Category가 아님

| 개념 | 어디에 넣을지 |
| :--- | :--- |
| **Government** | `source.type = "government"` |
| **Organization** | `source.type = "organization"` |
| **NGO / Intl Org** | `source.type = "ngo"` |
| **Company** | `source.type = "company"` |

---

## Medium (콘텐츠 포맷)

| Medium | 정의 |
| :--- | :--- |
| **web** | 일반 웹페이지 |
| **social** | SNS 게시물 |
| **video** | 영상 콘텐츠 |
| **audio** | 팟캐스트 |
| **document** | PDF, DOC |

---

## Research → Seed 역할 분리

| 엔진 | 역할 |
| :--- | :--- |
| **Research Engine** | "어디를 볼지" (URL 발견) |
| **Seed Engine** | "어떻게 가져올지" (계약 생성) |
| **Scraper** | "실제 수집" (실행) |
