---
title: 수동 설정 (Manual Setup)
description: Newsfork Seeds 로컬·배포 환경 수동 설정 가이드
---

로컬 또는 서버에서 Newsfork Seeds를 수동으로 설정하는 방법입니다.

## 사전 요구사항

- Node.js 18+
- pnpm
- Cloudflare 계정 (Workers, R2, D1, Queues 사용 시)

## 로컬 설정

1. 저장소 클론 후 의존성 설치:
   ```bash
   pnpm install
   ```

2. 환경 변수 설정: `.dev.vars` 또는 `.env`에 필요한 값 설정 (Wrangler 참고).

3. 로컬 실행:
   ```bash
   pnpm dev
   ```

## 배포 설정

CI/CD는 `.github/workflows/deploy.yml`에서 처리합니다. 수동 배포 시:

- `pnpm run deploy` 또는 `wrangler deploy` 사용
- 환경별 `wrangler.jsonc` 및 시크릿 확인

## 다음 단계

- [시작하기](/ko/getting-started/) — 개요 및 다음 단계
- [사용자 매뉴얼](/ko/user-manual/) — 배포, 환경, 테스트 상세
