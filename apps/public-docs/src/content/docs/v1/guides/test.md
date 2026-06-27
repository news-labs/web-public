---
title: Test
description: NewsFork Seeds - Test Directory
version: 1
lastUpdated: 2026-01-29
status: auto-generated
translatedFromHash: 0d71c06f824a90445122329771f12991dc32ef640df3022604a1a85593692f60
---

This document was automatically generated from the README in the **test** folder.

# NewsFork Seeds - Test Directory

This directory is a separate project for **testing GitHub Actions-based automation pipelines**.

## 📁 Directory Structure

 ```
test/
├── .github/                    # GitHub Actions 워크플로우
│   ├── workflows/              # CI/CD 워크플로우
│   │   ├── research-engine.yml    # Phase 1: URL 발견 & Dataset 생성
│   │   ├── analysis-engine.yml    # Phase 2: Seed 후보 분석
│   │   ├── contract-engine.yml    # Phase 3: Seed JSON 생성
│   │   └── ci.test.yml            # 통합 CI 테스트
│   ├── scripts/                # CI/CD 스크립트
│   │   ├── ci.sh
│   │   └── steps/
│   └── README.md
│
├── cli/                        # CLI 실행기
│   ├── research-engine.ts      # Research 단계 실행기
│   ├── analysis-engine.ts      # Analysis 단계 실행기
│   └── contract-engine.ts      # Contract 단계 실행기
│
├── schemas/                    # Zod 스키마 (Single Source of Truth)
│   ├── domain.schema.ts        # Domain/Seed ID 검증
│   ├── research.schema.ts      # Research/Liveness 검증
│   ├── seed.schema.ts         # Enhanced Seed V1 검증
│   └── index.ts               # 통합 export
│
├── services/                   # 순수 함수 비즈니스 로직
│   ├── domain.service.ts       # 도메인 정규화 (Pure Functions)
│   ├── research.service.ts     # 리서치 발견 (Pure Functions)
│   ├── seed.service.ts         # 시드 생성 (Pure Functions)
│   └── index.ts               # 통합 export
│
├── utils/                      # 핵심 유틸리티
│   ├── domain-normalizer.ts   # 레거시 호환성
│   └── kv-deduplication.ts     # KV 레지스트리
│
├── research/                   # Research 결과 (테스트 데이터)
│   ├── datasets/
│   ├── liveness/
│   ├── blocked/
│   └── dead/
│
├── analysis/                   # Analysis 결과 (테스트 데이터)
│   └── country=sg/
│
├── results/                    # 최종 결과 (테스트 데이터)
│   └── seeds/drafts/
│
├── services.test.ts            # 서비스 레이어 테스트
├── kv-deduplication.test.ts    # KV 시스템 테스트
└── README.md                   # 이 파일
``` 

## 🚀 GitHub Actions Workflow

### 1. Research Engine (`research-engine.yml`)

**Trigger**: Daily at 2:00 AM UTC or manual execution

**Stages**:
- Phase 1-A: Liveness Check (Domain Accessibility Verification)
- Phase 1-B: URL Discovery (Google Search, crt.sh, Domain Directory)
- Dataset Generation (Generate Immutable Research Dataset)

**Output**: `test/research/datasets/` , `test/research/liveness/` 

**CLI**: `npm run research:full -- --country=SG --category=news` 

### 2. Analysis Engine (`analysis-engine.yml`)

**Trigger**: Auto-exec after Research Engine completion or manual execution

**Steps**:
- Load Research Registry
- Domain analysis (KV duplicate check)
- Generate Seed Candidates
- Candidate validation

**Output**: `test/analysis/country=*/` 

**CLI**: `npm run analysis:full -- --country=SG --category=news` 

### 3. Contract Engine (`contract-engine.yml`)

**Trigger**: Manually triggered by Analysis Engine or manually executed

**Steps**:
- Load Seed Candidates
- Collect R2 Assets (robots.txt, sitemap.xml, homepage.html)
- Generate Enhanced Seed V1
- Perform Legal Compliance Check
- Upload to R2 Storage

