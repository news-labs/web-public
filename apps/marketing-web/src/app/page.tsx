import type { Metadata } from "next";
import { FadeInSection } from "@/components/sections/fade-in-section";
import { DefaultHero } from "@/components/sections/hero-section";
import { StatsBar } from "@/components/sections/stats-bar";
import { ProblemGrid } from "@/components/sections/problem-grid";
import { ModuleGrid } from "@/components/sections/module-grid";
import { TestimonialBlock } from "@/components/sections/testimonial-block";
import { CodeShowcase } from "@/components/sections/code-showcase";
import { PricingTeaser } from "@/components/sections/pricing-teaser";
import { TripleCta } from "@/components/sections/triple-cta";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { JsonLd } from "@/components/JsonLd";
import {
  API_MODULES,
  CODE_EXAMPLE,
  HOME_STATS,
  PROBLEM_CARDS,
  TESTIMONIAL,
  TRIPLE_CTA,
} from "@/data/home-content";
import { HOME_FAQ } from "@/data/pricing";

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
      <JsonLd />
      <DefaultHero />
      <StatsBar stats={HOME_STATS} />
      <FadeInSection>
        <ProblemGrid title="Scattered sources slow every insight." cards={PROBLEM_CARDS} />
      </FadeInSection>
      <FadeInSection>
        <ModuleGrid
          title="One API for how government news flows."
          subtitle="From collection to distribution — a complete intelligence stack on Cloudflare's global edge."
          modules={API_MODULES}
        />
      </FadeInSection>
      <FadeInSection>
        <TestimonialBlock
          quote={TESTIMONIAL.quote}
          author={TESTIMONIAL.author}
          role={TESTIMONIAL.role}
        />
      </FadeInSection>
      <FadeInSection>
        <CodeShowcase
          title="Query government news in seconds"
          subtitle="One API key. Structured JSON. OpenAPI 3.1. Start with a single curl command."
          command={CODE_EXAMPLE.command}
          response={CODE_EXAMPLE.response}
        />
      </FadeInSection>
      <FadeInSection>
        <PricingTeaser />
      </FadeInSection>
      <TripleCta cards={TRIPLE_CTA} />
      <FaqAccordion
        items={HOME_FAQ}
        title="FAQ"
        className="border-t border-border bg-muted/30"
      />
    </>
  );
}
