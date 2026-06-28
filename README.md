# web-public

News-Labs 공개 웹 — 마케팅 사이트 + 통합 사용자 문서.

## 구조

```
web-public/
├── apps/
│   ├── marketing-web/   # 마케팅 홈페이지 (Next.js → nl-marketing-web)
│   └── public-docs/     # 공개 문서 (API·Legal·FAQ → nl-public-docs)
└── packages/
```

## 개발

```bash
pnpm dev:www
pnpm dev:docs
```

## 배포

| App | Pages project | URL |
| --- | --- | --- |
| marketing-web | `nl-marketing-web` | www.newsfork.com |
| public-docs | `nl-public-docs` | docs.newsfork.com (external API + legal only) |

Internal engineering docs: [devdocs.newsfork.com](https://devdocs.newsfork.com/products/seeds/) (Seeds architecture/ops migrated from public-docs). Boundary: `apps/public-docs/docs/PLAN-content-separation.md`.

Cloudflare setup: [devdocs — Cloudflare docs setup](https://devdocs.newsfork.com/deployment/cloudflare-docs-setup/)
