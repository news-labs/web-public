import type { Metadata } from "next";
import { KindePageLayout } from "@/components/layout/kinde-page-layout";
import { MarketingFeatureCardsSection } from "@/components/marketing/marketing-feature-cards-section";
import { MarketingSplitImageSection } from "@/components/marketing/marketing-split-image-section";
import { MarketingFullImageSection } from "@/components/marketing/marketing-full-image-section";
import { PRODUCT_SECTIONS } from "@/data/product-sections";
import { SIGNUP_URL } from "@/data/home-content";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Explore Newsfork's full feature set — from AI-powered news scoring to semantic search, policy intelligence, and the edge-native API.",
};

export default function ProductPage() {
  const featureCards = PRODUCT_SECTIONS.map((s) => ({
    title: s.title,
    description: s.subtitle,
  }));

  return (
    <KindePageLayout
      title="A complete government news intelligence stack"
      description="From raw crawl to production API in a single platform. Every component is designed for scale, accuracy, and compliance."
      ctaPrimary={{ label: "Get API key", href: SIGNUP_URL, external: true }}
      ctaSecondary={{ label: "API Reference", href: "/docs/" }}
    >
      <MarketingFeatureCardsSection features={featureCards} title="Platform modules" />
      {PRODUCT_SECTIONS.map((section, i) => {
        const layout = i % 2 === 0 ? "B" : "C";
        const variant = i % 2 === 0 ? "white" : "muted";
        if (i === 0) {
          return (
            <MarketingFullImageSection
              key={section.id}
              headline={section.title}
              body={section.features.join(" ")}
              icon={section.icon}
              variant={variant as "white" | "muted"}
            />
          );
        }
        return (
          <MarketingSplitImageSection
            key={section.id}
            layout={layout as "B" | "C"}
            headline={section.title}
            body={section.features[0] ?? section.subtitle}
            icon={section.icon}
            variant={variant as "white" | "muted"}
          />
        );
      })}
    </KindePageLayout>
  );
}
