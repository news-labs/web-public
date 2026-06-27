---
title: Research
description: Research
version: 1
lastUpdated: 2026-04-12
status: auto-generated
---

이 문서는 **research** 폴더의 README에서 자동 생성되었습니다.

# Research

Research outputs represent the **discovery phase** of the NewsFork pipeline.

## Philosophy

> "Research Engine discovers WHERE to look."

Research doesn't judge content quality, fetch methods, or validity. It simply discovers URLs that _might_ be relevant news sources.

## Structure

```
research/
├── datasets/           # Research datasets (immutable snapshots)
│   └── country=sg/
│       └── category=news/
│           ├── 2026-01-24_0001.json
│           └── 2026-01-25_0001.json
├── blocked/            # Blocked domains (403, captcha)
│   └── country=sg/
│       └── 2026-01-24.json
├── dead/               # Dead domains (DNS fail, unreachable)
│   └── country=sg/
│       └── 2026-01-24.json
├── liveness/           # Liveness check results
│   └── country=sg/
│       └── 2026-01-24.json
└── README.md
```

## Storage

Research data is stored in **Cloudflare R2** for production use:

- **Primary Storage**: R2 Bucket (`DATASETS_BUCKET`)
- **Path Format**: `research/datasets/country={code}/category={type}/{date}_{chunk}.json`
- **Backup/Audit**: GitHub (via metadata sync)

## Path Convention

Uses Hive-style partitioning for compatibility with data lake tools:

```
research/datasets/country=sg/category=news/2026-01-25_0001.json
research/liveness/country=sg/2026-01-25.json
research/blocked/country=sg/2026-01-25.json
research/dead/country=sg/2026-01-25.json
```

This format works with:
- BigQuery
- Delta Lake
- AWS Athena
- Cloudflare R2

## Enhanced Research Dataset Schema

```json
{
  "meta": {
    "dataset_id": "sg-news-2026-01-25-0001",
    "country": "SG",
    "category": "news",
    "discovered_at": "2026-01-25T03:12:00Z",
    "research_methods": ["google_search", "crtsh"],
    "queries": ["Singapore government news site:.gov.sg"],
    "engine": {
      "name": "research-engine",
      "version": "1.0.0"
    },
    "record_count": 8
  },
  "records": [
    {
      "raw_url": "https://www.mom.gov.sg/newsroom",
      "normalized_domain": "mom.gov.sg",
      "domain_id": "gov:sg:mom.gov.sg",
      "source_type": "gov",
      "discovery_method": "google_search",
      "confidence": 0.95,
      "content_hints": ["news", "government_content"]
    }
  ]
}
```

## What Research Does

- ✅ Discover URLs via multiple methods (Google Search, crt.sh, etc.)
- ✅ Normalize domains and generate domain_id
- ✅ Check liveness (Phase 1-A)
- ✅ Create immutable dataset snapshots
- ✅ Track blocked/dead domains separately
- ✅ Store datasets in R2 for fast access
- ✅ Update metadata in D1 for querying

## What Research Does NOT Do

- ❌ Determine content type (RSS/HTML/API)
- ❌ Classify content nature
- ❌ Extract metadata
- ❌ Create seed contracts

These are the Seed Engine's responsibilities.

## Pipeline Flow

```
[API Request]
     │
     │  POST /api/v1/queues/research
     ▼
[Queue Batch Creation]
     │
     │  Batch metadata stored in D1
     ▼
[Queue Consumer]
     │
     │  Process messages in batches
     ▼
[Domain Functions]
     │
     │  discoverUrlsFromSource()
     │  createResearchOutput()
     │  generateDatasetId()
     ▼
[Storage]
     │
     ├──→ R2 (Raw datasets)
     ├──→ D1 (Metadata, batch state)
     └──→ GitHub (Audit trail via sync)
```

## API Endpoints

### Research Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/research` | List research outputs |
| GET | `/api/v1/research/index` | Get research index |
| GET | `/api/v1/research/:country/:category/:date` | Get specific research |
| GET | `/api/v1/research/:country/:category/today` | Get today's research |
| POST | `/api/v1/research` | Create research output |

### Queue Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/queues/research` | Create research batch |
| GET | `/api/v1/queues/batch/:batchId` | Get batch status |

### Queue Processing

Research queue processing:

1. **Batch Creation**: `POST /api/v1/queues/research` with URLs
2. **Queue Consumer**: Automatically processes messages
3. **URL Discovery**: Domain functions discover and normalize URLs
4. **Dataset Creation**: Creates immutable dataset snapshots
5. **Storage**: Saves to R2 and updates D1 metadata

## Queue Configuration

Research queue settings (from `wrangler.jsonc`):

```json
{
  "queue": "newsfork-research-staging",
  "max_batch_size": 10,
  "max_batch_timeout": 30,
  "max_retries": 3,
  "dead_letter_queue": "newsfork-dlq-staging"
}
```

## Service Layer

The Research Service (`src/services/research.service.ts`) orchestrates:

- **Domain Functions**: Pure business logic (no Cloudflare dependencies)
- **Infra Adapters**: Cloudflare R2, D1, GitHub storage
- **Queue Integration**: Batch processing via Cloudflare Queues

### Key Functions

```typescript
// Domain functions (pure, testable)
discoverUrlsFromSource(input: DiscoverUrlsInput): DiscoverUrlsOutput
createResearchOutput(...): ResearchOutput
generateDatasetId(...): string
createDatasetPath(...): string

// Service layer (orchestrates domain + infra)
ResearchService.list(params): Promise<ResearchListResult>
ResearchService.get(country, category, date): Promise<ResearchOutput>
ResearchService.create(request): Promise<ResearchOutput>
```

## Liveness Checks

Liveness checks are performed separately via the Liveness Queue:

1. **Queue Creation**: `POST /api/v1/queues/liveness` with domains
2. **Health Check**: Domain functions check domain accessibility
3. **Result Storage**: Saves to `research/liveness/` in R2
4. **Status Update**: Updates dataset liveness status in D1

## Metadata Sync

Research metadata is synced to GitHub for audit trail:

- **Trigger**: Scheduled cron job (every 6 hours) or manual sync
- **Endpoint**: `POST /api/v1/metadata/sync`
- **Process**: D1 metadata → GitHub commit
- **Location**: `metadata/snapshot.json` in GitHub

## Environment-Specific Paths

Research data paths are prefixed by environment:

- **Development**: `dev/research/datasets/...`
- **Staging**: `staging/research/datasets/...`
- **Production**: `prod/research/datasets/...`

This ensures complete isolation between environments.

## Data Access

### Via API

```bash
# List research outputs
curl https://api.example.com/api/v1/research?country=SG&category=news

# Get specific research
curl https://api.example.com/api/v1/research/SG/news/2026-01-25

# Create research batch
curl -X POST https://api.example.com/api/v1/queues/research \
  -H "Content-Type: application/json" \
  -d '{
    "country": "SG",
    "category": "news",
    "urls": ["https://example.com"],
    "chunkSize": 100
  }'
```

### Via R2 Direct Access

Research datasets can be accessed directly from R2:

```typescript
// Using R2 Storage Service
const r2 = createR2StorageService(env.DATASETS_BUCKET);
const dataset = await r2.getDataset(country, category, date, chunk);
```

## Related Documentation

- [Project README](../README.md)
- ](/ko/v1/guides/seeds/)
- [Environment Guide](../docs/ENVIRONMENT_GUIDE.md)
- [Architecture Guidelines](../.cursorrules)
