---
title: Technology Stack Definition and Developer Guide
description: 엔터프라이즈 미디어 플랫폼 기술 스택 및 개발자 계약
sidebar:
  order: 8
---

## Purpose

엔터프라이즈급 미디어 플랫폼을 위한 **단일·권위 있는 표준**을 정의합니다.

- 최종 기술 스택 (Runtime, API, AI, Admin)
- 로컬 개발 표준 및 개발자 계약
- CI/CD 및 GitOps 기반 자동화
- E2E 자동화 (Playwright)
- 결제, 메시징, 광고 관리
- AI 시맨틱 검색 인프라
- 실시간 장애 대응 및 관측성 전략

## Architecture Vision

**AI, 결제, 광고, 자동화, 관측성**이 통합된 **엔터프라이즈 미디어 플랫폼**을 목표로 합니다.

### Core Objectives

- 🌍 **100ms 이내 글로벌 응답** (Edge)
- 🔐 **API Gateway 기반 보안·정책 우선**
- 🤖 **AI 시맨틱 검색 및 개인화 추천**
- 🚀 **실시간 장애 탐지·대응**
- 👥 **다팀 확장 가능한 표준 개발 경험**

### Design Philosophy

- **Contract First:** API는 계약
- **Local First:** 서버 도달 전 로컬에서 검증
- **Gateway Aware:** 실제 사용자와 동일한 진입점(Zuplo)에서 검증
- **Observability by Design:** 장애는 즉시 노출, 은폐 금지

## Final Technology Stack

| Domain | Technology | Role |
|--------|------------|------|
| Runtime | Cloudflare Workers | 글로벌 에지 실행 |
| API Framework | Hono + Zod | 계약 우선·타입 안전 API |
| Database | Cloudflare D1 + Drizzle | 뉴스·메타데이터 저장 |
| Cache / KV | Cloudflare KV | 세션, 토큰, 캐시 |
| API Gateway | Zuplo (GitOps) | 인증, 속도 제한, 정책 |
| CI/CD | GitHub Actions | 테스트, 배포, 정책 동기화 |
| Local Dev | Wrangler | 로컬 에지 시뮬레이션 |
| Unit Testing | Vitest | 로컬·CI 표준 |
| E2E Testing | Playwright | 사용자 관점 검증 |
| Monitoring | Sentry | 실시간 장애 대응 |
| AI Search | Cloudflare Vectorize | 시맨틱 뉴스 검색 |
| Payments | Stripe | 구독·결제 |
| Messaging | Twilio | SMS·알림 |
| Editor | Cursor | AI 페어 프로그래밍 |

## Developer Philosophy

1. **로컬에서 실패하는 코드는 서버에 올리지 않는다**
2. **서버는 실행 환경이지 개발 환경이 아니다**
3. **테스트는 필수 관문이며 선택이 아니다**
4. **개발 환경은 규칙으로 강제하며, 문서만으로는 부족하다**

> _"CI는 신뢰의 근원이 아니라 두 번째 방어선이다."_

## End-to-End Flow

```
Local Development (Cursor)
   ↓
Local Unit & Contract Testing (Vitest)
   ↓
Local Edge Simulation (Wrangler)
   ↓
Git Commit / Push (GitHub)
   ↓
CI Continuous Testing (Vitest)
   ↓
Automated Deployment (Cloudflare Workers)
   ↓
Gateway Synchronization (Zuplo)
   ↓
End-to-End Verification (Playwright)
   ↓
Runtime Monitoring & Incident Response (Sentry)
```

**Core Rule:** 서버에 배포하기 전에 반드시 로컬에서 검증한다.
