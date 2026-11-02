/**
 * Build Admin / CMS return targets for account.newsfork.com → CP handoff.
 * Actual mint/consume happens on control-plane `/api/v1/auth/handoff/*`.
 *
 * Brand Domain/Content entry is cms.newsfork.com only (ops.* and admin /t retired).
 */

export const ADMIN_ORIGIN = "https://admin.newsfork.com";
export const CMS_ORIGIN = "https://cms.newsfork.com";
export const CP_AUTH_BASE = `${ADMIN_ORIGIN}/api/v1/auth`;

/** Canonical brand Domain/Content path on CMS Portal. */
export function cmsBrandPath(brandId: string, suffix = "/domain"): string {
  const id = brandId.trim();
  const path = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `${CMS_ORIGIN}/${encodeURIComponent(id)}${path}`;
}

/** @deprecated Use cmsBrandPath — admin `/t/{brand}` redirects to cms. */
export function adminTenantPath(brandId: string, suffix = "/domain"): string {
  return cmsBrandPath(brandId, suffix);
}

/**
 * @deprecated ops.{brandDomain} entry retired.
 * Without a brandId mapping, send operators to CMS login.
 */
export function opsDomainPath(_brandDomain: string, _suffix = "/domain"): string {
  return `${CMS_ORIGIN}/login`;
}

export function isAllowedAdminReturnUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return u.origin === ADMIN_ORIGIN || u.origin === CMS_ORIGIN;
  } catch {
    return false;
  }
}

/** Query string for account login that returns into Admin/CMS after OTP. */
export function accountLoginWithReturn(redirectTo: string): string {
  if (!isAllowedAdminReturnUrl(redirectTo)) {
    throw new Error("redirect_not_allowed");
  }
  const url = new URL("/login", "https://account.newsfork.com");
  url.searchParams.set("return_url", redirectTo);
  return url.toString();
}
