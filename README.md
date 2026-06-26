# web-public

News-Labs 공개 웹 — 마케팅 사이트 + 공개 문서.

## 구조

```
web-public/
├── apps/
│   ├── marketing-web/   # 마케팅 홈페이지 (Next.js 15 + Tailwind)
│   └── public-docs/     # 공개 API 문서 (Astro Starlight)
└── packages/
```

## 개발

```bash
# 마케팅 사이트
pnpm dev:www

# 문서
pnpm dev:docs
```

## 배포

Cloudflare Pages + Workers (OpenNext.js cloudflare adapter)
