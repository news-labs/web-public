import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "@/data/home-content";

interface HeroSectionProps {
  badge: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  primaryCta: { label: string; href: string; external?: boolean };
  secondaryCta: { label: string; href: string };
  footnote?: string;
}

export function HeroSection({
  badge,
  title,
  titleHighlight,
  subtitle,
  primaryCta,
  secondaryCta,
  footnote,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-36 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm text-accent mb-8">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          {badge}
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance mb-6 leading-[1.1]">
          {title}
          {titleHighlight && (
            <>
              <br />
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </>
          )}
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryCta.href}
            target={primaryCta.external ? "_blank" : undefined}
            rel={primaryCta.external ? "noopener noreferrer" : undefined}
          >
            <Button size="lg" className="gap-2">
              {primaryCta.label} <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href={secondaryCta.href}>
            <Button variant="outline" size="lg">
              {secondaryCta.label}
            </Button>
          </Link>
        </div>

        {footnote && (
          <p className="mt-6 text-sm text-muted-foreground">{footnote}</p>
        )}
      </div>
    </section>
  );
}

export function DefaultHero() {
  return (
    <HeroSection
      badge="Real-time government news intelligence"
      title="Government news"
      titleHighlight="in one API"
      subtitle="Collect, score, and query government news from 100+ countries—semantic search, News-V scoring, and edge-native delivery in a single REST API."
      primaryCta={{ label: "Get API key", href: SIGNUP_URL, external: true }}
      secondaryCta={{ label: "Explore Newsfork", href: "/product/" }}
      footnote="Free tier available — 1,000 requests/month, no credit card required"
    />
  );
}
