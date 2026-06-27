---
title: API Development and E2E Test Flow
description: API Development-Deployment-E2E Validation Standard Pipeline (RFC-API-E2E-001)
sidebar:
  order: 7
translatedFromHash: 82e9e18dd8bc7b5f45a0e540a96d3ddfb767d027d28aa08194ffa59012510744
---

## Pipeline Overview 

```
로컬 개발
   ↓
단위 및 계약 테스트
   ↓
자동 배포
   ↓
게이트웨이 동기화
   ↓
End-to-End 검증
   ↓
런타임 모니터링
``` 

Each stage provides **stricter validation** than the previous one. 

## Design Principles 

1. **Contract as Source of Truth** — API behavior is defined by schema and OpenAPI. 
2. **Gateway-Aware Validation** — APIs are tested using the same gateway as end-users.
3. **Progressive Risk Reduction** — Defects are eliminated as early as possible and at the lowest cost.
4. **Deployment as Test Boundary** — Successful deployment without E2E validation ≠ guaranteed accuracy.
5. **Observability as Continuation of Testing** — Runtime monitoring complements pre-deployment testing.

## Stage 1 – API Development and Unit Validation

- API implemented as **schema validation-based handlers**.
- Unit tests performed in **simulated/mocked** environments (D1, KV, etc.).
- **Pass criteria:** All unit tests must pass; schema violations prevent progression to the next stage.

## Stage 2 – Deployment and Contract Publication

- Main merge code must be deployable and automatically deployed via CI/CD.
- API contracts are output in OpenAPI format and automatically synchronized with the gateway.

## Stage 3 – E2E Validation

- **Execution Timing:** Must run **after** successful deployment.
- **Target:** **Gateway endpoints**, not internal services.
- **Scope:** Authentication success/failure, core business flows, contract compliance (status codes, response structure).
- **Failure Action:** Deemed deployment failure, blocks release/production promotion.

## Stage 4 – Runtime Monitoring

- Real-time collection of runtime errors (stack trace, request metadata, Correlation ID).
- Immediate notification for critical errors.
- Feed monitoring data back into unit tests, E2E scenarios, and contract refinement.

## Environment Segmentation (Recommended)

| Environment | Purpose |
|------|------|
| Development | Local iterative development |
| Staging | Deployment + E2E verification |
| Production | Actual user traffic |

E2E runs on **staging** before production promotion.

## Conformance Levels (Optional)

- **Level 1:** Unit testing + Deployment
- **Level 2:** Gateway synchronization + E2E
- **Level 3:** E2E + Runtime observation (Full conformance)
