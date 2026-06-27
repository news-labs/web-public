/**
 * Tenant-auth middleware for web-admin-api.
 * Validates webmaster/designer session tokens via CP /api/v1/auth/verify-tenant.
 * This middleware is ADDITIVE — the existing requireWebAdmin still handles API-key / admin sessions.
 */
import type { MiddlewareHandler } from "hono";
import type { Env } from "../types/env.js";

const WEB_ROLES = ["webmaster", "designer"] as const;
export type WebRole = (typeof WEB_ROLES)[number];

interface WebTenantAuthContext {
  tenantId: string;
  userId: string;
  email: string;
  roles: WebRole[];
}

declare module "hono" {
  interface ContextVariableMap {
    webTenantAuth: WebTenantAuthContext | null;
  }
}

export const requireWebTenantAuth: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const tenantId = c.req.header("X-Tenant-Id");
  const authHeader = c.req.header("Authorization")?.replace(/^Bearer\s+/i, "");

  if (!tenantId || !authHeader) {
    await next();
    return;
  }

  const cpBase = c.env.CP_API_BASE_URL?.replace(/\/$/, "");
  if (!cpBase) {
    await next();
    return;
  }

  try {
    const res = await fetch(`${cpBase}/api/v1/auth/verify-tenant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: authHeader,
        tenant_id: tenantId,
        required_roles: ["webmaster", "designer"],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json() as {
        user_id: string;
        email: string;
        tenant_id: string;
        roles: string[];
      };
      c.set("webTenantAuth", {
        tenantId: data.tenant_id,
        userId: data.user_id,
        email: data.email,
        roles: data.roles.filter((r): r is WebRole => WEB_ROLES.includes(r as WebRole)),
      });
    } else {
      c.set("webTenantAuth", null);
    }
  } catch {
    c.set("webTenantAuth", null);
  }

  await next();
};
