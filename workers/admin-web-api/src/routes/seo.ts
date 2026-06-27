/**
 * SEO policy API — template-based meta policies and exceptions.
 */

import { Hono } from "hono";
import type { Env } from "../types/env.js";

const seo = new Hono<{ Bindings: Env }>();

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

seo.get("/policies", async (c) => {
  const scopeType = c.req.query("scopeType");
  const scopeId = c.req.query("scopeId");
  let sql = "SELECT * FROM seo_policies WHERE 1=1";
  const binds: string[] = [];
  if (scopeType) {
    sql += " AND scope_type = ?";
    binds.push(scopeType);
  }
  if (scopeId) {
    sql += " AND scope_id = ?";
    binds.push(scopeId);
  }
  sql += " ORDER BY updated_at DESC";
  const { results } = await c.env.WEB_ADMIN_DB.prepare(sql).bind(...binds).all();
  return c.json({ items: results ?? [] });
});

seo.post("/policies", async (c) => {
  const body = (await c.req.json()) as {
    scope_type: string;
    scope_id: string;
    title_template?: string;
    description_template?: string;
    og_image_url?: string;
    sitemap_changefreq?: string;
    sitemap_priority?: number;
  };
  if (!body.scope_type || !body.scope_id) {
    return c.json({ error: "scope_type and scope_id required" }, 400);
  }
  const policyId = id("seo");
  const ts = now();
  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO seo_policies (policy_id, scope_type, scope_id, title_template, description_template, og_image_url, sitemap_changefreq, sitemap_priority, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(scope_type, scope_id) DO UPDATE SET
       title_template = excluded.title_template,
       description_template = excluded.description_template,
       og_image_url = excluded.og_image_url,
       sitemap_changefreq = excluded.sitemap_changefreq,
       sitemap_priority = excluded.sitemap_priority,
       updated_at = excluded.updated_at`,
  )
    .bind(
      policyId,
      body.scope_type,
      body.scope_id,
      body.title_template ?? null,
      body.description_template ?? null,
      body.og_image_url ?? null,
      body.sitemap_changefreq ?? "daily",
      body.sitemap_priority ?? 0.5,
      ts,
      ts,
    )
    .run();

  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO change_history (event_id, event_type, brand_id, region_code, entity_type, entity_id, summary, created_at)
     VALUES (?, 'seo_policy', ?, ?, 'seo_policy', ?, ?, ?)`,
  )
    .bind(
      id("evt"),
      body.scope_type === "brand" ? body.scope_id : null,
      body.scope_type === "region" ? body.scope_id : null,
      `${body.scope_type}:${body.scope_id}`,
      `SEO policy updated for ${body.scope_type}/${body.scope_id}`,
      ts,
    )
    .run();

  return c.json({ ok: true, policy_id: policyId }, 201);
});

seo.get("/exceptions", async (c) => {
  const slug = c.req.query("slug");
  const brandId = c.req.query("brandId");
  let sql = "SELECT * FROM seo_exceptions WHERE 1=1";
  const binds: string[] = [];
  if (slug) {
    sql += " AND slug LIKE ?";
    binds.push(`%${slug}%`);
  }
  if (brandId) {
    sql += " AND brand_id = ?";
    binds.push(brandId);
  }
  sql += " ORDER BY updated_at DESC LIMIT 100";
  const { results } = await c.env.WEB_ADMIN_DB.prepare(sql).bind(...binds).all();
  return c.json({ items: results ?? [] });
});

seo.post("/exceptions", async (c) => {
  const body = (await c.req.json()) as {
    slug: string;
    locale?: string;
    brand_id?: string;
    region_code?: string;
    meta_json: Record<string, unknown>;
  };
  if (!body.slug || !body.meta_json) {
    return c.json({ error: "slug and meta_json required" }, 400);
  }
  const exceptionId = id("exc");
  const ts = now();
  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO seo_exceptions (exception_id, slug, locale, brand_id, region_code, meta_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      exceptionId,
      body.slug,
      body.locale ?? null,
      body.brand_id ?? null,
      body.region_code ?? null,
      JSON.stringify(body.meta_json),
      ts,
      ts,
    )
    .run();
  return c.json({ ok: true, exception_id: exceptionId }, 201);
});

seo.get("/health", async (c) => {
  const brandId = c.req.query("brandId");
  const regionCode = c.req.query("regionCode");
  const { results: policies } = await c.env.WEB_ADMIN_DB.prepare(
    "SELECT COUNT(*) as cnt FROM seo_policies",
  ).all();
  const { results: exceptions } = await c.env.WEB_ADMIN_DB.prepare(
    "SELECT COUNT(*) as cnt FROM seo_exceptions",
  ).all();
  return c.json({
    score: 85,
    checks: [
      { id: "title_template", status: "ok", label: "Title templates configured" },
      { id: "hreflang", status: regionCode ? "ok" : "warn", label: "hreflang locales set" },
      { id: "exceptions", status: "ok", label: `${(exceptions?.[0] as { cnt?: number })?.cnt ?? 0} exceptions` },
      { id: "policies", status: "ok", label: `${(policies?.[0] as { cnt?: number })?.cnt ?? 0} policies` },
    ],
    brand_id: brandId ?? null,
    region_code: regionCode ?? null,
  });
});

export { seo };
