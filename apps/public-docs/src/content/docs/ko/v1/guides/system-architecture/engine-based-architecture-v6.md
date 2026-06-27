---
title: 엔진 기반 아키텍처 (v6.0)
description: Newsfork v6.0 모듈형 엔진 아키텍처 - 8대 코어 엔진, 엔진 철학, Zuplo API Gateway
sidebar:
  order: 0
version: "6.0"
---

# Newsfork v6.0 — 엔진 기반 아키텍처

**버전:** 6.0  
**상태:** 목표 아키텍처 (기획 / 단계적 도입)

---

## 철학

> "각 기능은 독립된 엔진으로 분리되어, 일관된 네이밍과 인터페이스를 통해 개발된다"

- 각 엔진은 **독립적으로 개발·배포·테스트** 가능하다.
- **엔진 간 통신**은 **Queue** 또는 **API**로만 수행한다 (직접 공유 상태 없음).
- 모든 엔진은 **동일한 네이밍 컨벤션**과 **폴더 구조**를 따른다 (`nf-{engine}-{resource}-{qualifier}`).
- **외부 노출**은 **Zuplo API Gateway**를 통해 이루어진다.

---

## 8대 코어 엔진

| 코드 | 엔진 | 역할 |
|------|------|------|
| **E1** | **Collection Engine** | 뉴스 수집 (Research → Seed → Scraper) |
| **E2** | **Diaspora Engine** | City Node 기반 다국어 뉴스 사이트 생성 |
| **E3** | **RAG Engine** | Agentic GraphRAG + Knowledge API |
| **E4** | **Knowledge Agent** | Diaspora 사이트 연동 AI 에이전트 |
| **E5** | **Journalist Engine** | 사용자 기사 작성 지원 AI |
| **E6** | **Advertising Engine** | 도메인-시티별 광고 관리 (Frappe/ERPNext) |
| **E7** | **Publishing Engine** | 멀티미디어 자동 생성 및 소셜 발행 |
| **E8** | **Distribution Engine** | 멀티채널 뉴스 배포 |

---

## 현재 아키텍처와의 관계

**현재** 코드베이스(Research → Seed → Dataset → Metadata, 단일 Worker, Queues, R2, D1, KV)는 **기반**으로 유지되며 **E1 (Collection Engine)** 및 공유 인프라에 해당한다. v6.0에서는 E2–E8을 동일한 네이밍·인터페이스 규칙을 따르는 별도 엔진으로 추가한다. [Seed Engine Workflow](./seed-engine-workflow.md), [Distributed Build and Edge Caching](./distributed-build-and-edge-caching-architecture.md) 등 **기존 문서**는 현재 시스템을 그대로 설명하며, 본 문서는 **목표** 엔진 기반 모델을 설명한다.

---

## 참고

- **Project Overview** — 현재 아키텍처 및 Tech Stack
- **docs/planning/** — E1, E2, E3 엔진 명세 및 리소스 맵
- **.cursor/rules/infrastructure/resource-naming.mdc** — `nf-{engine}-{resource}-{qualifier}` 컨벤션
