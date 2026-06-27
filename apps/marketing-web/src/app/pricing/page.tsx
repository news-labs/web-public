import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { PRICING_FAQ, PRICING_PLANS } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Newsfork. Start free and scale as you grow. No hidden fees.",
};

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/30 py-20 md:py-28 text-center">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground pb-1">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <CheckCircle2
                        size={16}
                        className={`mt-0.5 shrink-0 ${
                          plan.highlight ? "text-accent" : "text-muted-foreground"
                        }`}
                      />
                      <span className={plan.highlight ? "" : "text-muted-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  target={plan.ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={plan.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <Button
                    size="lg"
                    variant={plan.highlight ? "default" : "outline"}
                    className="w-full gap-2"
                  >
                    {plan.cta} <ArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqAccordion
        items={PRICING_FAQ}
        title="Frequently asked questions"
        className="border-t border-border bg-muted/30"
      />

      <section className="py-16 text-center">
        <div className="container mx-auto max-w-xl px-4">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Link href="/contact/">
            <Button variant="outline">Contact us</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
