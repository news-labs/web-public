import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "@/data/home-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Newsfork is building the world's government news intelligence layer — infrastructure for developers who need reliable, structured news data.",
};

const VALUES = [
  {
    title: "Edge-native by default",
    description:
      "Every service runs on the edge. We chose Cloudflare Workers because sub-second latency isn't optional for news intelligence — it's table stakes.",
  },
  {
    title: "Compliance first",
    description:
      "Government news data comes with complex copyright, attribution, and crawl rules. Our seed contract system makes compliance a first-class citizen, not an afterthought.",
  },
  {
    title: "Developer experience matters",
    description:
      "One API key, one endpoint, structured JSON. No opaque black boxes or unexplained data gaps. We document everything and version all changes.",
  },
  {
    title: "Accuracy over quantity",
    description:
      "We'd rather cover fewer domains well than crawl everything badly. Our 65,000+ domain index is manually curated and continuously validated.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/30 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            We&apos;re building the intelligence layer for government news
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Newsfork started as an internal data pipeline. Today it powers developers, researchers,
            and media teams who need structured, reliable access to what governments around the world
            are publishing.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Government news is one of the most valuable — and most neglected — data sources in
                the world. Ministries, agencies, and legislative bodies publish thousands of
                documents every day. Most of it is never indexed, analysed, or made accessible to
                developers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We&apos;re changing that. Newsfork is the infrastructure layer that makes government
                news as easy to query as any REST API — with the quality signals, semantic
                understanding, and compliance guarantees that serious applications require.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">What we&apos;re building</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <span>A global crawl infrastructure covering 100+ countries and 65,000+ verified government news domains</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <span>AI analysis pipelines that score, embed, and classify every article at ingestion time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <span>A developer API and semantic search layer that makes the data immediately useful</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                  <span>An advertising platform (CuFork) that helps news publishers monetise their audiences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">
            How we work
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl border border-border bg-card p-8">
                <h3 className="font-semibold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto max-w-xl px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Join us</h2>
          <p className="text-muted-foreground mb-8">
            We&apos;re building in public. Follow our progress, try the API, or reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                Get API key <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/docs/">
              <Button variant="outline" size="lg">
                Read the docs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
