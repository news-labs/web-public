"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_CTA } from "@/lib/marketing-revamp-tokens";
import { SIGNUP_URL } from "@/data/home-content";

export type ProductHeroSecondaryCta =
  | { label: string; href: string; onClick?: undefined; external?: boolean }
  | { label: string; onClick: () => void; href?: undefined; external?: undefined };

export interface ProductHeroSectionProps {
  title: string;
  description: string;
  primaryCta?: { label: string; href: string; external?: boolean };
  secondaryCta?: ProductHeroSecondaryCta;
  footnote?: string;
}

const defaultPrimary = { label: "Get API key", href: SIGNUP_URL, external: true };
const defaultSecondary: ProductHeroSecondaryCta = {
  label: "Explore Newsfork",
  href: "/product/",
};

export function ProductHeroSection({
  title,
  description,
  primaryCta = defaultPrimary,
  secondaryCta = defaultSecondary,
  footnote,
}: ProductHeroSectionProps) {
  return (
    <section className="flex min-h-screen-below-header flex-col justify-center bg-background py-6 sm:min-h-screen-below-header-lg sm:py-10">
      <PageContainer>
        <MotionReveal className="mx-auto max-w-3xl text-center" variant="scale-in">
          <h1 className="mb-4 text-4xl font-bold tracking-title text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">{description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={primaryCta.href}
              target={primaryCta.external ? "_blank" : undefined}
              rel={primaryCta.external ? "noopener noreferrer" : undefined}
              className={REVAMP_CTA.primary}
            >
              {primaryCta.label}
            </Link>
            {"onClick" in secondaryCta && secondaryCta.onClick ? (
              <button type="button" onClick={secondaryCta.onClick} className={REVAMP_CTA.secondary}>
                {secondaryCta.label}
              </button>
            ) : (
              <Link
                href={secondaryCta.href ?? "/product/"}
                target={secondaryCta.external ? "_blank" : undefined}
                rel={secondaryCta.external ? "noopener noreferrer" : undefined}
                className={REVAMP_CTA.secondary}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
          {footnote && (
            <p className="mt-6 text-sm text-muted-foreground">{footnote}</p>
          )}
        </MotionReveal>
      </PageContainer>
    </section>
  );
}

export function DefaultHero() {
  return (
    <ProductHeroSection
      title="Government news in one API"
      description="Collect, score, and query government news from 100+ countries—semantic search, News-V scoring, and edge-native delivery in a single REST API."
      footnote="Free tier available — 1,000 requests/month, no credit card required"
    />
  );
}
