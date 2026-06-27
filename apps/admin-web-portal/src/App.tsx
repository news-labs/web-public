import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Globe } from "lucide-react";
import {
  AdminLayout,
  LoginCard,
  getStoredApiKey,
  getSessionToken,
  setSessionToken,
} from "@core-labs/admin-shell";
import { WEB_PORTAL } from "./portal.config";
import { SitesOverviewPage } from "./pages/sites-overview-page";
import { SiteDetailPage } from "./pages/site-detail-page";
import { ContentPage } from "./pages/content-page";
import { DesignPage } from "./pages/design-page";
import { DeployPage } from "./pages/deploy-page";
import { SchedulePage } from "./pages/schedule-page";
import { HistoryPage } from "./pages/history-page";
import { RedirectsPage } from "./pages/redirects-page";

export function App() {
  const [authed, setAuthed] = useState(
    () => Boolean(getStoredApiKey(WEB_PORTAL.storageKey) || getSessionToken(WEB_PORTAL.storageKey)),
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");
    if (session) {
      setSessionToken(WEB_PORTAL.storageKey, session);
      params.delete("session");
      window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? `?${params}` : ""}`);
      setAuthed(true);
    }
  }, []);

  if (!authed) {
    return <LoginCard config={WEB_PORTAL} icon={Globe} onSuccess={() => setAuthed(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout config={WEB_PORTAL} onLogout={() => setAuthed(false)} />}>
          <Route index element={<SitesOverviewPage />} />
          <Route path="sites" element={<SitesOverviewPage />} />
          <Route path="sites/:siteId" element={<SiteDetailPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="design" element={<DesignPage />} />
          <Route path="deploy" element={<DeployPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="redirects" element={<RedirectsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
