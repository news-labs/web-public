"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { REVAMP_CTA } from "@/lib/marketing-revamp-tokens";
import { SIGNUP_URL } from "@/data/home-content";

export interface ProductCTASectionProps {
  title?: string;
  description?: string;
}

export function ProductCTASection({
  title = "Your intelligence layer, ready in minutes",
  description = "Integrate Newsfork in minutes with a single API key. Structured JSON, OpenAPI 3.1, and edge-native delivery worldwide.",
}: ProductCTASectionProps = {}) {
  return (
    <section className="flex min-h-[70vh] flex-col justify-center border-t border-border bg-background py-24 sm:py-32">
      <PageContainer className="text-center">
        <MotionReveal variant="scale-in">
          <h2 className="mb-4 text-3xl font-bold tracking-title text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">{description}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={SIGNUP_URL} target="_blank" rel="noopener noreferrer" className={REVAMP_CTA.primaryLg}>
              Get API key
            </Link>
            <Link href="/contact/?intent=demo" className={REVAMP_CTA.secondary}>
              Book demo
            </Link>
          </div>
        </MotionReveal>
      </PageContainer>
    </section>
  );
}
