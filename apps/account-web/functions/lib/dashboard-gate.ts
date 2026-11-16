import { readSessionCookie } from "./gateway";
import { redirectWithSecurityHeaders } from "./security-headers";

/** Paths that require an `nf_account_session` cookie. */
export function isSessionProtectedPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === "/" || path === "/dashboard" || path.startsWith("/dashboard/");
}

/**
 * Same-origin dashboard deep-link after OTP (`/login/?next=/dashboard/keys/`).
 * Rejects protocol-relative and off-site values.
 */
export function sanitizeDashboardNext(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/dashboard")) return null;
  if (trimmed.includes("//") || trimmed.includes("\\") || trimmed.includes("@")) return null;
  try {
    const url = new URL(trimmed, "https://account.newsfork.com");
    if (url.origin !== "https://account.newsfork.com") return null;
    if (!url.pathname.startsWith("/dashboard")) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

/** Edge gate for static dashboard HTML — avoid unauthenticated shell flash. */
export function gateDashboardRequest(request: Request): Response | null {
  const url = new URL(request.url);
  if (!isSessionProtectedPath(url.pathname)) return null;

  const session = readSessionCookie(request);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return redirectWithSecurityHeaders(session ? "/dashboard/" : "/login/");
  }

  if (!session) {
    const login = new URL("/login/", url.origin);
    const next = sanitizeDashboardNext(`${url.pathname}${url.search}`);
    if (next) login.searchParams.set("next", next);
    return redirectWithSecurityHeaders(login.toString());
  }

  return null;
}
