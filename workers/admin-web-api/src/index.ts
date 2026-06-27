import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types/env.js";
import { requireWebAdmin } from "./middleware/auth.js";
import { auth } from "./routes/auth.js";
import { sites } from "./routes/sites.js";
import { deploy } from "./routes/deploy.js";
import { schedule } from "./routes/schedule.js";
import { design } from "./routes/design.js";
import { content } from "./routes/content.js";
import { redirects } from "./routes/redirects.js";
import { oauth } from "./routes/oauth.js";
import { users } from "./routes/users.js";

const app = new Hono<{ Bindings: Env }>();
app.use("*", cors());

app.get("/health", (c) =>
  c.json({ status: "ok", service: "nl-web-admin-portal-api", env: c.env.ENVIRONMENT }),
);

app.route("/api/v1/auth", auth);
app.route("/api/v1/oauth", oauth);
app.use("/api/*", requireWebAdmin);
app.route("/api/v1/users", users);
app.route("/api/v1/sites", sites);
app.route("/api/v1/deploy", deploy);
app.route("/api/v1/schedule", schedule);
app.route("/api/v1/design", design);
app.route("/api/v1/content", content);
app.route("/api/v1/redirects", redirects);

app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

app.onError((err, c) => {
  console.error("[admin-web-api]", err);
  return c.json({ error: "Internal error" }, 500);
});

export default app;
