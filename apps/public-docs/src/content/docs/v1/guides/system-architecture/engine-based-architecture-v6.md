---
title: Engine-Based Architecture (v6.0)
description: Newsfork v6.0 modular engine architecture - 8 core engines, engine philosophy, Zuplo API Gateway
sidebar:
  order: 0
version: "6.0"
---

# Newsfork v6.0 — Engine-Based Architecture

**Version:** 6.0  
**Status:** Target architecture (planning / phased rollout)

---

## Philosophy

> "각 기능은 독립된 엔진으로 분리되어, 일관된 네이밍과 인터페이스를 통해 개발된다"

- Each engine is **developed, deployed, and tested independently**.
- **Inter-engine communication** is only via **Queue** or **API** (no direct shared state).
- All engines follow the **same naming convention** and **folder structure** (`nf-{engine}-{resource}-{qualifier}`).
- **External exposure** is through **Zuplo API Gateway**.

---

## 8 Core Engines

| Code | Engine | Role |
|------|--------|------|
| **E1** | **Collection Engine** | 뉴스 수집 (Research → Seed → Scraper) |
| **E2** | **Diaspora Engine** | City Node 기반 다국어 뉴스 사이트 생성 |
| **E3** | **RAG Engine** | Agentic GraphRAG + Knowledge API |
| **E4** | **Knowledge Agent** | Diaspora 사이트 연동 AI 에이전트 |
| **E5** | **Journalist Engine** | 사용자 기사 작성 지원 AI |
| **E6** | **Advertising Engine** | 도메인-시티별 광고 관리 (Frappe/ERPNext) |
| **E7** | **Publishing Engine** | 멀티미디어 자동 생성 및 소셜 발행 |
| **E8** | **Distribution Engine** | 멀티채널 뉴스 배포 |

---

## Relationship to Current Architecture

The **current** codebase (Research → Seed → Dataset → Metadata, single Worker, Queues, R2, D1, KV) remains the **foundation** and maps to **E1 (Collection Engine)** and shared infrastructure. v6.0 adds E2–E8 as separate engines with the same naming and interface discipline. Existing docs (e.g. [Seed Engine Workflow](./seed-engine-workflow.md), [Distributed Build and Edge Caching](./distributed-build-and-edge-caching-architecture.md)) continue to describe the current system; this document describes the **target** engine-based model.

---

## See Also

- **Project Overview** — current architecture and Tech Stack
- **docs/planning/** — E1, E2, E3 engine specs (e1-collection-engine-spec.md, e2-diaspora-engine-spec.md, e3-rag-engine-spec.md) and resource map
- **.cursor/rules/infrastructure/resource-naming.mdc** — `nf-{engine}-{resource}-{qualifier}` convention
