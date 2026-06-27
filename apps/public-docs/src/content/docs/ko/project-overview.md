---
title: Project Overview
description: NewsFork Seeds
version: 1
lastUpdated: 2026-04-12
status: auto-generated
---

이 문서는 **프로젝트 루트** 폴더의 README에서 자동 생성되었습니다.

# NewsFork Seeds

> Research discovery and seed contract management for news sources.

## Overview

NewsFork Seeds is a comprehensive system for discovering, validating, and managing news source contracts. It follows a two-phase architecture:

1. **Research Phase**: Discover WHERE to look (URL discovery)
2. **Seed Phase**: Define HOW to fetch (content contracts)

The system is built as a **Distributed Event Processing Platform** using Cloudflare Workers, Queues, R2, D1, and KV, with GitHub as the audit trail.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   HTTP API  │  │  Scheduled  │  │   Queue     │              │
│  │   Handler   │  │   (Cron)    │  │  Consumers  │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────┐              │
│  │              Business Services                 │              │
│  │  Research │ Seed │ Dataset │ Metadata │ Queue  │              │
│  └───────────────────────┬───────────────────────┘              │
│                          ▼                                       │
│  ┌───────────────────────────────────────────────┐              │
│  │              Storage Services                  │              │
│  │  HybridStorage │ R2Storage │ GitHubStorage    │              │
│  └───────────────────────┬───────────────────────┘              │
└──────────────────────────┼──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│      R2       │  │      D1       │  │    GitHub     │
│  (Raw Data)   │  │  (Metadata)   │  │ (Audit Trail) │
└───────────────┘  └───────────────┘  └───────────────┘
```

### Architecture Layers

```
HTTP Request / Queue Message / Cron Event
     │
     ▼
┌─────────────┐
│    Apps     │  ← Entry Points (Workers) - 얇은 진입점만
└─────────────┘
     │
     ├──→ Domain (순수 비즈니스 로직, Cloudflare-free)
     │
     └──→ Infra (Cloudflare 어댑터)
          │
          ├── R2 (Raw Data: datasets, liveness)
          ├── D1 (Metadata: task state, domain cache)
          ├── KV (Fast Lookups: domain registry)
          ├── Queue (Task Processing)
          └── GitHub (Audit Trail)
```

## Tech Stack

- **Runtime**: Cloudflare Workers (Edge Computing)
- **Framework**: Hono (Fast HTTP framework)
- **Validation**: Zod (Schema validation)
- **Database**: D1 (SQLite-compatible, metadata storage)
- **Storage**: R2 (Raw datasets), GitHub (Audit trail)
- **Cache**: KV (Domain registry, fast lookups)
- **Queue**: Cloudflare Queues (Reliable task processing)
- **CI/CD**: GitHub Actions
- **Language**: TypeScript

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server (local)
pnpm dev:local

# Start development server (remote)
pnpm dev:remote

# Type check
pnpm typecheck

# Run tests
pnpm test

# Complete local validation (recommended before pushing)
pnpm run validate:local

# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production
```

### Local Testing & Validation

Before pushing to CI, run complete validation locally to save CI time:

```bash
# Complete validation (TypeScript + Tests + Build)
pnpm run validate:local

# Or run individually:
pnpm typecheck        # TypeScript validation
pnpm test            # Run all tests
pnpm test:local      # Run tests with Cloudflare Workers environment
```

**Why validate locally?**
- ✅ Faster feedback (immediate results)
- ✅ CI time savings (50-60% reduction)
- ✅ Better developer experience
- ✅ CI focuses on deployment only

**Local Development Server Testing:**

```bash
# Start local server
pnpm dev:local

# In another terminal, test API endpoints
curl http://localhost:8787/health
curl http://localhost:8787/api/v1/research
curl http://localhost:8787/api/v1/seeds

# Test Orchestrator
curl -X POST http://localhost:8787/api/v1/seeds/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"country": "sg", "category": "news", "date": "2026-01-28"}'
```

**Build Validation (Dry-run):**

```bash
# Validate build before deployment
pnpm exec wrangler deploy --dry-run --env staging

# With Cloudflare credentials
CLOUDFLARE_API_TOKEN=your-token \
CLOUDFLARE_ACCOUNT_ID=your-id \
pnpm exec wrangler deploy --dry-run --env staging
```

### Configuration

Set these secrets in Cloudflare Workers:

```bash
# Development
wrangler secret put GH_TOKEN
wrangler secret put GH_OWNER
wrangler secret put GH_REPO

# Staging
wrangler secret put GH_TOKEN --env staging
wrangler secret put GH_OWNER --env staging
wrangler secret put GH_REPO --env staging

# Production
wrangler secret put GH_TOKEN --env production
wrangler secret put GH_OWNER --env production
wrangler secret put GH_REPO --env production
```

