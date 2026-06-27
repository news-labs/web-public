---
title: Git Branch Usage
description: AI-Native Release / Staging / Playground branch strategy
sidebar:
  order: 2
translatedFromHash: f691e50be48736dbcbce7923ee3f691ff7a78d23e684824a9fdfb15a0fbe4e4c
---

Goal: **AI experiments freely, main branch remains stable, deployment controlled by humans**

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

| Branch | Meaning |
|--------|------|
| main | **AI-Native Truth** – Always clean and test-passing |
| playground/* | AI experiments, research, risky code |
| staging | QA / Deployment candidate |
| release/* | Actual production deployment |

## Playground Strategy (AI Experiments Only)

 ```bash
git checkout -b playground/domain-normalizer
``` 

- AI can generate freely here
- Failure is acceptable
- Cursor can **only freely modify in the playground branch**

## Promotion to main

 ```bash
git checkout main
git merge playground/domain-normalizer
npm test
git commit -m "feat: promote domain normalization from playground"
git branch -D playground/domain-normalizer
``` 

## Staging: Deployment Candidate

- QA, Performance, Data Validation, Legal Review
- **No AI Access**

## Release & Production

 ```bash
git checkout -b release/2026.01
git tag prod-2026.01
git push origin prod-2026.01
``` 

CI/CD deploys only to this tag.

## Hotfix Flow

 ```
release/2026.01 → fix/critical-bug → release/2026.01 → main
``` 

> release → main merge required

## .cursorrules rules

 ```
- Cursor는 playground/* 와 main 만 수정 가능
- staging 및 release 브랜치는 읽기 전용
- production 태그는 절대 수정 불가
``` 
