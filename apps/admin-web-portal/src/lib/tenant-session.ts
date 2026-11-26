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

/** Email (ID) + password login for webmaster / designer tenant users. */
export async function loginWebTenantPassword(
  cpApiBaseUrl: string,
  email: string,
  password: string,
  turnstileToken?: string | null,
): Promise<WebTenantSession> {
  const res = await fetch(`${cpApiBaseUrl}/api/v1/auth/password/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      audience: "tenant",
      ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
    }),
  });

  if (res.status === 403) throw new Error("Security check failed. Try again.");

  if (res.status === 429) throw new Error("Too many attempts. Try again in a few minutes.");
  if (!res.ok) {
    throw new Error("Invalid email or password");
  }

  const data = (await res.json()) as WebTenantSession & { session_token?: string; token?: string };
  const token = data.token ?? data.session_token ?? "";
  const tenants = (data.tenants ?? []).filter((t) =>
    t.roles.some((r) => ["webmaster", "designer"].includes(r)),
  );

  const session: WebTenantSession = {
    token,
    user: data.user,
    tenants,
  };
  saveWebTenantSession(session);
  return session;
}

/** @deprecated Use loginWebTenantPassword. */
export const loginWebTenantUser = loginWebTenantPassword;
