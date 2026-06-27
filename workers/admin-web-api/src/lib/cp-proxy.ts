import type { Env } from "../types/env.js";

export function resolveCpServiceToken(env: Env): string | undefined {
  return env.CP_SERVICE_TOKEN ?? env.WEB_ADMIN_API_KEY;
}

export async function proxyToCp(
  env: Env,
  request: Request,
  cpPath: string,
): Promise<Response> {
  const base = (env.CP_API_BASE_URL ?? "").replace(/\/$/, "");
  if (!base) {
    return new Response(JSON.stringify({ error: "CP_API_BASE_URL not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const targetUrl = `${base}${cpPath}${url.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);

  const serviceToken = resolveCpServiceToken(env);
  if (serviceToken) {
    headers.set("Authorization", `Bearer ${serviceToken}`);
  }

  const res = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    signal: AbortSignal.timeout(20000),
  });

  return new Response(res.body, { status: res.status, headers: res.headers });
}
