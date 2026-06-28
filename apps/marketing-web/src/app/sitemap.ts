import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/blog-posts";

export const dynamic = "force-static";

const BASE_URL = "https://www.newsfork.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: "/", changeFrequency: "weekly" as const, priority: 1.0 },
    { url: "/product/", changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "/pricing/", changeFrequency: "monthly" as const, priority: 0.9 },
    { url: "/docs/", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: "/blog/", changeFrequency: "weekly" as const, priority: 0.7 },
    { url: "/about/", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: "/contact/", changeFrequency: "yearly" as const, priority: 0.5 },
    { url: "/developers/system-status/", changeFrequency: "weekly" as const, priority: 0.5 },
  ];

  const blogRoutes = getAllSlugs().map((slug) => ({
    url: `/blog/${slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
