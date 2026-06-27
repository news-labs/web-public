/**
 * Media asset library — R2-backed image management with scope.
 */

import { Hono } from "hono";
import type { Env } from "../types/env.js";

const media = new Hono<{ Bindings: Env }>();

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

media.get("/", async (c) => {
  const scopeType = c.req.query("scopeType");
  const scopeId = c.req.query("scopeId");
  const assetType = c.req.query("assetType");
  let sql = "SELECT * FROM media_assets WHERE 1=1";
  const binds: string[] = [];
  if (scopeType) {
    sql += " AND scope_type = ?";
    binds.push(scopeType);
  }
  if (scopeId) {
    sql += " AND scope_id = ?";
    binds.push(scopeId);
  }
  if (assetType) {
    sql += " AND asset_type = ?";
    binds.push(assetType);
  }
  sql += " ORDER BY created_at DESC LIMIT 200";
  const { results } = await c.env.WEB_ADMIN_DB.prepare(sql).bind(...binds).all();
  return c.json({ items: results ?? [] });
});

media.post("/upload", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file");
  const scopeType = String(form.get("scopeType") ?? "brand");
  const scopeId = String(form.get("scopeId") ?? "default");
  const assetType = String(form.get("assetType") ?? "image");

  if (!file || typeof file === "string") {
    return c.json({ error: "file required" }, 400);
  }

  const uploadFile = file as File;

  const assetId = id("media");
  const r2Key = `assets/${scopeType}/${scopeId}/${assetId}_${uploadFile.name}`;
  const ts = now();

  if (c.env.MEDIA_R2) {
    await c.env.MEDIA_R2.put(r2Key, await uploadFile.arrayBuffer(), {
      httpMetadata: { contentType: uploadFile.type || "application/octet-stream" },
    });
  }

  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO media_assets (asset_id, scope_type, scope_id, asset_type, filename, r2_key, public_url, mime_type, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      assetId,
      scopeType,
      scopeId,
      assetType,
      uploadFile.name,
      r2Key,
      c.env.MEDIA_R2 ? `/${r2Key}` : null,
      uploadFile.type || null,
      ts,
      ts,
    )
    .run();

  return c.json({ ok: true, asset_id: assetId, r2_key: r2Key }, 201);
});

media.delete("/:assetId", async (c) => {
  const assetId = c.req.param("assetId");
  const row = await c.env.WEB_ADMIN_DB.prepare("SELECT r2_key FROM media_assets WHERE asset_id = ?")
    .bind(assetId)
    .first<{ r2_key: string }>();
  if (!row) return c.json({ error: "Not found" }, 404);
  if (c.env.MEDIA_R2 && row.r2_key) {
    await c.env.MEDIA_R2.delete(row.r2_key);
  }
  await c.env.WEB_ADMIN_DB.prepare("DELETE FROM media_assets WHERE asset_id = ?").bind(assetId).run();
  return c.json({ ok: true });
});

export { media };
