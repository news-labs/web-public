"use client";

import Link from "next/link";
import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_CTA } from "@/lib/marketing-revamp-tokens";
import { PRICING_BAND } from "@/data/home-content";

export function PricingTeaser() {
  return (
    <Section className="border-t border-border bg-muted/50 md:py-20">
      <div className="mx-auto grid max-w-revamp-content items-center gap-10 lg:grid-cols-2">
        <MotionReveal variant="scale-in">
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-accent-2/10 shadow-md">
            <div className="text-center px-6">
              <p className="text-4xl font-bold text-accent">$0</p>
              <p className="mt-2 text-sm text-muted-foreground">Free tier to start</p>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal className="text-center lg:text-left">
          <h2 className="mb-4 text-2xl font-bold tracking-title text-foreground sm:text-3xl">
            {PRICING_BAND.headline}
          </h2>
          <p className="mb-8 text-muted-foreground">{PRICING_BAND.subline}</p>
          <Link href="/pricing/" className={REVAMP_CTA.primaryLg}>
            View pricing
            <svg className="ml-2 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </MotionReveal>
      </div>
    </Section>
  );
}
