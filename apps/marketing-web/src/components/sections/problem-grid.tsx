import { SectionHeader } from "./section-header";

interface ProblemCard {
  title: string;
  description: string;
}

interface ProblemGridProps {
  title: string;
  cards: ProblemCard[];
}

export function ProblemGrid({ title, cards }: ProblemGridProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader title={title} />

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-8 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
            >
              <h3 className="mb-3 text-lg font-semibold">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
