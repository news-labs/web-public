import { Hono } from "hono";
import type { Env } from "../types/env.js";

const users = new Hono<{ Bindings: Env }>();

users.get("/", async (c) => {
  const rows = await c.env.WEB_ADMIN_DB.prepare(
    `SELECT user_id, email, role, status FROM admin_users ORDER BY created_at DESC`,
  ).all();
  return c.json({ users: rows.results ?? [] });
});

users.get("/me", (c) =>
  c.json({ auth: "api-key", role: "web_admin", portal: "web" }),
);

export { users };
