---
title: Cloudflare Migration
description: Cloudflare Migration and Operations Guide
sidebar:
  order: 3
translatedFromHash: 72490b5aa5bacea5ef871452b57af2f0bbc5714bafdbe9f06fd9aee70a1cb550
---

## Overview

The migration to transition the execution environment from GitHub Actions to Cloudflare Workers and migrate the data storage from GitHub to R2 has been completed.

## Completed Changes

### 1. Execution Environment: GitHub Actions → Cloudflare Workers
- All data processing logic now runs on Workers
- Stable task distribution via Cloudflare Queues
- Scheduled task execution using Cron triggers

### 2. Data Storage: GitHub → R2
- Raw JSON data stored in R2
- Only metadata synchronized to GitHub (audit trail)
- State and metadata managed via D1 database

### 3. Adding Cloudflare Queues
- Task splitting and stable processing
- Supports automatic retries and DLQ (Dead Letter Queue)
- Protects external services via rate limiting

---

## New Architecture

 ```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   HTTP API  │  │  Scheduled  │  │   Queue     │              │
│  │   Handler   │  │   (Cron)    │  │  Consumers  │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │                                       │
│  ┌───────────────────────┴───────────────────────┐              │
│  │              Business Services                 │              │
│  │  Research │ Dataset │ Metadata │ Queue        │              │
│  └───────────────────────┬───────────────────────┘              │
│                          │                                       │
│  ┌───────────────────────┴───────────────────────┐              │
│  │              Storage Services                  │              │
│  │  HybridStorage │ R2Storage │ GitHubStorage    │              │
│  └───────────────────────┬───────────────────────┘              │
└──────────────────────────┼──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│      R2       │  │      D1       │  │    GitHub     │
│  (Raw Data)   │  │  (Metadata)   │  │ (Audit Trail) │
└───────────────┘  └───────────────┘  └───────────────┘
``` 

---

## File Structure

 ```
src/
├── index.ts                      # 앱 진입점 (HTTP, Cron, Queue handlers)
├── routes/
│   ├── index.ts                  # 라우트 export
│   ├── health.ts                 # 헬스체크
│   ├── research.ts               # 리서치 API
│   ├── seeds.ts                  # 시드 API
│   ├── datasets.ts               # 데이터셋 API (NEW)
│   ├── metadata.ts               # 메타데이터 API (NEW)
│   └── queues.ts                 # 큐 관리 API (NEW)
├── services/
│   ├── index.ts                  # 서비스 export
│   ├── storage.service.ts        # GitHub Storage
│   ├── r2-storage.service.ts     # R2 Storage (NEW)
│   ├── hybrid-storage.service.ts # Hybrid Storage (NEW)
│   ├── queue.service.ts          # Queue Service (NEW)
│   ├── dataset.service.ts        # Dataset Service (NEW)
│   ├── metadata.service.ts       # Metadata Service (NEW)
│   ├── research.service.ts
│   └── seed.service.ts
├── schemas/
│   ├── index.ts
│   ├── common.ts
│   ├── research.ts
│   ├── seed.ts
│   ├── checkpoint.ts
│   ├── metadata.ts               # Metadata Schemas (NEW)
│   └── queue.ts                  # Queue Schemas (NEW)
└── lib/
    ├── index.ts
    ├── path.ts
    ├── errors.ts
    ├── domain.ts
    ├── kv.ts
    ├── liveness.ts
    ├── dataset-utils.ts
    ├── checkpoint.ts
    ├── r2.ts                     # R2 Utilities (NEW)
    ├── d1.ts                     # D1 Utilities (NEW)
    └── queue.ts                  # Queue Processors (NEW)

migrations/
└── 001_init.sql                  # D1 Database Schema (NEW)

.github/workflows/
├── deploy.yml                    # Workers 배포
└── metadata-sync.yml             # 메타데이터 GitHub 동기화 (NEW)
``` 

---

## API Endpoints

### Existing Endpoints (Maintained)
- `GET /health` - Health Check
- `GET /api/v1/research/:country/:category/:date` - Research Query
- `POST /api/v1/research` - Research Creation
- `GET /api/v1/seeds` - Seed List
- `POST /api/v1/seeds` - Seed Creation

### New Endpoint
- `GET /api/v1/datasets` - Dataset List
- `GET /api/v1/datasets/stats` - Dataset Statistics
- `GET /api/v1/datasets/:country/:category/:date` - List Chunks for Specific Date
- `GET /api/v1/datasets/:country/:category/:date/:chunk` - Query Specific Chunk
- `POST /api/v1/datasets/:country/:category/:date/:chunk` - Save Chunk
- `DELETE /api/v1/datasets/:country/:category/:date/:chunk` - Delete Chunk

- `GET /api/v1/metadata/snapshot` - Snapshot Metadata
- `POST /api/v1/metadata/sync` - GitHub Sync Trigger
- `GET /api/v1/metadata/by-country/:country` - Country-Specific Metadata
- `GET /api/v1/metadata/by-category/:category` - Category-Specific Metadata
- `GET /api/v1/metadata/by-date-range` - Date Range Metadata
- `GET /api/v1/metadata/tasks` - Task Statistics

- `POST /api/v1/queues/research` - Research Batch Creation
- `POST /api/v1/queues/liveness` - Create Liveness Batch
- `POST /api/v1/queues/contract` - Create Contract Batch
- `GET /api/v1/queues/batch/:batchId` - Query Batch Status
- `POST /api/v1/queues/trigger/metadata-sync` - Trigger Metadata Synchronization
- `POST /api/v1/queues/trigger/research-discovery` - Trigger Research Discovery

