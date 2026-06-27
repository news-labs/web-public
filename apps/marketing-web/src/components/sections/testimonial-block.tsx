"use client";

import { useState } from "react";
import { Section } from "@/components/layout/section";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_TYPO } from "@/lib/marketing-revamp-tokens";
import { TESTIMONIALS } from "@/data/home-content";

export function TestimonialBlock() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TESTIMONIALS[activeIndex];

  return (
    <Section id="case-study" className="bg-accent md:py-24">
      <div className="mx-auto grid max-w-revamp-content items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <MotionReveal variant="scale-in">
          <div className="mx-auto flex h-64 max-w-sm items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl lg:mx-0">
            <div className="text-center px-6">
              <p className="text-5xl font-bold text-white/90">NF</p>
              <p className="mt-2 text-sm text-sky-100">Trusted by policy &amp; data teams</p>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal className="text-center lg:text-left" variant="fade-up">
          <h2 className={`mb-6 text-white ${REVAMP_TYPO.sectionTitle}`}>
            Build intelligence on structured government news
          </h2>
          <blockquote className="min-h-[5rem] text-lg text-sky-50">
            &ldquo;{active.quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-medium text-sky-100">
            — {active.author}, {active.role} at {active.company}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === activeIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </MotionReveal>
      </div>
    </Section>
  );
}
