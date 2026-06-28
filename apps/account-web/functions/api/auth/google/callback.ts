import { getApibayPortalConfig } from "../../lib/apibay-portal";
import { redirectWithSecurityHeaders } from "../../lib/security-headers";

interface Env {
  APIBAY_PORTAL_ORIGIN?: string;
  APIBAY_GOOGLE_OAUTH_PATH?: string;
  ACCOUNT_PORTAL_ORIGIN?: string;
}

/** Bridge callback: hand off to apibay canonical OAuth callback on api.newsfork.com */
export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const config = getApibayPortalConfig(context.env as Record<string, string | undefined>);
  const incoming = new URL(context.request.url);
  const callback = new URL("/oauth/google/callback", config.portalOrigin);
  for (const [key, value] of incoming.searchParams.entries()) {
    callback.searchParams.set(key, value);
  }
  callback.searchParams.set("account_origin", config.accountOrigin);
  return redirectWithSecurityHeaders(callback.toString());
}
