---
title: manual Setup
description: Guide to manually setting up a Newsfork Seeds local-deployment environment
translatedFromHash: d1e22474dd66b1e3b4ae170bb24a72af3d23b2b57df29cccb743e3f1ab08ddf0
---

How to manually set up Newsfork Seeds locally or on a server. ## Prerequisites - Node.js 18+ - pnpm - Cloudflare account (if using Workers, R2, D1, Queues) ## Local Setup Local Setup

1. After cloning the repository, install dependencies:
   ```bash
   pnpm install
   ```

2. 환경 변수 설정: `.dev.vars ` 또는 `.env `에 필요한 값 설정 (Wrangler 참고).

3. 로컬 실행:
   ```bash
   pnpm dev
   ```

## 배포 설정

CI/CD는 `.github/workflows/deploy.yml `에서 처리합니다. 수동 배포 시:

- ` pnpm run deploy ` 또는 ` wrangler deploy ` 사용
- 환경별 ` wrangler.jsonc` and verify secrets

## Next steps

- [Getting Started](/ko/getting-started/) — Overview and next steps
- [User Manual](/ko/user-manual/) — Details on deployment, environments, and testing
