---
title: Environment Guide
description: Development / Staging / Production 환경 설정 및 Cloudflare 리소스 구성
sidebar:
  order: 1
---

## 🏗️ Production-Grade Environment Architecture

This project implements **Silicon Valley-standard environment isolation** with legal compliance and data governance in mind.

### 🎯 Core Principle

> **Environment is in the configuration, not in variables**
> 
> Each environment has completely separate Cloudflare resources (R2, D1, KV, Queues) to prevent contamination and ensure legal compliance.

---

## 📁 Environment Structure

### Cloudflare Resources (Per Environment)

```
Development:
├── Workers: newsfork-seeds-dev
├── R2: newsfork-datasets-dev, newsfork-metadata-dev
├── D1: newsfork-metadata-dev
├── KV: DOMAIN_KV (dev namespace)
└── Queues: newsfork-research-dev, newsfork-contract-dev, newsfork-liveness-dev

Staging:
├── Workers: newsfork-seeds-staging
├── R2: newsfork-datasets-staging, newsfork-metadata-staging
├── D1: newsfork-metadata-staging
├── KV: DOMAIN_KV (staging namespace)
└── Queues: newsfork-research-staging, newsfork-contract-staging, newsfork-liveness-staging

Production:
├── Workers: newsfork-seeds-prod
├── R2: newsfork-datasets-prod, newsfork-metadata-prod
├── D1: newsfork-metadata-prod
├── KV: DOMAIN_KV (prod namespace)
└── Queues: newsfork-research-prod, newsfork-contract-prod, newsfork-liveness-prod
```

### Data Storage

```
R2 (Raw Data):
├── research/datasets/country=*/category=*/*.json
├── research/liveness/country=*/*.json
├── research/blocked/country=*/*.json
└── research/dead/country=*/*.json

D1 (Metadata):
├── dataset_metadata
├── task_batches
├── task_items
├── domain_cache
└── liveness_results

GitHub (Audit Trail):
├── metadata/snapshot.json
└── seeds/**/*.json
```

---

## 🚦 Environment Details

### 🧪 Development (`dev`)
**Purpose**: Safe experimentation and feature development

- **Safety**: ✅ Completely safe
- **Data**: Can be deleted/recreated freely
- **Impact**: Zero impact on staging/production
- **Retention**: 7 days

### 🎭 Staging (`staging`)
**Purpose**: Pre-production testing and integration validation

- **Safety**: ⚠️ Mirror of production
- **Data**: Should match production patterns
- **Impact**: No production impact
- **Retention**: 30 days

### 🏭 Production (`production`)
**Purpose**: Legal evidence and compliance records

- **Safety**: 🚨 **CRITICAL** - Legal implications
- **Data**: Immutable timestamped files
- **Impact**: Legal/compliance consequences
- **Retention**: 7 years (legal compliance)

---

## 🚀 Deployment Methods

### Method 1: Wrangler CLI

```bash
# Development (local)
pnpm run dev
pnpm run dev:local

# Development (remote)
pnpm run dev:remote

# Staging deployment
pnpm run deploy:staging

# Production deployment
pnpm run deploy:production
```

### Method 2: GitHub Actions

- **Staging**: Automatic on push to `main` branch (when `src/**`, `package.json`, or `wrangler.jsonc` changes)
- **Production**: Manual trigger via `workflow_dispatch` with environment selection

### Database Migrations

```bash
# Apply migrations to dev
pnpm db:migrate

# Apply migrations to staging
pnpm db:migrate:staging

# Apply migrations to production
pnpm db:migrate:production
```

---

## 🔧 Configuration

### Environment Variables (wrangler.jsonc)

| Variable | Dev | Staging | Production |
|----------|-----|---------|------------|
| `CF_ENV` | `dev` | `staging` | `production` |
| `DATA_PATH_PREFIX` | `dev` | `staging` | `prod` |
| `ENVIRONMENT` | `development` | `staging` | `production` |

### Cloudflare Resources

