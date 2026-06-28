import { getApibayPortalConfig } from "../../lib/apibay-portal";
import { SECURITY_HEADERS } from "../../lib/security-headers";

interface Env {
  APIBAY_PORTAL_ORIGIN?: string;
  APIBAY_LOGOUT_PATH?: string;
  ACCOUNT_PORTAL_ORIGIN?: string;
}

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const config = getApibayPortalConfig(context.env as Record<string, string | undefined>);
  const logoutUrl = new URL(
    config.logoutPath.startsWith("/") ? config.logoutPath : `/${config.logoutPath}`,
    config.portalOrigin,
  );
  logoutUrl.searchParams.set("return_url", `${config.accountOrigin}/login`);

  const headers = new Headers(SECURITY_HEADERS);
  headers.set("Location", logoutUrl.toString());
  headers.append(
    "Set-Cookie",
    "account_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
  );

  return new Response(null, { status: 302, headers });
}

export async function onRequestPost(context: { env: Env }): Promise<Response> {
  return onRequestGet(context);
}
