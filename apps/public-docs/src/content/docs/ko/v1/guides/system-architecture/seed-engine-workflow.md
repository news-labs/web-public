---
title: Seed Engine Workflow
description: Seed 엔진 설계 및 워크플로우
sidebar:
  order: 2
---

## 개요

이 문서는 Seed Engine의 전체 워크플로우를 **아웃풋(출력) 중심**으로 단계별로 정리합니다. 각 단계에서 어떤 입력을 받아 어떤 출력을 생성하는지 명확히 설명합니다.

---

## 📊 전체 워크플로우 개요

```
[Input]  R2: raw/.../raw_NNNN.json
    │
    ├─> [Step 1] Orchestrator: 파일 목록 수집
    │   └─> [Output] SEED_QUEUE 메시지들
    │
    ├─> [Step 2] File Processor: Raw 파일 읽기 및 도메인 추출
    │   └─> [Output] DOMAIN_QUEUE 메시지들 + .success 파일
    │
    └─> [Step 3] Domain Collector: robots.txt, sitemap.xml 수집
        └─> [Output] domain_metadata.json + 증거 파일들 + .success 파일
```

---

## 🔹 Step 1: Orchestrator (파일 목록 수집 및 Queue 발송)

### 입력 (Input)

**트리거**:
- HTTP API: `POST /api/v1/seeds/orchestrate`
- Request Body (선택적 필터):
  ```json
  {
    "country": "sg",        // 선택적
    "category": "news",    // 선택적
    "date": "2026-01-28",  // 선택적
    "force": false         // .success 파일 무시하고 재처리
  }
  ```

**R2 버킷 상태**:
- `raw/country={cc}/category={cat}/date=YYYY-MM-DD/raw_0001.json`
- `raw/country={cc}/category={cat}/date=YYYY-MM-DD/raw_0002.json`
- `raw/country={cc}/category={cat}/date=YYYY-MM-DD/raw_0003.json`
- ...

### 처리 작업 (Processing)

1. **R2 List API 호출**
   ```typescript
   const prefix = `raw/country=${country}/category=${category}/date=${date}/`;
   const files = await bucket.list({ prefix, limit: 1000, cursor });
   ```

2. **파일 필터링**
   - `raw_NNNN.json` 패턴만 선택
   - `.success` 파일 제외
   - 시스템 파일 제외 (`.DS_Store`, `Thumbs.db` 등)

3. **순서 정렬**
   - 파일명 기준 정렬: `raw_0001.json`, `raw_0002.json`, ...

4. **Queue 메시지 발송**
   - 각 파일 경로마다 하나의 메시지 생성

### 출력 (Output)

**SEED_QUEUE 메시지들**:
```typescript
// 메시지 1
{
  file_path: "raw/country=sg/category=news/date=2026-01-28/raw_0001.json",
  partition_info: {
    country: "sg",
    category: "news",
    date: "2026-01-28"
  }
}

// 메시지 2
{
  file_path: "raw/country=sg/category=news/date=2026-01-28/raw_0002.json",
  partition_info: {
    country: "sg",
    category: "news",
    date: "2026-01-28"
  }
}
```

**로그 출력**:
```typescript
{
  event: "orchestrator_start",
  partition_info: { country: "sg", category: "news", date: "2026-01-28" }
}

{
  event: "files_found",
  count: 5
}

{
  event: "queue_messages_sent",
  count: 5
}
```

---

## 🔹 Step 2: File Processor Worker (Raw 파일 읽기 및 도메인 추출)

### 입력 (Input)

**SEED_QUEUE 메시지**:
```typescript
{
  file_path: "raw/country=sg/category=news/date=2026-01-28/raw_0001.json",
  partition_info: {
    country: "sg",
    category: "news",
    date: "2026-01-28"
  }
}
```

**R2 파일**:
- `raw/.../raw_0001.json` (EnhancedResearchDataset 형식)
- 크기: 10MB ~ 20MB

### 처리 작업 (Processing)

1. **Early Exit 확인**
   ```typescript
   const successPath = `${file_path}.success`;
   const exists = await bucket.head(successPath);
   if (exists) return; // 이미 처리 완료
   ```

2. **Raw 파일 읽기**
   ```typescript
   const file = await bucket.get(file_path);
   const content = await streamToString(file.body); // ReadableStream → string
   ```

3. **JSON 파싱 및 검증**
   ```typescript
   const parsed = JSON.parse(content);
   const validated = EnhancedResearchDataset.safeParse(parsed); // Zod 검증
   ```

