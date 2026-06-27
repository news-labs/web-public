import {
  AdminLayout,
  TenantContextBar,
  TenantProvider,
} from "@core-labs/admin-shell";
import { WEB_PORTAL } from "../portal.config";
import { useTenantBootstrap } from "../lib/use-tenant-bootstrap";

function WebAdminLayoutInner({ onLogout }: { onLogout: () => void }) {
  useTenantBootstrap();
  return (
    <AdminLayout
      config={WEB_PORTAL}
      onLogout={onLogout}
      headerSlot={<TenantContextBar />}
    />
  );
}

export function WebAdminLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <TenantProvider storageKey={WEB_PORTAL.storageKey}>
      <WebAdminLayoutInner onLogout={onLogout} />
    </TenantProvider>
  );
}
