import { callGateway, clearSessionCookie, readSessionCookie, type GatewayEnv } from "../../lib/gateway";
import { SECURITY_HEADERS } from "../../lib/security-headers";

async function logout(context: { request: Request; env: GatewayEnv }): Promise<Response> {
  const token = readSessionCookie(context.request);
  if (token) {
    await callGateway(context.env, "/v1/account/auth/logout", { method: "POST", sessionToken: token, body: {} });
  }
  const headers = new Headers(SECURITY_HEADERS);
  headers.set("Location", "/login/");
  headers.append("Set-Cookie", clearSessionCookie());
  headers.append("Set-Cookie", "account_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return new Response(null, { status: 302, headers });
}

export const onRequestGet = logout;
export const onRequestPost = logout;
