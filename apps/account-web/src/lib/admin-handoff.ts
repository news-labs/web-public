/**
 * F4 — build Admin / ops return targets for account.newsfork.com → CP handoff.
 * Actual mint/consume happens on control-plane `/api/v1/auth/handoff/*`.
 */

export const ADMIN_ORIGIN = "https://admin.newsfork.com";
export const CMS_ORIGIN = "https://cms.newsfork.com";
export const CP_AUTH_BASE = `${ADMIN_ORIGIN}/api/v1/auth`;

const OPS_HOST_RE = /^ops\.[a-z0-9.-]+\.[a-z]{2,}$/i;

export function adminTenantPath(brandId: string, suffix = "/domain"): string {
  const id = brandId.trim();
  const path = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${ADMIN_ORIGIN}/t/${encodeURIComponent(id)}${path}`;
}

export function opsDomainPath(brandDomain: string, suffix = "/domain"): string {
  const host = brandDomain.trim().toLowerCase().replace(/^ops\./, "");
  const path = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `https://ops.${host}${path}`;
}

export function isAllowedAdminReturnUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    if (u.origin === ADMIN_ORIGIN || u.origin === CMS_ORIGIN) return true;
    return OPS_HOST_RE.test(u.hostname);
  } catch {
    return false;
  }
}

/** Query string for account login that returns into Admin/ops after OTP. */
export function accountLoginWithReturn(redirectTo: string): string {
  if (!isAllowedAdminReturnUrl(redirectTo)) {
    throw new Error("redirect_not_allowed");
  }
  const url = new URL("/login", "https://account.newsfork.com");
  url.searchParams.set("return_url", redirectTo);
  return url.toString();
}
