"use client";

import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_TYPO } from "@/lib/marketing-revamp-tokens";
import { HOME_STATS } from "@/data/home-content";

export function StatsBar() {
  return (
    <Section
      withContainer={false}
      className="border-y border-border bg-muted/50 py-12 md:py-16"
    >
      <div className="mx-auto grid max-w-revamp-content grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:px-8">
        {HOME_STATS.map((stat, i) => (
          <MotionReveal key={stat.label} className="text-center" delay={0.06 * i}>
            <p className={`mb-1 text-foreground ${REVAMP_TYPO.statValue}`}>{stat.value}</p>
            <p className={REVAMP_TYPO.statLabel}>{stat.label}</p>
          </MotionReveal>
        ))}
      </div>
    </Section>
  );
}
