---
title: Code Quality Standard
description: refactoring and code review standards (incorporating code cleanup completions)
sidebar:
  order: 2
translatedFromHash: d42cd227556e4fcc286511086513f528c7754d187c8af3a15f658446b0d976a6
---

## Key Conclusions

- **File Size**: Recommended under 250 lines per file, under 50 lines per function. Split if exceeded.
- **Single Responsibility**: One purpose per module. Maintain separation of Route/Domain/Infra layers.
- **Refactoring**: Eliminate duplication, ensure clear boundaries, prioritize pure functions for testability.

## Current Status

- Implemented code review and cleanup plan. Completed Phase 2/3, finishing re-export and large file splitting.

## Related Documents

| Document | Content |
|------|------|
| [Code Review and Cleanup Plan](./code-review-and-cleanup-plan.md) | Code review and cleanup plan |
| [Code Cleanup Completed](./code-cleanup-completed.md) | Code Cleanup Completion Report |
| [Refactoring Plan](./refactoring-plan.md) | Code Refactoring Plan |
