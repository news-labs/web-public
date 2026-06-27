---
title: 자동 다국어 문서 파이프라인 기획 (KO → EN)
description: GitHub Actions 기반 한국어 문서 자동 번역·동기화 파이프라인 설계 및 구현 단계. DeepL/OpenAI, 용어집, Human-in-the-loop 정책.
version: "1.0.0"
lastUpdated: 2026-01-29
status: draft
sidebar:
  order: 2
---

본 문서는 **한국어로 작성된 문서를 영어로 자동 번역하여 `en/` 폴더에 동기화**하는 파이프라인의 기획·설계 내용을 정리합니다. 코드 구현은 포함하지 않으며, 아키텍처·트리거·도구·구현 단계·Best Practice만 정의합니다.

---

## 1. 목표 및 범위

### 1.1 목표

- **원칙**: 주 작성 언어는 한국어(`ko/`). 모든 원본 문서는 `docs/src/content/docs/ko/` 하위에 작성한다.
- **자동화**: 한국어 문서가 Push될 때마다 **영어 번역본이 자동 생성**되어 `docs/src/content/docs/en/`의 동일한 상대 경로에 저장된다.
- **동기화**: Astro Starlight의 다국어 구조(`ko/`, `en/`)를 유지하면서 **내용만 동기화**한다. 단순 파일 복사가 아니라 **번역**이 적용된다.

### 1.2 범위

| 포함 | 제외 |
|------|------|
| `docs/src/content/docs/ko/**/*.md` 변경 시 EN 자동 번역 | `ko/` 원본 수동 번역 작업 |
| Frontmatter `title`, `description` 번역 | 웹사이트 빌드·배포 (기존 프로세스 유지) |
| Markdown 본문, 코드 블록·Mermaid 문법 보존 | 실시간 번역 API 연동(배치만) |

---

## 2. 파이프라인 아키텍처 (GitHub Actions 기반)

### 2.1 전체 흐름

1. **Trigger**: 개발자가 한국어 문서(`.md`)를 `docs/src/content/docs/ko/` 하위에 Push(또는 PR)한다.
2. **Detection**: GitHub Actions가 `on.push.paths`(또는 `pull_request.paths`)로 `docs/src/content/docs/ko/**` 변경을 감지한다.
3. **Translation**: 변경·추가된 파일 목록을 기준으로, **DeepL API** 또는 **OpenAI(GPT-4o) API**를 사용해 Markdown 형식(코드 블록, Frontmatter, Mermaid)을 유지한 채 **본문·Frontmatter 텍스트만** 영어로 번역한다.
4. **Sync**: 번역 결과를 `docs/src/content/docs/en/`의 **동일한 상대 경로**에 저장한다. (예: `ko/v1/guides/foo.md` → `en/v1/guides/foo.md`)
5. **Commit / PR**: 생성·수정된 영어 파일을 저장소에 커밋하거나, 전용 브랜치에 커밋 후 **PR을 생성**한다. 커밋 메시지에 `[skip ci]`를 넣어 번역 커밋이 다시 워크플로를 트리거하지 않도록 한다.

### 2.2 다이어그램 (개념)

```
[개발자: ko/**/*.md Push]
         ↓
[GitHub Actions: paths = docs/src/content/docs/ko/**]
         ↓
[변경된 .md 파일 목록 추출]
         ↓
[번역 스크립트: DeepL or OpenAI]
  - Frontmatter title, description 번역
  - 본문 번역 (코드/Mermaid 블록은 스킵 또는 보존)
         ↓
[en/ 동일 경로에 저장]
         ↓
[git commit & push] or [Create PR]
```

---

## 3. 추천 도구 및 구성 요소

### 3.1 번역 API

- **Option A – DeepL API**  
  - 장점: 비용·품질 균형, Markdown 친화적.  
  - 도구 예: `deepl-transformer` 유형 액션 또는 직접 호출 스크립트(Python/Node).
- **Option B – OpenAI (GPT-4o) API**  
  - 장점: 지시문으로 “코드 블록·Mermaid·Frontmatter 구조 유지” 등을 명시 가능.  
  - 구현: GitHub Actions에서 `OPENAI_API_KEY` 시크릿 사용, Python/Node 스크립트로 요청/파싱.

### 3.2 워크플로 구성 요소

- **Checkout**: `actions/checkout@v4` (풀 디렉션, 또는 변경 파일만 사용).
- **번역 스크립트**:  
  - 입력: `--src docs/src/content/docs/ko` (또는 변경 파일 목록),  
  - 출력: `--dest docs/src/content/docs/en`  
  - 스크립트 위치 예: `scripts/translate_docs.py` 또는 `scripts/translate_docs.mjs`.
- **자동 커밋**:  
  - `stefanzweifel/git-auto-commit-action@v5` 등으로 `en/` 변경분만 커밋,  
  - `commit_message`: 예) `docs: automatic translation KO → EN [skip ci]`.

---

## 4. 구체적인 구현 단계

### 4.1 규칙 및 정책 반영

