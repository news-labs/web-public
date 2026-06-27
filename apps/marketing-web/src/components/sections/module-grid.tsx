"use client";

import Link from "next/link";
import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_TYPO } from "@/lib/marketing-revamp-tokens";
import { API_MODULES } from "@/data/home-content";

export function ModuleGrid() {
  return (
    <Section id="features" className="bg-background md:py-24">
      <MotionReveal className="mx-auto max-w-revamp-narrow text-center">
        <h2 className={`mb-3 text-foreground ${REVAMP_TYPO.sectionTitle}`}>
          One API for how government news flows.
        </h2>
        <p className={`mb-12 ${REVAMP_TYPO.sectionSub}`}>
          From collection to distribution — a complete intelligence stack on Cloudflare&apos;s global edge.
        </p>
      </MotionReveal>
      <div className="mx-auto grid max-w-revamp-content gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {API_MODULES.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <MotionReveal key={mod.title} delay={0.05 * i} className="h-full min-h-0">
              <Link
                href={mod.href}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-muted/50 shadow-sm transition-all hover:border-accent/30 hover:shadow-md"
              >
                <div className="flex aspect-square w-full items-center justify-center border-b border-border bg-accent/5">
                  <Icon className="h-16 w-16 text-accent" aria-hidden />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h4 className={`mb-2 text-foreground ${REVAMP_TYPO.cardTitle}`}>{mod.title}</h4>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {mod.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Learn more
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </MotionReveal>
          );
        })}
      </div>
    </Section>
  );
}
