import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";

interface CtaCard {
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
}

interface TripleCtaProps {
  title?: string;
  subtitle?: string;
  cards: CtaCard[];
}

export function TripleCta({
  title = "Ready to get started?",
  subtitle = "Talk to our team, see a live demo, or start your free API key today.",
  cards,
}: TripleCtaProps) {
  return (
    <section className="border-t border-border bg-foreground text-background py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          className="mb-12 [&_h2]:text-background [&_p]:text-background/70"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-background/20 bg-background/5 p-8 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-background/70 leading-relaxed mb-6 flex-1">
                {card.description}
              </p>
              <Link
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
              >
                <Button
                  size="md"
                  variant="outline"
                  className="w-full gap-2 border-background/30 text-background hover:bg-background/10"
                >
                  {card.cta} <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
