"use client";

import Link from "next/link";
import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_TYPO } from "@/lib/marketing-revamp-tokens";
import { TRIPLE_CTA } from "@/data/home-content";

export function TripleCta() {
  return (
    <Section
      id="support"
      className="scroll-mt-20 border-t border-border bg-muted/50 md:py-24"
    >
      <MotionReveal className="mx-auto max-w-2xl text-center">
        <h2 className={`mb-3 text-foreground ${REVAMP_TYPO.sectionTitle}`}>
          Ready to get started?
        </h2>
        <p className={`mb-12 ${REVAMP_TYPO.sectionSub}`}>
          Talk to our team, see a live demo, or start your free API key today.
        </p>
      </MotionReveal>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
        {TRIPLE_CTA.map((ch, i) => (
          <MotionReveal key={ch.title} delay={0.06 * i} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/30 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <span className="text-lg font-bold">{i + 1}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{ch.title}</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                {ch.description}
              </p>
              <Link
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                {ch.cta}
              </Link>
            </div>
          </MotionReveal>
        ))}
      </div>
    </Section>
  );
}
