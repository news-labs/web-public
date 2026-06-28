---
title: Seeds, Research & Health API
description: 엔진 핵심 인터페이스 — Health·Research·Seeds 통합
sidebar:
  order: 1
---

**대상 독자** — Newsfork 엔진 코어를 호출하는 통합 담당자. 기본 URL과 인증은 [API 개요](/ko/v1/api/)를 참조하세요.

## 개요

엔진 핵심 인터페이스는 헬스 체크, Research(URL 발견), Seeds(계약·오케스트레이션)를 다룹니다. Health는 시스템 상태를, Research는 어디를 볼지, Seeds는 어떻게 수집할지를 정의합니다.

## Health API

시스템 상태 확인용 엔드포인트.

**Base path:** `/health`

- **GET /health** — 기본 헬스체크. `status`, `timestamp`, `version` 반환.
- **GET /health/ready** — 레디니스. 트래픽 수신 준비 여부.
- **GET /health/live** — 라이브니스. 프로세스 생존 여부.

루트 **GET /** 에서 API 이름·버전·엔드포인트 목록을 JSON으로 반환합니다.

## Research API

Research Engine은 **"어디를 볼지"**를 담당합니다.

**Base path:** `/api/v1/research`

- **GET /api/v1/research** — Research 목록 (`country`, `category`, `date`, `limit`, `offset` 쿼리).
- **GET /api/v1/research/index** — Research 인덱스(목차).
- **GET /api/v1/research/:country/:category/:date** — 특정 Research 상세.
- **POST /api/v1/research** — 새 Research 생성 (`ResearchCreateRequest`).

## Seeds API

Seed Engine은 **"어떻게 가져올지"**를 정의합니다.

**Base path:** `/api/v1/seeds`

- **GET /api/v1/seeds** — Seed 목록 (`country`, `status`, `source_type`, `limit`, `offset` 쿼리).
- **GET /api/v1/seeds/:seedId** — 특정 Seed 조회.
- **POST /api/v1/seeds** — 새 Seed 생성 (draft).
- **PATCH /api/v1/seeds/:seedId** — Seed 수정.
- **POST /api/v1/seeds/promote** — Draft → active 승격.
- **POST /api/v1/seeds/orchestrate** — Seed 오케스트레이션 트리거 (R2 raw 목록 → SEED_QUEUE). Request body: `country`, `category`, `date`, `force` (선택).

## 인증

`Authorization` 헤더로 API 자격 증명을 전송하세요. [API 개요](/ko/v1/api/#인증) 및 [API Quickstart](/ko/api-quickstart/)을 참조하세요.

## 다음 단계

- [Data Management API](/ko/v1/api/data-management-api/) — 데이터셋 및 메타데이터
- [Infrastructure API](/ko/v1/api/infrastructure-api/) — 큐 배치 작업
- [Research 가이드](/ko/v1/guides/research/) — URL 발견 워크플로

## 참고

- 구현: `src/routes/health.ts`, `src/routes/research.ts`, `src/routes/seeds.ts`, `src/routes/seed-orchestrator.ts`
