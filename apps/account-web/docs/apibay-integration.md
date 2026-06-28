# apibay-labs portal integration (account.newsfork.com)

Account portal UI lives on `account.newsfork.com`. **Signup, login, API keys, billing, and sessions remain on apibay-labs** at `api.newsfork.com`.

## Canonical URLs

| User action | Account UI | apibay handoff |
|-------------|------------|----------------|
| Sign in | `https://account.newsfork.com/login` | `https://api.newsfork.com/login` |
| Get API key / Sign up | `https://account.newsfork.com/signup` | `https://api.newsfork.com/signup` |
| Google OAuth | `/api/auth/google?flow=login\|signup` | `https://api.newsfork.com/oauth/google` |
| Post-auth dashboard | — | `https://api.newsfork.com` (portal home) |

Query parameters (`plan`, `email`, `return_url`, etc.) are forwarded unchanged from account → apibay.

## BFF routes (Cloudflare Pages Functions)

| Route | Behavior |
|-------|----------|
| `GET /api/auth/continue` | `flow=login\|signup\|forgot`; merges query → 302 to apibay portal path |
| `GET /api/auth/google` | `flow=login\|signup`; 302 to apibay Google OAuth start |
| `GET /api/auth/google/callback` | 302 to apibay callback (canonical OAuth on api host) |
| `POST /api/auth/logout` | Clears account cookies; 302 to apibay logout or portal home |

## Allowlist (return_url / post-login)

Configure in apibay-labs dashboard:

- `https://account.newsfork.com`
- `https://account.newsfork.com/login`
- `https://account.newsfork.com/signup`
- `https://api.newsfork.com`
- `https://api.newsfork.com/*`

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

## Operator checklist

- [ ] apibay: allow `account.newsfork.com` in OAuth redirect / return URL allowlist
- [ ] apibay: optional P2 redirect `api.newsfork.com/signup` → `account.newsfork.com/signup`
- [ ] apibay: optional P2 redirect `api.newsfork.com/login` → `account.newsfork.com/login`
- [ ] DNS: `account` CNAME → `nl-account-web.pages.dev` (see `scripts/activate-nl-pages-domains.mjs`)
- [ ] Verify E2E: www CTA → account UI → apibay → API key visible
