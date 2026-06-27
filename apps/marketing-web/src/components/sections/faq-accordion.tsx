"use client";

import Link from "next/link";
import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SiteFAQAccordion } from "@/components/sections/site-faq-accordion";
import { FaqPageJsonLd } from "@/components/seo/faq-page-json-ld";
import { DOCS_SITE_BASE_URL } from "@/lib/nav-config";
import { HOME_FAQ, type FaqItem } from "@/data/pricing";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  items?: FaqItem[];
  title?: string;
  className?: string;
  showDocsLink?: boolean;
}

export function FaqAccordion({
  items = HOME_FAQ,
  title = "FAQ",
  className,
  showDocsLink = true,
}: FaqAccordionProps) {
  const jsonLdItems = items.map((item) => ({ question: item.q, answer: item.a }));

  return (
    <Section className={cn("border-t border-border bg-background md:py-24", className)}>
      <FaqPageJsonLd items={jsonLdItems} />
      <MotionReveal className="text-center">
        <h2 className="mb-10 text-2xl font-bold tracking-title text-foreground sm:text-3xl">{title}</h2>
      </MotionReveal>
      <MotionReveal delay={0.05}>
        <SiteFAQAccordion items={items} defaultOpenIndex={0} />
      </MotionReveal>
      {showDocsLink && (
        <MotionReveal delay={0.1} className="mt-8 text-center">
          <Link href={`${DOCS_SITE_BASE_URL}/`} className="text-sm font-medium text-accent hover:underline">
            More questions in the docs →
          </Link>
        </MotionReveal>
      )}
    </Section>
  );
}
