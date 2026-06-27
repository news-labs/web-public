"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";
import type { FaqItem } from "@/data/pricing";

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export function FaqAccordion({
  items,
  title = "FAQ",
  className,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container mx-auto max-w-3xl px-4">
        <SectionHeader title={title} />

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm md:text-base">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border px-6 pb-5 pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
