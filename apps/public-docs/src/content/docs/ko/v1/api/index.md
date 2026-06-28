---
title: API 개요
description: Newsfork Seeds 플랫폼의 기본 URL, 인증, 주요 API 영역.
sidebar:
  order: 0
---

**대상 독자** — REST API를 호출하기 전 **기본 경로**와 **인증**을 확인할 때 이 페이지를 사용하세요. 처음이면 [시작하기](/ko/getting-started/) 또는 [API 빠른 시작](/ko/api-quickstart/)부터 시작하세요.

## 개요

Newsfork는 헬스 체크, Research 발견, Seed 계약, 데이터셋 관리, 큐 기반 배치 처리를 위한 호스팅 REST API를 제공합니다.

## 기본 URL

계정 온보딩에서 환경별 base URL을 안내합니다. 보안 팀 승인 없이 프로덕션 URL을 클라이언트 코드에 하드코딩하지 마세요.

## 인증

대부분의 API 호출에는 유효한 **API 키**가 필요합니다. `Authorization` 헤더로 전달합니다:

```http
Authorization: Bearer YOUR_API_KEY
```

예제는 [API 빠른 시작](/ko/api-quickstart/)을 참고하세요.

## 주요 API 영역

| 영역 | 목적 | 문서 |
| --- | --- | --- |
| **Health, Research & Seeds** | 핵심 엔진 인터페이스 | [Seeds API](/ko/v1/api/seeds-api/) |
| **Data management** | 데이터셋 및 메타데이터 | [Data Management API](/ko/v1/api/data-management-api/) |
| **Infrastructure** | 큐 배치 처리 | [Infrastructure API](/ko/v1/api/infrastructure-api/) |
| **Reference** | 카테고리 및 출력 스키마 | [Category Reference](/ko/v1/api/category-reference/), [Output JSON Scheme](/ko/v1/api/output-json-scheme/) |

## 다음 단계

- [API 빠른 시작](/ko/api-quickstart/) — 첫 요청
- [Seeds, Research & Health API](/ko/v1/api/seeds-api/) — 핵심 엔드포인트
- [가이드](/ko/v1/guides/) — 통합 개념
