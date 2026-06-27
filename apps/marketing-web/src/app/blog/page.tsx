import type { Metadata } from "next";
import { BlogIndex } from "@/components/BlogIndex";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Updates, engineering deep dives, and news intelligence insights from the Newsfork team.",
};

export default function BlogPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-14">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Updates, deep dives, and insights from the Newsfork team.
          </p>
        </div>

        <BlogIndex />
      </div>
    </section>
  );
}
