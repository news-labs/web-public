import { createApiClient } from "@core-labs/admin-shell";
import { WEB_PORTAL } from "../portal.config";

export const api = createApiClient(WEB_PORTAL.apiBaseUrl, WEB_PORTAL.storageKey);

// ── Legacy site deploy ──────────────────────────────────────────────

export function fetchSites() {
  return api<{ sites: SiteRow[] }>("/api/v1/sites");
}

export function fetchSite(siteId: string) {
  return api<SiteRow>(`/api/v1/sites/${siteId}`);
}

export function triggerDeploy(siteId: string, environment: "staging" | "production" = "staging") {
  return api<{ ok: boolean; deployId: string; previewUrl?: string }>("/api/v1/deploy/trigger", {
    method: "POST",
    body: JSON.stringify({ siteId, environment }),
  });
}

export function fetchDeployHistory() {
  return api<{ items: DeployRow[] }>("/api/v1/deploy/history");
}

export function fetchSchedules() {
  return api<{ items: ScheduleRow[] }>("/api/v1/schedule");
}

export function createSchedule(siteId: string, cronExpression: string, environment: "staging" | "production") {
  return api<{ ok: boolean; scheduleId: string }>("/api/v1/schedule", {
    method: "POST",
    body: JSON.stringify({ siteId, cronExpression, environment }),
  });
}

export function promoteSchedule(scheduleId: string) {
  return api<{ ok: boolean }>(`/api/v1/schedule/${scheduleId}/promote`, { method: "POST" });
}

// ── Diaspora / CP proxy ─────────────────────────────────────────────

export function fetchBrands() {
  return api<{ brands: BrandRow[] }>("/api/v1/diaspora/brands");
}

