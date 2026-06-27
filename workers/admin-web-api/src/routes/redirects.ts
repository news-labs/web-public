import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../types/env.js";

const redirects = new Hono<{ Bindings: Env }>();

redirects.get("/", async (c) => {
  const siteId = new URL(c.req.url).searchParams.get("siteId");
  const rows = siteId
    ? await c.env.WEB_ADMIN_DB.prepare(
        `SELECT rule_id, site_id, from_path, to_path, status_code, updated_at FROM redirect_rules WHERE site_id = ? ORDER BY updated_at DESC`,
      )
        .bind(siteId)
        .all()
    : await c.env.WEB_ADMIN_DB.prepare(
        `SELECT rule_id, site_id, from_path, to_path, status_code, updated_at FROM redirect_rules ORDER BY updated_at DESC LIMIT 100`,
      ).all();

  return c.json({
    items: rows.results ?? [],
    files: [
      { site: "public-docs", path: "apps/public-docs/public/_redirects" },
      { site: "marketing-web", path: "apps/marketing-web/public/_redirects" },
    ],
  });
});

redirects.post("/", zValidator("json", z.object({
  siteId: z.string(),
  fromPath: z.string(),
  toPath: z.string(),
  statusCode: z.number().int().default(301),
})), async (c) => {
  const body = c.req.valid("json");
  const timestamp = new Date().toISOString();
  const ruleId = crypto.randomUUID();
  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO redirect_rules (rule_id, site_id, from_path, to_path, status_code, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(ruleId, body.siteId, body.fromPath, body.toPath, body.statusCode, timestamp, timestamp)
    .run();
  return c.json({ ok: true, ruleId });
});

redirects.delete("/:ruleId", async (c) => {
  await c.env.WEB_ADMIN_DB.prepare(`DELETE FROM redirect_rules WHERE rule_id = ?`)
    .bind(c.req.param("ruleId"))
    .run();
  return c.json({ ok: true });
});

export { redirects };
