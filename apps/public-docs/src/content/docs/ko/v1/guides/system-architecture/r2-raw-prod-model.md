---
title: R2 raw/prod 2단계 모델
description: 기존 3단계(datasets/processing/prod)를 raw/prod 2단계로 재설정한 prefix 모델.
sidebar:
  order: 11
---

# R2 prefix 2단계 모델: raw / prod

**문서 버전**: 1.0  
**목적**: 기존 3단계(datasets / processing / prod)를 **2단계(raw / prod)** 로 재설정하는 변경 모델. **확정·구현 완료.**

---

## 1. 변경 요약

| 구분 | 기존 (3단계) | 변경 후 (2단계) |
|------|----------------|------------------|
| **1단계** | datasets/ (Bronze, 불변) | **raw/** (불변 원본) |
| **2단계** | processing/ (Silver) + prod/ (Gold) | **prod/** (파이프라인 산출물 전체) |

- **raw**: 외부에서 수집·업로드된 원본 데이터. **덮어쓰기 금지**.
- **prod**: 파이프라인이 **생성·갱신하는** 모든 결과(중간 산출물·최종 산출물 포함). 기존 processing + prod 를 하나의 prefix로 통합.

---

## 2. 2단계 정의

### 2.1 raw (1단계)

| 항목 | 내용 |
|------|------|
| **의미** | 가공 전 원본 데이터. 수집·업로드된 그대로. |
| **규칙** | **불변**. 기존 파일 덮어쓰기 금지. |
| **경로 형식** | `raw/country={cc}/category={cat}/date=YYYY-MM-DD/` |
| **파일 예** | `raw_0001.json`, `raw_0002.json`, `raw_metadata.json` |
| **대응** | 기존 **datasets/** 와 동일 역할. |

### 2.2 prod (2단계)

| 항목 | 내용 |
|------|------|
| **의미** | 파이프라인이 만든 모든 산출물(중간·최종). |
| **규칙** | 생성·갱신 가능. raw 에 다시 쓰지 않음. |
| **경로 형식** | `prod/country={cc}/category={cat}/date=YYYY-MM-DD/...` |
| **포함** | 도메인 메타·robots·sitemap, 체크포인트(.success), 최종 집계·배포용 파일 등. |
| **대응** | 기존 **processing/** + **prod/** 를 하나의 **prod/** 로 통합. |

- **prod** 안에서 세부 구분이 필요하면, 하위 경로로 나눌 수 있음 (예: `prod/.../domain_metadata.json`, `prod/.../final/` 등).  
- 상위 prefix 는 **raw** / **prod** 두 개만 사용.

---

## 3. 경로 매핑 (기존 → 변경 후)

| 기존 경로 (3단계) | 변경 후 (2단계) |
|-------------------|------------------|
| `datasets/country=us/category=news/date=2026-01-28/raw_0001.json` | `raw/country=us/category=news/date=2026-01-28/raw_0001.json` |
| `datasets/.../raw_0001.json.success` | `raw/.../raw_0001.json.success` 또는 `prod/.../` (정책에 따라) |
| `processing/country=us/.../example.com/domain_metadata.json` | `prod/country=us/.../example.com/domain_metadata.json` |
| `processing/.../robots.txt`, `sitemap.xml` | `prod/.../robots.txt`, `prod/.../sitemap.xml` |
| `prod/` 하위 최종 산출물 | `prod/` 하위 (기존과 동일) |

---

## 4. 영향 범위 (구현 시 수정 대상)

| 영역 | 변경 포인트 |
|------|--------------|
| **경로 빌더** | `datasets/` → `raw/`, `processing/` → `prod/`. prefix 상수·함수 반환값 수정. |
| **Seed 오케스트레이터** | raw 파일 list prefix: `raw/country=.../category=.../date=.../`. |
| **Seed Queue Consumer** | raw 파일 get 경로, .success 경로를 raw/ prefix 기준으로. |
| **Domain Queue Consumer** | domain_metadata·robots·sitemap·.success 저장 경로를 prod/ prefix 기준으로. |
| **업로드 스크립트** | R2 키 prefix: `raw/` + 기존 상대 경로. |
| **기존 R2 데이터** | 마이그레이션 스크립트(`dev/migrate-r2-to-raw-prefix.ts`)로 `raw/` 아래로 이전. S3 CopyObject(서버 측, 병렬) + DeleteObjects(배치) 사용. |

---

## 5. 규칙(lifecycle) 정합성

- **Raw 불변**: **raw/** 아래 파일은 덮어쓰지 않음.
- **단계 혼재 금지**: raw 에 파생 결과를 쓰지 않고, 파생 결과는 **prod/** 에만 씀.
- **raw_metadata.json**: 파티션당 권장. **raw/** 파티션 루트에 두면 됨.

---

## 6. 요약

| 항목 | 내용 |
|------|------|
| **prefix** | **raw** (1단계), **prod** (2단계). 기존 3단계(datasets/processing/prod) 제거. |
| **raw** | 수집·업로드 원본. 불변. `raw/country=.../category=.../date=.../`. |
| **prod** | 파이프라인 산출물 전체. `prod/country=.../...`. |
| **마이그레이션** | `pnpm migrate:r2:raw-prefix:dry-run` 으로 대상 확인 후 `pnpm migrate:r2:raw-prefix` (복사+삭제) 또는 `pnpm migrate:r2:raw-prefix:no-delete` (복사만). S3 CopyObject + DeleteObjects 사용. |
