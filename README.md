# web-public

News-Labs 공개 웹 — 마케팅 사이트 + 통합 사용자 문서.

## 구조

```
web-public/
├── apps/
│   ├── marketing-web/   # 마케팅 홈페이지 (Next.js → nl-marketing-web)
│   └── public-docs/     # 사용자 문서 (Astro Starlight → nl-public-docs)
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
| public-docs | `nl-public-docs` | docs.newsfork.com |

Internal docs: `core-platform/docs/devdocs` → `nl-internal-docs` → devdocs.newsfork.com

Cloudflare setup: [docs/CLOUDFLARE_DOCS_SETUP.md](docs/CLOUDFLARE_DOCS_SETUP.md)
