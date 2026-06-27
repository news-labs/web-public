import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS, getAllSlugs, getPostBySlug } from "@/data/blog-posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function renderParagraph(text: string) {
  if (text.startsWith("**") && text.includes("**")) {
    const parts = text.split("**");
    return (
      <p className="text-muted-foreground leading-relaxed mb-4">
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold text-foreground">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  }

  return <p className="text-muted-foreground leading-relaxed mb-4">{text}</p>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-20 md:py-28">
      <div className="container mx-auto max-w-3xl px-4">
        <Link
          href="/blog/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
            {post.category}
          </span>
          <time className="text-sm text-muted-foreground" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-balance">
          {post.title}
        </h1>

        <div className="prose prose-neutral max-w-none">
          {post.content.map((paragraph, index) => (
            <div key={index}>{renderParagraph(paragraph)}</div>
          ))}
        </div>
      </div>
    </article>
  );
}
