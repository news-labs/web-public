---
title: Deployment Guide
description: How to deploy Staging / Production
sidebar:
  order: 2
translatedFromHash: 55205aee48cf3b36bb940453f5599722788c59e0b05d62438f71f438a2e911a3
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

**Expected Result**:
 ```
✅ TypeScript validation passed (0 errors)
``` 

**If Failed**: Fix type errors and rerun

---

### Step 2: Unit Tests

 ```bash
# 모든 테스트 실행
pnpm test

# 또는 Cloudflare Workers 환경에서 테스트
pnpm test:local
``` 

**Expected Result**:
 ```
✓ test files passed
✓ tests passed
``` 

**If Failed**: Identify and fix the cause of the test failure

---

### Step 3: Integrated Validation (Recommended)

 ```bash
# 전체 검증 실행 (TypeScript + 테스트 + 빌드)
pnpm run validate:local
``` 

**Expected Result**:
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

**If Failed**: Check and fix error messages for each step

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

**Expected Result**:
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

#### Deploy to Staging Environment

 ```bash
# Staging 환경으로 배포
pnpm deploy:staging
``` 

**Or use wrangler directly**:
 ```bash
wrangler deploy --env staging --minify
``` 

**Expected Result**:
 ```
🌀 Creating the bundle...
✨ Success! Uploaded newsfork-seeds-staging
📦 Bundle size: 440.65 KiB / gzip: 101.38 KiB
``` 

---

#### Production Environment Deployment

 ```bash
# Production 환경으로 배포
pnpm deploy:production
``` 

**Or use wrangler directly**:
 ```bash
wrangler deploy --env production --minify
``` 

**⚠️ Caution**: Proceed with caution when deploying to Production.

---

### Pre-Deploy Checklist

#### 1. Verify Cloudflare Authentication

 ```bash
# Wrangler 로그인 상태 확인
wrangler whoami

# 로그인이 안 되어 있다면
wrangler login
``` 

#### 2. Verify Environment Variables and Secrets

 ```bash
# Staging secrets 확인
wrangler secret list --env staging

# Production secrets 확인
wrangler secret list --env production
``` 

**Required Secrets**:
- `GH_TOKEN`: GitHub API Token
- `GH_OWNER`: GitHub Organization/Username
- `GH_REPO`: GitHub Repository Name

**How to Set Secrets**:
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

#### 3. Verify Resources

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

#### Automatic Deployment (When pushing to main branch)

 ```bash
# 1. 로컬에서 모든 검증 완료
pnpm run validate:local

# 2. 변경사항 커밋 및 푸시
git add .
git commit -m "feat: your changes"
git push origin main
``` 

**Automatic Execution**:
- GitHub Actions run automatically
- Follows this sequence: `validate` → `provision` → `deploy`

#### Manual Deployment (workflow_dispatch)

1. GitHub repository → Actions tab
2. Select the "Deploy" workflow
3. Click "Run workflow"
4. Select environment (staging or production)
5. Run the workflow

---

## 3. Server Verification

### 3.1 Basic Health Check

#### Verify Health Endpoint

 ```bash
# Staging
curl https://newsfork-seeds-staging.YOUR_SUBDOMAIN.workers.dev/health

# Production
curl https://newsfork-seeds.YOUR_SUBDOMAIN.workers.dev/health
``` 

**Expected Response**:
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

**Expected Response**:
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

**Expected Response**:
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

**Expected Response**:
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

#### Automated Validation Script (Optional)

The script below is an example and is not included in the repository. Create it in your project root if needed.

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

**Usage**:
 ```bash
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh staging
./scripts/verify-deployment.sh production
``` 

---

### 3.4 Cloudflare Dashboard Check

#### Workers Dashboard

1. Access the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → newsfork-seeds-staging (or production)
3. **Analytics** tab: Check request count, error rate
4. **Logs** tab: View real-time logs
5. **Settings** tab: Check environment variables, Secrets

#### View real-time logs

 ```bash
# Wrangler를 통한 로그 확인
wrangler tail --env staging

# 특정 필터링
wrangler tail --env staging --format pretty | grep "error"
``` 

---

### 3.5 Queue Status Check

#### Check Queue Status

 ```bash
# Queue 목록 확인
wrangler queues list

# 특정 Queue의 메시지 확인 (Cloudflare Dashboard에서)
# Workers & Pages → Queues → newsfork-research-staging
``` 

#### Queue Message Transmission Test

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

**Expected Response**:
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

**Symptom**: `this.snapshotClient.startCurrentRun is not a function` 

**Cause**: Version compatibility issue between `vitest` and `@cloudflare/vitest-pool-workers`.

**Action**: If TypeScript validation passes, deployment is possible. If necessary, visit `pnpm update vitest @cloudflare/vitest-pool-workers` or `rm -rf node_modules pnpm-lock.yaml && pnpm install` and try again.

---

### 4.2 When Deploy Fails

#### Error: "Queue does not exist"

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

#### Error: "D1 database not found"

 ```bash
# D1 Database 확인
wrangler d1 list

# Database가 없다면 생성 (이름은 wrangler.jsonc의 해당 env와 일치해야 함)
wrangler d1 create newsfork-metadata-staging
``` 

#### Error: "KV namespace not found"

 ```bash
# KV Namespace 생성
wrangler kv namespace create DOMAIN_KV --env staging
``` 

---

### 4.3 When Health Check Fails

#### 502 Bad Gateway

**Cause**: Worker did not start

**Resolution**:
1. Check Worker status in Cloudflare Dashboard
2. Check error messages in logs
3. Check environment variables and secrets

#### 500 Internal Server Error

**Cause**: Runtime error

**Resolution**:
 ```bash
# 실시간 로그 확인
wrangler tail --env staging

# 에러 메시지 확인 후 코드 수정
``` 

---

### 4.4 When API Endpoints Fail

#### 404 Not Found

**Cause**: Route not registered

**Resolution**:
1. Verify route registration at `src/routes/index.ts`
2. Verify route mapping at `src/index.ts`

#### 401/403 Unauthorized

**Cause**: Missing or invalid authentication token

**Resolution**:
 ```bash
# Secrets 확인
wrangler secret list --env staging

# Secret 재설정
wrangler secret put GH_TOKEN --env staging
``` 

---

## Checklist

### Pre-Deploy Checklist

- [ ] Passed local TypeScript validation (`pnpm typecheck`)
- [ ] Passed local tests (`pnpm test`)
- [ ] Passed local build validation (`pnpm run validate:local`)
- [ ] Cloudflare authentication verified (`wrangler whoami`)
- [ ] Required secrets configuration verified
- [ ] Resource existence verified (D1, KV, Queue, R2)

### Post-Deploy Checklist

- [ ] Verify Health endpoint response (`/health`)
- [ ] Pass readiness check (`/health/ready`)
- [ ] Liveness check passed (`/health/live`)
- [ ] API endpoints accessible (`/api/v1/research` , `/api/v1/seeds`)
- [ ] No errors in Cloudflare Dashboard
- [ ] No errors in real-time logs

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
- **Health**: `/health` , `/health/ready` , `/health/live` 
- **API**: `/api/v1/research` , `/api/v1/seeds` , `/api/v1/datasets` 

---

**Date Created**: 2026-01-28  
**Last Updated**: 2026-01-28
