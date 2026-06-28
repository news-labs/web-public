---
title: Changelog
description: Newsfork 문서 및 설계 변경 이력
version: "1.0.0"
lastUpdated: 2026-01-29
status: published
sidebar:
  order: 99
---

## 2026-06-28

### 공개·내부 문서 분리

- 내부 아키텍처·배포·환경·레퍼런스 문서를 devdocs(Access)로 이전.
- Manual Setup을 [API 빠른 시작](/ko/api-quickstart/)으로 대체.
- 공개 사이트는 외부 API, 통합 가이드, Legal, 요금, FAQ만 제공.
- CI 감사 추가: `scripts/audit-public-docs-sensitive.mjs`.

## 2026-01-29

### Starlight 인프라 및 첫 설계 문서

- **Starlight 인프라 구축**: 프로젝트 `docs/` 폴더에 Astro Starlight 설치. 기본 언어 `ko`, 추가 언어 `en`으로 다국어 구조 구성.
- **디렉토리 아키텍처**: `docs/src/content/docs/` 하위에 IA 적용.
  - `v1/api/`, `v1/guides/` 폴더 생성 (ko/en 로케일별).
- **첫 설계 문서**: 개인화 엔진 설계 (이후 내부 devdocs로 이전).
