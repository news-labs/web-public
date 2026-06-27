---
title: Upload-to-r2
description: R2 Upload Tool
version: 1
lastUpdated: 2026-04-12
status: auto-generated
---

이 문서는 **upload-to-r2** 폴더의 README에서 자동 생성되었습니다.

# R2 Upload Tool

Cloudflare R2에 로컬 파일을 업로드하는 적응형 속도 제어 도구입니다.

## 주요 기능

- 🧪 **테스트 모드**: SG 국가 파일만 먼저 테스트 업로드
- 🌍 **전체 모드**: 모든 국가 파일 업로드
- ⚡ **적응형 동시성 제어**: 성공률에 따라 자동으로 업로드 속도 조절
- 📊 **실시간 모니터링**: 진행률, 속도, ETA 표시
- 🔄 **자동 재시도**: Rate limit 및 네트워크 에러 자동 재시도
- ✅ **기존 파일 건너뛰기**: R2에 이미 있는 파일은 업로드하지 않음
- 💾 **실패 파일 저장**: 실패한 파일 목록을 `failed_uploads.json`에 저장
- 🔁 **재시작 지원**: 이전에 실패한 파일부터 우선 처리

## 사용 방법

### 🧪 테스트 모드 (기본 - SG만 먼저 테스트)

```bash
# npm 스크립트 사용
pnpm upload:r2

# 또는 직접 실행
tsx dev/upload-to-r2.ts
```

기본적으로 **테스트 모드**로 실행되며, SG 국가 파일만 먼저 업로드합니다. 테스트 업로드가 완료되면 터미널에서 전체 업로드를 진행할지 물어봅니다.

### 🌍 전체 모드 (모든 파일 업로드)

**방법 1: npm 스크립트 사용 (추천)**

```bash
pnpm upload:r2:full
```

**방법 2: 환경 변수 사용**

```bash
R2_TEST_MODE=false tsx dev/upload-to-r2.ts
```

**방법 3: 테스트 모드에서 y 입력**

테스트 모드로 실행한 후, 완료 시 나타나는 질문에 `y`를 입력하면 전체 업로드가 시작됩니다.

> 💡 **팁**: 전체 모드는 테스트 없이 바로 모든 국가의 파일을 업로드합니다. 대량 파일이 있는 경우 시간이 오래 걸릴 수 있습니다.
> 
> ✨ **자동 재시도**: 업로드 완료 후 실패한 파일이 있으면 자동으로 최대 3회까지 재시도합니다.

### 🔄 실패한 파일만 재시도

이전 업로드에서 실패한 파일만 다시 업로드합니다.

```bash
# npm 스크립트 사용 (추천)
pnpm upload:r2:retry

# 또는 환경 변수로 설정
R2_RETRY_FAILED=true tsx dev/upload-to-r2.ts
```

> 💡 **참고**: `failed_uploads.json` 파일이 있어야 합니다. 이 파일은 이전 업로드 실패 시 자동으로 생성됩니다.

### 환경 변수 설정

환경 변수를 통해 설정을 오버라이드할 수 있습니다:

```bash
# 버킷 이름
R2_BUCKET_NAME=newsfork-datasets

# 로컬 파일 경로
R2_LOCAL_ROOT=../research/datasets

# 초기 동시 업로드 수
R2_INITIAL_CONCURRENCY=5

# 최대 동시 업로드 수
R2_MAX_CONCURRENCY=20

# 기존 파일 건너뛰기 (true/false)
R2_SKIP_EXISTING=true

# 테스트 모드 (true/false)
R2_TEST_MODE=true

# 테스트 국가 코드
R2_TEST_COUNTRY=sg

# 실패한 파일만 재시도 (true/false)
R2_RETRY_FAILED=false

# 디버그 모드 (전체 에러 메시지 출력)
R2_DEBUG_MODE=false

# Cloudflare API 토큰 (skipExisting=true일 때 필요)
CLOUDFLARE_API_TOKEN=your_api_token_here
# 또는
CF_API_TOKEN=your_api_token_here

# Cloudflare Account ID (기본값: wrangler.jsonc에서 자동 감지)
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

예시:

```bash
R2_BUCKET_NAME=newsfork-datasets \
R2_LOCAL_ROOT=../research/datasets \
R2_INITIAL_CONCURRENCY=10 \
R2_SKIP_EXISTING=true \
tsx dev/upload-to-r2.ts
```

## 동작 흐름

### 테스트 모드 (기본)

1. **SG 국가 파일 스캔**: `country=sg/` 경로의 파일만 스캔
2. **기존 파일 확인**: R2에 이미 있는 파일은 건너뜀
3. **테스트 업로드 실행**: SG 파일만 업로드
4. **자동 재시도**: 실패한 파일이 있으면 자동으로 최대 3회 재시도
5. **확인 요청**: 터미널에서 `y/n` 질문
6. **전체 업로드**: `y` 입력 시 모든 국가 파일 업로드
7. **자동 재시도**: 전체 업로드 후에도 실패한 파일 자동 재시도

### 전체 모드

1. **모든 파일 스캔**: 모든 국가의 파일 스캔
2. **기존 파일 확인**: R2에 이미 있는 파일은 건너뜀
3. **전체 업로드 실행**: 모든 파일 업로드
4. **자동 재시도**: 실패한 파일이 있으면 자동으로 최대 3회 재시도

## 적응형 속도 제어

도구는 업로드 성공률을 모니터링하며 자동으로 동시 업로드 수를 조절합니다:

- **성공률 > 95%**: 동시 업로드 수 증가 (+2, 최대 20개)
- **성공률 80-95%**: 현재 수준 유지
- **성공률 < 80%**: 동시 업로드 수 감소 (-2, 최소 1개)

## 모니터링 출력

실시간으로 다음 정보를 표시합니다:

```
[00:05] ████████░░░░░░░░░░░░ 1,250/5,234 (23.9%)
         Speed: 45 files/sec | Concurrent: 8 | Success: 98.2%
         ETA: 1m 23s | Errors: 2 (retrying...)
