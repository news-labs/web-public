---
title: Test and Deployment Guide
description: 테스트 및 배포 내용은 배포 절차 문서로 통합되었습니다.
sidebar:
  order: 3
---

테스트 명령어 순서, 배포 방법, 서버 확인 절차는 **[배포 절차](./deployment.md)** 문서에 통합되어 있습니다.

- **로컬 테스트 순서**: TypeScript 검증 → 단위 테스트 → 통합 검증 → 로컬 서버 테스트
- **배포 방법**: Wrangler CLI 또는 GitHub Actions (main push / workflow_dispatch)
- **배포 후 확인**: Health, Readiness, Liveness, API 엔드포인트
- **문제 해결**: Vitest 호환성, Queue/D1/KV 부재, Health/API 실패 대응

위 항목의 상세 내용은 [배포 절차](./deployment.md)를 참조하세요.