**Output**: `test/results/seeds/drafts/` , Cloudflare R2

**CLI**: `npm run contract:full -- --country=SG --category=news --fetch-r2=true` 

## 🛠️ Local Development and Testing

### Run Individual Steps

 ```bash
# Research 단계
npm run research:liveness -- --country=SG --category=news
npm run research:discovery -- --country=SG --category=news --max-results=50
npm run research:dataset -- --country=SG --category=news

# Analysis 단계
npm run analysis:registry -- --country=SG --category=news
npm run analysis:domains -- --country=SG --category=news
npm run analysis:candidates -- --country=SG --category=news

# Contract 단계
npm run contract:generate -- --country=SG --category=news --fetch-r2=true
npm run contract:validate -- --country=SG --category=news
npm run contract:legal -- --country=SG --category=news
``` 

### Run Full Pipeline

 ```bash
# 전체 Research 파이프라인
npm run research:full -- --country=SG --category=news

# 전체 Analysis 파이프라인
npm run analysis:full -- --country=SG --category=news

# 전체 Contract 파이프라인
npm run contract:full -- --country=SG --category=news --fetch-r2=true
``` 

### Test Execution

 ```bash
# 서비스 레이어 테스트
npm test test/services.test.ts

# KV 시스템 테스트
npm test test/kv-deduplication.test.ts

# 모든 테스트
npm test test/
``` 

## 📊 Data Flow

### 1. Research Phase
- **Input**: Country/Category Parameters
- **Processing**: URL Discovery, Domain Normalization, Liveness Check
- **Output**: Immutable Research Dataset (JSON)

### 2. Analysis Phase
- **Input**: Research Dataset
- **Processing**: Build domain registry, KV duplicate check, Generate Seed candidates
- **Output**: Seed Candidates (JSON)

### 3. Contract Phase
- **Input**: Seed Candidates
- **Processing**: R2 Asset Collection, Enhanced Seed V1 Generation, Legal Verification
- **Output**: Seed Contracts (GitHub) + R2 Assets (Cloudflare R2)

## ⚙️ Environment Variable Setup

Secrets used in GitHub Actions:

 ```bash
# Cloudflare KV (Analysis 단계)
CLOUDFLARE_KV_ACCOUNT_ID
CLOUDFLARE_KV_NAMESPACE_ID
CLOUDFLARE_API_TOKEN

# Cloudflare R2 (Contract 단계)
CLOUDFLARE_R2_ACCOUNT_ID
CLOUDFLARE_R2_ACCESS_KEY_ID
CLOUDFLARE_R2_SECRET_ACCESS_KEY
CLOUDFLARE_R2_BUCKET

# NewsFork 설정
NEWSFORK_DEDUP=true
``` 

## 🏗️ Principal Architect Design Principles

### SOLID + GitHub Actions Optimization

**1. Single Responsibility**
- Each workflow handles only one step
- CLI scripts have clear command separation

**2. Dependency Inversion**
- Service layer implemented as pure functions
- GitHub Actions calls services only via CLI

**3. Open/Closed**
- Adding new countries/categories requires only parameter changes, no code modification
- New Research Methods can be added

**4. Separation of Concerns**
- Research (discovery) ↔ Analysis (analysis) ↔ Contract (contract) are completely separated
- Each step can be executed and tested independently

## 🎯 Advantages

1. **Automation**: Daily automated execution for latest domain discovery
2. **Scalability**: Parallel processing possible by country/category
3. **Stability**: Verification and error handling at each stage
4. **Traceability**: All results version-controlled on GitHub
5. **Cost Efficiency**: Utilizes GitHub Actions free quota
6. **Legal Safety**: Automated compliance checks

## 📝 Notes

This directory is the **main project's test pipeline**. Actual tests for the main project run in the ``.test.ts`` files within the ``src/`` directory.

Main project test execution:
 ```bash
# 프로젝트 루트에서
pnpm test
``` 

## Related Documentation

- [Project README](../README.md)
- ](/v1/guides/research/)
- ](/v1/guides/seeds/)
- [Architecture Guidelines](../.cursorrules)
