import { PageContainer } from "@/components/layout/page-container";
import { SiteFAQAccordion } from "@/components/sections/site-faq-accordion";
import { MotionReveal } from "@/components/ui/motion-reveal";

export interface MarketingFAQSectionProps {
  items: Array<{ q: string; a: string }>;
}

export function MarketingFAQSection({ items }: MarketingFAQSectionProps) {
  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <PageContainer className="max-w-revamp-content">
        <MotionReveal>
          <h2 className="mb-10 text-center text-2xl font-bold tracking-title text-foreground sm:text-3xl">
            FAQ
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.05}>
          <SiteFAQAccordion items={items} />
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
