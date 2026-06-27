---
title: AI-Native Cursor & Git Development SOP
description: AI-Native 프로덕션급 개발 표준 요약
sidebar:
  order: 3
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

| 계층 | 의미 |
|------|------|
| playground | AI가 자유롭게 실험하는 위험 구역 |
| src | 통합된 안정 코드 |
| staging | 실제 배포 전 최종 검증 구역 |

## Naming Rules

- **실험 코드:** `playground/YYYYMMDD-feature-name/`
- **테스트:** `*.test.ts`, `*.spec.ts`
- **브랜치:** `feat/*`, `fix/*`, `refactor/*`, `release/*`

## AI-Native Development Flow

### Phase 1 — Experiment (playground)

- 모든 신규 로직은 **playground/** 에서만 작성
- Cursor Composer는 해당 폴더 범위 내에서만 작동

### Phase 2 — Promote to src

- 실험이 검증되면 **승격(Promotion)** 스크립트로 src로 이동
- CI(단위·통합 테스트) 통과 필수

### Phase 3 — Staging & Release

- staging에서 QA·성능·법무 검증
- **AI 접근 금지** — 인간만 배포 승인

## Related Documents

- [Git Branch Usage](/ko/reference/git-branch-usage/) — main / playground / staging / release 전략
- [Cursor Rules Newsfork Overview](/ko/v1/guides/development-workflow/cursor-rules-newsfork-overview/) — 계약 우선·기술 스택
