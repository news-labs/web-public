import { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Globe } from "lucide-react";
import {
  LoginCard,
  RequirePortalRole,
  getStoredApiKey,
  getSessionToken,
  setSessionToken,
} from "@core-labs/admin-shell";
import { WEB_PORTAL, ADMIN_UI_BASENAME } from "./portal.config";
import {
  loadWebTenantSession,
  loadWebActiveTenantId,
  clearWebTenantSession,
  saveWebActiveTenant,
  type WebTenantInfo,
  type WebTenantSession,
} from "./lib/tenant-session";
import { WebTenantLoginPage } from "./pages/web-tenant-login-page";
import { WebTenantSelectPage } from "./pages/web-tenant-select-page";
import { WebAdminLayout } from "./components/web-admin-layout";
import { DashboardPage } from "./pages/dashboard-page";
import { SitesOverviewPage } from "./pages/sites-overview-page";
import { SiteDetailPage } from "./pages/site-detail-page";
import { BrandsPage } from "./pages/brands-page";
import { RegionsPage } from "./pages/regions-page";
import { LocalesPage } from "./pages/locales-page";
import { TemplatesPage, TemplateOverridesPage } from "./pages/templates-page";
import { DesignTokensPage, PreviewPage, ComponentsGalleryPage } from "./pages/design-pages";
import { ContentIndexPage, CategoriesPage } from "./pages/content-pages";
import { MediaLibraryPage, CdnAssetsPage } from "./pages/media-pages";
import {
  SeoMetaPage,
  SeoHreflangPage,
  SeoSitemapPage,
  SeoUrlPreviewPage,
} from "./pages/seo-pages";
import { RedirectsPage } from "./pages/redirects-page";
import {
  PublishCalendarPage,
  BulkSchedulePage,
  PublishLogPage,
  BuildHistoryPage,
} from "./pages/publishing-pages";
import { DeployPage } from "./pages/deploy-page";
import {
  AnalyticsOverviewPage,
  AnalyticsRegionsPage,
  AnalyticsLanguagesPage,
  AnalyticsSeoPage,
  WebVitalsPage,
} from "./pages/analytics-pages";
import {
  GithubReposPage,
  CiRunsPage,
  ChangeHistoryPage,
  AuditLogPage,
} from "./pages/integrations-pages";

// ── Web Tenant Context ────────────────────────────────────────────────────

interface WebTenantContextValue {
  webSession: WebTenantSession | null;
  activeTenant: WebTenantInfo | null;
  setActiveTenant: (t: WebTenantInfo) => void;
}

const WebTenantContext = createContext<WebTenantContextValue>({
  webSession: null,
  activeTenant: null,
  setActiveTenant: () => undefined,
});

export function useWebTenantContext() {
  return useContext(WebTenantContext);
}

// ── App ───────────────────────────────────────────────────────────────────

export function App() {
  // Legacy admin API-key / Google OAuth auth
  const [legacyAuthed, setLegacyAuthed] = useState(
    () => Boolean(getStoredApiKey(WEB_PORTAL.storageKey) || getSessionToken(WEB_PORTAL.storageKey)),
  );

  // Tenant-user auth (webmaster / designer)
  const [webSession, setWebSession] = useState<WebTenantSession | null>(() => loadWebTenantSession());
  const [activeTenant, setActiveTenantState] = useState<WebTenantInfo | null>(() => {
    const session = loadWebTenantSession();
    if (!session) return null;
    const savedId = loadWebActiveTenantId();
    return session.tenants.find((t) => t.tenant_id === savedId) ?? null;
  });

  const handleWebLogout = () => {
    clearWebTenantSession();
    setWebSession(null);
    setActiveTenantState(null);
    setLegacyAuthed(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");
    if (session) {
      setSessionToken(WEB_PORTAL.storageKey, session);
      params.delete("session");
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? `?${params}` : ""}`);
      setLegacyAuthed(true);
    }
  }, []);

  // Determine auth mode
  if (!legacyAuthed && !webSession) {
    // Show tenant login with fallback to legacy API-key login
    return (
      <WebTenantLoginPage
        onSuccess={(s) => {
          setWebSession(s);
          if (s.tenants.length === 1) {
            setActiveTenantState(s.tenants[0]);
            saveWebActiveTenant(s.tenants[0].tenant_id);
          }
        }}
      />
    );
  }

  if (!legacyAuthed && webSession && !activeTenant) {
    return (
      <WebTenantSelectPage
        session={webSession}
        onSelect={(t) => setActiveTenantState(t)}
        onLogout={handleWebLogout}
      />
    );
  }

  if (legacyAuthed) {
    // Use LoginCard fallback for api-key admins
    if (!getStoredApiKey(WEB_PORTAL.storageKey) && !getSessionToken(WEB_PORTAL.storageKey)) {
      return <LoginCard config={WEB_PORTAL} icon={Globe} onSuccess={() => setLegacyAuthed(true)} />;
    }
  }

  return (
    <WebTenantContext.Provider value={{ webSession, activeTenant, setActiveTenant: setActiveTenantState }}>
      <BrowserRouter basename={ADMIN_UI_BASENAME}>
        <Routes>
          <Route element={<WebAdminLayout onLogout={handleWebLogout} />}>
          <Route index element={<DashboardPage />} />
          <Route path="sites" element={<SitesOverviewPage />} />
          <Route path="sites/:siteId" element={<SiteDetailPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="regions" element={<RegionsPage />} />
          <Route path="locales" element={<LocalesPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/overrides" element={<TemplateOverridesPage />} />
          <Route path="design/tokens" element={<DesignTokensPage />} />
          <Route path="preview" element={<PreviewPage />} />
          <Route path="design/components" element={<ComponentsGalleryPage />} />
          <Route path="content" element={<ContentIndexPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="media/cdn" element={<CdnAssetsPage />} />
          <Route path="seo/meta" element={<SeoMetaPage />} />
          <Route path="seo/hreflang" element={<SeoHreflangPage />} />
          <Route path="seo/sitemap" element={<SeoSitemapPage />} />
          <Route path="seo/url-preview" element={<SeoUrlPreviewPage />} />
          <Route path="redirects" element={<RedirectsPage />} />
          <Route path="schedule" element={<PublishCalendarPage />} />
          <Route path="schedule/bulk" element={<BulkSchedulePage />} />
          <Route path="publish-log" element={<PublishLogPage />} />
          <Route path="history" element={<BuildHistoryPage />} />
          <Route path="history/changes" element={<ChangeHistoryPage />} />
          <Route path="deploy" element={
            <RequirePortalRole config={WEB_PORTAL} allowed={["web_admin", "admin"]}>
              <DeployPage />
            </RequirePortalRole>
          } />
          <Route path="analytics" element={<AnalyticsOverviewPage />} />
          <Route path="analytics/regions" element={<AnalyticsRegionsPage />} />
          <Route path="analytics/languages" element={<AnalyticsLanguagesPage />} />
          <Route path="analytics/seo" element={<AnalyticsSeoPage />} />
          <Route path="analytics/web-vitals" element={<WebVitalsPage />} />
          <Route path="integrations/github" element={<GithubReposPage />} />
            <Route path="integrations/ci" element={<CiRunsPage />} />
            <Route path="audit" element={
              <RequirePortalRole config={WEB_PORTAL} allowed={["web_admin", "admin"]}>
                <AuditLogPage />
              </RequirePortalRole>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WebTenantContext.Provider>
  );
}
