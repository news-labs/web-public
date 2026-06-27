---
title: Git Branch Usage
description: AI-Native Release / Staging / Playground 브랜치 전략
sidebar:
  order: 2
---

> 목표: **AI는 마음껏 실험, main은 항상 안정, 배포는 인간이 통제**

## Branch Map

```
                           ┌──────────────┐
                           │ playground/* │  ← AI 실험
                           └───────┬──────┘
                                   │
                                   ▼
                            ┌────────────┐
                            │    main    │  ← 통합 기준선 (AI-Native Baseline)
                            └───────┬────┘
                                   │
                                   ▼
                           ┌──────────────┐
                           │   staging    │  ← Release Candidate
                           └───────┬──────┘
                                   │
                                   ▼
                          ┌────────────────┐
                          │ release/2026.01 │ ← Production tag
                          └────────────────┘
```

## Branch Roles

| 브랜치 | 의미 |
|--------|------|
| main | **AI-Native Truth** – 항상 깨끗하고 테스트 통과 |
| playground/* | AI 실험, 리서치, 위험 코드 |
| staging | QA / 배포 후보 |
| release/* | 실제 운영 배포 |

## Playground Strategy (AI 실험 전용)

```bash
git checkout -b playground/domain-normalizer
```

- AI는 여기서 마음껏 생성
- 실패해도 무관
- Cursor는 **playground 브랜치에서만 자유 수정**

## main으로의 승격

```bash
git checkout main
git merge playground/domain-normalizer
npm test
git commit -m "feat: promote domain normalization from playground"
git branch -D playground/domain-normalizer
```

## Staging: 배포 후보

- QA, 성능, 데이터 검증, 법무 검증
- **AI 접근 금지**

## Release & Production

```bash
git checkout -b release/2026.01
git tag prod-2026.01
git push origin prod-2026.01
```

CI/CD가 이 태그만 배포.

## Hotfix Flow

```
release/2026.01 → fix/critical-bug → release/2026.01 → main
```

> release → main 역병합 필수

## .cursorrules 규칙

```
- Cursor는 playground/* 와 main 만 수정 가능
- staging 및 release 브랜치는 읽기 전용
- production 태그는 절대 수정 불가
```
