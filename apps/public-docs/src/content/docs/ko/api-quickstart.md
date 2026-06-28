---
title: API 빠른 시작
description: API 키로 Newsfork Seeds REST API를 시작하는 방법
sidebar:
  order: 2
---

첫 API 호출을 위해 이 가이드를 사용하세요. 전체 엔드포인트는 [v1 API](/ko/v1/api/)를 참고하세요.

## 사전 준비

- 활성 구독이 있는 Newsfork 계정
- 계정 대시보드 또는 온보딩 이메일의 API 키

전체 API 키는 지원 티켓, 채팅, 공개 저장소에 공유하지 마세요.

## Base URL

통합에 사용할 base URL은 온보딩 자료에 안내됩니다. production 또는 sandbox URL이 필요하면 [hello@newsfork.com](mailto:hello@newsfork.com)으로 문의하세요.

## 인증

`Authorization` 헤더에 API 키를 전달합니다:

```bash
curl -sS \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://YOUR_BASE_URL/health"
```

`YOUR_API_KEY`와 `YOUR_BASE_URL`을 계정에서 받은 값으로 바꾸세요.

## 첫 요청

### 헬스 체크

```bash
curl -sS \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://YOUR_BASE_URL/health"
```

### 시드 목록

```bash
curl -sS \
  -H "Authorization: Bearer YOUR_API_KEY" \
  "https://YOUR_BASE_URL/api/v1/seeds"
```

쿼리 파라미터와 응답 필드는 [Seeds API](/ko/v1/api/seeds-api/)를 참고하세요.

## 오류 처리

| HTTP 상태 | 의미 |
| --- | --- |
| `401` | API 키 누락 또는 잘못됨 |
| `403` | 키는 유효하나 해당 리소스 권한 없음 |
| `429` | Rate limit 초과 — 백오프 후 재시도 |
| `5xx` | 서버 오류 — 지수 백오프로 재시도 |

## Rate limit

플랜에 따라 limit이 다릅니다. [요금](/ko/company/pricing/) 또는 영업 문의를 참고하세요.

## 다음 단계

- [시작하기](/ko/getting-started/) — 통합 개요
- [Seeds API](/ko/v1/api/seeds-api/) — 핵심 엔드포인트
- [Seeds 가이드](/ko/v1/guides/seeds/) — Seed 계약 개념
- [FAQ](/ko/resources/faq/) — 자주 묻는 질문