4. **도메인 추출**
   ```typescript
   // records 배열에서 도메인 정보 추출
   for (const record of data.records) {
     // 기존 domain_id 활용 또는 재정규화
     const normalized = extractDomain(record);
     domains.push(normalized);
   }
   ```

5. **중복 제거**
   ```typescript
   const uniqueDomains = deduplicateDomains(domains); // Set 기반 O(1) 조회
   ```

6. **DOMAIN_QUEUE에 메시지 발송**
   ```typescript
   for (const domain of uniqueDomains) {
     await DOMAIN_QUEUE.send({
       domain_id: domain.domain_id,
       domain_url: domain.input_url,
       registrable_domain: domain.registrable_domain,
       authority: domain.authority,
       partition_info,
       source_file_path: file_path
     });
   }
   ```

7. **Checkpoint 생성**
   ```typescript
   await bucket.put(`${file_path}.success`, ""); // 빈 파일
   ```

### 출력 (Output)

**DOMAIN_QUEUE 메시지들**:
```typescript
// 메시지 1
{
  domain_id: "gov:sg:mom.gov.sg",
  domain_url: "https://www.mom.gov.sg/newsroom",
  registrable_domain: "mom.gov.sg",
  authority: "gov",
  partition_info: {
    country: "sg",
    category: "news",
    date: "2026-01-28"
  },
  source_file_path: "raw/country=sg/category=news/date=2026-01-28/raw_0001.json"
}

// 메시지 2
{
  domain_id: "gov:sg:moh.gov.sg",
  domain_url: "https://www.moh.gov.sg/news",
  registrable_domain: "moh.gov.sg",
  authority: "gov",
  partition_info: {
    country: "sg",
    category: "news",
    date: "2026-01-28"
  },
  source_file_path: "raw/country=sg/category=news/date=2026-01-28/raw_0001.json"
}
```

**R2 Checkpoint 파일**:
- 경로: `raw/.../raw_0001.json.success`
- 내용: 빈 파일 (0 bytes)
- 용도: 파일 처리 완료 표시

**로그 출력**:
```typescript
{
  event: "file_processor_start",
  file_path: "raw/.../raw_0001.json"
}

{
  event: "domains_extracted",
  file_path: "raw/.../raw_0001.json",
  total_records: 10,
  unique_domains: 8
}

{
  event: "file_processing_complete",
  file_path: "raw/.../raw_0001.json",
  domains_sent: 8
}
```

---

## 🔹 Step 3: Domain Collector Worker (robots.txt, sitemap.xml 수집)

### 입력 (Input)

**DOMAIN_QUEUE 메시지**:
```typescript
{
  domain_id: "gov:sg:mom.gov.sg",
  domain_url: "https://www.mom.gov.sg/newsroom",
  registrable_domain: "mom.gov.sg",
  authority: "gov",
  partition_info: {
    country: "sg",
    category: "news",
    date: "2026-01-28"
  },
  source_file_path: "raw/.../raw_0001.json"
}
```

### 처리 작업 (Processing)

1. **Early Exit 확인**
   ```typescript
   const resultPath = `prod/.../mom.gov.sg/domain_metadata.json.success`;
   const exists = await bucket.head(resultPath);
   if (exists) return; // 이미 처리 완료
   ```

2. **robots.txt 수집**
   ```typescript
   const robotsResult = await fetch("https://mom.gov.sg/robots.txt", {
     headers: { 'User-Agent': 'Newsfork-SeedEngine/1.0' },
     signal: AbortSignal.timeout(10000)
   });
   ```

3. **robots.txt에서 sitemap URL 추출**
   ```typescript
   const sitemapUrls = extractSitemapUrlsFromRobots(robotsResult.content);
   // 예: ["https://mom.gov.sg/sitemap.xml"]
   ```

4. **sitemap.xml 수집**
   ```typescript
   // 우선순위: robots.txt에서 추출한 URL > 기본 경로
   const sitemapResult = await fetchSitemapXml(domain, sitemapUrls);
   ```

5. **sitemap.xml 파싱**
   ```typescript
   const urlCount = parseSitemapUrlCount(sitemapResult.content);
   // 예: 150 (sitemap 내 URL 개수)
   ```

6. **Domain Metadata 생성**
   ```typescript
   const metadata = {
     domain_id: "gov:sg:mom.gov.sg",
     registrable_domain: "mom.gov.sg",
     country: "SG",
     category: "news",
     collected_at: "2026-01-28T10:30:00Z",
     robots: {
       status_code: 200,
       content_length: 1234,
       exists: true,
       fetched_at: "2026-01-28T10:30:00Z",
       sitemap_urls: ["https://mom.gov.sg/sitemap.xml"]
     },
     sitemap: {
       status_code: 200,
       content_length: 5678,
       exists: true,
       fetched_at: "2026-01-28T10:30:05Z",
       url_count: 150,
       url: "https://mom.gov.sg/sitemap.xml"
     },
     source: {
       raw_file_path: "raw/.../raw_0001.json"
     }
   };
   ```

