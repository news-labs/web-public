import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../types/env.js";

const content = new Hono<{ Bindings: Env }>();

content.get("/", async (c) => {
  const siteId = new URL(c.req.url).searchParams.get("siteId");
  const query = siteId
    ? `SELECT page_id, site_id, slug, title, status, updated_at FROM content_pages WHERE site_id = ? ORDER BY updated_at DESC`
    : `SELECT page_id, site_id, slug, title, status, updated_at FROM content_pages ORDER BY updated_at DESC LIMIT 100`;
  const rows = siteId
    ? await c.env.WEB_ADMIN_DB.prepare(query).bind(siteId).all()
    : await c.env.WEB_ADMIN_DB.prepare(query).all();
  return c.json({ items: rows.results ?? [] });
});

content.post("/", zValidator("json", z.object({
  siteId: z.string(),
  slug: z.string(),
  title: z.string(),
  body: z.string().optional(),
})), async (c) => {
  const body = c.req.valid("json");
  const timestamp = new Date().toISOString();
  const pageId = crypto.randomUUID();
  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO content_pages (page_id, site_id, slug, title, body, status, updated_at)
     VALUES (?, ?, ?, ?, ?, 'draft', ?)`,
  )
    .bind(pageId, body.siteId, body.slug, body.title, body.body ?? "", timestamp)
    .run();
  return c.json({ ok: true, pageId });
});

export { content };
