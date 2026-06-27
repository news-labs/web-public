---
title: R2 운영 표준
description: R2 객체 목록(S3 API), 이동·복사·삭제(wrangler), raw/prod prefix 정의. 마이그레이션 및 스크립트 구현 기준.
sidebar:
  order: 10
---

# R2 운영 표준 (Cloudflare R2 Operations Standard)

**문서 버전**: 1.1  
**목적**: R2 버킷의 객체 목록 조회, 폴더/파일 이동·복사·삭제, prefix 구조를 **표준 방식**으로 정의.  
마이그레이션 및 향후 R2 관련 스크립트·Worker 구현 시 이 문서를 기준으로 한다.

---

## 1. API 사용 원칙

| 용도 | 사용 API / 도구 | 비고 |
|------|------------------|------|
| **객체 목록 조회** | **S3 호환 API** (ListObjectsV2) | Cloudflare REST API는 버킷 내 객체 목록을 지원하지 않음. |
| **객체 대량 이동·복사·삭제 (같은 버킷)** | **S3 CopyObject + DeleteObjects** (`@aws-sdk/client-s3`) | 서버 측 복사(본문 미경유) + 배치 삭제. 마이그레이션·대량 이동 시 사용. |
| **객체 단건 get/put/delete (수동·로컬)** | **wrangler r2 object** (CLI, `--remote`) | 로컬·CI에서 단일 객체 다운로드·업로드·삭제 시 사용. |
| **Worker 내 R2 접근** | R2 Binding (`env.R2_BUCKET.get/put/delete/list`) | 런타임은 Binding 기준. 목록은 1000개 단위 pagination. |

- **객체 목록**이 필요한 스크립트(업로드 skip-existing, 마이그레이션 등)는 반드시 **S3 호환 API**로 목록을 조회한다.  
- **같은 버킷 내 대량 이동**은 **S3 CopyObject**(서버 측 복사) + **DeleteObjects**(배치 삭제)를 사용한다. wrangler get/put/delete 반복은 사용하지 않는다.  
- Cloudflare 계정 API 토큰(`CLOUDFLARE_API_TOKEN`)만으로는 **버킷 내 객체 목록**을 받을 수 없으므로, **R2 API 토큰**(Access Key ID + Secret Access Key)을 사용한다.

---

## 2. 객체 목록 조회 (S3 호환 API)

### 2.1 필수 사항

- **엔드포인트**: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- **인증**: R2 API 토큰 (Access Key ID, Secret Access Key)
- **API**: AWS SDK `@aws-sdk/client-s3` 의 `ListObjectsV2` (또는 동등한 S3 호환 클라이언트)
- **페이지네이션**: `MaxKeys: 1000`, `ContinuationToken` / `NextContinuationToken` 로 전체 목록 수집

### 2.2 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `R2_ACCESS_KEY_ID` | ✅ | R2 API 토큰의 Access Key ID |
| `R2_SECRET_ACCESS_KEY` | ✅ | R2 API 토큰의 Secret Access Key |
| `R2_ACCOUNT_ID` 또는 `CLOUDFLARE_ACCOUNT_ID` | 선택 | 엔드포인트 구성용. 없으면 프로젝트 기본값 사용 |
| `R2_BUCKET_NAME` | 선택 | 대상 버킷 이름. 기본값 예: `newsfork-datasets` |

### 2.3 참조 구현

- **목록 조회**: `dev/upload-to-r2/scanner.ts` 의 `loadR2FileList(bucketName)`
  - S3Client + ListObjectsV2, 결과를 `Set<string>` 으로 반환 (O(1) 조회용)

---

## 3. 객체 이동·복사·삭제

### 3.1 대량 이동·복사·삭제 (같은 버킷) — S3 API

로컬/CI에서 **같은 버킷 내** 객체를 대량으로 **이동(복사 후 삭제)** 하거나 **복사만** 할 때:

- **S3 호환 API** 사용: **CopyObject** (서버 측 복사) + **DeleteObjects** (배치 삭제).
- **CopyObject**: `CopySource: bucket/키`, `Key: 새키` 로 R2 내부에서만 복사. 객체 본문이 클라이언트를 경유하지 않음.
- **병렬 복사**: CopyObject를 동시에 N건(예: 20~50) 실행. 구현 예: `COPY_CONCURRENCY = 30`.
- **배치 삭제**: DeleteObjects로 최대 1,000키/요청. 복사에 성공한 키만 삭제 대상으로 사용.
- **CopySource 형식**: `CopySource: ${bucket}/${encodeURIComponent(key)}` 로 특수문자 키 대응.

| 항목 | 권장 값 | 비고 |
|------|---------|------|
| 복사 동시성 | 30 | R2 rate limit 고려. 429 시 재시도·동시성 감소 검토. |
| 삭제 배치 크기 | 1,000 | S3 DeleteObjects 상한. |

