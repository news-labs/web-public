import { Hono } from "hono";
import type { Env } from "../types/env.js";
import { verifySessionToken } from "../lib/crypto.js";

const auth = new Hono<{ Bindings: Env }>();

auth.get("/verify", async (c) => {
  const authHeader = c.req.header("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expected = c.env.WEB_ADMIN_API_KEY;
  const sessionSecret = c.env.INTERNAL_SIG_SECRET ?? expected;

  if (c.env.ENVIRONMENT !== "production" && !expected) {
    return c.json({ ok: true, mode: "dev-bypass", portal: "web" });
  }

  if (authHeader && sessionSecret) {
    const session = await verifySessionToken(authHeader, sessionSecret);
    if (session && (session.role === "web_admin" || session.role === "admin")) {
      return c.json({ ok: true, portal: "web", mode: "session", email: session.email });
    }
  }

  if (!authHeader || authHeader !== expected) {
    return c.json({ error: "Invalid API key" }, 401);
  }

  return c.json({ ok: true, portal: "web", mode: "api_key" });
});

export { auth };
