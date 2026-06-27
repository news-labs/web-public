---
title: Local Runnable Project Structure
description: local executable project structure guide
sidebar:
  order: 7
translatedFromHash: 437c25c7a09447ea0c1edabde11edc1142e983707051bbf465e91c0569548715
---

The error occurs due to missing monorepo configuration and Cloudflare type. I will modify it to a structure that can be executed locally. 

## Project Structure (Executable)

```
newsfork-seeds/
├── package.json
├── tsconfig.json
├── wrangler.jsonc
├── .dev.vars                    # Cloudflare Workers 로컬 환경변수
├── src/
│   ├── index.ts                 # Hono API
│   ├── routes/                  # HTTP 엔드포인트
│   ├── domain/                  # 순수 비즈니스 로직
│   ├── infra/                   # Cloudflare 어댑터
│   ├── lib/                     # 유틸리티
│   └── schemas/                 # Zod 스키마
├── scripts/
├── migrations/
└── data/
```

## Key Configuration Files

- **package.json**: `pnpm dev` , `pnpm deploy` , `validate:local` etc. scripts
- **wrangler.jsonc**: D1, R2, KV, Queues bindings
- **.dev.vars**: Local environment variables (excluding Git)

## Execution Order

 ```bash
# 1. 의존성 설치
pnpm install

# 2. 로컬 서버 시작
pnpm dev

# 3. 검증 (별도 터미널)
pnpm validate:local
``` 

## Troubleshooting ### "Cannot find module '@repo/db/schema'" - Monorepo-specific path. Modify to `import { ... } from '../db/schema'` format. ### "Cannot find name 'R2Bucket'"

- Install `@cloudflare/workers-types` and add to ``types`` in ``tsconfig.json``.

### D1 Migration Failed

 ```bash
rm -rf .wrangler/state/v3/d1
wrangler d1 create <db-name> --local
pnpm db:migrate
``` 

## Related Documents

- [Environment Setup](/ko/v1/guides/deployment-ops/environment-setup/) — Environment Setup Details
- [Local Testing](/ko/user-manual/local-testing/) — Local Testing Procedure
- [Deployment](/ko/user-manual/deployment/) — Deployment Guide
