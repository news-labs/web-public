import { Hono } from "hono";
import type { Env } from "../types/env.js";
import { createSessionToken } from "../lib/crypto.js";
import { gatewaySpaPath, oauthPublicOrigin } from "../lib/oauth-public-origin.js";

const oauth = new Hono<{ Bindings: Env }>();

oauth.get("/google/url", (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  if (!clientId) return c.json({ error: "Google OAuth not configured" }, 501);

  const origin = oauthPublicOrigin(c.env, c.req.url);
  const redirectUri = `${origin}/api/v1/oauth/google/callback`;
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });
  return c.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, redirectUri, state });
});

oauth.get("/google/callback", async (c) => {
  const code = new URL(c.req.url).searchParams.get("code");
  const clientId = c.env.GOOGLE_CLIENT_ID;
  const clientSecret = c.env.GOOGLE_CLIENT_SECRET;
  if (!code || !clientId || !clientSecret) {
    return c.json({ error: "OAuth misconfigured or missing code" }, 400);
  }

  const origin = oauthPublicOrigin(c.env, c.req.url);
  const redirectUri = `${origin}/api/v1/oauth/google/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return c.json({ error: "Token exchange failed" }, 502);

  const tokens = (await tokenRes.json()) as { access_token: string };
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!userRes.ok) return c.json({ error: "Userinfo failed" }, 502);
  const user = (await userRes.json()) as { sub: string; email: string; name?: string };

  const timestamp = new Date().toISOString();
  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO admin_users (user_id, email, role, google_id, status, created_at, last_login_at)
     VALUES (?, ?, 'web_admin', ?, 'active', ?, ?)
     ON CONFLICT(email) DO UPDATE SET last_login_at = excluded.last_login_at, google_id = excluded.google_id`,
  )
    .bind(user.sub, user.email, user.sub, timestamp, timestamp)
    .run();

  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO admin_audit_log (log_id, user_id, action, resource_type, resource_id, details, created_at)
     VALUES (?, ?, 'oauth_login', 'user', ?, ?, ?)`,
  )
    .bind(crypto.randomUUID(), user.email, user.sub, JSON.stringify({ portal: "web" }), timestamp)
    .run();

  const secret = c.env.INTERNAL_SIG_SECRET ?? c.env.WEB_ADMIN_API_KEY ?? "dev";
  const sessionToken = await createSessionToken(
    { sub: user.sub, email: user.email, role: "web_admin", portal: "web" },
    secret,
  );

  const spaBase = gatewaySpaPath(c.env, "ops/web");
  return c.redirect(`${spaBase}?session=${encodeURIComponent(sessionToken)}`);
});

export { oauth };