```

## 실패 파일 관리

업로드에 실패한 파일은 두 가지 파일에 저장됩니다:

1. **`failed_uploads.json`**: 실패한 파일 경로 목록 (재시도용)
2. **`upload_errors.json`**: 상세 에러 정보 (디버깅용)

### 실패한 파일 재시도

**방법 1: 전용 명령어 사용 (추천)**

```bash
pnpm upload:r2:retry
```

이 명령어는 `failed_uploads.json`에 있는 파일만 다시 업로드합니다.

**방법 2: 자동 우선 처리**

일반 업로드 모드에서도 실패한 파일은 자동으로 우선 처리됩니다.

**방법 3: 자동 재시도**

업로드 완료 후 실패한 파일이 있으면 자동으로 최대 3회까지 재시도합니다.

### 에러 분석

`upload_errors.json` 파일에는 다음 정보가 포함됩니다:

```json
[
  {
    "r2Key": "country=lt/category=news/date=2026-01-26/raw_0001.json",
    "localPath": "/path/to/file.json",
    "error": "Full error message",
    "retries": 2,
    "timestamp": "2026-01-27T15:30:00.000Z"
  }
]
```

### 실패 파일 목록 관리

실패 파일 목록을 삭제하려면:

```bash
rm failed_uploads.json upload_errors.json
```

> 💡 **팁**: 모든 파일이 성공적으로 업로드되면 `failed_uploads.json`과 `upload_errors.json` 파일이 자동으로 삭제됩니다.

## 파일 구조

```
dev/
├── upload-to-r2.ts              # 메인 진입점
└── upload-to-r2/
    ├── README.md                 # 이 파일
    ├── types.ts                 # 타입 정의
    ├── config.ts                # 설정 관리
    ├── scanner.ts               # 파일 스캔
    ├── uploader.ts              # 업로드 실행
    ├── rateController.ts        # 적응형 속도 제어
    └── monitor.ts               # 실시간 모니터링
```

## 요구사항

- Node.js 18+
- `wrangler` CLI 설치 및 인증 완료
- Cloudflare R2 버킷 생성 완료
- `skipExisting=true` 사용 시: Cloudflare API 토큰 필요 (`CLOUDFLARE_API_TOKEN` 또는 `CF_API_TOKEN`)

## 문제 해결

### "wrangler: command not found"

Wrangler CLI가 설치되지 않았습니다:

```bash
pnpm add -D wrangler
```

### "Authentication required"

Wrangler 인증이 필요합니다:

```bash
wrangler login
```

### "Cloudflare API token not found"

`skipExisting=true`를 사용할 때는 Cloudflare API 토큰이 필요합니다:

```bash
# API 토큰 생성: https://dash.cloudflare.com/profile/api-tokens
# "Edit Cloudflare Workers" 권한이 있는 토큰 생성

export CLOUDFLARE_API_TOKEN=your_token_here
# 또는
export CF_API_TOKEN=your_token_here
```

또는 `skipExisting=false`로 설정하여 API 토큰 없이 사용할 수 있습니다 (기본값).

### 업로드 속도가 느림

- `R2_INITIAL_CONCURRENCY` 값을 높여보세요 (기본값: 5)
- `R2_MAX_CONCURRENCY` 값을 높여보세요 (기본값: 20)
- 네트워크 연결 상태를 확인하세요

### 특정 파일만 업로드 실패

1. `failed_uploads.json` 파일 확인 (재시도용)
2. `upload_errors.json` 파일 확인 (상세 에러 정보)
3. 디버그 모드로 재실행: `R2_DEBUG_MODE=true pnpm upload:r2:retry`

### "Failed to fetch" 에러

네트워크 일시적 오류입니다. 자동 재시도로 해결됩니다:
- Exponential Backoff 적용 (1초 → 2초 → 4초)
- 최대 3회 자동 재시도
- 재시도 후에도 실패하면 `failed_uploads.json`에 저장

## 주의사항

- 기본적으로 **기존 파일 건너뛰기는 비활성화** (`R2_SKIP_EXISTING=false`)되어 있습니다
  - 성능 최적화: 첫 업로드는 즉시 시작 (R2 확인 단계 생략)
  - `R2_SKIP_EXISTING=true`로 설정하면 Bulk List Strategy 사용 (1000배 빠름)
- 테스트 모드는 기본적으로 **SG 국가만** 업로드합니다
- 대량 업로드 시 시간이 오래 걸릴 수 있습니다
- Ctrl+C로 중단할 수 있으며, 현재 진행 중인 업로드는 완료 후 종료됩니다
- **시스템 파일은 자동으로 제외됩니다**: `.DS_Store`, `Thumbs.db`, `desktop.ini` 및 점(.)으로 시작하는 숨김 파일

## 성능 최적화

### Bulk List Strategy (skipExisting=true일 때)

기존 방식 (개별 head 요청):
- 2,108개 파일 × 1.5초 = 약 52분

개선된 방식 (Bulk List):
- 3회 List 요청 × 1.5초 = 약 4.5초
- **99.8% 시간 단축** (약 1000배 빠름)

이 최적화는 Cloudflare R2 API의 List 작업을 활용하여 모든 파일 목록을 한 번에 가져온 후, 메모리 상에서 O(1) 조회를 수행합니다.
