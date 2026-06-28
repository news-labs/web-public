# Web Admin ↔ CP API Contract

BFF: `web-public/workers/admin-web-api`  
Upstream: `nl-api-cp` (`CP_API_BASE_URL`)

## Proxied routes (passthrough auth via `CP_SERVICE_TOKEN`)

| Web Admin BFF | CP API |
|---------------|--------|
| `GET/POST/PATCH /api/v1/diaspora/*` | `/api/v1/diaspora/*` → seeds-api |
| `GET/POST/PATCH /api/v1/tenants/*` | `/api/v1/tenants/*` |
| `GET /api/v1/audit` | `/api/v1/audit` |

## Local BFF routes

| Route | Purpose |
|-------|---------|
| `/api/v1/seo/*` | SEO policies, exceptions, health |
| `/api/v1/media/*` | R2 media library |
| `/api/v1/design/tokens` | Design token CRUD |
| `/api/v1/analytics/*` | Traffic aggregation + content index |
| `/api/v1/integrations/github/*` | Template CI |
| `/api/v1/history` | Unified change history |

## Environment

| Variable | Description |
|----------|-------------|
| `CP_API_BASE_URL` | e.g. `https://nl-api-cp.newsfork.workers.dev` |
| `CP_SERVICE_TOKEN` | Service Bearer for CP (falls back to `WEB_ADMIN_API_KEY`) |
| `GITHUB_TOKEN` | GitHub API for CI runs |
| `GITHUB_WORKFLOW_DEPLOY_TEMPLATE` | Template deploy workflow filename |
