---
title: Local Testing Optimized
description: local test environments and how to optimize them
sidebar:
  order: 1
translatedFromHash: 89554d97c4dce814ed90e1fcb6873368b7b68d11cf0c4ce2eac997b90ca82a07
---

How to validate CI/deployment scripts locally. For app build, test, and deployment, refer to the [deployment procedure](./deployment.md). --- ## 1. Basic Test (Syntax Check)

 ```bash
# 프로젝트 루트에서 실행
find .github/scripts scripts -name "*.sh" -type f | xargs -I {} bash -n {}

# 개별 파일
bash -n scripts/setup-cloudflare-resources.sh
bash -n .github/scripts/steps/provision-resources.sh
``` 

**Expected**: exit code 0, no errors.

---

## 2. Auth Logic Test (Without API Token)

 ```bash
# 토큰 없이 실행 → 적절한 에러 메시지 확인
./scripts/setup-cloudflare-resources.sh
./scripts/rollback.sh staging

# 예상: "CLOUDFLARE_API_TOKEN not set" 등 안내 메시지
``` 

**Verify authentication variables**: `CLOUDFLARE_API_TOKEN` Actual API calls only occur when `CF_API_TOKEN` is set.

---

## 3. Additional Tests (Requires Token)

Items executable only when a token is present.

- **setup-cloudflare-resources.sh**: Creates all environment resources with a single manual run. Run only in test environments.
- **provision-resources.sh**: Configures `DEPLOY_ENV=staging`, then provisions D1/KV/Queue and updates wrangler.jsonc.
- **verify-resources.sh**: Verifies existence of D1, KV, and Queue.
- **rollback.sh**: `./scripts/rollback.sh staging` — Automatically verify via `interactive` or ``ROLLBACK_AUTO_CONFIRM=true``.
- **wrangler dev --remote**: Run locally with ``pnpm dev:remote:staging`` — uses Staging resources.
- **act** (optional): After ``brew install act``, run ``act -W .github/workflows/deploy.yml`` — simulates CI locally (not fully identical).

Debugging: Run script after configuring ``ACTIONS_STEP_DEBUG='true'``. `2>&1 | tee test-output.log`.

---

## checklist when saving logs.

- [ ] Passed syntax check (all .sh files: `bash -n`)
- [ ] Error messages output correctly when running without tokens
- [ ] (When tokens exist) Verify order of verify-resources.sh, provision-resources.sh, rollback.sh

**Caution**: `setup-cloudflare-resources.sh` creates actual Cloudflare resources. Run on a test account.