**Logpush (production only):** Worker logs are pushed to R2 via Cloudflare Logpush. Create a single R2 bucket `logpush-r2` in Cloudflare, then set GitHub Secrets: `LOGPUSH_R2_ACCESS_KEY`, `LOGPUSH_R2_SECRET_KEY`. Provision and verify run only when deploying to production. Cloudflare API token must have **Logs Write**. See [Logpush R2 Secrets Guide](./docs/LOGPUSH_R2_SECRETS_GUIDE.md).

## Project Structure

```
newsfork-seeds/
├── src/
│   ├── apps/                    # Entry Points (Workers)
│   │   └── api/
│   │       ├── index.ts        # HTTP Worker entry point
│   │       ├── queue-handler.ts # Queue consumer handler
│   │       └── scheduled-handler.ts # Cron handler
│   │
│   ├── domain/                  # 순수 비즈니스 로직 (Cloudflare-free)
│   │   ├── research/           # Research 도메인
│   │   │   ├── discoverUrlsFromSource.ts
│   │   │   ├── createResearchOutput.ts
│   │   │   ├── generateDatasetId.ts
│   │   │   └── updateDatasetWithLiveness.ts
│   │   └── seed/               # Seed 도메인
│   │       ├── createSeedContract.ts
│   │       ├── validateSeedContract.ts
│   │       └── promoteSeedToActive.ts
│   │
│   ├── infra/                   # Cloudflare 어댑터
│   │   └── cloudflare/
│   │       ├── r2/             # R2 Storage 어댑터
│   │       ├── github/         # GitHub Storage 어댑터
│   │       └── hybrid/         # Hybrid Storage (R2 + GitHub)
│   │
│   ├── services/                # 서비스 레이어 (Domain + Infra 조합)
│   │   ├── research.service.ts
│   │   ├── seed.service.ts
│   │   ├── dataset.service.ts
│   │   ├── metadata.service.ts
│   │   ├── queue.service.ts
│   │   └── storage.service.ts
│   │
│   ├── routes/                  # API 라우트 핸들러
│   │   ├── health.ts
│   │   ├── research.ts
│   │   ├── seeds.ts
│   │   ├── datasets.ts
│   │   ├── metadata.ts
│   │   └── queues.ts
│   │
│   ├── schemas/                 # Zod 스키마 (계약 정의)
│   │   ├── research.ts
│   │   ├── seed/
│   │   ├── queue.ts
│   │   └── common.ts
│   │
│   └── lib/                     # Cross-domain 유틸리티
│       ├── d1/                  # D1 유틸리티
│       ├── kv/                  # KV 유틸리티
│       ├── queue/               # Queue 유틸리티
│       ├── path/                # 경로 빌더/파서
│       └── errors.ts
│
├── research/                    # Research 데이터 (R2)
│   ├── datasets/                # Research datasets
│   ├── liveness/               # Liveness check results
│   ├── blocked/                # Blocked domains
│   └── dead/                   # Dead domains
│
├── seeds/                       # Seed contracts (GitHub)
│   ├── drafts/                 # Pending review
│   ├── active/                 # Production contracts
│   └── archived/               # Historical
│
├── migrations/                  # D1 Database migrations
│   └── 001_init.sql
│
├── .github/
│   ├── workflows/               # GitHub Actions
│   │   ├── deploy.yml          # Deployment workflow
│   │   └── metadata-sync.yml   # Metadata sync workflow
│   └── scripts/                # CI/CD scripts
│       ├── ci.sh
│       ├── setup.sh
│       └── steps/
│
├── docs/                        # Documentation
│   ├── README.md
│   ├── ENVIRONMENT_GUIDE.md
│   └── CLOUDFLARE_MIGRATION_PLAN.md
│
└── wrangler.jsonc               # Cloudflare Workers config
```

## API Endpoints

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/health/ready` | Readiness probe |
| GET | `/health/live` | Liveness probe |

### Research

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/research` | List research outputs |
| GET | `/api/v1/research/index` | Get research index |
| GET | `/api/v1/research/:country/:category/:date` | Get specific research |
| GET | `/api/v1/research/:country/:category/today` | Get today's research |
| POST | `/api/v1/research` | Create research output |

### Seeds

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/seeds` | List seeds with filters |
| GET | `/api/v1/seeds/:id` | Get seed by ID |
| POST | `/api/v1/seeds` | Create draft seed |
| PATCH | `/api/v1/seeds/:id` | Update seed |
| POST | `/api/v1/seeds/:id/promote` | Promote to active |
| POST | `/api/v1/seeds/:id/archive` | Archive seed |

### Datasets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/datasets` | List datasets (R2) |
| GET | `/api/v1/datasets/:country/:category/:date/:chunk` | Get specific dataset |
| POST | `/api/v1/datasets` | Save dataset to R2 |

