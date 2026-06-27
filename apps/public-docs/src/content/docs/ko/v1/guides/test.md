---
title: Test
description: NewsFork Seeds - Test Directory
version: 1
lastUpdated: 2026-04-12
status: auto-generated
---

이 문서는 **test** 폴더의 README에서 자동 생성되었습니다.

# NewsFork Seeds - Test Directory

이 디렉토리는 **GitHub Actions 기반 자동화 파이프라인 테스트**를 위한 별도 프로젝트입니다.

## 📁 디렉토리 구조

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

## 🚀 GitHub Actions 워크플로우

### 1. Research Engine (`research-engine.yml`)

**트리거**: 매일 오전 2시 UTC 또는 수동 실행

**단계**:
- Phase 1-A: Liveness Check (도메인 접근성 검증)
- Phase 1-B: URL Discovery (Google Search, crt.sh, 도메인 디렉토리)
- Dataset Generation (불변 Research Dataset 생성)

**출력**: `test/research/datasets/`, `test/research/liveness/`

**CLI**: `npm run research:full -- --country=SG --category=news`

### 2. Analysis Engine (`analysis-engine.yml`)

**트리거**: Research Engine 완료 후 자동 실행 또는 수동 실행

**단계**:
- Research Registry 로드
- Domain 분석 (KV 중복 검사)
- Seed Candidate 생성
- 후보 검증

**출력**: `test/analysis/country=*/`

**CLI**: `npm run analysis:full -- --country=SG --category=news`

### 3. Contract Engine (`contract-engine.yml`)

**트리거**: Analysis Engine에서 수동 트리거 또는 수동 실행

**단계**:
- Seed Candidate 로드
- R2 Assets 수집 (robots.txt, sitemap.xml, homepage.html)
- Enhanced Seed V1 생성
- 법적 컴플라이언스 검사
- R2 Storage 업로드

**출력**: `test/results/seeds/drafts/`, Cloudflare R2

**CLI**: `npm run contract:full -- --country=SG --category=news --fetch-r2=true`

## 🛠️ 로컬 개발 및 테스트

### 개별 단계 실행

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

### 전체 파이프라인 실행

```bash
# 전체 Research 파이프라인
npm run research:full -- --country=SG --category=news

# 전체 Analysis 파이프라인
npm run analysis:full -- --country=SG --category=news

# 전체 Contract 파이프라인
npm run contract:full -- --country=SG --category=news --fetch-r2=true
```

### 테스트 실행

```bash
# 서비스 레이어 테스트
npm test test/services.test.ts

# KV 시스템 테스트
npm test test/kv-deduplication.test.ts

# 모든 테스트
npm test test/
```

## 📊 데이터 흐름

### 1. Research 단계
- **입력**: 국가/카테고리 파라미터
- **처리**: URL 발견, 도메인 정규화, 라이브니스 체크
- **출력**: 불변 Research Dataset (JSON)

### 2. Analysis 단계
- **입력**: Research Dataset
- **처리**: 도메인 레지스트리 구축, KV 중복 검사, Seed 후보 생성
- **출력**: Seed Candidates (JSON)

### 3. Contract 단계
- **입력**: Seed Candidates
- **처리**: R2 에셋 수집, Enhanced Seed V1 생성, 법적 검증
- **출력**: Seed Contracts (GitHub) + R2 Assets (Cloudflare R2)

## ⚙️ 환경 변수 설정

GitHub Actions에서 사용하는 시크릿:

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

## 🏗️ Principal Architect 설계 원칙

### SOLID + GitHub Actions 최적화

**1. Single Responsibility**
- 각 워크플로우는 하나의 단계만 담당
- CLI 스크립트는 명확한 커맨드 분리

**2. Dependency Inversion**
- 서비스 레이어는 순수 함수로 구현
- GitHub Actions는 CLI를 통해서만 서비스 호출

**3. Open/Closed**
- 새로운 국가/카테고리 추가 시 코드 변경 없이 파라미터만 변경
- 새로운 Research Method 추가 가능

**4. Separation of Concerns**
- Research (발견) ↔ Analysis (분석) ↔ Contract (계약) 완전 분리
- 각 단계는 독립적으로 실행 및 테스트 가능

## 🎯 장점

1. **자동화**: 매일 자동 실행으로 최신 도메인 발견
2. **확장성**: 국가/카테고리별 병렬 처리 가능
3. **안정성**: 각 단계별 검증 및 에러 처리
4. **추적성**: 모든 결과가 GitHub에 버전 관리
5. **비용 효율성**: GitHub Actions 무료 할당량 활용
6. **법적 안전성**: 자동 컴플라이언스 검사

## 📝 참고사항

이 디렉토리는 **메인 프로젝트의 테스트 파이프라인**입니다. 메인 프로젝트의 실제 테스트는 `src/` 디렉토리 내의 `.test.ts` 파일들에서 실행됩니다.

메인 프로젝트 테스트 실행:
```bash
# 프로젝트 루트에서
pnpm test
```

## 관련 문서

- [프로젝트 README](../README.md)
- ](/ko/v1/guides/research/)
- ](/ko/v1/guides/seeds/)
- [Architecture Guidelines](../.cursorrules)
