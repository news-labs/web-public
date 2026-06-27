import { createApiClient } from "@core-labs/admin-shell";
import { WEB_PORTAL } from "../portal.config";

export const api = createApiClient(WEB_PORTAL.apiBaseUrl, WEB_PORTAL.storageKey);

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

export function fetchDesignTokens() {
  return api<{ tokens: Record<string, string>; preview: string }>("/api/v1/design/tokens");
}

export function fetchRedirects(siteId?: string) {
  const q = siteId ? `?siteId=${encodeURIComponent(siteId)}` : "";
  return api<{ items: RedirectRow[]; files: Array<{ site: string; path: string }> }>(`/api/v1/redirects${q}`);
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

export function fetchContentPages(siteId?: string) {
  const q = siteId ? `?siteId=${encodeURIComponent(siteId)}` : "";
  return api<{ items: ContentPageRow[] }>(`/api/v1/content${q}`);
}

export function createContentPage(siteId: string, slug: string, title: string, body?: string) {
  return api<{ ok: boolean; pageId: string }>("/api/v1/content", {
    method: "POST",
    body: JSON.stringify({ siteId, slug, title, body }),
  });
}

export function promoteSchedule(scheduleId: string) {
  return api<{ ok: boolean }>(`/api/v1/schedule/${scheduleId}/promote`, { method: "POST" });
}

export interface RedirectRow {
  rule_id: string;
  site_id: string;
  from_path: string;
  to_path: string;
  status_code: number;
}

export interface ContentPageRow {
  page_id: string;
  site_id: string;
  slug: string;
  title: string;
  status: string;
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
