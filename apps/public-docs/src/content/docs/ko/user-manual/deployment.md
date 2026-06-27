---
title: Deployment Guide
description: Staging / Production 배포 방법
sidebar:
  order: 2
---

## Contents

1. [Local Test Sequence](#1-local-test-sequence)
2. [Server Deployment](#2-server-deployment)
3. [Server Verification](#3-server-verification)
4. [Troubleshooting](#4-troubleshooting)
5. [Checklist](#checklist)
6. [Quick Reference](#quick-reference)

---

## 1. Local Test Sequence

### Step 1: TypeScript Validation

```bash
# TypeScript 타입 체크
pnpm typecheck
```

**예상 결과**:
```
✅ TypeScript validation passed (0 errors)
```

**실패 시**: 타입 에러를 수정한 후 다시 실행

---

### Step 2: Unit Tests

```bash
# 모든 테스트 실행
pnpm test

# 또는 Cloudflare Workers 환경에서 테스트
pnpm test:local
```

**예상 결과**:
```
✓ test files passed
✓ tests passed
```

**실패 시**: 테스트 실패 원인을 확인하고 수정

---

### Step 3: Integrated Validation (Recommended)

```bash
# 전체 검증 실행 (TypeScript + 테스트 + 빌드)
pnpm run validate:local
```

**예상 결과**:
```
🔍 Running complete local validation...
==========================================

📝 Step 1: TypeScript type check...
✅ TypeScript validation passed

🧪 Step 2: Running tests...
✅ All tests passed

🔨 Step 3: Build validation (dry-run)...
✅ Build validation passed

✅ All local validations passed!
```

**실패 시**: 각 단계별 에러 메시지를 확인하고 수정

---

### Step 4: Local Server Test (Optional)

```bash
# 터미널 1: 로컬 개발 서버 시작
pnpm dev:local

# 터미널 2: API 엔드포인트 테스트
curl http://localhost:8787/health
curl http://localhost:8787/api/v1/research
curl http://localhost:8787/api/v1/seeds
```

**예상 결과**:
```json
// GET /health
{
  "status": "healthy",
  "timestamp": "2026-01-28T03:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 2. Server Deployment

### Environment-Specific Deploy Commands

#### Staging 환경 배포

```bash
# Staging 환경으로 배포
pnpm deploy:staging
```

**또는 직접 wrangler 사용**:
```bash
wrangler deploy --env staging --minify
```

**예상 결과**:
```
🌀 Creating the bundle...
✨ Success! Uploaded newsfork-seeds-staging
📦 Bundle size: 440.65 KiB / gzip: 101.38 KiB
```

---

#### Production 환경 배포

```bash
# Production 환경으로 배포
pnpm deploy:production
```

**또는 직접 wrangler 사용**:
```bash
wrangler deploy --env production --minify
```

**⚠️ 주의**: Production 배포는 신중하게 진행하세요.

---

### Pre-Deploy Checklist

#### 1. Cloudflare 인증 확인

```bash
# Wrangler 로그인 상태 확인
wrangler whoami

# 로그인이 안 되어 있다면
wrangler login
```

#### 2. 환경 변수 및 Secret 확인

```bash
# Staging secrets 확인
wrangler secret list --env staging

# Production secrets 확인
wrangler secret list --env production
```

**필수 Secrets**:
- `GH_TOKEN`: GitHub API 토큰
- `GH_OWNER`: GitHub 조직/사용자명
- `GH_REPO`: GitHub 저장소명

**Secret 설정 방법**:
```bash
# Staging
wrangler secret put GH_TOKEN --env staging
wrangler secret put GH_OWNER --env staging
wrangler secret put GH_REPO --env staging

# Production
wrangler secret put GH_TOKEN --env production
wrangler secret put GH_OWNER --env production
wrangler secret put GH_REPO --env production
```

#### 3. 리소스 확인

```bash
# D1 Database 확인
wrangler d1 list

# KV Namespace 확인
wrangler kv namespace list --env staging

# Queue 확인
wrangler queues list

# R2 Bucket 확인
wrangler r2 bucket list
```

---

### Deploy via GitHub Actions (Recommended)

#### 자동 배포 (main 브랜치 push 시)

```bash
# 1. 로컬에서 모든 검증 완료
pnpm run validate:local

# 2. 변경사항 커밋 및 푸시
git add .
git commit -m "feat: your changes"
git push origin main
```

**자동 실행**:
- GitHub Actions가 자동으로 실행
- `validate` → `provision` → `deploy` 순서로 진행

#### 수동 배포 (workflow_dispatch)

1. GitHub 저장소 → Actions 탭
2. "Deploy" 워크플로우 선택
3. "Run workflow" 클릭
4. 환경 선택 (staging 또는 production)
5. "Run workflow" 실행

---

## 3. Server Verification

### 3.1 Basic Health Check

#### Health Endpoint 확인

```bash
# Staging
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/health

# Production
curl https://newsfork-seeds.YOUR_SUBDOMAIN.workers.dev/health
```

**예상 응답**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T03:00:00.000Z",
  "version": "1.0.0"
}
```

#### Readiness Check

```bash
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/health/ready
```

**예상 응답**:
```json
{
  "ready": true,
  "timestamp": "2026-01-28T03:00:00.000Z"
}
```

#### Liveness Check

```bash
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/health/live
```

**예상 응답**:
```json
{
  "alive": true,
  "timestamp": "2026-01-28T03:00:00.000Z"
}
```

---

### 3.2 API Endpoint Verification

#### Root Endpoint

```bash
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/
```

**예상 응답**:
```json
{
  "name": "NewsFork Seeds API",
  "version": "2.0.0",
  "build": { ... },
  "environment": "staging",
  "endpoints": { ... }
}
```

#### Research API

```bash
# Research 목록 조회
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/api/v1/research

# 특정 Research 조회
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/api/v1/research/sg/news/2026-01-28
```

#### Seeds API

```bash
# Seeds 목록 조회
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/api/v1/seeds

# 특정 Seed 조회
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/api/v1/seeds/gov:sg:mom.gov.sg::news
```

#### Datasets API

```bash
# Datasets 목록 조회
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/api/v1/datasets
```

---

### 3.3 Integrated Validation Script

#### 자동 검증 스크립트 (선택사항)

아래 스크립트는 예시이며 저장소에 포함되어 있지 않습니다. 필요 시 프로젝트 루트에 생성하세요.

```bash
# scripts/verify-deployment.sh (예시)
#!/bin/bash
set -e

ENV="${1:-staging}"
BASE_URL="https://newsfork-seeds-${ENV}.YOUR_SUBDOMAIN.workers.dev"

echo "🔍 Verifying deployment for ${ENV}..."

# Health check
echo "1. Health check..."
if curl -f "${BASE_URL}/health" > /dev/null 2>&1; then
  echo "   ✅ Health check passed"
else
  echo "   ❌ Health check failed"
  exit 1
fi

# Readiness check
echo "2. Readiness check..."
if curl -f "${BASE_URL}/health/ready" > /dev/null 2>&1; then
  echo "   ✅ Readiness check passed"
else
  echo "   ❌ Readiness check failed"
  exit 1
fi

# API endpoints
echo "3. API endpoints..."
if curl -f "${BASE_URL}/api/v1/research" > /dev/null 2>&1; then
  echo "   ✅ Research API accessible"
else
  echo "   ⚠️  Research API not accessible"
fi

echo "✅ Deployment verification completed"
```

**사용법**:
```bash
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh staging
./scripts/verify-deployment.sh production
```

---

### 3.4 Cloudflare Dashboard Check

#### Workers 대시보드

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. Workers & Pages → newsfork-seeds-staging (또는 production)
3. **Analytics** 탭: 요청 수, 에러율 확인
4. **Logs** 탭: 실시간 로그 확인
5. **Settings** 탭: 환경 변수, Secrets 확인

#### 실시간 로그 확인

```bash
# Wrangler를 통한 로그 확인
wrangler tail --env staging

# 특정 필터링
wrangler tail --env staging --format pretty | grep "error"
```

---

### 3.5 Queue Status Check

#### Queue 상태 확인

```bash
# Queue 목록 확인
wrangler queues list

# 특정 Queue의 메시지 확인 (Cloudflare Dashboard에서)
# Workers & Pages → Queues → newsfork-research-staging
```

#### Queue 메시지 전송 테스트

```bash
# Orchestrator API 호출 (Queue 메시지 생성)
curl -X POST https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/api/v1/seeds/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "country": "sg",
    "category": "news",
    "date": "2026-01-28"
  }'
```

**예상 응답**:
```json
{
  "status": "queued",
  "files_found": 10,
  "messages_sent": 10,
  "skipped": 0
}
```

---

## 4. Troubleshooting

### 4.1 Test Errors (Vitest)

**증상**: `this.snapshotClient.startCurrentRun is not a function`

**원인**: `vitest`와 `@cloudflare/vitest-pool-workers` 버전 호환성 문제.

**조치**: TypeScript 검증이 통과했다면 배포 가능. 필요 시 `pnpm update vitest @cloudflare/vitest-pool-workers` 또는 `rm -rf node_modules pnpm-lock.yaml && pnpm install` 후 재시도.

---

### 4.2 When Deploy Fails

#### 에러: "Queue does not exist"

```bash
# Staging 예시 (실제 이름은 wrangler.jsonc env별 설정 참조)
wrangler queues create newsfork-research-staging
wrangler queues create newsfork-contract-staging
wrangler queues create newsfork-liveness-staging
wrangler queues create newsfork-seed-staging
wrangler queues create newsfork-domain-staging
wrangler queues create newsfork-dlq-staging
wrangler queues create newsfork-seed-dlq-staging
wrangler queues create newsfork-domain-dlq-staging
```

#### 에러: "D1 database not found"

```bash
# D1 Database 확인
wrangler d1 list

# Database가 없다면 생성 (이름은 wrangler.jsonc의 해당 env와 일치해야 함)
wrangler d1 create newsfork-metadata-staging
```

#### 에러: "KV namespace not found"

```bash
# KV Namespace 생성
wrangler kv namespace create DOMAIN_KV --env staging
```

---

### 4.3 When Health Check Fails

#### 502 Bad Gateway

**원인**: Worker가 시작되지 않음

**해결**:
1. Cloudflare Dashboard에서 Worker 상태 확인
2. 로그에서 에러 메시지 확인
3. 환경 변수 및 Secrets 확인

#### 500 Internal Server Error

**원인**: 런타임 에러

**해결**:
```bash
# 실시간 로그 확인
wrangler tail --env staging

# 에러 메시지 확인 후 코드 수정
```

---

### 4.4 When API Endpoints Fail

#### 404 Not Found

**원인**: 라우트가 등록되지 않음

**해결**:
1. `src/routes/index.ts`에서 라우트 등록 확인
2. `src/index.ts`에서 라우트 연결 확인

#### 401/403 Unauthorized

**원인**: 인증 토큰 누락 또는 잘못됨

**해결**:
```bash
# Secrets 확인
wrangler secret list --env staging

# Secret 재설정
wrangler secret put GH_TOKEN --env staging
```

---

## Checklist

### Pre-Deploy Checklist

- [ ] 로컬 TypeScript 검증 통과 (`pnpm typecheck`)
- [ ] 로컬 테스트 통과 (`pnpm test`)
- [ ] 로컬 빌드 검증 통과 (`pnpm run validate:local`)
- [ ] Cloudflare 인증 확인 (`wrangler whoami`)
- [ ] 필수 Secrets 설정 확인
- [ ] 리소스 존재 확인 (D1, KV, Queue, R2)

### Post-Deploy Checklist

- [ ] Health endpoint 응답 확인 (`/health`)
- [ ] Readiness check 통과 (`/health/ready`)
- [ ] Liveness check 통과 (`/health/live`)
- [ ] API 엔드포인트 접근 가능 (`/api/v1/research`, `/api/v1/seeds`)
- [ ] Cloudflare Dashboard에서 에러 없음 확인
- [ ] 실시간 로그에서 에러 없음 확인

---

## Quick Reference

### Key Commands

```bash
# 검증
pnpm typecheck              # TypeScript 검증
pnpm test                   # 테스트 실행
pnpm run validate:local     # 전체 검증

# 배포
pnpm deploy:staging         # Staging 배포
pnpm deploy:production      # Production 배포

# 확인
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/health
wrangler tail --env staging
```

### Key URLs

- **Staging**: `https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev`
- **Production**: `https://newsfork-seeds.YOUR_SUBDOMAIN.workers.dev`
- **Health**: `/health`, `/health/ready`, `/health/live`
- **API**: `/api/v1/research`, `/api/v1/seeds`, `/api/v1/datasets`

---

**작성 일시**: 2026-01-28  
**최종 업데이트**: 2026-01-28
