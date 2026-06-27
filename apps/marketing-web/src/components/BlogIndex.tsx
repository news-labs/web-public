"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogPost } from "@/data/blog-posts";

type BlogCategory = (typeof BLOG_CATEGORIES)[number];

function filterPosts(category: BlogCategory): BlogPost[] {
  if (category === "All") return BLOG_POSTS;
  return BLOG_POSTS.filter((post) => post.category === category);
}

export function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");
  const posts = useMemo(() => filterPosts(activeCategory), [activeCategory]);

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-12">
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === activeCategory
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts in this category yet.</p>
      ) : (
        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-border pb-10 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
                  {post.category}
                </span>
                <time className="text-xs text-muted-foreground" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3 hover:text-accent transition-colors">
                <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}/`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                Read more <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
