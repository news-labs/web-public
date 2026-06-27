import type { Metadata } from "next";
import { DefaultHero } from "@/components/sections/product-hero-section";
import { StatsBar } from "@/components/sections/stats-bar";
import { ProblemGrid } from "@/components/sections/problem-grid";
import { ModuleGrid } from "@/components/sections/module-grid";
import { TestimonialBlock } from "@/components/sections/testimonial-block";
import { CodeShowcase } from "@/components/sections/code-showcase";
import { PricingTeaser } from "@/components/sections/pricing-teaser";
import { TripleCta } from "@/components/sections/triple-cta";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { WebSiteJsonLd } from "@/components/seo/web-site-json-ld";
import { CODE_EXAMPLE } from "@/data/home-content";

export const metadata: Metadata = {
  title: "Newsfork — Government News Intelligence API",
  description:
    "Real-time government news from 100+ countries. News-V scoring, semantic search, and edge-native REST API.",
  openGraph: {
    title: "Newsfork — Government News Intelligence API",
    description:
      "Real-time government news from 100+ countries. News-V scoring, semantic search, and edge-native REST API.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Newsfork" }],
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <DefaultHero />
      <StatsBar />
      <ProblemGrid />
      <ModuleGrid />
      <TestimonialBlock />
      <CodeShowcase
        title="Query government news in seconds"
        subtitle="One API key. Structured JSON. OpenAPI 3.1. Start with a single curl command."
        command={CODE_EXAMPLE.command}
        response={CODE_EXAMPLE.response}
      />
      <PricingTeaser />
      <TripleCta />
      <FaqAccordion />
    </>
  );
}
