---
title: API 개요
description: Newsfork Seeds 플랫폼의 기본 URL, 인증, 주요 API 영역.
sidebar:
  order: 0
---

**대상 독자** — REST API를 호출하기 전 **기본 경로**와 **인증**을 확인할 때 이 페이지를 사용하세요. 제품 사용자는 [시작하기](/ko/getting-started/) 또는 [가이드](/ko/v1/guides/)부터 시작하세요.

## 개요

Newsfork는 헬스 체크, Research 발견, Seed 계약, 데이터셋 관리, 큐 기반 배치 처리를 위한 REST API를 제공합니다. 모든 API는 R2, D1, KV, Queues 바인딩이 있는 Cloudflare Workers에서 실행됩니다.

## 기본 URL

배포 환경에서 다음 기본 URL을 제공합니다.

- **Health** — 프로세스 및 레디니스 확인 (`/health`)
- **Research & Seeds** — URL 발견 및 Seed 계약 (`/api/v1/research`, `/api/v1/seeds`)
- **Data management** — R2 데이터셋 및 메타데이터 동기화 (`/api/v1/datasets`, `/api/v1/metadata`)
- **Infrastructure** — 큐 배치 작업 (`/api/v1/queues`)

보안 팀 승인 없이 프로덕션 URL을 클라이언트 코드에 하드코딩하지 마세요.

## 인증

대부분의 API 호출에는 유효한 **API 키** 또는 세션 토큰이 필요합니다. `Authorization` 헤더(또는 통합 가이드에 명시된 방식)로 자격 증명을 전송하세요. 로컬 자격 증명은 [수동 설정](/ko/manual-setup/)을 참조하세요.

## 주요 API 영역

| 영역 | 목적 | 문서 |
| --- | --- | --- |
| **Health, Research & Seeds** | 핵심 엔진 인터페이스 | [Seeds API](/ko/v1/api/seeds-api/) |
| **Data management** | 데이터셋 및 메타데이터 | [Data Management API](/ko/v1/api/data-management-api/) |
| **Infrastructure** | 큐 배치 처리 | [Infrastructure API](/ko/v1/api/infrastructure-api/) |
| **Reference** | 카테고리 및 출력 스키마 | [Category Reference](/ko/v1/api/category-reference/), [Output JSON Scheme](/ko/v1/api/output-json-scheme/) |

## 다음 단계

- [시작하기](/ko/getting-started/) — 역할 및 통합 순서
- [Seeds, Research & Health API](/ko/v1/api/seeds-api/) — 핵심 엔드포인트
- [가이드](/ko/v1/guides/) — 아키텍처 및 운영
