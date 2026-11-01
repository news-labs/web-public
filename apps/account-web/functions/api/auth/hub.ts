/** Parent module so nested `/api/auth/hub/*` Pages Functions mount correctly. */
import { redirectWithSecurityHeaders } from "../../lib/security-headers";

export async function onRequestGet(context: { request: Request }): Promise<Response> {
  const url = new URL(context.request.url);
  url.pathname = "/api/auth/push-callback";
  return redirectWithSecurityHeaders(url.toString());
}
