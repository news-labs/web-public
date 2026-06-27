---
title: Seeds, Research & Health API
description: 엔진 핵심 인터페이스 — Health·Research·Seeds 통합
sidebar:
  order: 1
---

엔진 핵심 인터페이스: Health 체크, Research(URL 발견), Seeds(계약·오케스트레이션) API를 통합하여 설명합니다.

---

## Health

시스템 상태 확인용 엔드포인트. **Base path:** `/health`

- **GET /health** — 기본 헬스체크. `status`, `timestamp`, `version` 반환.
- **GET /health/ready** — 레디니스. 트래픽 수신 준비 여부.
- **GET /health/live** — 라이브니스. 프로세스 생존 여부.

루트 **GET /** 에서 API 이름·버전·엔드포인트 목록을 JSON으로 반환합니다.

---

## Research API

Research Engine은 **"어디를 볼지"**를 담당합니다. **Base path:** `/api/v1/research`

- **GET /api/v1/research** — Research 목록 (country, category, date, limit, offset 쿼리).
- **GET /api/v1/research/index** — Research 인덱스(목차).
- **GET /api/v1/research/:country/:category/:date** — 특정 Research 상세.
- **POST /api/v1/research** — 새 Research 생성 (ResearchCreateRequest).

---

## Seeds API

Seed Engine은 **"어떻게 가져올지"**를 정의합니다. **Base path:** `/api/v1/seeds`

- **GET /api/v1/seeds** — Seed 목록 (country, status, source_type, limit, offset 쿼리).
- **GET /api/v1/seeds/:seedId** — 특정 Seed 조회.
- **POST /api/v1/seeds** — 새 Seed 생성 (draft).
- **PATCH /api/v1/seeds/:seedId** — Seed 수정.
- **POST /api/v1/seeds/promote** — Draft → active 승격.
- **POST /api/v1/seeds/orchestrate** — Seed 오케스트레이션 트리거 (R2 raw 목록 → SEED_QUEUE). Request body: `country`, `category`, `date`, `force` (선택).

---

## 참고

- 구현: `src/routes/health.ts`, `src/routes/research.ts`, `src/routes/seeds.ts`, `src/routes/seed-orchestrator.ts`
