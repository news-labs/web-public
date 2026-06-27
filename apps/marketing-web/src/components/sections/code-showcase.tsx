"use client";

import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_TYPO } from "@/lib/marketing-revamp-tokens";

interface CodeShowcaseProps {
  title: string;
  subtitle: string;
  command: string;
  response: string;
}

export function CodeShowcase({ title, subtitle, command, response }: CodeShowcaseProps) {
  return (
    <Section className="border-y border-border bg-muted/50 md:py-24">
      <div className="mx-auto grid max-w-revamp-content items-center gap-12 lg:grid-cols-2">
        <MotionReveal className="order-2 space-y-4 lg:order-1" variant="scale-in">
          <div className="overflow-hidden rounded-2xl border border-border bg-[#0d1117]">
            <div className="border-b border-white/10 px-4 py-2">
              <span className="font-mono text-xs text-white/50">Terminal</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-green-400">
              <code>{command}</code>
            </pre>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-[#0d1117]">
            <div className="border-b border-white/10 px-4 py-2">
              <span className="font-mono text-xs text-white/50">Response</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-blue-300">
              <code>{response}</code>
            </pre>
          </div>
        </MotionReveal>
        <MotionReveal className="order-1 lg:order-2">
          <h2 className={`mb-4 text-foreground ${REVAMP_TYPO.sectionTitle}`}>{title}</h2>
          <p className={`${REVAMP_TYPO.sectionSub}`}>{subtitle}</p>
        </MotionReveal>
      </div>
    </Section>
  );
}
