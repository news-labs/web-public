/**
 * GitHub integration — template repo CI triggers and run listing.
 */

import { Hono } from "hono";
import type { Env } from "../types/env.js";

const integrations = new Hono<{ Bindings: Env }>();

async function githubFetch(env: Env, path: string, init?: RequestInit): Promise<Response> {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "GITHUB_TOKEN not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
}

integrations.get("/github/repos", async (c) => {
  const repo = c.env.GITHUB_REPO;
  const [owner, name] = repo.split("/");
  const res = await githubFetch(c.env, `/repos/${owner}/${name}`);
  if (!res.ok) {
    return c.json({
      items: [{ repo, branch: "main", last_tag: null, url: `https://github.com/${repo}` }],
    });
  }
  const data = (await res.json()) as { default_branch?: string; html_url?: string };
  const tagsRes = await githubFetch(c.env, `/repos/${owner}/${name}/tags?per_page=1`);
  const tags = tagsRes.ok ? ((await tagsRes.json()) as Array<{ name: string }>) : [];
  return c.json({
    items: [
      {
        repo,
        branch: data.default_branch ?? "main",
        last_tag: tags[0]?.name ?? null,
        url: data.html_url ?? `https://github.com/${repo}`,
      },
    ],
  });
});

integrations.get("/github/runs", async (c) => {
  const repo = c.env.GITHUB_REPO;
  const [owner, name] = repo.split("/");
  const workflow = c.req.query("workflow") ?? c.env.GITHUB_WORKFLOW_DEPLOY_TEMPLATE ?? "deploy-template.yml";
  const res = await githubFetch(
    c.env,
    `/repos/${owner}/${name}/actions/workflows/${encodeURIComponent(workflow)}/runs?per_page=20`,
  );
  if (!res.ok) {
    return c.json({ items: [] });
  }
  const data = (await res.json()) as {
    workflow_runs?: Array<{
      id: number;
      status: string;
      conclusion: string | null;
      head_branch: string;
      created_at: string;
      html_url: string;
    }>;
  };
  return c.json({
    items: (data.workflow_runs ?? []).map((r) => ({
      run_id: String(r.id),
      status: r.status,
      conclusion: r.conclusion,
      branch: r.head_branch,
      created_at: r.created_at,
      url: r.html_url,
    })),
  });
});

integrations.post("/github/trigger-template-deploy", async (c) => {
  const body = (await c.req.json()) as { template_id?: string; ref?: string };
  const repo = c.env.GITHUB_REPO;
  const [owner, name] = repo.split("/");
  const workflow =
    c.env.GITHUB_WORKFLOW_DEPLOY_TEMPLATE ?? "deploy-template.yml";

  const res = await githubFetch(
    c.env,
    `/repos/${owner}/${name}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref: body.ref ?? "main",
        inputs: { template_id: body.template_id ?? "default" },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    return c.json({ error: "GitHub dispatch failed", details: err }, 502);
  }

  const ts = new Date().toISOString();
  await c.env.WEB_ADMIN_DB.prepare(
    `INSERT INTO change_history (event_id, event_type, entity_type, entity_id, summary, details_json, created_at)
     VALUES (?, 'template_deploy', 'template', ?, ?, ?, ?)`,
  )
    .bind(
      `evt_${crypto.randomUUID().slice(0, 8)}`,
      body.template_id ?? "default",
      `Triggered template deploy for ${body.template_id ?? "default"}`,
      JSON.stringify({ ref: body.ref ?? "main", workflow }),
      ts,
    )
    .run();

  return c.json({ ok: true, queued: true });
});

integrations.post("/webhooks/github", async (c) => {
  const body = (await c.req.json()) as {
    action?: string;
    workflow_run?: { id: number; conclusion?: string; head_branch?: string };
  };
  if (body.workflow_run?.conclusion === "success") {
    const ts = new Date().toISOString();
    await c.env.WEB_ADMIN_DB.prepare(
      `INSERT INTO template_versions (version_id, template_id, version, git_repo, git_ref, github_run_id, deployed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        `ver_${crypto.randomUUID().slice(0, 8)}`,
        "default",
        body.workflow_run.head_branch ?? "main",
        c.env.GITHUB_REPO,
        body.workflow_run.head_branch ?? "main",
        String(body.workflow_run.id),
        ts,
      )
      .run();
  }
  return c.json({ ok: true });
});

export { integrations };