- **dry-run**: 복사·삭제 없이 대상 키만 출력. **실제 이동 전 반드시 dry-run 실행 권장**.
- **--no-delete**: CopyObject만 수행하고 원본 유지.

### 3.2 단건 get/put/delete (수동·로컬) — wrangler CLI

단일 객체를 **다운로드·업로드·삭제** 할 때(수동 작업, 소량):

- **wrangler r2 object** 명령 사용, **`--remote`** 필수.
- 객체 경로 형식: `{bucket_name}/{key}` (예: `newsfork-datasets/raw/country=us/date=2026-01-26/raw_0001.json`).

| 작업 | 명령 예시 |
|------|------------|
| 다운로드 | `wrangler r2 object get "bucket/key" -f /local/path --remote` |
| 업로드 | `wrangler r2 object put "bucket/key" --file /local/path --remote` |
| 삭제 | `wrangler r2 object delete "bucket/key" --remote` |

- **대량 이동에는 사용하지 않는다.** 같은 버킷 내 대량 이동은 S3 CopyObject + DeleteObjects 사용.

### 3.3 참조 구현

- **마이그레이션 스크립트**: `dev/migrate-r2-to-raw-prefix.ts`
  - **목록**: `loadR2FileList(bucket)` (S3 ListObjectsV2).
  - **복사**: S3 **CopyObjectCommand** — `raw/`, `prod/` 가 아닌 키를 `raw/{key}` 로 서버 측 복사. 동시성 30.
  - **삭제**: S3 **DeleteObjectsCommand** — 복사 성공한 키만 1,000개 단위 배치 삭제.
  - **옵션**: `--dry-run` (대상만 출력), `--no-delete` (복사만, 원본 유지).

---

## 4. Prefix 구조 (raw / prod)

버킷 내 **최상위 prefix** 는 다음 두 가지만 사용한다.

| Prefix | 의미 | 규칙 |
|--------|------|------|
| **raw/** | 수집·업로드된 원본 데이터 | **불변**. 덮어쓰기 금지. |
| **prod/** | 파이프라인 산출물(중간·최종) | 생성·갱신 가능. raw 에 파생 결과 쓰지 않음. |

- **raw** 경로 형식 예: `raw/country={cc}/category={cat}/date=YYYY-MM-DD/raw_0001.json`, `raw_metadata.json`
- **prod** 경로 형식 예: `prod/country={cc}/.../domain_metadata.json`, `robots.txt`, `sitemap.xml`, `.success` 등
- 기존 루트 또는 `datasets/` 등 다른 prefix 에 있던 객체는 **마이그레이션**으로 `raw/` (또는 정책에 따라 `prod/`) 아래로 이전한다.

자세한 2단계 모델은 [R2 raw/prod 2단계 모델](/ko/v1/guides/system-architecture/r2-raw-prod-model) 참고.

---

## 5. 마이그레이션·이동 워크플로우

1. **환경 변수 설정**: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, (선택) `R2_BUCKET_NAME`, `R2_ACCOUNT_ID`
2. **Dry-run 실행**: `pnpm migrate:r2:raw-prefix:dry-run` 으로 이동 대상·개수 확인
3. **실제 실행**: dry-run 결과 검토 후  
   - `pnpm migrate:r2:raw-prefix` — 복사 후 원본 삭제  
   - `pnpm migrate:r2:raw-prefix:no-delete` — 복사만, 원본 유지
4. **검증**: R2 대시보드 또는 S3 API로 `raw/` prefix 하위에 객체가 기대한 대로 있는지 확인

---

## 6. 요약

| 항목 | 표준 |
|------|------|
| **객체 목록** | S3 호환 API (ListObjectsV2), R2 API 토큰, `@aws-sdk/client-s3` |
| **객체 대량 이동 (같은 버킷)** | S3 CopyObject (서버 측) + DeleteObjects (배치). 병렬 복사(예: 30), 삭제 1,000키/요청 |
| **객체 단건 get/put/delete (수동)** | wrangler r2 object ... --remote |
| **Prefix** | raw/ (불변 원본), prod/ (산출물) |
| **이동 스크립트** | 목록=S3, 복사=S3 CopyObject, 삭제=S3 DeleteObjects. dry-run 필수 권장 |
| **참조** | `dev/upload-to-r2/scanner.ts` (loadR2FileList), `dev/migrate-r2-to-raw-prefix.ts` |

이 문서는 R2 관련 **표준 방식**을 정의하며, `.cursor/rules/data/r2-constraints.mdc`(청크 크기, Bulk Listing, Worker 내 금지 패턴 등)와 함께 적용한다.
