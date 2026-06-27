# web-public

News-Labs 공개 웹 — 마케팅 사이트 + 통합 사용자 문서.

## 구조

```
web-public/
├── apps/
│   ├── marketing-web/   # 마케팅 홈페이지 (Next.js 15 + Tailwind)
│   └── public-docs/     # 통합 사용자 문서 (Astro Starlight → docs.newsfork.com)
├── workers/
│   └── docs-router/     # (deprecated) legacy legal/API split router
└── packages/
```

## 개발

```bash
# 마케팅 사이트
pnpm dev:www

# 사용자 문서 (Starlight)
pnpm dev:docs
```

## 배포

| App | Pages project | URL |
| --- | --- | --- |
| marketing-web | `nf-web-public` | www.newsfork.com |
| public-docs | `nf-public-docs` | docs.newsfork.com |

Cloudflare setup: [docs/CLOUDFLARE_DOCS_SETUP.md](docs/CLOUDFLARE_DOCS_SETUP.md)
