---
title: Local Runnable Project Structure
description: 로컬 실행 가능한 프로젝트 구조 가이드
sidebar:
  order: 7
---

에러는 monorepo 설정과 Cloudflare 타입이 없어서 발생합니다. 로컬에서 바로 실행 가능한 구조로 수정하겠습니다.

## Project Structure (실행 가능)

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

- **package.json**: `pnpm dev`, `pnpm deploy`, `validate:local` 등 스크립트
- **wrangler.jsonc**: D1, R2, KV, Queues 바인딩
- **.dev.vars**: 로컬 환경변수 (Git 제외)

## Execution Order

```bash
# 1. 의존성 설치
pnpm install

# 2. 로컬 서버 시작
pnpm dev

# 3. 검증 (별도 터미널)
pnpm validate:local
```

## Troubleshooting

### "Cannot find module '@repo/db/schema'"

- monorepo 전용 경로. `import { ... } from '../db/schema'` 형태로 수정.

### "Cannot find name 'R2Bucket'"

- `@cloudflare/workers-types` 설치 및 `tsconfig.json`의 `types`에 추가.

### D1 마이그레이션 실패

```bash
rm -rf .wrangler/state/v3/d1
wrangler d1 create <db-name> --local
pnpm db:migrate
```

## Related Documents

- [Environment Setup](/ko/v1/guides/deployment-ops/environment-setup/) — 환경 구성 상세
- [Local Testing](/ko/user-manual/local-testing/) — 로컬 테스트 절차
- [Deployment](/ko/user-manual/deployment/) — 배포 가이드
