# web-public

News-Labs 공개 웹 — 마케팅 사이트 + 통합 사용자 문서.

## 구조

```
web-public/
├── apps/
│   ├── marketing-web/   # 마케팅 홈페이지 (Next.js → nl-marketing-web)
│   ├── account-web/     # 개발자 계정 포털 (Next.js → nl-account-web)
│   └── public-docs/     # 공개 문서 (API·Legal·FAQ → nl-public-docs)
└── packages/
```

## 개발

```bash
pnpm dev:www
pnpm dev:account
pnpm dev:docs
```

## 배포 (Static hosting: assets-only Workers)

세 사이트 모두 **Workers Static Assets, assets-only**(`main` 없음, 바인딩 없음)로 배포합니다. Worker 코드가 실행되지
않으므로 정적 요청은 무료·무제한입니다. 설계: `news-labs/ops-ci-workflows` → `docs/thin-cloudflare-static-hosting.md`.
계정은 `marcojapan1234`, 존이 생기기 전까지는 `*.workers.dev`로 엽니다.

| App | Worker | Output | `not_found_handling` | Host (존 이전 후) |
| --- | --- | --- | --- | --- |
| marketing-web | `nl-site-newsfork-marketing` | `apps/marketing-web/out` | `404-page` | www.newsfork.com |
| account-web | `nl-site-newsfork-account` | `apps/account-web/out` | `404-page` | account.newsfork.com |
| public-docs | `nl-site-newsfork-docs` | `apps/public-docs/dist` | `404-page` | docs.newsfork.com (external API + legal only) |

각 앱의 `wrangler.jsonc`에는 `account_id`가 없습니다(D-2). `CLOUDFLARE_ACCOUNT_ID` 환경변수로 넣습니다.

정적 빌드에서 동작하지 않는 것 (백엔드가 없음. `/api`는 나중에 Tunnel → project-a):

- marketing-web `/contact/` 폼: `NEXT_PUBLIC_CONTACT_FORM_ACTION`(외부 endpoint)이 없으면 "temporarily unavailable" +
  mailto 안내. `functions/api/contact.ts`는 서빙되지 않습니다.
- account-web 로그인·가입·대시보드: `NEXT_PUBLIC_ACCOUNT_API_ENABLED=1`로 빌드하지 않으면 "temporarily unavailable"
  화면을 보여 주고 `/api/account/*`를 호출하지 않습니다. `functions/`(BFF)는 서빙되지 않습니다.
- apex `newsfork.com` → `www` 리다이렉트: Workers `_redirects`는 도메인 단위 규칙을 지원하지 않으므로, 존을 만든 뒤
  Redirect Rule로 처리합니다.

### Build + deploy (project-a)

```bash
# 한 단계라도 실패하면 멈추도록 서브셸에서 실행합니다.
(
set -euo pipefail

# 1) build (repo checkout, Node 22 + pnpm via corepack; no Cloudflare token needed)
cd web-public
corepack pnpm install --frozen-lockfile --filter marketing-web... --filter account-web... --filter public-docs...
NODE_ENV=production corepack pnpm --filter marketing-web run build   # → apps/marketing-web/out
NODE_ENV=production corepack pnpm --filter account-web run build     # → apps/account-web/out
corepack pnpm --filter public-docs run build                         # → apps/public-docs/dist

# 2) stage next to the wrangler in /opt/nl-static-sites (npx resolves it from the parent node_modules)
S=/opt/nl-static-sites/out
for a in marketing-web:nl-site-newsfork-marketing:out account-web:nl-site-newsfork-account:out public-docs:nl-site-newsfork-docs:dist; do
  IFS=: read app name dir <<<"$a"; rm -rf "$S/$name"; mkdir -p "$S/$name"
  cp "apps/$app/wrangler.jsonc" "$S/$name/" && cp -r "apps/$app/$dir" "$S/$name/$dir"
done

# 3) deploy (root: reads the token). Uploads only changed files; roll back with `npx wrangler rollback`.
export PATH=/opt/nl-static-sites/node/bin:$PATH WRANGLER_SEND_METRICS=false
CLOUDFLARE_API_TOKEN=$(cat /root/.config/cf-marcojapan/token)
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:?set the target account ID first}"
bash scripts/deploy-static-sites.sh /opt/nl-static-sites
)
```

`public-docs`의 `build`·`deploy` 스크립트는 먼저 `scripts/audit-public-docs-sensitive.mjs`를 실행하고, 검사에 걸리면 실패합니다.
`astro build`를 직접 실행하면 검사를 건너뜁니다. `scripts/deploy-static-sites.sh`는 토큰이 대상 계정에 접근할 수 있는지
확인하고, 세 사이트의 dry-run이 모두 통과해야 배포를 시작합니다. 배포 도중 실패하면 거기서 멈추며, 이미 배포된 사이트는 되돌리지 않습니다.

Free 한도: 버전당 20,000 파일, 파일당 25 MiB. 현재 빌드는 각각 수십~수백 개 파일, 최대 파일 약 1.6 MB입니다.

구 계정 Cloudflare Pages용 마케팅·계정·문서 배포 워크플로는 삭제했습니다.

Internal engineering docs: [devdocs.newsfork.com](https://devdocs.newsfork.com/products/seeds/) (Seeds architecture/ops migrated from public-docs). Boundary: `apps/public-docs/docs/PLAN-content-separation.md`.

Cloudflare setup: [devdocs — Cloudflare docs setup](https://devdocs.newsfork.com/deployment/cloudflare-docs-setup/)
