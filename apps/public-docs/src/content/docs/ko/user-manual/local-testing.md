---
title: Local Testing
description: 로컬에서 스크립트·환경 테스트 방법
sidebar:
  order: 4
---

로컬에서 CI/배포 스크립트를 검증하는 방법입니다. 앱 빌드·테스트·배포는 [배포 절차](./deployment.md)를 참조하세요.

---

## 1. Basic Test (Syntax Check)

```bash
# 프로젝트 루트에서 실행
find .github/scripts scripts -name "*.sh" -type f | xargs -I {} bash -n {}

# 개별 파일
bash -n scripts/setup-cloudflare-resources.sh
bash -n .github/scripts/steps/provision-resources.sh
```

**예상**: exit code 0, 에러 없음.

---

## 2. Auth Logic Test (Without API Token)

```bash
# 토큰 없이 실행 → 적절한 에러 메시지 확인
./scripts/setup-cloudflare-resources.sh
./scripts/rollback.sh staging

# 예상: "CLOUDFLARE_API_TOKEN not set" 등 안내 메시지
```

**인증 변수 확인**: `CLOUDFLARE_API_TOKEN` 또는 `CF_API_TOKEN` 설정 시에만 실제 API 호출이 이루어집니다.

---

## 3. 추가 테스트 (토큰 필요)

토큰이 있을 때만 실행 가능한 항목입니다.

- **setup-cloudflare-resources.sh**: 한 번 수동 실행으로 모든 환경 리소스 생성. 테스트 환경에서만 실행.
- **provision-resources.sh**: `DEPLOY_ENV=staging` 등 설정 후 D1/KV/Queue 프로비저닝 및 wrangler.jsonc 갱신.
- **verify-resources.sh**: D1, KV, Queue 존재 여부 검증.
- **rollback.sh**: `./scripts/rollback.sh staging` — interactive 또는 `ROLLBACK_AUTO_CONFIRM=true`로 자동 확인.
- **wrangler dev --remote**: `pnpm dev:remote:staging` — 로컬 실행, Staging 리소스 사용.
- **act** (선택): `brew install act` 후 `act -W .github/workflows/deploy.yml` — CI 로컬 시뮬레이션(완전 동일하지 않음).

디버깅: `ACTIONS_STEP_DEBUG='true'` 설정 후 스크립트 실행. 로그 저장 시 `2>&1 | tee test-output.log`.

---

## 체크리스트

- [ ] 문법 검사 통과 (`bash -n` 모든 .sh)
- [ ] 토큰 없이 실행 시 에러 메시지 정상 출력
- [ ] (토큰 있을 때) verify-resources.sh, provision-resources.sh, rollback.sh 순서 확인

**주의**: `setup-cloudflare-resources.sh`는 실제 Cloudflare 리소스를 생성합니다. 테스트용 계정에서 실행하세요.
