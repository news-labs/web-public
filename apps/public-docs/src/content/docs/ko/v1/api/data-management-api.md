---
title: Data Management API
description: Datasets·Metadata API — 데이터 처리 인터페이스
sidebar:
  order: 2
---

R2 원시 데이터셋과 메타데이터 스냅샷·동기화 API입니다.

---

## Datasets API

**Base path:** `/api/v1/datasets`

- **GET /api/v1/datasets** — 데이터셋 목록 (country, category 쿼리).
- **GET /api/v1/datasets/stats** — 데이터셋 통계.
- **GET /api/v1/datasets/:country/:category/:date** — 특정 날짜 파티션 청크 목록.
- **GET /api/v1/datasets/:country/:category/:date/:chunk** — 특정 청크 조회.
- **POST /api/v1/datasets** — 데이터셋 저장 (EnhancedResearchDataset).
- **DELETE /api/v1/datasets/:country/:category/:date/:chunk** — 청크 삭제.

---

## Metadata API

**Base path:** `/api/v1/metadata`

- **GET /api/v1/metadata/snapshot** — 전체 스냅샷 메타데이터 (GitHub Actions 동기화용).
- **POST /api/v1/metadata/sync** — 스냅샷을 GitHub로 동기화.
- **GET /api/v1/metadata/by-country/:country** — 국가별 메타데이터.
- **GET /api/v1/metadata/tasks** — 메타데이터 태스크 목록/상태.

---

## 참고

- 구현: `src/routes/datasets.ts`, `src/routes/metadata.ts`
