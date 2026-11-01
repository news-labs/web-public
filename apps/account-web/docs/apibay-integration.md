# apibay-labs portal integration (account.newsfork.com)

Account portal UI lives on `account.newsfork.com`. **Signup, login, API keys, billing, and sessions remain on apibay-labs** at `api.newsfork.com`.

## Canonical URLs

| User action | Account UI | apibay handoff |
|-------------|------------|----------------|
| Sign in | `https://account.newsfork.com/login` | `https://api.newsfork.com/login` |
| Get API key / Sign up | `https://account.newsfork.com/signup` | `https://api.newsfork.com/signup` |
| Google OAuth | `/api/auth/google?flow=login\|signup` | `https://api.newsfork.com/oauth/google` |
| Post-auth dashboard | — | `https://api.newsfork.com` (portal home) |
| Hub push link | Brand `/sign-in` | `return_url` → `/api/auth/push-callback?next=…` → brand `/auth/callback` |

Query parameters (`plan`, `email`, `return_url`, etc.) are forwarded from account login/signup UI → continue/OAuth → apibay.

## BFF routes (Cloudflare Pages Functions)

| Route | Behavior |
|-------|----------|
| `GET /api/auth/continue` | `flow=login\|signup\|forgot`; merges query → 302 to apibay portal path |
| `GET /api/auth/google` | `flow=login\|signup`; 302 to apibay Google OAuth start |
| `GET /api/auth/google/callback` | 302 to apibay callback (canonical OAuth on api host) |
| `GET /api/auth/push-callback` | Validates `next` brand `/auth/callback`; copies `user_id`/`uid`; 302 |
| `GET /api/auth/hub/callback` | Alias (needs sibling `hub.ts`) |
| `GET /api/auth/hub-callback` | Legacy alias |
| `POST /api/auth/logout` | Clears account cookies; 302 to apibay logout or portal home |

## Allowlist (return_url / post-login)

### account-web (`sanitizeReturnUrl`)

Always allowed:

- `account.newsfork.com`, `api.newsfork.com`, `www.newsfork.com`
- Brand apex (and subdomains): `koryy.com`, `tokyy.com` — **path must be** `/auth/callback`
- Optional extras: Pages env `ACCOUNT_RETURN_URL_HOSTS` (comma-separated hostnames)

### apibay-labs dashboard

Configure:

- `https://account.newsfork.com`
- `https://account.newsfork.com/login`
- `https://account.newsfork.com/signup`
- `https://account.newsfork.com/api/auth/push-callback` (**required** for hub push account link)
- `https://api.newsfork.com`
- `https://api.newsfork.com/*`
- Optional direct brand callbacks: `https://koryy.com/auth/callback`, `https://tokyy.com/auth/callback`

**Post-login:** redirect to `return_url` and append `user_id` (or `uid`) query param so hub-callback / brand callback can link the push visitor.

## OAuth redirect URIs (GCP + apibay)

Register when enabling account-hosted OAuth bridge:

- `https://account.newsfork.com/api/auth/google/callback` (optional bridge)
- Primary OAuth remains on `api.newsfork.com` per apibay defaults

## CORS

If apibay exposes browser auth APIs, allow origin:

- `https://account.newsfork.com`

## Environment (Pages / CI)

| Variable | Default | Purpose |
|----------|---------|---------|
| `APIBAY_PORTAL_ORIGIN` | `https://api.newsfork.com` | Portal base URL |
| `APIBAY_SIGNUP_PATH` | `/signup` | Signup path |
| `APIBAY_LOGIN_PATH` | `/login` | Login path |
| `APIBAY_FORGOT_PASSWORD_PATH` | `/forgot-password` | Forgot password |
| `APIBAY_GOOGLE_OAUTH_PATH` | `/oauth/google` | OAuth start |
| `APIBAY_LOGOUT_PATH` | `/logout` | Logout |
| `ACCOUNT_PORTAL_ORIGIN` | `https://account.newsfork.com` | This portal |
| `ACCOUNT_RETURN_URL_HOSTS` | _(empty)_ | Extra https return hosts |

## Operator checklist

- [x] apibay: allow `account.newsfork.com` (+ hub/callback URL) in return_url allowlist (`dashboard/lib/return-url.ts`)
- [x] apibay: append `user_id` on post-login redirect to `return_url`
- [x] apibay: P2 bare `/login` `/signup` → `account.newsfork.com` (skip when `return_url` / `account_origin` / `from`)
- [ ] DNS: `account` CNAME → `nl-account-web.pages.dev` (Zone DNS Edit or Dashboard)
- [ ] Verify E2E: brand Sign in → account → apibay → hub/callback → `/auth/callback?user_id=` → push prefs linked
- [ ] Verify E2E: www CTA → account UI → apibay → API key visible
