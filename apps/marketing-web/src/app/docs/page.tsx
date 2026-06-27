import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Code2, FileJson, Globe, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "@/data/home-content";

export const metadata: Metadata = {
  title: "Docs",
  description: "Newsfork API documentation, guides, and references.",
};

const DOC_SECTIONS = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Get your first API response in under 5 minutes.",
    href: "https://docs.newsfork.com/getting-started/",
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Complete REST API reference with request/response examples.",
    href: "https://docs.newsfork.com/v1/api/category-reference/",
  },
  {
    icon: Globe,
    title: "Seeds & Research API",
    description: "Seed contracts, research pipeline, and domain discovery.",
    href: "https://docs.newsfork.com/v1/api/seeds-api/",
  },
  {
    icon: BookOpen,
    title: "Architecture Guides",
    description: "System architecture, deployment, and integration guides.",
    href: "https://docs.newsfork.com/v1/guides/",
  },
  {
    icon: FileJson,
    title: "OpenAPI Spec",
    description: "Machine-readable OpenAPI 3.1 specification for the Newsfork API.",
    href: "https://api.newsfork.com/openapi.json",
  },
];

export default function DocsPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-6">
          Everything you need to integrate and build with Newsfork.
        </p>
        <p className="text-sm text-muted-foreground mb-16">
          Korean documentation:{" "}
          <a
            href="https://docs.newsfork.com/ko/getting-started/"
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            docs.newsfork.com/ko
          </a>
        </p>

        <div className="grid gap-5 sm:grid-cols-2 mb-12">
          {DOC_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <a
                key={section.title}
                href={section.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-accent/40 hover:shadow-md"
              >
                <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-semibold">{section.title}</h3>
                    <ExternalLink size={13} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border bg-muted/50 p-8 text-left">
          <h2 className="font-semibold mb-3">Quick example</h2>
          <pre className="overflow-x-auto rounded-lg bg-foreground text-background p-5 text-sm leading-relaxed">
            <code>{`curl https://api.newsfork.com/v1/news \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G \\
  --data-urlencode "country=us" \\
  --data-urlencode "category=policy" \\
  --data-urlencode "limit=10"`}</code>
          </pre>
          <p className="mt-4 text-xs text-muted-foreground">
            Knowledge agent Q&amp;A (<code>/v1/knowledge/ask</code>) is not yet available — use semantic
            search via <code>/v1/rag/query</code> on Pro and Enterprise plans.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <a href="https://docs.newsfork.com/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              Open full docs <ExternalLink size={15} />
            </Button>
          </a>
          <Link href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="gap-2">
              Get API key <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
