import type { Metadata } from "next";
import { KindePageLayout } from "@/components/layout/kinde-page-layout";
import { MarketingFeatureCardsSection } from "@/components/marketing/marketing-feature-cards-section";
import { MarketingSplitImageSection } from "@/components/marketing/marketing-split-image-section";
import { SIGNUP_URL } from "@/data/home-content";
import { Globe, Shield, Code2, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Newsfork is building the world's government news intelligence layer — infrastructure for developers who need reliable, structured news data.",
};

const VALUES = [
  {
    title: "Edge-native by default",
    description:
      "Every service runs on the edge. Sub-second latency isn't optional for news intelligence — it's table stakes.",
  },
  {
    title: "Compliance first",
    description:
      "Government news data comes with complex copyright, attribution, and crawl rules. Our seed contract system makes compliance a first-class citizen.",
  },
  {
    title: "Developer experience matters",
    description:
      "One API key, one endpoint, structured JSON. We document everything and version all changes.",
  },
  {
    title: "Accuracy over quantity",
    description:
      "We'd rather cover fewer domains well than crawl everything badly. Our 65,000+ domain index is curated and validated.",
  },
];

export default function AboutPage() {
  return (
    <KindePageLayout
      title="We're building the intelligence layer for government news"
      description="Newsfork started as an internal data pipeline. Today it powers developers, researchers, and media teams who need structured, reliable access to what governments publish."
      ctaPrimary={{ label: "Get API key", href: SIGNUP_URL, external: true }}
      ctaSecondary={{ label: "Read the docs", href: "/docs/" }}
    >
      <MarketingSplitImageSection
        layout="B"
        headline="Our mission"
        body="Government news is one of the most valuable — and most neglected — data sources in the world. Newsfork is the infrastructure layer that makes it as easy to query as any REST API."
        icon={Globe}
        variant="muted"
      />
      <MarketingSplitImageSection
        layout="C"
        headline="What we're building"
        body="A global crawl infrastructure, AI analysis pipelines, semantic search, and an advertising platform (CuFork) for news publishers."
        icon={Target}
        variant="white"
      />
      <MarketingFeatureCardsSection features={VALUES} title="How we work" />
      <MarketingSplitImageSection
        layout="B"
        headline="Built for developers"
        body="OpenAPI 3.1, MCP tools for AI agents, and edge-native delivery on Cloudflare Workers worldwide."
        icon={Code2}
        variant="muted"
      />
      <MarketingSplitImageSection
        layout="C"
        headline="Compliance by design"
        body="Robots.txt compliance, GDPR-aware retention, and per-country licensing rules are built into every seed contract."
        icon={Shield}
        variant="white"
      />
    </KindePageLayout>
  );
}
