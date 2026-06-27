"use client";

import { useState } from "react";
import { NavChevronDownIcon } from "@/components/ui/nav-chevron-down-icon";

export interface SiteFAQAccordionProps {
  items: Array<{ q: string; a: string }>;
  defaultOpenIndex?: number | null;
}

export function SiteFAQAccordion({ items, defaultOpenIndex = null }: SiteFAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpenIndex ?? null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={`${i}-${item.q}`} className="px-4 py-4 sm:px-6">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-3 text-left font-medium text-foreground outline-none"
            >
              <span>{item.q}</span>
              <NavChevronDownIcon
                className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
