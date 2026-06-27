---
title: Changelog
description: Newsfork 문서 및 설계 변경 이력
version: "1.0.0"
lastUpdated: 2026-01-29
status: published
sidebar:
  order: 99
---

## 2026-01-29

### Starlight 인프라 및 첫 설계 문서

- **Starlight 인프라 구축**: 프로젝트 `docs/` 폴더에 Astro Starlight 설치. 기본 언어 `ko`, 추가 언어 `en`으로 다국어 구조 구성.
- **디렉토리 아키텍처**: `docs/src/content/docs/` 하위에 IA 적용.
  - `v1/api/`, `v1/guides/`, `user-manual/`, `archive/whitepaper/` 폴더 생성 (ko/en 로케일별).
- **첫 설계 문서**: `v1/guides/personalization-engine-design.md` 추가.
  - 주제: Newsfork 뉴스 개인화 엔진(가중치 기반 알고리즘 및 파이프라인 설계).
  - 내용: 사용자 클릭·체류 시간 기반 관심사 추출, Redis 캐시 전략.
  - Mermaid.js 데이터 흐름도(graph TD) 포함.
  - Frontmatter: status `draft`, version `1.0.0`.