---

## Cloudflare Queues Configuration

### Queue List
| Queue Name | Purpose | Batch Size | Timeout | Retries |
|---------|------|------------|---------|---------|
| newsfork-research-{env} | Research tasks | 10 | 30s | 3 |
| newsfork-contract-{env} | Contract Creation | 10 | 30s | 3 |
| newsfork-liveness-{env} | Liveness Check | 50-100 | 10s | 3 |
| newsfork-dlq-{env} | Dead Letter Queue | - | - | - |

### Message Type
- `research_discovery`: Research Discovery Task
- `research_batch`: Research Batch Processing
- `metadata_sync`: Metadata Synchronization
- `contract_generate`: Contract Creation
- `contract_validate`: Contract Validation
- `contract_batch`: Contract Batch Processing
- `liveness_check`: Single Liveness Check
- `liveness_batch`: Liveness Batch Check

---

## Configuration and Deployment

### 1. Create Cloudflare Resource

 ```bash
# R2 버킷 생성
wrangler r2 bucket create newsfork-datasets-dev
wrangler r2 bucket create newsfork-metadata-dev

# D1 데이터베이스 생성
wrangler d1 create newsfork-metadata-dev

# 큐 생성
wrangler queues create newsfork-research-dev
wrangler queues create newsfork-contract-dev
wrangler queues create newsfork-liveness-dev
wrangler queues create newsfork-dlq-dev

# KV 네임스페이스 생성
wrangler kv:namespace create DOMAIN_KV
``` 

### 2. Update wrangler.jsonc
Update the generated resource IDs in `wrangler.jsonc`:
- R2 bucket_name
- D1 database_id
- KV namespace id
- Queue names

### 3. Apply D1 Schema

 ```bash
wrangler d1 execute METADATA_DB --file=./migrations/001_init.sql
``` 

### 4. Configure Secrets

 ```bash
wrangler secret put GH_TOKEN
wrangler secret put GH_OWNER
wrangler secret put GH_REPO
``` 

### 5. Deploy

 ```bash
# 개발 환경
pnpm run dev

# 스테이징 배포
pnpm run deploy:staging

# 프로덕션 배포
pnpm run deploy:production
``` 

---

## Data Flow

### Research Batch Processing

 ```
1. API 호출: POST /api/v1/queues/research
   └─> QueueService.createResearchBatch()
       └─> URL 목록을 청크로 분할 (예: 100개씩)
       └─> 각 청크를 RESEARCH_QUEUE에 전송
       └─> 배치 메타데이터를 D1에 저장

2. Queue Consumer
   └─> processResearchQueue() 호출
   └─> 청크 처리 (URL 정규화, 도메인 추출)
   └─> 결과를 R2에 저장
   └─> D1에 배치 진행 상태 업데이트

3. 완료 후
   └─> metadata_sync 작업 자동 트리거
   └─> R2 메타데이터를 GitHub에 동기화
``` 

### Metadata Synchronization

 ```
1. Cron 트리거 (매 6시간) 또는 API 호출
   └─> RESEARCH_QUEUE에 metadata_sync 메시지 전송

2. Queue Consumer
   └─> handleMetadataSync() 호출
   └─> R2에서 모든 데이터셋 메타데이터 집계
   └─> GitHub에 metadata/snapshot.json 커밋

3. GitHub Actions (선택적)
   └─> metadata-sync.yml 워크플로우
   └─> Worker API에서 스냅샷 조회
   └─> GitHub 저장소에 커밋
``` 

---

## Deleted Files

### CLI Tools (Replaced by Workers)
- `cli/research-engine.ts` 
- `cli/contract-engine.ts` 

### GitHub Actions Workflows (Replaced by Workers)
- `.github/workflows/research-dev.yml` 
- `.github/workflows/research-staging.yml` 
- `.github/workflows/research-prod.yml` 
- `.github/workflows/research-pipeline.yml` 
- `.github/workflows/contract-pipeline.yml` 
- `.github/workflows/seed-dev.yml` 
- `.github/workflows/seed-staging.yml` 
- `.github/workflows/seed-prod.yml` 
- `.github/workflows/seed-promotion.yml` 

---

## Test

### Local Test

 ```bash
# 로컬 Workers 실행 (Miniflare)
pnpm run dev:local

# 테스트 실행
pnpm test

# Workers 전용 테스트
pnpm run test:local
``` 

### API Test

 ```bash
# 헬스체크
curl http://localhost:8787/health

# 데이터셋 목록
curl http://localhost:8787/api/v1/datasets

# 메타데이터 스냅샷
curl http://localhost:8787/api/v1/metadata/snapshot

# 리서치 배치 생성
curl -X POST http://localhost:8787/api/v1/queues/research \
  -H "Content-Type: application/json" \
  -d '{"country":"SG","category":"news","urls":["https://example.com"]}'
``` 

---

## Monitoring

### Cloudflare Dashboard
- Workers Analytics: Request Count, Latency, Error Rate
- Queues: Message Throughput, Retry Count, DLQ Status
- R2: Storage Usage, Request Count
- D1: Query Performance, Storage Usage

### Metadata Synchronization
- Verify ``metadata/snapshot.json`` in GitHub repository
- Last sync time, total dataset count, record count

---

## Notes

1. **Worker Execution Time Limit**: Each task is designed to complete within 30 seconds
2. **Queue Retries**: Failed tasks retried up to 3 times before moving to DLQ
3. **Rate Limiting**: Applies 100ms delay per domain during liveness checks
4. **Memory Limit**: Consider Workers' 128MB memory limit
5. **R2 Costs**: Requires monitoring of storage and request costs