| Resource | Dev | Staging | Production |
|----------|-----|---------|------------|
| R2 Datasets | `newsfork-datasets-dev` | `newsfork-datasets-staging` | `newsfork-datasets-prod` |
| R2 Metadata | `newsfork-metadata-dev` | `newsfork-metadata-staging` | `newsfork-metadata-prod` |
| D1 Database | `newsfork-metadata-dev` | `newsfork-metadata-staging` | `newsfork-metadata-prod` |
| Research Queue | `newsfork-research-dev` | `newsfork-research-staging` | `newsfork-research-prod` |
| Contract Queue | `newsfork-contract-dev` | `newsfork-contract-staging` | `newsfork-contract-prod` |
| Liveness Queue | `newsfork-liveness-dev` | `newsfork-liveness-staging` | `newsfork-liveness-prod` |
| Seed Queue | `newsfork-seed-dev` | `newsfork-seed-staging` | `newsfork-seed-prod` |
| Domain Queue | `newsfork-domain-dev` | `newsfork-domain-staging` | `newsfork-domain-prod` |
| DLQ | `newsfork-dlq-dev` | `newsfork-dlq-staging` | `newsfork-dlq-prod` |
| Seed DLQ | `newsfork-seed-dlq-dev` | `newsfork-seed-dlq-staging` | `newsfork-seed-dlq-prod` |
| Domain DLQ | `newsfork-domain-dlq-dev` | `newsfork-domain-dlq-staging` | `newsfork-domain-dlq-prod` |

### Queue Configuration

현재 wrangler.jsonc 기준, 모든 Queue는 **max_batch_size=1** (파일 단위 처리):

| Queue | Max Batch Size | Max Batch Timeout | Max Retries | DLQ |
|-------|----------------|-------------------|-------------|-----|
| Research | 1 | 30s | 3 | Yes |
| Contract | 1 | 30s | 3 | Yes |
| Liveness | 1 | 10s | 3 | Yes |
| Seed | 1 | 30s | 3 | Yes |
| Domain | 1 | 30s | 3 | Yes |

**Queue Processing Flow:**
1. API creates batch → Messages enqueued
2. Queue consumer processes messages in batches
3. Failed messages retry up to 3 times
4. Permanently failed messages → Dead Letter Queue (DLQ)

### Secrets (per environment)

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

---

## 🛡️ Safety Rules

### ⚠️ Production Protection

1. **Resource Isolation**: Completely separate R2, D1, KV, Queues
2. **Manual Deployment**: Production requires manual GitHub Actions trigger
3. **Immutability**: Production data is write-once, read-many
4. **Audit Trail**: All changes synced to GitHub for compliance

### 📋 Compliance Rules

- Production data has **7-year retention**
- All production operations are **auditable** via GitHub sync
- **Metadata files** committed to GitHub for transparency
- **Queue DLQ** preserves failed tasks for investigation

---

## 🧪 Testing Each Environment

### Development Testing

```bash
# Run local Workers
pnpm run dev:local

# Test API
curl http://localhost:8787/health
curl http://localhost:8787/api/v1/datasets
```

### Staging Testing

```bash
# Deploy to staging
pnpm run deploy:staging

# Test API
curl https://newsfork-seeds-staging.workers.dev/health
```

### Production Testing

```bash
# Full test suite first
pnpm test

# Deploy to production (requires confirmation)
pnpm run deploy:production

# Test API
curl https://newsfork-seeds-prod.workers.dev/health
```

---

## 🚨 Emergency Procedures

### Production Issue Response

1. **Stop**: Pause all Queue consumers if needed
2. **Assess**: Check Cloudflare Dashboard for errors
3. **Document**: Review DLQ for failed tasks
4. **Notify**: Alert compliance team if data affected
5. **Preserve**: Maintain audit trail in GitHub

### Environment Contamination

1. **Identify**: Locate affected R2/D1 data
2. **Quarantine**: Disable affected environment
3. **Restore**: Recover from R2 versioning or backups
4. **Validate**: Verify data integrity via metadata snapshot
5. **Update**: Strengthen access controls

---

## 📚 Best Practices

### Development
- ✅ Experiment freely
- ✅ Use local mode (`pnpm run dev:local`)
- ✅ Delete/recreate resources as needed
- ✅ Test new features with Queue batches

### Staging
- ✅ Mirror production patterns
- ✅ Run integration tests
- ✅ Validate Queue processing
- ✅ Test metadata sync to GitHub

### Production
- ⚠️ Manual deployment confirmation
- ⚠️ Full test suite must pass
- ⚠️ Legal compliance validation
- ⚠️ Monitor Queue DLQ

---

## 🔗 참고

- Wrangler 설정: 프로젝트 루트 `wrangler.jsonc`
- 마이그레이션: [기획·분석 → infra](../../plan/infra/cloudflare-migration-plan.md)
- 배포 절차: [배포 절차](./deployment.md)

**Production**은 법적·컴플라이언스 경계이므로 수동 배포와 검증 후에만 사용하세요.
