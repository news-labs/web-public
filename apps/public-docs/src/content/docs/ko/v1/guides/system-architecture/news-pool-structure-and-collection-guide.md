---
title: News Pool Structure and Collection Guide
description: 뉴스 풀(News Pool) 구성 및 수집 체계 가이드
sidebar:
  order: 6
---

ASI 시대의 **NewsFork** 모델은 단순한 뉴스 수집기가 아니라, 국가별 파편화된 공공 정보를 전 세계 AI와 외국인(Expats)에게 연결하는 **'글로벌 지능형 뉴스 허브'**가 될 것입니다.

## 1. News Pool 구성: "중앙 지능형 데이터 호수"

각 채널(에이전트)이 뉴스 풀에서 기사를 선택해 가려면, 원본 데이터는 특정 언어나 형식에 종속되지 않은 **'중립적 구조'**여야 합니다.

### Unified Schema

- 모든 뉴스는 **JSON 기반 표준 스키마**로 변환되어 저장
- 예: `country_code`, `agency_name`, `original_lang`, `fact_tags`, `importance_score`

### Hybrid Storage

- **관계형 DB (D1/PostgreSQL):** 기사 메타데이터, 구독 정보
- **벡터 DB (Pinecone/Milvus):** 뉴스의 '의미'를 벡터로 저장, 유사도 기반 추천

### Multi-Agent Orchestration

- 중앙 Orchestrator가 뉴스 풀 관리
- 하위 채널 에이전트가 '의도 기반 라우팅'으로 기사 선택

## 2. Acquisition Strategy (책임 있는 수집)

### Smart Crawling

- **공식 API 우선:** data.europa.eu, data.gov 등 오픈 데이터 포털
- **웹 스크래핑:** Wrangler 기반 서버리스 스크래퍼, 유휴 시간대 작업

### Multilingual Pipeline (NMT)

- 수집 즉시 신경망 기계 번역(NMT)으로 영어/표준 공용어 1차 번역
- 현지화 최적화: Expats 채널을 위한 문화적 뉘앙스 반영

## 3. 단계별 서비스 실행 모델

| 단계 | 채널 유형 | 작동 방식 | 비즈니스 모델 |
|------|-----------|-----------|---------------|
| 1단계 | Expats 채널 | 국가별 에이전트가 외국인 거주자에게 필요한 정보만 선별 | 채널별 프리미엄 구독 또는 광고 |
| 1단계 | 개발자 API | 뉴스 풀 직접 접근, 구조화된 팩트 데이터 구독 | Zuplo + Stripe 사용량 기반 과금 |
| 2단계 | 개인화 추천 | 벡터 DB + 활동 데이터로 관심사 맞는 뉴스 큐레이션 | 초개인화 프리미엄 멤버십 |

## Recommended: "지능형 게이트웨이 전략"

뉴스 풀의 입구와 출구에 **Zuplo**를 배치하여 API 사용량을 제어하고, 각 채널 에이전트들이 뉴스 풀에서 기사를 'Fork' 해갈 때마다 트래픽과 가치를 모니터링합니다.