export function createBrand(payload: Partial<BrandRow>) {
  return api<{ ok: boolean }>("/api/v1/diaspora/brands", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchRegions(brandId?: string) {
  const q = brandId ? `?brand_id=${encodeURIComponent(brandId)}` : "";
  return api<{ regions: RegionRow[] }>(`/api/v1/diaspora/regions${q}`);
}

export function upsertRegion(payload: Partial<RegionRow>) {
  return api<{ ok: boolean }>("/api/v1/diaspora/regions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function patchRegion(cityCode: string, payload: Partial<RegionRow>) {
  return api<{ ok: boolean }>(`/api/v1/diaspora/regions/${cityCode}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function fetchTemplates() {
  return api<{ templates: TemplateRow[] }>("/api/v1/diaspora/templates");
}

export function upsertTemplate(payload: Partial<TemplateRow>) {
  return api<{ ok: boolean; template_id: string }>("/api/v1/diaspora/templates", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchCategories() {
  return api<{ categories: CategoryRow[] }>("/api/v1/diaspora/categories");
}

export function fetchPublishLog(params?: { brandId?: string; regionCode?: string }) {
  const qs = new URLSearchParams();
  if (params?.brandId) qs.set("brand_id", params.brandId);
  if (params?.regionCode) qs.set("city_code", params.regionCode);
  const q = qs.toString() ? `?${qs}` : "";
  return api<{ items: PublishLogRow[] }>(`/api/v1/diaspora/publish-log${q}`);
}

export function fetchDiasporaSchedule() {
  return api<{ items: DiasporaScheduleRow[] }>("/api/v1/diaspora/schedule");
}

export function fetchSiteBuilds() {
  return api<{ builds: SiteBuildRow[] }>("/api/v1/diaspora/admin/site-builds");
}

export function triggerSiteBuild(cityCode?: string) {
  return api<{ ok: boolean }>(
    cityCode ? `/api/v1/diaspora/admin/build` : `/api/v1/diaspora/admin/build/all`,
    { method: "POST", body: JSON.stringify(cityCode ? { city_code: cityCode } : {}) },
  );
}

export function previewUrlPolicy(payload: {
  apex_domain: string;
  slug?: string;
  path_prefix?: string;
  hreflang_locales?: string[];
}) {
  return api<{ canonical_url: string; hreflang_urls?: Record<string, string> }>(
    "/api/v1/diaspora/redirects/preview",
    { method: "POST", body: JSON.stringify(payload) },
  );
}

// ── SEO ─────────────────────────────────────────────────────────────

export function fetchSeoPolicies(scopeType?: string, scopeId?: string) {
  const qs = new URLSearchParams();
  if (scopeType) qs.set("scopeType", scopeType);
  if (scopeId) qs.set("scopeId", scopeId);
  const q = qs.toString() ? `?${qs}` : "";
  return api<{ items: SeoPolicyRow[] }>(`/api/v1/seo/policies${q}`);
}

export function upsertSeoPolicy(payload: {
  scope_type: string;
  scope_id: string;
  title_template?: string;
  description_template?: string;
  og_image_url?: string;
}) {
  return api<{ ok: boolean }>("/api/v1/seo/policies", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchSeoHealth(brandId?: string, regionCode?: string) {
  const qs = new URLSearchParams();
  if (brandId) qs.set("brandId", brandId);
  if (regionCode) qs.set("regionCode", regionCode);
  return api<SeoHealthResponse>(`/api/v1/seo/health?${qs}`);
}

// ── Design tokens ───────────────────────────────────────────────────

export function fetchDesignTokens(scopeType?: string, scopeId?: string) {
  const qs = new URLSearchParams();
  if (scopeType) qs.set("scopeType", scopeType);
  if (scopeId) qs.set("scopeId", scopeId);
  const q = qs.toString() ? `?${qs}` : "";
  return api<{ tokens: Record<string, string>; scope_type: string; scope_id: string }>(
    `/api/v1/design/tokens${q}`,
  );
}

export function saveDesignTokens(payload: {
  scope_type: string;
  scope_id: string;
  tokens: Record<string, string>;
}) {
  return api<{ ok: boolean }>("/api/v1/design/tokens", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ── Media ───────────────────────────────────────────────────────────

export function fetchMediaAssets(scopeType?: string, scopeId?: string) {
  const qs = new URLSearchParams();
  if (scopeType) qs.set("scopeType", scopeType);
  if (scopeId) qs.set("scopeId", scopeId);
  return api<{ items: MediaAssetRow[] }>(`/api/v1/media?${qs}`);
}

// ── Analytics ───────────────────────────────────────────────────────

export function fetchAnalyticsOverview(brandId?: string, regionCode?: string) {
  const qs = new URLSearchParams();
  if (brandId) qs.set("brandId", brandId);
  if (regionCode) qs.set("regionCode", regionCode);
  return api<AnalyticsOverview>(`/api/v1/analytics/overview?${qs}`);
}

export function fetchAnalyticsRegions() {
  return api<{ items: AnalyticsRegionRow[] }>("/api/v1/analytics/regions");
}

export function fetchAnalyticsLanguages() {
  return api<{ items: AnalyticsLanguageRow[] }>("/api/v1/analytics/languages");
}

export function fetchWebVitals(domain?: string) {
  const q = domain ? `?domain=${encodeURIComponent(domain)}` : "";
  return api<WebVitalsResponse>(`/api/v1/analytics/web-vitals${q}`);
}

export function fetchContentIndex(params: {
  cursor?: string;
  limit?: number;
  brandId?: string;
  regionCode?: string;
}) {
  const qs = new URLSearchParams();
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.brandId) qs.set("brandId", params.brandId);
  if (params.regionCode) qs.set("regionCode", params.regionCode);
  return api<ContentIndexResponse>(`/api/v1/analytics/content-index?${qs}`);
}

// ── GitHub integrations ─────────────────────────────────────────────

export function fetchGithubRepos() {
  return api<{ items: GithubRepoRow[] }>("/api/v1/integrations/github/repos");
}

export function fetchGithubRuns(workflow?: string) {
  const q = workflow ? `?workflow=${encodeURIComponent(workflow)}` : "";
  return api<{ items: GithubRunRow[] }>(`/api/v1/integrations/github/runs${q}`);
}

export function triggerTemplateDeploy(templateId: string, ref?: string) {
  return api<{ ok: boolean }>("/api/v1/integrations/github/trigger-template-deploy", {
    method: "POST",
    body: JSON.stringify({ template_id: templateId, ref }),
  });
}

// ── Change history ──────────────────────────────────────────────────

export function fetchChangeHistory(params?: {
  brandId?: string;
  regionCode?: string;
  eventType?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.brandId) qs.set("brandId", params.brandId);
  if (params?.regionCode) qs.set("regionCode", params.regionCode);
  if (params?.eventType) qs.set("eventType", params.eventType);
  return api<{ items: ChangeEventRow[]; audit: unknown[] }>(`/api/v1/history?${qs}`);
}

// ── Redirects & content (legacy) ────────────────────────────────────

export function fetchRedirects(siteId?: string) {
  const q = siteId ? `?siteId=${encodeURIComponent(siteId)}` : "";
  return api<{ items: RedirectRow[]; files: Array<{ site: string; path: string }> }>(
    `/api/v1/redirects${q}`,
  );
}

export function createRedirect(siteId: string, fromPath: string, toPath: string) {
  return api<{ ok: boolean; ruleId: string }>("/api/v1/redirects", {
    method: "POST",
    body: JSON.stringify({ siteId, fromPath, toPath, statusCode: 301 }),
  });
}

export function deleteRedirect(ruleId: string) {
  return api<{ ok: boolean }>(`/api/v1/redirects/${ruleId}`, { method: "DELETE" });
}

export function createContentPage(siteId: string, slug: string, title: string, body?: string) {
  return api<{ ok: boolean; pageId: string }>("/api/v1/content", {
    method: "POST",
    body: JSON.stringify({ siteId, slug, title, body }),
  });
}

// ── Types ───────────────────────────────────────────────────────────

export interface BrandRow {
  brand_id: string;
  apex_domain: string;
  url_policy?: string;
  default_locale?: string;
  template_id?: string;
  is_active?: boolean;
}

export interface RegionRow {
  city_code: string;
  brand_id: string;
  city_name: string;
  country_iso: string;
  timezone: string;
  domain: string;
  routing_mode: string;
  target_language: string;
  default_lang?: string;
  supported_langs?: string[];
  hreflang_locales?: string[];
  seo_title_template?: string;
  template_override_id?: string | null;
  status?: string;
  is_active?: boolean;
}

export interface TemplateRow {
  template_id: string;
  display_name: string;
  description?: string;
  css_path?: string;
  git_repo?: string;
  git_ref?: string;
  version?: string;
  is_active?: boolean;
}

export interface CategoryRow {
  category_slug: string;
  display_name: string;
  is_global_active?: boolean;
}

export interface PublishLogRow {
  log_id?: string;
  slug?: string;
  city_code?: string;
  status?: string;
  published_at?: string;
}

export interface DiasporaScheduleRow {
  schedule_id?: string;
  slug?: string;
  city_code?: string;
  publish_at?: string;
  status?: string;
}

export interface SiteBuildRow {
  build_id?: string;
  city_code?: string;
  status?: string;
  started_at?: string;
  completed_at?: string;
}

export interface SeoPolicyRow {
  policy_id: string;
  scope_type: string;
  scope_id: string;
  title_template?: string;
  description_template?: string;
}

export interface SeoHealthResponse {
  score: number;
  checks: Array<{ id: string; status: string; label: string }>;
}

export interface MediaAssetRow {
  asset_id: string;
  filename: string;
  asset_type: string;
  public_url?: string;
  r2_key: string;
}

export interface AnalyticsOverview {
  summary: {
    pageviews_7d: number;
    unique_visitors_7d: number;
    publish_count_today: number;
    build_success_rate: number;
  };
  series: Array<{ date: string; pageviews: number; unique_visitors: number }>;
}

export interface AnalyticsRegionRow {
  city_code: string;
  city_name?: string;
  country_iso?: string;
  pageviews_7d: number;
}

export interface AnalyticsLanguageRow {
  locale: string;
  pageviews_7d: number;
  share: number;
}

export interface WebVitalsResponse {
  lcp_p75: number;
  inp_p75: number;
  cls_p75: number;
  status: string;
}

export interface ContentIndexResponse {
  items: ContentMetaRow[];
  next_cursor: string | null;
  total_estimate: number | null;
}

export interface ContentMetaRow {
  slug?: string;
  title?: string;
  locale?: string;
  region?: string;
  category?: string;
  status?: string;
  published_at?: string;
}

export interface GithubRepoRow {
  repo: string;
  branch: string;
  last_tag: string | null;
  url: string;
}

export interface GithubRunRow {
  run_id: string;
  status: string;
  conclusion: string | null;
  branch: string;
  created_at: string;
  url: string;
}

export interface ChangeEventRow {
  event_id: string;
  event_type: string;
  summary: string;
  created_at: string;
  brand_id?: string;
  region_code?: string;
}

export interface RedirectRow {
  rule_id: string;
  site_id: string;
  from_path: string;
  to_path: string;
  status_code: number;
}

export interface SiteRow {
  id: string;
  name: string;
  domain: string;
  workflow: string;
  appPath: string;
}

export interface DeployRow {
  deploy_id: string;
  site_id: string;
  environment: string;
  status: string;
  created_at: string;
}

export interface ScheduleRow {
  schedule_id: string;
  site_id: string;
  cron_expression: string;
  environment: string;
  enabled: number;
}

export interface ContentPageRow {
  page_id: string;
  site_id: string;
  slug: string;
  title: string;
  status: string;
}
