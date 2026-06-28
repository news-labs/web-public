# E2E QA checklist — account.newsfork.com

Automated UI tests: `pnpm --filter account-web run test:e2e` (static pages only).

BFF routes (`/api/auth/*`) require Cloudflare Pages Functions — verify after deploy with `wrangler pages dev` or production.

## Pre-deploy local

```bash
cd web-public
pnpm install
pnpm --filter account-web run typecheck
pnpm --filter account-web run build
pnpm --filter account-web run test:e2e
```

## Production smoke (manual)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open https://www.newsfork.com | Marketing home loads |
| 2 | Click **Sign in** | `https://account.newsfork.com/login` |
| 3 | Check response headers | `X-Robots-Tag: noindex` |
| 4 | Enter email → **Log in** | Redirect to `https://api.newsfork.com/login` (apibay) with `email` query |
| 5 | Open www → **Get API key** | `https://account.newsfork.com/signup` |
| 6 | **Continue with Google** on signup | Redirect to `https://api.newsfork.com/oauth/google` |
| 7 | Complete apibay signup | API key visible on `api.newsfork.com` portal |
| 8 | Pricing **Pro** CTA | `account.newsfork.com/signup?plan=pro` → apibay with `plan=pro` |

## Regression

- `admin.newsfork.com` unchanged (ops portal)
- `api.newsfork.com/v1/*` API calls still work with `nf_live_*` keys
- Marketing pages no longer link `api.newsfork.com` for sign-in/sign-up CTAs
