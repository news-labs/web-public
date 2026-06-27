import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiMockup } from "@/components/sections/api-mockup";
import { PRODUCT_SECTIONS } from "@/data/product-sections";
import { SIGNUP_URL } from "@/data/home-content";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Explore Newsfork's full feature set — from AI-powered news scoring to semantic search, policy intelligence, and the edge-native API.",
};

export default function ProductPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/30 py-20 md:py-28 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            A complete government news intelligence stack
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            From raw crawl to production API in a single platform. Every component is designed
            for scale, accuracy, and compliance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing/">
              <Button size="lg" className="gap-2">
                View pricing <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/docs/">
              <Button variant="outline" size="lg">
                API Reference
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto max-w-6xl px-4 space-y-24 md:space-y-32">
          {PRODUCT_SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const isEven = i % 2 === 0;
            return (
              <div
                key={section.id}
                id={section.id}
                className={`grid gap-12 md:grid-cols-2 items-center scroll-mt-24 ${
                  isEven ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                    <Icon size={24} />
                  </div>
                  <p className="text-sm font-medium text-accent mb-1">{section.subtitle}</p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    {section.title}
                  </h2>
                  <ul className="space-y-3 mt-6">
                    {section.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <ApiMockup label={section.mockup.label} lines={section.mockup.lines} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-20 md:py-24 text-center">
        <div className="container mx-auto max-w-xl px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Free tier includes 1,000 API requests/month. No credit card required.
          </p>
          <Link href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              Get your API key <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
