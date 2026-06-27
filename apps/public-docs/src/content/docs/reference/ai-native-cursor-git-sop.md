---
title: AI-Native Cursor & Git Development SOP
description: AI-Native production-grade development standards at a glance
sidebar:
  order: 3
translatedFromHash: be67a520d0ef49a0083cecc5ea6f049ddb06ce82f75da55a441dda04fbe388b3
---

## Project Folder Architecture

 ```
├── .cursor/              # Cursor 프로젝트 설정
├── .cursorrules          # AI 아키텍처 헌법
├── src/                  # 통합된 안정 코드 (CI 통과 상태)
├── staging/              # 배포 후보 (Release Candidate)
├── tests/                # src와 1:1 대응 검증
├── scripts/              # 승격, 마이그레이션, 배포
└── playground/           # AI 실험 격리 구역 (Quarantine)
``` 

| Tier | Meaning |
|------|------|
| playground | Risk zone for AI to freely experiment |
| src | Integrated stable code |
| staging | Final verification zone before actual deployment |

## Naming Rules

- **Experimental Code:** `playground/YYYYMMDD-feature-name/` 
- **Testing:** `*.test.ts` , `*.spec.ts` 
- **Branches:** `feat/*` , `fix/*` , `refactor/*` , `release/*` 

## AI-Native Development Flow

### Phase 1 — Experiment (playground)

- All new logic is written only in **playground/**
- Cursor Composer operates only within this folder scope

### Phase 2 — Promote to src - If the experiment is validated, move to src via the **Promotion** script - Must pass CI (unit·integration tests) ### Phase 3 — Staging & Release - QA, performance, and legal verification on staging - **No AI access** — Human approval only for deployment ## Related Documents

- [Git Branch Usage](/ko/reference/git-branch-usage/) — main / playground / staging / release strategy
- [Cursor Rules Newsfork Overview](/ko/v1/guides/development-workflow/cursor-rules-newsfork-overview/) — Contract First · Tech Stack
