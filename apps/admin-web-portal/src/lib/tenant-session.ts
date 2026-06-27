/**
 * Tenant session management for web-admin-portal.
 * Webmaster and designer users log in via CP user-login endpoint.
 */

const WEB_SESSION_KEY = "nl_web_tenant_session";
const WEB_ACTIVE_TENANT_KEY = "nl_web_active_tenant";

export interface WebTenantInfo {
  tenant_id: string;
  slug: string;
  display_name: string;
  apex_domain: string | null;
  country_code: string | null;
  city_code: string | null;
  worker_url: string | null;
  roles: string[];
}

export interface WebTenantSession {
  token: string;
  user: { user_id: string; email: string; name: string | null };
  tenants: WebTenantInfo[];
}

export function saveWebTenantSession(session: WebTenantSession): void {
  localStorage.setItem(WEB_SESSION_KEY, JSON.stringify(session));
}

export function loadWebTenantSession(): WebTenantSession | null {
  try {
    const raw = localStorage.getItem(WEB_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WebTenantSession;
  } catch {
    return null;
  }
}

export function clearWebTenantSession(): void {
  localStorage.removeItem(WEB_SESSION_KEY);
  localStorage.removeItem(WEB_ACTIVE_TENANT_KEY);
}

export function saveWebActiveTenant(tenantId: string): void {
  localStorage.setItem(WEB_ACTIVE_TENANT_KEY, tenantId);
}

export function loadWebActiveTenantId(): string | null {
  return localStorage.getItem(WEB_ACTIVE_TENANT_KEY);
}

export function getWebTenantApiHeaders(tenantId: string): HeadersInit {
  const session = loadWebTenantSession();
  return {
    Authorization: `Bearer ${session?.token ?? ""}`,
    "X-Tenant-Id": tenantId,
    "Content-Type": "application/json",
  };
}

/** Login using the CP platform_user endpoint (shared with editor-portal). */
export async function loginWebTenantUser(
  cpApiBaseUrl: string,
  email: string,
  password: string,
): Promise<WebTenantSession> {
  const res = await fetch(`${cpApiBaseUrl}/api/v1/auth/user-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Login failed" })) as { error?: string };
    throw new Error(err.error ?? "Login failed");
  }

  const data = await res.json() as WebTenantSession;

  // Filter to only show designer/webmaster relevant tenants
  const webTenants = data.tenants.filter((t) =>
    t.roles.some((r) => ["webmaster", "designer"].includes(r)),
  );

  const session = { ...data, tenants: webTenants };
  saveWebTenantSession(session);
  return session;
}
