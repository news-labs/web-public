/**
 * Analytics aggregation — diaspora stats + placeholder CF metrics.
 */

import { Hono } from "hono";
import type { Env } from "../types/env.js";
import { proxyToCp } from "../lib/cp-proxy.js";

const analytics = new Hono<{ Bindings: Env }>();

analytics.get("/overview", async (c) => {
  const brandId = c.req.query("brandId");
  const regionCode = c.req.query("regionCode");
  const days = Number(c.req.query("days") ?? "7");

  let diasporaStats: Record<string, unknown> = {};
  try {
    const res = await proxyToCp(c.env, new Request("http://local/api/v1/diaspora/admin/stats"), "/api/v1/diaspora/admin/stats");
    if (res.ok) diasporaStats = (await res.json()) as Record<string, unknown>;
  } catch {
    /* upstream optional in dev */
  }

  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toISOString().slice(0, 10),
      pageviews: Math.floor(8000 + Math.random() * 4000),
      unique_visitors: Math.floor(2000 + Math.random() * 1500),
    };
  });

  return c.json({
    brand_id: brandId ?? null,
    region_code: regionCode ?? null,
    summary: {
      pageviews_7d: series.reduce((s, r) => s + r.pageviews, 0),
      unique_visitors_7d: series.reduce((s, r) => s + r.unique_visitors, 0),
      publish_count_today: (diasporaStats.published_today as number) ?? 0,
      build_success_rate: (diasporaStats.build_success_rate as number) ?? 0.98,
    },
    series,
    diaspora: diasporaStats,
  });
});

analytics.get("/regions", async (c) => {
  const res = await proxyToCp(
    c.env,
    new Request("http://local/api/v1/diaspora/regions"),
    "/api/v1/diaspora/regions",
  );
  if (!res.ok) {
    return c.json({ items: [] });
  }
  const data = (await res.json()) as { regions?: Array<Record<string, unknown>> };
  const items = (data.regions ?? []).map((r) => ({
    city_code: r.city_code,
    city_name: r.city_name,
    country_iso: r.country_iso,
    pageviews_7d: Math.floor(1000 + Math.random() * 5000),
    articles_published: Math.floor(50 + Math.random() * 200),
  }));
  return c.json({ items });
});

analytics.get("/languages", async (c) => {
  return c.json({
    items: [
      { locale: "en", pageviews_7d: 42000, share: 0.42 },
      { locale: "ko", pageviews_7d: 28000, share: 0.28 },
      { locale: "ja", pageviews_7d: 15000, share: 0.15 },
      { locale: "zh", pageviews_7d: 15000, share: 0.15 },
    ],
  });
});

analytics.get("/web-vitals", async (c) => {
  const domain = c.req.query("domain");
  return c.json({
    domain: domain ?? "all",
    lcp_p75: 2.1,
    inp_p75: 180,
    cls_p75: 0.08,
    status: "good",
  });
});

analytics.get("/content-index", async (c) => {
  const cursor = c.req.query("cursor");
  const limit = Math.min(Number(c.req.query("limit") ?? "50"), 100);
  const brandId = c.req.query("brandId");
  const regionCode = c.req.query("regionCode");

  const path = `/api/v1/diaspora/admin/published-articles?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}${brandId ? `&brand_id=${encodeURIComponent(brandId)}` : ""}${regionCode ? `&city_code=${encodeURIComponent(regionCode)}` : ""}`;
  const res = await proxyToCp(c.env, new Request(`http://local${path}`), path);
  if (!res.ok) {
    return c.json({ items: [], next_cursor: null, total_estimate: 0 });
  }
  const data = (await res.json()) as {
    articles?: Array<Record<string, unknown>>;
    next_cursor?: string;
    count?: number;
  };
  return c.json({
    items: (data.articles ?? []).map((a) => ({
      slug: a.slug,
      title: a.title,
      locale: a.locale ?? a.target_language,
      region: a.city_code,
      category: a.category,
      status: a.status ?? "published",
      published_at: a.published_at,
      build_id: a.build_id,
      r2_path: a.r2_path,
    })),
    next_cursor: data.next_cursor ?? null,
    total_estimate: data.count ?? null,
  });
});

export { analytics };
