import { PageContainer } from "@/components/layout/page-container";
import { MotionReveal } from "@/components/ui/motion-reveal";

export interface MarketingFeatureCardsSectionProps {
  features: Array<{ title: string; description: string }>;
  title?: string;
}

export function MarketingFeatureCardsSection({
  features,
  title = "Features",
}: MarketingFeatureCardsSectionProps) {
  return (
    <section className="border-t border-border bg-muted/50 py-16 md:min-h-[560px] md:py-24">
      <PageContainer className="max-w-revamp-content">
        <MotionReveal>
          <h2 className="mb-10 text-center text-2xl font-bold tracking-title text-foreground sm:text-3xl">
            {title}
          </h2>
        </MotionReveal>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <MotionReveal key={f.title} delay={i * 0.06} variant="scale-in">
              <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