### Metadata

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/metadata/snapshot` | Get metadata snapshot |
| POST | `/api/v1/metadata/sync` | Sync metadata to GitHub |

### Queues

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/queues/research` | Create research batch |
| POST | `/api/v1/queues/contract` | Create contract batch |
| POST | `/api/v1/queues/liveness` | Create liveness batch |
| GET | `/api/v1/queues/batch/:batchId` | Get batch status |

## Data Flow

### Research Pipeline

```
1. Research Request
   ↓
2. Queue Batch Creation (POST /api/v1/queues/research)
   ↓
3. Queue Consumer Processing
   ↓
4. URL Discovery (Domain functions)
   ↓
5. Dataset Creation & Storage (R2)
   ↓
6. Metadata Update (D1)
   ↓
7. GitHub Sync (Audit trail)
```

### Seed Pipeline

```
1. Research Dataset (R2)
   ↓
2. Seed Candidate Analysis
   ↓
3. Draft Seed Creation (POST /api/v1/seeds)
   ↓
4. Human Review
   ↓
5. Promotion (POST /api/v1/seeds/:id/promote)
   ↓
6. Active Seed (GitHub)
```

### Queue Processing

The system uses Cloudflare Queues for reliable task processing:

- **Research Queue**: Processes URL discovery batches
- **Contract Queue**: Processes seed contract generation
- **Liveness Queue**: Processes domain health checks

Each queue has:
- Batch processing (10-100 items per batch)
- Automatic retries (max 3 attempts)
- Dead Letter Queue (DLQ) for failed tasks

## Data Conventions

### Path Format (Hive-style)

```
research/datasets/country=sg/category=news/2026-01-23_0001.json
seeds/drafts/country=sg/domain=mom.gov.sg/content=news/v1.json
```

Compatible with BigQuery, Delta Lake, AWS Athena, Cloudflare R2.

### Research Dataset Schema

```json
{
  "meta": {
    "dataset_id": "sg-news-2026-01-25-0001",
    "country": "SG",
    "category": "news",
    "discovered_at": "2026-01-25T03:12:00Z",
    "research_methods": ["google_search", "crtsh"],
    "record_count": 8
  },
  "records": [
    {
      "raw_url": "https://www.mom.gov.sg/newsroom",
      "normalized_domain": "mom.gov.sg",
      "domain_id": "gov:sg:mom.gov.sg",
      "source_type": "gov",
      "confidence": 0.95
    }
  ]
}
```

### Seed Contract Schema

```json
{
  "seed_id": "sg-mom-001",
  "source": {
    "domain": "mom.gov.sg",
    "type": "government",
    "name": "Ministry of Manpower",
    "country": "SG"
  },
  "contents": [{
    "nature": "news",
    "source_url": "https://www.mom.gov.sg/newsroom",
    "fetch_type": "html",
    "confidence": 0.92
  }],
  "status": "active",
  "version": 1
}
```

## Key Concepts

### Source Type vs Content Category

| Concept | Description | Examples |
|---------|-------------|----------|
| **Source Type** | WHO produces content | government, media, company |
| **Content Category** | WHAT the content is | news, policy, guide |
| **Medium** | HOW it's delivered | web, social, video |

### Seed Lifecycle

```
draft → active → archived
          ↓
      suspended
```

### Storage Strategy

- **R2**: Raw data (datasets, liveness checks) - Large files
- **D1**: Metadata (task state, domain cache) - Queryable, small data
- **KV**: Fast lookups (domain registry) - Cache layer
- **GitHub**: Audit trail (seed contracts, metadata snapshots) - Version control

## Environments

The system supports three environments with completely isolated resources:

- **Development** (`dev`): Safe experimentation
- **Staging** (`staging`): Pre-production testing
- **Production** (`production`): Legal compliance records

See [Environment Guide](./docs/ENVIRONMENT_GUIDE.md) for details.

## GitHub Actions

| Workflow | Schedule | Description |
|----------|----------|-------------|
| `deploy.yml` | On push to main | Deploy to Cloudflare Workers |
| `metadata-sync.yml` | Every 6 hours | Sync metadata to GitHub |

## Testing

```bash
# Run all tests
pnpm test

# Run tests with Cloudflare Workers environment
pnpm test:local

# Type check
pnpm exec tsc --noEmit
```

## Database Migrations

```bash
# Apply migrations to dev
pnpm db:migrate

# Apply migrations to staging
pnpm db:migrate:staging

# Apply migrations to production
pnpm db:migrate:production
```

## Documentation

- [Architecture Guidelines](./.cursorrules) - Detailed architecture and coding standards
- [Environment Guide](./docs/ENVIRONMENT_GUIDE.md) - Environment setup and configuration
- ](/ko/v1/guides/research/) - Research data structure
- ](/ko/v1/guides/seeds/) - Seed contract structure
- ](/ko/v1/guides/docs/) - All documentation

## License

MIT