7. **Zod 스키마 검증**
   ```typescript
   const validated = DomainMetadataSchema.safeParse(metadata);
   if (!validated.success) throw new ValidationError(...);
   ```

8. **R2에 파일 저장**
   ```typescript
   // 8-1. 증거 파일 저장 (선택적)
   await bucket.put(`${resultPath}/robots.txt`, robotsResult.content);
   await bucket.put(`${resultPath}/sitemap.xml`, sitemapResult.content);
   
   // 8-2. 메타데이터 파일 저장 (필수)
   await bucket.put(`${resultPath}/domain_metadata.json`, JSON.stringify(validated.data, null, 2));
   
   // 8-3. Checkpoint 생성
   await bucket.put(`${resultPath}/domain_metadata.json.success`, "");
   ```

### 출력 (Output)

**R2 저장 파일들**:

1. **domain_metadata.json** (필수)
   - 경로: `prod/country=sg/category=news/date=2026-01-28/mom.gov.sg/domain_metadata.json`
   - 내용:
     ```json
     {
       "domain_id": "gov:sg:mom.gov.sg",
       "registrable_domain": "mom.gov.sg",
       "country": "SG",
       "category": "news",
       "collected_at": "2026-01-28T10:30:00Z",
       "robots": {
         "status_code": 200,
         "content_length": 1234,
         "exists": true,
         "fetched_at": "2026-01-28T10:30:00Z",
         "sitemap_urls": ["https://mom.gov.sg/sitemap.xml"]
       },
       "sitemap": {
         "status_code": 200,
         "content_length": 5678,
         "exists": true,
         "fetched_at": "2026-01-28T10:30:05Z",
         "url_count": 150,
         "url": "https://mom.gov.sg/sitemap.xml"
       },
       "source": {
         "raw_file_path": "raw/country=sg/category=news/date=2026-01-28/raw_0001.json"
       }
     }
     ```

2. **robots.txt** (선택적, 증거 보관용)
   - 경로: `prod/country=sg/category=news/date=2026-01-28/mom.gov.sg/robots.txt`
   - 내용: 원본 robots.txt 텍스트
   - 예:
     ```
     User-agent: *
     Allow: /
     
     Sitemap: https://mom.gov.sg/sitemap.xml
     ```

3. **sitemap.xml** (선택적, 증거 보관용)
   - 경로: `prod/country=sg/category=news/date=2026-01-28/mom.gov.sg/sitemap.xml`
   - 내용: 원본 sitemap.xml XML
   - 예:
     ```xml
     <?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>https://mom.gov.sg/newsroom</loc>
         <lastmod>2026-01-28</lastmod>
       </url>
       ...
     </urlset>
     ```

4. **domain_metadata.json.success** (Checkpoint)
   - 경로: `prod/country=sg/category=news/date=2026-01-28/mom.gov.sg/domain_metadata.json.success`
   - 내용: 빈 파일 (0 bytes)
   - 용도: 도메인 처리 완료 표시

**로그 출력**:
```typescript
{
  event: "domain_collector_start",
  domain_id: "gov:sg:mom.gov.sg",
  registrable_domain: "mom.gov.sg"
}

{
  event: "robots_fetched",
  domain_id: "gov:sg:mom.gov.sg",
  status: 200,
  content_length: 1234
}

{
  event: "sitemap_fetched",
  domain_id: "gov:sg:mom.gov.sg",
  status: 200,
  content_length: 5678,
  url_count: 150
}

{
  event: "domain_collector_complete",
  domain_id: "gov:sg:mom.gov.sg",
  robots_exists: true,
  sitemap_exists: true
}
```

---

## 📁 최종 출력 구조 요약

### R2 버킷 최종 상태

```
raw/
└── country=sg/
    └── category=news/
        └── date=2026-01-28/
            ├── raw_0001.json                    # 원본 (변경 없음)
            ├── raw_0001.json.success            # ✅ Step 2 출력
            ├── raw_0002.json
            ├── raw_0002.json.success            # ✅ Step 2 출력
            └── ...

prod/
└── country=sg/
    └── category=news/
        └── date=2026-01-28/
            ├── mom.gov.sg/
            │   ├── domain_metadata.json         # ✅ Step 3 출력 (필수)
            │   ├── domain_metadata.json.success  # ✅ Step 3 출력 (Checkpoint)
            │   ├── robots.txt                   # ✅ Step 3 출력 (선택적)
            │   └── sitemap.xml                  # ✅ Step 3 출력 (선택적)
            ├── moh.gov.sg/
            │   ├── domain_metadata.json
            │   ├── domain_metadata.json.success
            │   ├── robots.txt
            │   └── sitemap.xml
            └── ...
```

