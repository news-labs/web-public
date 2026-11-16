import {
  callGateway,
  clearSessionCookie,
  isSameOrigin,
  readSessionCookie,
  sessionCookie,
  type GatewayEnv,
} from "../../lib/gateway";
import { SECURITY_HEADERS } from "../../lib/security-headers";
import { getApibayPortalConfig, sanitizeReturnUrl } from "../../lib/apibay-portal";

interface Context {
  request: Request;
  env: GatewayEnv & Record<string, unknown>;
  params: { path?: string[] | string };
}

function respond(body: unknown, status: number, extraHeaders: Record<string, string> = {}): Response {
  const headers = new Headers({ ...SECURITY_HEADERS, "cache-control": "no-store", ...extraHeaders });
  headers.set("content-type", "application/json");
  return new Response(JSON.stringify(body), { status, headers });
}

async function relay(
  res: Response,
  extraHeaders: Record<string, string> = {},
  clearOnUnauthorized = false,
): Promise<Response> {
  const body = await res.json().catch(() => ({ error: "bad_gateway_response" }));
  const headers: Record<string, string> = { ...extraHeaders };
  const retryAfter = res.headers.get("retry-after");
  if (retryAfter) headers["retry-after"] = retryAfter;
  if (clearOnUnauthorized && res.status === 401) headers["set-cookie"] = clearSessionCookie();
  return respond(body, res.status, headers);
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = (await request.json()) as unknown;
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * `/api/account/*` BFF: keeps the gateway session token in an HttpOnly cookie and
 * forwards whitelisted calls to `api.newsfork.com/v1/account/*`.
 */
export async function onRequest(context: Context): Promise<Response> {
  const { request, env } = context;
  const segments = Array.isArray(context.params.path)
    ? context.params.path
    : context.params.path
      ? [context.params.path]
      : [];
  const route = segments.join("/");
  const method = request.method.toUpperCase();

  if (method !== "GET" && !isSameOrigin(request)) {
    return respond({ error: "forbidden_origin" }, 403);
  }

  if (method === "POST" && route === "otp") {
    const body = await readBody(request);
    return relay(await callGateway(env, "/v1/account/auth/otp", { method, body: { email: body.email } }));
  }

  if (method === "POST" && route === "verify") {
    const body = await readBody(request);
    const res = await callGateway(env, "/v1/account/auth/verify", {
      method,
      body: { email: body.email, code: body.code, name: body.name, company: body.company },
    });
    const data = (await res.json().catch(() => ({}))) as { sessionToken?: string; [k: string]: unknown };
    if (!res.ok || !data.sessionToken) return respond(data, res.status === 200 ? 502 : res.status);
    const { sessionToken, ...rest } = data;
    const config = getApibayPortalConfig(env as Record<string, string | undefined>);
    const next =
      typeof body.returnUrl === "string"
        ? sanitizeReturnUrl(body.returnUrl, config.accountOrigin, config.extraReturnHosts)
        : null;
    return respond({ ...rest, next }, 200, { "set-cookie": sessionCookie(sessionToken) });
  }

  if (method === "GET" && route === "plans") {
    return relay(await callGateway(env, "/v1/plans"));
  }

  const sessionToken = readSessionCookie(request);
  if (!sessionToken) return respond({ error: "unauthorized" }, 401);

  if (method === "POST" && route === "logout") {
    await callGateway(env, "/v1/account/auth/logout", { method, sessionToken, body: {} });
    return respond({ ok: true }, 200, { "set-cookie": clearSessionCookie() });
  }

  let target: { path: string; method: string; body?: unknown } | null = null;
  if (method === "GET" && route === "me") target = { path: "/v1/account/me", method };
  else if (method === "GET" && route === "usage") {
    const days = new URL(request.url).searchParams.get("days") ?? "30";
    target = { path: `/v1/account/usage?days=${encodeURIComponent(days)}`, method };
  } else if (method === "GET" && route === "keys") target = { path: "/v1/account/keys", method };
  else if (method === "POST" && route === "keys") {
    const body = await readBody(request);
    target = { path: "/v1/account/keys", method, body: { label: body.label } };
  } else if (method === "GET" && route === "billing") target = { path: "/v1/account/billing", method };
  else if (method === "POST" && route === "billing/checkout") {
    const body = await readBody(request);
    target = { path: "/v1/account/billing/checkout", method, body: { plan: body.plan } };
  } else if (method === "POST" && route === "billing/portal") {
    target = { path: "/v1/account/billing/portal", method, body: {} };
  } else if (method === "DELETE" && segments.length === 2 && segments[0] === "keys") {
    target = { path: `/v1/account/keys/${encodeURIComponent(segments[1]!)}`, method };
  }
  if (!target) return respond({ error: "not_found" }, 404);

  return relay(await callGateway(env, target.path, { ...target, sessionToken }), {}, true);
}
