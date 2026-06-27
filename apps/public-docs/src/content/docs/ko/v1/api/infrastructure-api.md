---
title: Infrastructure API (Queues)
description: Queues API — 비동기 배치 처리 인터페이스
sidebar:
  order: 3
---

Cloudflare Queues를 이용한 배치 작업 생성 및 메타데이터 동기화 트리거 API입니다.

**Base path:** `/api/v1/queues`

---

## POST /api/v1/queues/research

Research 발견(URL 처리) 배치 생성. **Request body:** `country`, `category`, `urls` (1~10000), `chunkSize` (선택, 기본 100).

---

## POST /api/v1/queues/liveness

Liveness(도메인 생존) 체크 배치 생성. **Request body:** `country`, `domains` (1~10000), `chunkSize` (선택, 기본 50).

---

## POST /api/v1/queues/contract

Contract(Seed 계약) 생성 배치. **Request body:** `country`, `category`, `domainIds` (1~1000), `chunkSize` (선택, 기본 20).

---

## GET /api/v1/queues/batch/:batchId

특정 배치 ID의 상태(또는 결과) 조회.

---

## POST /api/v1/queues/trigger/metadata-sync

메타데이터 동기화 트리거.

---

## 참고

- 구현: `src/routes/queues.ts`. Queue 바인딩: RESEARCH_QUEUE, LIVENESS_QUEUE, CONTRACT_QUEUE 등 (`wrangler.jsonc`).
