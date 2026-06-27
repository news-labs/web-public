import type { LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { MarketingPlaceholderImage } from "@/components/marketing/marketing-placeholder-image";
import { MotionReveal } from "@/components/ui/motion-reveal";

export interface MarketingFullImageSectionProps {
  headline: string;
  body: string;
  icon?: LucideIcon;
  variant?: "white" | "muted";
}

export function MarketingFullImageSection({
  headline,
  body,
  icon,
  variant = "white",
}: MarketingFullImageSectionProps) {
  const bg = variant === "muted" ? "bg-muted/50" : "bg-background";
  return (
    <section className={`border-t border-border py-16 md:min-h-[640px] md:py-20 ${bg}`}>
      <PageContainer className="max-w-revamp-content">
        <MotionReveal>
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-3 text-2xl font-bold tracking-title text-foreground sm:text-3xl">{headline}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.06} variant="scale-in">
          <MarketingPlaceholderImage icon={icon} />
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
