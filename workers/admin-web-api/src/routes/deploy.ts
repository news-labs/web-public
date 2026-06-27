import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { SITES, type Env } from "../types/env.js";

const deploy = new Hono<{ Bindings: Env }>();

deploy.post("/trigger", zValidator("json", z.object({
  siteId: z.string(),
  environment: z.enum(["staging", "production"]).default("staging"),
})), async (c) => {
  const { siteId, environment } = c.req.valid("json");
  const site = SITES.find((s) => s.id === siteId);
  if (!site) return c.json({ error: "Site not found" }, 404);

  const deployId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const workflowRunId = c.env.GITHUB_TOKEN
    ? await triggerWorkflow(c.env, site.workflow, environment)
    : null;

  const previewUrl = `https://${siteId}-${environment}.pages.dev`;
  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO deploy_history (deploy_id, site_id, environment, status, triggered_by, workflow_run_id, preview_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      deployId,
      siteId,
      environment,
      workflowRunId ? "triggered" : "queued",
      "api-key",
      workflowRunId,
      previewUrl,
      timestamp,
    )
    .run();

  return c.json({ ok: true, deployId, workflowRunId, previewUrl, siteId, environment });
});

deploy.get("/history", async (c) => {
  const rows = await c.env.WEB_ADMIN_DB.prepare(
    `SELECT deploy_id, site_id, environment, status, workflow_run_id, preview_url, created_at
     FROM deploy_history ORDER BY created_at DESC LIMIT 50`,
  ).all();
  return c.json({ items: rows.results ?? [] });
});

async function triggerWorkflow(env: Env, workflowFile: string, environment: string): Promise<string | null> {
  const [owner, repo] = env.GITHUB_REPO.split("/");
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFile}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main", inputs: { environment } }),
    },
  );
  if (!res.ok) return null;
  return `dispatched-${Date.now()}`;
}

export { deploy };
