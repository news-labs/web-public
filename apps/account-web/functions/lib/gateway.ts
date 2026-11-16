/** BFF → nl-api-gateway account API (service binding in prod, HTTPS fallback). */

export interface GatewayEnv {
  GATEWAY?: { fetch(input: Request | string, init?: RequestInit): Promise<Response> };
  API_PUBLIC_ORIGIN?: string;
}

export const SESSION_COOKIE = "nf_account_session";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export function readSessionCookie(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  for (const part of cookie.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) {
      const value = rest.join("=");
      return /^nf_sess_[0-9a-f]{64}$/.test(value) ? value : null;
    }
  }
  return null;
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function callGateway(
  env: GatewayEnv,
  path: string,
  init: { method?: string; body?: unknown; sessionToken?: string | null } = {},
): Promise<Response> {
  const origin = (env.API_PUBLIC_ORIGIN ?? "https://api.newsfork.com").replace(/\/$/, "");
  const headers: Record<string, string> = { accept: "application/json" };
  if (init.body !== undefined) headers["content-type"] = "application/json";
  if (init.sessionToken) headers.authorization = `Bearer ${init.sessionToken}`;
  const request = new Request(`${origin}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  try {
    return env.GATEWAY ? await env.GATEWAY.fetch(request) : await fetch(request);
  } catch {
    return Response.json({ error: "gateway_unavailable" }, { status: 502 });
  }
}

/** Same-origin check for state-changing BFF calls (cookie auth ⇒ CSRF guard). */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
