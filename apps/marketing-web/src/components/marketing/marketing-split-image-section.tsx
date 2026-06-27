import { PageContainer } from "@/components/layout/page-container";
import { MarketingPlaceholderImage } from "@/components/marketing/marketing-placeholder-image";
import { MotionReveal } from "@/components/ui/motion-reveal";
import type { LucideIcon } from "lucide-react";

export type MarketingLayoutKind = "A" | "B" | "C";

export interface MarketingSplitImageSectionProps {
  layout: Extract<MarketingLayoutKind, "B" | "C">;
  headline: string;
  body: string;
  icon?: LucideIcon;
  variant?: "white" | "muted";
}

export function MarketingSplitImageSection({
  layout,
  headline,
  body,
  icon,
  variant = "muted",
}: MarketingSplitImageSectionProps) {
  const bg = variant === "muted" ? "bg-muted/50" : "bg-background";
  const textBlock = (
    <MotionReveal className="flex flex-col justify-center">
      <h2 className="mb-3 text-2xl font-bold tracking-title text-foreground sm:text-3xl">{headline}</h2>
      <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
    </MotionReveal>
  );
  const imageBlock = (
    <MotionReveal className="flex items-center justify-center" variant="scale-in" delay={0.05}>
      <MarketingPlaceholderImage icon={icon} />
    </MotionReveal>
  );

  return (
    <section className={`border-t border-border py-16 md:min-h-[640px] md:py-20 ${bg}`}>
      <PageContainer className="max-w-revamp-content">
        {layout === "B" ? (
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
            <div>{imageBlock}</div>
            <div>{textBlock}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-10 md:gap-10">
            <div className="order-2 md:order-1 md:col-span-3">{textBlock}</div>
            <div className="order-1 md:order-2 md:col-span-7">{imageBlock}</div>
          </div>
        )}
      </PageContainer>
    </section>
  );
}
