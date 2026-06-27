import type { MiddlewareHandler } from "hono";
import type { Env } from "../types/env.js";
import { verifySessionToken } from "../lib/crypto.js";

const PORTAL_ROLES = new Set(["web_admin", "admin"]);

export const requireWebAdmin: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  if (c.env.ENVIRONMENT !== "production" && !c.env.WEB_ADMIN_API_KEY) {
    await next();
    return;
  }

  const authHeader = c.req.header("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expected = c.env.WEB_ADMIN_API_KEY;
  const sessionSecret = c.env.INTERNAL_SIG_SECRET ?? expected;

  if (authHeader && sessionSecret) {
    const session = await verifySessionToken(authHeader, sessionSecret);
    if (session && PORTAL_ROLES.has(session.role)) {
      c.header("X-Session-User", session.email ?? session.sub ?? "oauth");
      await next();
      return;
    }
  }

  if (!authHeader || authHeader !== expected) {
    return c.json({ error: "Web admin access required" }, 401);
  }

  await next();
};
