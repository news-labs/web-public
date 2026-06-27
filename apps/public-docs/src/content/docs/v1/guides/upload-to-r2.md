---
title: Upload-to-r2
description: R2 Upload Tool
version: 1
lastUpdated: 2026-01-29
status: auto-generated
translatedFromHash: 62d5f93138e676cd9c78c29f10decc28f6b94a43f2982bbdadd504d4bdf78067
---

This document was automatically generated from the README in the **upload-to-r2** folder.

# R2 Upload Tool

An adaptive rate control tool for uploading local files to Cloudflare R2.

## Key Features

- 🧪 **Test Mode**: Uploads only SG country files first for testing
- 🌍 **Full Mode**: Uploads all country files
- ⚡ **Adaptive Concurrency Control**: Automatically adjusts upload speed based on success rate
- 📊 **Real-time Monitoring**: Displays progress, speed, and ETA
- 🔄 **Auto Retry**: Automatically retries rate limit and network errors
- ✅ **Skip Existing Files**: Does not upload files already present in R2
- 💾 **Save Failed Files**: Stores a list of failed files at `failed_uploads.json`
- 🔁 **Restart Support**: Prioritizes processing files that previously failed

## How to Use

### 🧪 Test Mode (Default - Test SG files first)

 ```bash
# npm 스크립트 사용
pnpm upload:r2

# 또는 직접 실행
tsx dev/upload-to-r2.ts
``` 

Runs in **Test Mode** by default, uploading only SG country files first. After the test upload completes, the terminal will ask if you want to proceed with the full upload.

### 🌍 Full Mode (Upload All Files)

**Method 1: Using npm Scripts (Recommended)

 ```bash
pnpm upload:r2:full
``` 

**Method 2: Using Environment Variables**

 ```bash
R2_TEST_MODE=false tsx dev/upload-to-r2.ts
``` 

**Method 3: Enter 'y' in Test Mode**

After running in test mode, when prompted upon completion, enter ``y`` to start the full upload.

> 💡 **Tip**: Full mode uploads files for all countries immediately without testing. This may take a long time if you have a large number of files.
> 
> ✨ **Auto-Retry**: If any files fail after upload completion, they will be automatically retried up to 3 times.

### 🔄 Retry only failed files

Re-uploads only files that failed in the previous upload.

 ```bash
# npm 스크립트 사용 (추천)
pnpm upload:r2:retry

# 또는 환경 변수로 설정
R2_RETRY_FAILED=true tsx dev/upload-to-r2.ts
``` 

> 💡 **Note**: The file `failed_uploads.json` must exist. This file is automatically created if the previous upload fails.

### Environment Variable Settings

Settings can be overridden via environment variables:

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

Example:

 ```bash
R2_BUCKET_NAME=newsfork-datasets \
R2_LOCAL_ROOT=../research/datasets \
R2_INITIAL_CONCURRENCY=10 \
R2_SKIP_EXISTING=true \
tsx dev/upload-to-r2.ts
``` 

## Workflow Flow

### Test Mode (Default)

1. **SG Country File Scan**: `country=sg/` Only scans files in the path
2. **Check Existing Files**: Skips files already present on R2
3. **Execute Test Upload**: Uploads only SG files
4. **Auto Retry**: Automatically retries failed files up to 3 times
5. **Request Confirmation**: Terminal prompt: "`y/n`"
6. **Full Upload**: Uploads all country files when "`y`" is entered
7. **Auto Retry**: Automatically retries failed files after full upload

### Full Mode

1. **Scan All Files**: Scan files for all countries
2. **Check existing files**: Skip files already present in R2
3. **Execute full upload**: Upload all files
4. **Auto retry**: Automatically retry failed files up to 3 times

## Adaptive Speed Control

The tool monitors upload success rates and automatically adjusts the number of simultaneous uploads:

- **Success Rate > 95%**: Increase number of simultaneous uploads (+2, max 20)
- **Success Rate 80-95%**: Maintains current level
- **Success rate < 80%**: Decreases concurrent uploads (-2, minimum 1)

