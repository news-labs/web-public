---
title: raw/prod 단계별 입출력 데이터셋
description: raw와 prod 각 단계의 Input·Output, 저장 위치, 데이터 포맷. robots.txt·sitemap·domain_metadata 포함.
sidebar:
  order: 12
---

# raw / prod 단계별 Input·Output 데이터셋

**문서 버전**: 1.0  
**목적**: raw와 prod 각 단계의 **입력(Input)**·**출력(Output)** 데이터셋·결과물, 저장 위치, 데이터 포맷을 정의. **확정·구현 기준.**

---

## 1. 개요

2단계 prefix 모델(**raw** / **prod**) 기준으로, 각 단계에서 **무엇이 들어오고(Input)**, **무엇이 나가고(Output)**, **어디에 어떤 포맷으로 저장되는지** 정리한 문서이다.

---

## 2. raw 단계 (1단계)

### 2.1 raw — Input (입력)

| 항목 | 내용 |
|------|------|
| **출처** | 로컬 또는 외부 파이프라인에서 생성된 **원본 연구 데이터**. 업로드 스크립트(`dev/upload-to-r2`)가 R2에 올림. |
| **저장 위치** | **raw/** prefix 아래. 예: `raw/country={cc}/category={cat}/date=YYYY-MM-DD/` |
| **파일 명** | `raw_0001.json`, `raw_0002.json`, … (연속 번호), 파티션당 `raw_metadata.json` 권장 |
| **데이터 포맷** | **JSON**. 스키마: **EnhancedResearchDataset** (Zod 기준) |
| **역할** | 파이프라인의 **유일한 원본 입력**. 불변(덮어쓰기 금지). |

### 2.2 raw — Output (출력)

raw **파일 자체는 수정하지 않는다**. raw 단계에서 파이프라인이 **생성·기록하는** 것은 아래뿐이다.

| 항목 | 내용 |
|------|------|
| **체크포인트** | **파일**: `raw/.../raw_NNNN.json.success` (같은 파티션, raw prefix 내). **포맷**: 빈 객체 또는 빈 텍스트. **의미**: 해당 raw 파일 처리 완료. |
| **다운스트림 입력** | raw 파일 1개를 읽어 **도메인 목록**을 추출한 뒤, **DOMAIN_QUEUE**로 메시지 전송(도메인 1개당 1메시지). 이 메시지가 **prod 단계의 Input**이 됨. |

---

## 3. prod 단계 (2단계)

### 3.1 prod — Input (입력)

| 항목 | 내용 |
|------|------|
| **출처** | **DOMAIN_QUEUE** 메시지. Seed Queue Consumer가 raw 파일에서 추출한 **도메인 1개당 1메시지**. |
| **전달 형식** | 큐 메시지 body (JSON). 스키마: **DomainQueueMessage**. |
| **필드 요약** | `domain_id`, `domain_url`, `registrable_domain`, `authority`, `partition_info` (country, category, date), `source_file_path` (선택). |

### 3.2 prod — Output (출력)·저장 위치

| 결과물 | 다운로드/생성 방식 | 저장 위치 (prod/) | 데이터 포맷 |
|--------|--------------------|--------------------------------|-------------|
| **robots.txt** | HTTP GET `https://{registrable_domain}/robots.txt` | `prod/country={cc}/category={cat}/date=YYYY-MM-DD/{sanitized_domain}/robots.txt` | **Plain text** (원문 그대로) |
| **sitemap.xml** | robots.txt에서 Sitemap URL 추출 또는 기본 URL 시도 후 다운로드 | `prod/.../{sanitized_domain}/sitemap.xml` | **XML** (원문 그대로) |
| **domain_metadata.json** | robots·sitemap fetch 결과 요약 메타데이터 | `prod/.../{sanitized_domain}/domain_metadata.json` | **JSON**. 스키마: **DomainMetadata** (Zod). |
| **domain_metadata.json.success** | 해당 도메인 처리 완료 표시 | `prod/.../{domain}/domain_metadata.json.success` | 빈 텍스트. |

---

## 4. 요약 표

| 단계 | Input | Output (저장물) | 비고 |
|------|-------|------------------|------|
| **raw** | 업로드된 **raw_NNNN.json** (EnhancedResearchDataset). 위치: `raw/.../`. | `raw/.../raw_NNNN.json.success` (체크포인트). + 큐로 전달되는 도메인 목록(prod Input). | raw 파일은 불변. |
| **prod** | **DOMAIN_QUEUE** 메시지 (DomainQueueMessage). | `prod/.../{domain}/robots.txt`, `sitemap.xml`, `domain_metadata.json`, `.success`. | robots·sitemap는 외부 URL에서 다운로드 후 prod에 저장. |

---

## 5. 데이터 포맷·스키마 참조

| 데이터 | 스키마/포맷 | 참조 (코드베이스) |
|--------|-------------|-------------------|
| raw 파일 | EnhancedResearchDataset (JSON) | `src/schemas/research.ts` |
| Seed Queue 메시지 | SeedQueueMessage | `src/schemas/seed-engine.ts` |
| Domain Queue 메시지 | DomainQueueMessage | `src/schemas/seed-engine.ts` |
| domain_metadata.json | DomainMetadata | `src/schemas/seed-engine.ts` |
| robots.txt | Plain text (원문) | — |
| sitemap.xml | XML (원문) | — |
