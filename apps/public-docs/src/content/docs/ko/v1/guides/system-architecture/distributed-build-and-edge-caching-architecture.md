---
title: Distributed Build and Edge Caching Architecture
description: 분산 빌드와 에지 캐싱 조합 아키텍처
sidebar:
  order: 4
---

이 프로젝트의 핵심은 **"빌드 성능"**과 **"멀티 테넌시(1만 개 도메인) 관리"**의 균형입니다. 매시간 특정 도메인 그룹이 갱신되어야 한다면, 전체 페이지를 한 번에 빌드하는 방식은 불가능합니다. 따라서 **분산 빌드(Distributed Build)**와 **에지 캐싱(Edge Caching)**을 조합한 아키텍처가 정답입니다.

---

## 대규모 뉴스 생성기 솔루션 비교

| 비교 항목 | **Astro (추천)** | **Hugo (성능 특화)** | **Vite-based (Custom)** |
| :--- | :--- | :--- | :--- |
| **빌드 속도** | 중간 (Node.js 기반) | **압도적 최상 (Go 엔진)** | 중간 |
| **컴포넌트 개발** | **최상 (React/Vue/Svelte 혼용)** | 어려움 (Go Template) | 우수 (직접 설계) |
| **멀티 도메인 관리** | 매우 용이 (Dynamic Routes) | 보통 (Config 복잡) | 용이 (직접 구현) |
| **2025 트렌드** | **현재 가장 선호됨** | 안정적이나 점유율 하락 | 라이브러리 성격 |
| **추천 이유** | Islands Architecture로 광고/위젯 성능 극대화 | 빌드 속도가 생명일 때 | 독자적 빌드 파이프라인 |

---

## 추천 아키텍처 (2025-2026)

**Astro + Cloudflare Pages + Durable Objects** 조합을 추천합니다.

### 1. 프레임워크: Astro (Hybrid Mode)

- 뉴스 기사는 99% 정적 콘텐츠. Astro는 JS를 0에 가깝게 유지하면서 필요한 부분만 인터랙티브하게 만들 수 있습니다.
- **빌드 전략:** 전체 20만 페이지를 한 번에 빌드하지 말고, **Incremental Static Regeneration (ISR)**과 유사하게 도메인별 그룹 빌드를 수행합니다.

### 2. 배포 및 도메인: Cloudflare Pages & Custom Domains

- **1만 개 도메인 관리:** Cloudflare for Platforms (Custom Hostnames)로 수만 개 커스텀 도메인 연결, SSL 자동 발급.
- **매시간 갱신:** Wrangler CLI로 도메인 그룹별 빌드 스크립트를 Cron Triggers로 스케줄링합니다.

### 3. 데이터 및 저장소: Cloudflare R2 & D1

- **R2:** 생성된 정적 HTML·뉴스 이미지 저장. Egress Fee 없음.
- **D1:** 뉴스 메타데이터·도메인별 설정을 에지에서 초고속 쿼리.

---

## 빌드 오케스트레이션

1. **빌드 큐:** 매시간 갱신 대상 도메인 목록을 Upstash QStash 등에 넣어 순차 처리.
2. **병렬 빌드 워커:** GitHub Actions 또는 Cloudflare Workers로 도메인 1,000개 단위 **Parallel Build** 수행. 20만 페이지도 10분 내외 전체 갱신 가능.
3. **에지 최적화:** 뉴스 기사는 한 번 생성되면 잘 바뀌지 않으므로, Cloudflare Cache Rules로 TTL을 길게 설정해 원본 서버 부하를 최소화합니다.
