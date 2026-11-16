# Account portal (account.newsfork.com)

> **Role boundary (SSOT):** `account.newsfork.com` is the **API consumer self-serve portal** (OTP shell, keys, usage, Stripe). Hub brand visitors and Admin/CMS operators may enter OTP here only for a **one-time handoff** — do not keep brand/admin sessions on this host.
>
> | Surface | Owns session? | Role |
> |---|---|---|
> | `account.newsfork.com` | Yes (`nf_account_session`) | API consumer: keys · usage · billing |
> | Hub brands (`koryy.com`, …) | Brand cookie after handoff | Push prefs via `/auth/callback?user_id=` |
> | `admin.newsfork.com` / `cms.newsfork.com` | CP session after handoff | Ops / Domain Content — handoff mint/consume on CP |
>
> Backend SSOT for keys, metering, and Stripe: news-labs **`nl-api-gateway`** (`api.newsfork.com`).

## Native account API (current)

| Surface | Path | Backend |
|---|---|---|
| Login / signup (email OTP) | `/login/`, `/signup/` | `POST /api/account/otp`, `POST /api/account/verify` → gateway `/v1/account/auth/*` |
| Dashboard (plan, usage, keys, billing, settings) | `/dashboard/*` | `GET/POST/PATCH/DELETE /api/account/*` |
| Logout | `POST /api/account/logout`, `GET /api/auth/logout` | gateway `/v1/account/auth/logout` |
| Session gate | `functions/_middleware.ts` | Unauthenticated `/` and `/dashboard/*` → `/login/` |

BFF: `functions/api/account/[[path]].ts` keeps the gateway `nf_sess_…` token in an HttpOnly `nf_account_session` cookie (30 days) and calls `nl-api-gateway` via the `GATEWAY` service binding (`wrangler.toml`), falling back to `API_PUBLIC_ORIGIN`. Non-GET calls require a same-origin `Origin` header.

**2026-11 cutover:** `/api/auth/continue` and `/api/auth/google` were removed (they 404). Do not revive apibay browser handoffs for signup/login.

## Hub push callbacks

Brand sign-in still uses return-URL sanitizers in `functions/lib/apibay-portal.ts` (name is transitional):

| Route | Behavior |
|-------|----------|
| `GET /api/auth/push-callback` | Validates `next` brand `/auth/callback`; copies `user_id`/`uid`; 302 |
| `GET /api/auth/hub/callback` | Alias |
| `GET /api/auth/hub-callback` | Legacy alias |

### Allowlist (`sanitizeReturnUrl`)

Always allowed:

- `account.newsfork.com`, `api.newsfork.com`, `www.newsfork.com`
- `admin.newsfork.com`, `cms.newsfork.com` (F4/F5 handoff targets)
- Brand apex (and subdomains): `koryy.com`, `tokyy.com` — **path must be** `/auth/callback`
- Optional extras: Pages env `ACCOUNT_RETURN_URL_HOSTS` (comma-separated hostnames)

## Canonical URLs

| User action | URL |
|-------------|-----|
| Sign in | `https://account.newsfork.com/login/` |
| Sign up / Get API key | `https://account.newsfork.com/signup/` |
| Dashboard | `https://account.newsfork.com/dashboard/` |
| Hub push return | `https://account.newsfork.com/api/auth/push-callback?next=https://{brand}/auth/callback` |

Deep-link after login: `/login/?next=/dashboard/keys/` (`next` must be a same-origin `/dashboard…` path).

## Environment (Pages / CI)

| Variable | Default | Purpose |
|----------|---------|---------|
| `API_PUBLIC_ORIGIN` | `https://api.newsfork.com` | Gateway HTTPS fallback when service binding unavailable |
| `ACCOUNT_PORTAL_ORIGIN` | `https://account.newsfork.com` | This portal |
| `ACCOUNT_RETURN_URL_HOSTS` | _(empty)_ | Extra https return hosts for hub callbacks |
| `API_PORTAL_ORIGIN` | `https://api.newsfork.com` | Legacy alias used by return-URL helpers |
| `APIBAY_PORTAL_ORIGIN` | same | Transitional alias — prefer `API_PORTAL_ORIGIN` |

## Operator checklist

- [x] Native OTP login/signup on account-web → `nl-api-gateway`
- [x] Session cookie BFF + CSRF Origin check
- [x] Unauthenticated `/dashboard/*` edge redirect (`functions/_middleware.ts`)
- [x] Hub push `return_url` allowlist + `user_id` relay
- [ ] Optional: restore Google OAuth **on gateway** (not apibay bridge)
- [ ] Verify E2E: brand Sign in → account OTP → hub/callback → `/auth/callback?user_id=`
- [ ] Verify E2E: www CTA → account → API key visible
