import { Building2, ChevronRight, Globe, MapPin } from "lucide-react";
import { Button } from "@core-labs/admin-shell";
import { saveWebActiveTenant, type WebTenantInfo, type WebTenantSession } from "../lib/tenant-session";

const ROLE_COLORS: Record<string, string> = {
  webmaster: "bg-orange-100 text-orange-700",
  designer: "bg-pink-100 text-pink-700",
};

interface WebTenantSelectPageProps {
  session: WebTenantSession;
  onSelect: (tenant: WebTenantInfo) => void;
  onLogout: () => void;
}

export function WebTenantSelectPage({ session, onSelect, onLogout }: WebTenantSelectPageProps) {
  const handleSelect = (tenant: WebTenantInfo) => {
    saveWebActiveTenant(tenant.tenant_id);
    onSelect(tenant);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Select Site</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium">{session.user.email}</span>
          </p>
        </div>

        {session.tenants.length === 0 && (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            No sites assigned. Contact your administrator.
          </div>
        )}

        <ul className="space-y-2">
          {session.tenants.map((tenant) => (
            <li key={tenant.tenant_id}>
              <button
                onClick={() => handleSelect(tenant)}
                className="w-full flex items-center gap-4 rounded-xl border p-4 text-left hover:bg-muted/40 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{tenant.display_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {tenant.apex_domain && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {tenant.apex_domain}
                      </span>
                    )}
                    {(tenant.country_code || tenant.city_code) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {[tenant.country_code, tenant.city_code].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tenant.roles.filter((r) => ["webmaster", "designer"].includes(r)).map((role) => (
                      <span
                        key={role}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={onLogout}>Sign out</Button>
        </div>
      </div>
    </div>
  );
}
