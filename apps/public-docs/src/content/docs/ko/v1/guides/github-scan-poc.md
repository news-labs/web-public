---
title: Github-scan-poc
description: GitHub GraphQL + REST 스캔 PoC
version: 1
lastUpdated: 2026-04-12
status: auto-generated
---

이 문서는 **github-scan-poc** 폴더의 README에서 자동 생성되었습니다.

# GitHub GraphQL + REST 스캔 PoC

GitHub public repo의 **메타데이터**(GraphQL)와 **파일 트리**(REST)를 수집해 구조 JSON을 만드는 PoC입니다.

- **GraphQL**: 레포 이름, 설명, 기본 브랜치, 스타, 라이선스
- **REST**: `git/trees?recursive=1` 로 전체 트리 한 번에 수집 (API 2회)
- **코드 내용(blob)은 읽지 않음** — 구조만 생성
- 결과는 Docsfork Pattern Engine 입력으로 사용 가능

## 요구 사항

- Node.js 18+
- `GITHUB_TOKEN` 환경 변수 (GitHub Personal Access Token, repo 읽기 권한)

## 실행

```bash
# 프로젝트 루트에서
export GITHUB_TOKEN=your_github_token
pnpm exec tsx docsfork/dev/github-scan-poc/index.ts
```

기본 대상: `vercel/next.js`. 다른 레포를 스캔하려면:

```bash
# owner repo
pnpm exec tsx docsfork/dev/github-scan-poc/index.ts vercel next.js

# 또는 GitHub URL
pnpm exec tsx docsfork/dev/github-scan-poc/index.ts https://github.com/owner/repo
```

## 출력

- `output/sample.json`: `{ meta: RepoMeta, tree: TreeEntry[] }` 형식의 구조 JSON

## 디렉터리 구조

```
github-scan-poc/
├── README.md
├── index.ts           # 실행 엔트리
├── github/
│   ├── graphql.ts     # fetchRepoMeta
│   ├── rest.ts        # fetchRepoTree
│   ├── types.ts       # RepoRef, RepoMeta, TreeEntry, RepoStructure
│   ├── parse-repo-url.ts  # URL → RepoRef
│   └── scan.ts        # scanRepository (Core 연결 지점)
└── output/
    └── sample.json    # 생성 결과
```

## npm 스크립트 (선택)

프로젝트 루트 `package.json`에 추가할 수 있습니다:

```json
"github-scan": "tsx docsfork/dev/github-scan-poc/index.ts",
"github-scan:repo": "tsx docsfork/dev/github-scan-poc/index.ts"
```

이후 `pnpm github-scan` 또는 `pnpm github-scan:repo owner repo` 로 실행 가능.