## Monitoring Output

Displays the following information in real-time:

 ```
[00:05] ████████░░░░░░░░░░░░ 1,250/5,234 (23.9%)
         Speed: 45 files/sec | Concurrent: 8 | Success: 98.2%
         ETA: 1m 23s | Errors: 2 (retrying...)
``` 

## Failed File Management

Files that failed to upload are stored in two files:

1. **`failed_uploads.json`**: List of failed file paths (for retries)
2. **`upload_errors.json`**: Detailed error information (for debugging)

### Retrying Failed Files

**Method 1: Use Dedicated Command (Recommended)**

 ```bash
pnpm upload:r2:retry
``` 

This command only re-uploads files located at `failed_uploads.json`.

**Method 2: Automatic Priority Processing**

Failed files are automatically prioritized even in normal upload mode.

**Method 3: Automatic Retry**

If any files fail after upload completion, they are automatically retried up to 3 times.

### Error Analysis

 The file `upload_errors.json` contains the following information:

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

### Managing the Failed Files List

To delete the failed files list:

 ```bash
rm failed_uploads.json upload_errors.json
``` 

> 💡 **Tip**: Once all files are successfully uploaded, the `failed_uploads.json` and `upload_errors.json` files will be automatically deleted.

## File Structure

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

## Requirements

- Node.js 18+
- `wrangler` CLI installed and authenticated
- Cloudflare R2 bucket created
- When using `skipExisting=true`: Cloudflare API token required (`CLOUDFLARE_API_TOKEN` or `CF_API_TOKEN`)

## Troubleshooting

### "wrangler: command not found"

Wrangler CLI is not installed:

 ```bash
pnpm add -D wrangler
``` 

### "Authentication required"

Wrangler authentication is required:

 ```bash
wrangler login
``` 

### "Cloudflare API token not found"

 When using `skipExisting=true`, a Cloudflare API token is required:

 ```bash
# API 토큰 생성: https://dash.cloudflare.com/profile/api-tokens
# "Edit Cloudflare Workers" 권한이 있는 토큰 생성

export CLOUDFLARE_API_TOKEN=your_token_here
# 또는
export CF_API_TOKEN=your_token_here
``` 

Or configure it to use without an API token via `skipExisting=false` (default).

### Slow upload speed

- Try increasing the value of `R2_INITIAL_CONCURRENCY` (default: 5)
- Try increasing the value of `R2_MAX_CONCURRENCY` (default: 20)
- Check your network connection status

### Only specific files fail to upload

1. Check the file at `failed_uploads.json` (for retry)
2. Check the file at `upload_errors.json` (for detailed error info)
3. Rerun in debug mode: `R2_DEBUG_MODE=true pnpm upload:r2:retry` 

### "Failed to fetch" error

This is a temporary network error. Resolved by automatic retry:
- Exponential Backoff applied (1 sec → 2 sec → 4 sec)
- Maximum 3 automatic retries
- If still failed after retry, stored at `failed_uploads.json`

## Important Notes

- **Skip existing files** is **disabled** by default (`R2_SKIP_EXISTING=false`)
  - Performance optimization: First upload starts immediately (R2 verification step skipped)
  - Setting to `R2_SKIP_EXISTING=true` enables Bulk List Strategy (1000x faster)
- Test mode uploads **only SG countries** by default
- Bulk uploads may take a long time
- Can be stopped with Ctrl+C; current uploads complete before closing
- **System files are automatically excluded**: `.DS_Store` , `Thumbs.db` , `desktop.ini` and hidden files starting with a period (.)

## Performance Optimization

### Bulk List Strategy (when skipExisting=true)

Original Method (individual head requests):
- 2,108 files × 1.5 seconds = approx. 52 minutes

Improved method (Bulk List):
- 3 List requests × 1.5 seconds = approx. 4.5 seconds
- **99.8% time reduction** (Approx. 1000x faster)

This optimization leverages the Cloudflare R2 API's List operation to fetch all file listings at once, then performs O(1) lookups in memory.
