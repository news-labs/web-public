# DEPRECATED — use Admin Gateway merged assets

Web Admin UI is served from **`/ops/web/`** on the Admin Gateway (`nl-api-cp`).

- Gateway: `https://admin.newsfork.com/ops/web/`
- BFF API remains on `nl-portal-web-admin` (browser calls via `VITE_API_URL`)
- Phase 3 target: `infra-control-plane/apps/admin-unified/modules/ops-web`
- **`/ops/web/regions` retired** → 301 `/platform/reference-data?tab=cities` (diaspora `city_nodes`). Brand geo → `cms.newsfork.com/{brand}/domain/editions`.
