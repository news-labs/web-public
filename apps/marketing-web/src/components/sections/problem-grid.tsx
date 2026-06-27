"use client";

import type { LucideIcon } from "lucide-react";
import { Database, FileSearch, Clock } from "lucide-react";
import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_TYPO } from "@/lib/marketing-revamp-tokens";
import { PROBLEM_CARDS } from "@/data/home-content";

const PROBLEM_ICONS: LucideIcon[] = [Database, FileSearch, Clock];

export function ProblemGrid() {
  return (
    <Section className="bg-background md:py-24">
      <MotionReveal className="mx-auto max-w-revamp-narrow text-center">
        <h2 className={`mb-3 text-foreground ${REVAMP_TYPO.sectionTitle}`}>
          Scattered sources slow every insight.
        </h2>
        <p className={`mb-12 ${REVAMP_TYPO.sectionSub}`}>
          Government news lives across thousands of ministry sites—no unified index or schema.
        </p>
      </MotionReveal>
      <div className="mx-auto grid max-w-revamp-content gap-8 md:grid-cols-3">
        {PROBLEM_CARDS.map((item, i) => {
          const Icon = PROBLEM_ICONS[i] ?? Database;
          return (
            <MotionReveal key={item.title} delay={0.06 * i} variant="scale-in">
              <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex h-36 items-center justify-center border-b border-border bg-muted/50">
                  <Icon className="h-12 w-12 text-accent" aria-hidden />
                </div>
                <div className="p-5 text-center">
                  <h3 className={`mb-1 text-foreground ${REVAMP_TYPO.cardTitle}`}>{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </article>
            </MotionReveal>
          );
        })}
      </div>
    </Section>
  );
}