---

## 🔄 데이터 변환 플로우

### 변환 단계별 데이터 형태

**Step 1 → Step 2**:
```
R2 파일 경로 (string)
    ↓
SEED_QUEUE 메시지 (JSON)
    ↓
EnhancedResearchDataset (Zod 검증된 객체)
```

**Step 2 → Step 3**:
```
EnhancedResearchDataset.records[]
    ↓
NormalizedDomain[] (도메인 정규화)
    ↓
DOMAIN_QUEUE 메시지 (JSON)
```

**Step 3 → 최종 출력**:
```
DOMAIN_QUEUE 메시지
    ↓
HTTP Fetch (robots.txt, sitemap.xml)
    ↓
DomainMetadata (Zod 검증된 객체)
    ↓
R2 파일들 (JSON, TXT, XML)
```

---

## ⚠️ 에러 처리 및 부분 실패

### Step 2 (File Processor) 에러 처리

**에러 케이스**:
1. **JSON 파싱 실패** → 즉시 throw (재시도 대상)
2. **스키마 검증 실패** → 즉시 throw (재시도 대상)
3. **개별 record 추출 실패** → 로그만 남기고 계속 진행
4. **Queue 발송 실패** → 로그만 남기고 계속 진행

**출력 영향**:
- 일부 도메인 추출 실패 → 성공한 도메인만 DOMAIN_QUEUE에 발송
- Queue 발송 실패 → DLQ로 이동, 나머지는 정상 처리
- 전체 실패 → `.success` 파일 생성 안 함 (재시도 가능)

### Step 3 (Domain Collector) 에러 처리

**에러 케이스**:
1. **robots.txt 수집 실패** → `status_code: 0`, `exists: false`로 기록, 계속 진행
2. **sitemap.xml 수집 실패** → `status_code: 404`, `exists: false`로 기록, 계속 진행
3. **메타데이터 검증 실패** → 즉시 throw (재시도 대상)
4. **파일 저장 실패** → 즉시 throw (재시도 대상)

**출력 영향**:
- robots.txt 실패 → `domain_metadata.json`에는 실패 정보 기록, 파일은 저장 안 함
- sitemap.xml 실패 → `domain_metadata.json`에는 실패 정보 기록, 파일은 저장 안 함
- 메타데이터 저장 실패 → `.success` 파일 생성 안 함 (재시도 가능)

---

## 📊 처리 통계 예시

### Step 1 (Orchestrator) 통계

```
입력: 5개 raw 파일
출력: 5개 SEED_QUEUE 메시지
처리 시간: ~2초
```

### Step 2 (File Processor) 통계

```
입력: 1개 raw 파일 (10MB, 100 records)
처리:
  - 도메인 추출: 100 records → 85 unique domains
  - 중복 제거: 15개 중복 제거
출력:
  - 85개 DOMAIN_QUEUE 메시지
  - 1개 .success 파일
처리 시간: ~5초
```

### Step 3 (Domain Collector) 통계

```
입력: 1개 DOMAIN_QUEUE 메시지
처리:
  - robots.txt 수집: 성공 (200, 1.2KB)
  - sitemap.xml 수집: 성공 (200, 5.6KB, 150 URLs)
출력:
  - 1개 domain_metadata.json (2.5KB)
  - 1개 robots.txt (1.2KB)
  - 1개 sitemap.xml (5.6KB)
  - 1개 .success 파일
처리 시간: ~3초
```

---

## 🎯 핵심 아웃풋 요약

### 필수 출력 (Must Have)

1. **Step 2**: `raw_NNNN.json.success` (Checkpoint)
2. **Step 3**: `domain_metadata.json` (메타데이터)
3. **Step 3**: `domain_metadata.json.success` (Checkpoint)

### 선택적 출력 (Nice to Have)

1. **Step 3**: `robots.txt` (증거 보관용)
2. **Step 3**: `sitemap.xml` (증거 보관용)

### 중간 출력 (Internal)

1. **Step 1**: SEED_QUEUE 메시지들
2. **Step 2**: DOMAIN_QUEUE 메시지들

---

**문서 버전**: 1.0.0  
**작성일**: 2026-01-28  
**목적**: Seed Engine 워크플로우를 아웃풋 중심으로 단계별 정리