- **`.cursor/rules/docs.md`**  
  - 다국어·번역 정책 문단을 추가/유지한다.  
  - 핵심 내용:  
    - 원본은 `ko/`에만 작성.  
    - `en/`은 GitHub Actions로 자동 생성되므로 **수동 수정 지양**.  
    - 번역 시 Frontmatter의 `title`, `description`을 반드시 번역 대상에 포함.

### 4.2 GitHub Actions 워크플로

- **파일 위치**: `.github/workflows/translate.yml` (또는 `translate-docs.yml`).
- **Trigger**:  
  - `on.push.paths`: `docs/src/content/docs/ko/**`  
  - (선택) `on.pull_request.paths`: 동일 경로로 PR 시 미리 번역 결과 확인.
- **Job**:  
  - 1) checkout, 2) 런타임(Python/Node) 설정, 3) 번역 스크립트 실행(환경변수에 API 키 주입), 4) 자동 커밋 또는 PR 생성.

### 4.3 번역 스크립트 요구사항 (기획 수준)

- **입력**:  
  - 소스 디렉터리: `docs/src/content/docs/ko`  
  - (선택) 이번 Push에서 변경된 파일 목록만 처리하도록 인자 지원.
- **처리**:  
  - Markdown 파싱: Frontmatter / 본문 / 코드 블록 / Mermaid 블록 구분.  
  - 번역 대상: Frontmatter 내 `title`, `description` 및 본문 중 코드·Mermaid가 아닌 텍스트.  
  - API 호출 시 **용어집(Glossary)** 전달 권장(아래 5.2).
- **출력**:  
  - 동일한 상대 경로에 `en/` 하위에 파일 생성.  
  - 기존 `en/` 파일이 있으면 덮어쓰기(또는 “변경 시에만” 정책 명시).

### 4.4 Starlight 연동

- `astro.config.mjs`의 `locales`에 `ko`, `en`이 이미 설정되어 있으면, `en/`에 파일이 생성되는 즉시 사이트 상단 **언어 선택**에서 영어가 노출된다. 별도 빌드 설정 변경은 최소화.

---

## 5. 아키텍트 제언 (Best Practices)

### 5.1 Human-in-the-loop

- 기계 번역만으로는 품질이 보장되지 않는다.  
- **중요 문서**(백서, 사용자 매뉴얼 등)는 자동 번역 후 **검토 단계**를 두는 것이 좋다.  
- Frontmatter의 `status: review`를 활용해 “번역 완료·리뷰 대기” 상태를 구분하고, 리뷰 완료 후 `published`로 전환하는 정책을 권장한다.

### 5.2 용어집(Glossary) 관리

- ‘개인화 엔진’, ‘가중치 로직’, ‘시드 계약’ 등 **고유 명사·도메인 용어**가 일관되게 번역되도록, 번역 API 호출 시 **Glossary**를 함께 넘기는 스크립트를 설계한다.  
- Glossary는 프로젝트 내 파일(예: `docs/glossary.csv`, `docs/glossary.json`)로 관리하고, CI에서 읽어 API 파라미터로 전달한다.

### 5.3 Toil 제거

- 수동으로 번역해 `en/`에 복사하는 작업은 **Toil(낭비)**이며, 버전 불일치와 이중 수정의 원인이 된다.  
- **GitHub Actions를 통한 자동화를 기본**으로 하고, 예외(긴급 수정 등)만 수동으로 처리하는 것을 권장한다.

---

## 6. 산출물 및 체크리스트 (구현 시 참고)

| 단계 | 산출물 | 비고 |
|------|--------|------|
| 1 | `.cursor/rules/docs.md`에 다국어·번역 정책 반영 | 이미 일부 반영된 경우 갱신만 |
| 2 | `.github/workflows/translate.yml` (또는 동일 목적 워크플로) | trigger, job, 스크립트 호출 |
| 3 | 번역 스크립트 (예: `scripts/translate_docs.py` 또는 `.mjs`) | API 선택(DeepL/OpenAI), Frontmatter/본문/코드 구분 |
| 4 | Glossary 파일 및 스크립트 연동 | 선택이지만 권장 |
| 5 | 시크릿 설정 (예: `OPENAI_API_KEY`, `DEEPL_API_KEY`) | Repo Secrets |
| 6 | 자동 커밋 액션 또는 PR 생성 로직 | `[skip ci]` 포함 |

---

## 7. 요약

- **Trigger**: `docs/src/content/docs/ko/**` 변경 시 GitHub Actions 실행.  
- **Translation**: DeepL 또는 OpenAI(GPT-4o)로 Markdown 구조를 유지한 채 텍스트만 KO → EN 번역.  
- **Sync**: 번역 결과를 `docs/src/content/docs/en/` 동일 경로에 저장.  
- **Commit**: 자동 커밋 또는 PR 생성, `[skip ci]`로 재실행 방지.  
- **정책**: 원본은 `ko/`, `en/`은 자동 생성·수동 수정 지양, 중요 문서는 `status: review`로 Human-in-the-loop, Glossary로 용어 일관성 유지.

이 기획문서를 바탕으로, 다음 단계에서 **번역 스크립트 상세 설계** 및 **워크플로 YAML·프롬프트 설정**을 구체화할 수 있다.
