import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types/env.js";
import { requireWebAdmin } from "./middleware/auth.js";
import { requireWebTenantAuth } from "./middleware/tenant-web-auth.js";
import { auth } from "./routes/auth.js";
import { sites } from "./routes/sites.js";
import { deploy } from "./routes/deploy.js";
import { schedule } from "./routes/schedule.js";
import { design } from "./routes/design.js";
import { content } from "./routes/content.js";
import { redirects } from "./routes/redirects.js";
import { oauth } from "./routes/oauth.js";
import { users } from "./routes/users.js";
import { cpProxy } from "./routes/cp-proxy.js";
import { seo } from "./routes/seo.js";
import { media } from "./routes/media.js";
import { analytics } from "./routes/analytics.js";
import { integrations } from "./routes/integrations.js";
import { changeHistory } from "./routes/change-history.js";
import { mountLegacyGatewayRedirects } from "./lib/legacy-gateway-redirect.js";

const app = new Hono<{ Bindings: Env }>();
app.use("*", cors());

app.get("/health", (c) =>
  c.json({ status: "ok", service: "nl-web-admin-portal-api", env: c.env.ENVIRONMENT }),
);

app.route("/api/v1/auth", auth);
app.route("/api/v1/oauth", oauth);
// Enrich context with tenant info when X-Tenant-Id is present (webmaster/designer users)
app.use("/api/*", requireWebTenantAuth);
app.use("/api/*", requireWebAdmin);
app.route("/api/v1/users", users);
app.route("/api/v1/sites", sites);
app.route("/api/v1/deploy", deploy);
app.route("/api/v1/schedule", schedule);
app.route("/api/v1/design", design);
app.route("/api/v1/content", content);
app.route("/api/v1/redirects", redirects);
app.route("/api/v1", cpProxy);
app.route("/api/v1/seo", seo);
app.route("/api/v1/media", media);
app.route("/api/v1/analytics", analytics);
app.route("/api/v1/integrations", integrations);
app.route("/api/v1/history", changeHistory);

mountLegacyGatewayRedirects(app);
app.get("*", (c) => c.text("Not Found", 404));

app.onError((err, c) => {
  console.error("[admin-web-api]", err);
  return c.json({ error: "Internal error" }, 500);
});

export default app;
