import type { Context } from "hono";
import type { Env } from "../types/env.js";

function cpBase(env: Env): string {
  return (
    env.CP_API_BASE_URL ??
    env.ADMIN_GATEWAY_URL ??
    "https://nl-api-cp.newsfork.workers.dev"
  ).replace(/\/$/, "");
}

/** Proxy legacy BFF verify to Control Plane auth v2. */
export async function proxyAuthVerifyToCp(c: Context<{ Bindings: Env }>, portal: "web" | "editor") {
  const authHeader = c.req.header("Authorization") ?? "";
  const res = await fetch(`${cpBase(c.env)}/api/v1/auth/verify`, {
    headers: { Authorization: authHeader },
    signal: AbortSignal.timeout(10_000),
  });

  const body = (await res.json().catch(() => ({ error: "Invalid control plane response" }))) as Record<
    string,
    unknown
  >;

  if (!res.ok) {
    return c.json(body, res.status as 401);
  }

  return c.json({
    ...body,
    portal_legacy: portal,
    verify_source: "cp_gateway",
    deprecated: "Use Admin Gateway /api/v1/auth/verify directly",
  });
}
