/**
 * Visual revamp tokens — Apple (one idea per viewport) + Kinde (centered hero, card grid).
 */

export const REVAMP_HEADLINE_MAX_WORDS = 9;
export const REVAMP_SUBLINE_MAX_WORDS = 15;
export const REVAMP_HERO_MAX_WORDS = 9;

export const REVAMP_IMAGE_ASPECT = { width: 1280, height: 720 } as const;
export const REVAMP_ICON_SIZE = 512;
export const REVAMP_NAV_THUMB = { width: 120, height: 80 } as const;

export const REVAMP_SECTION = {
  pyMobile: "py-16",
  pyDesktop: "md:py-24",
  minHeight: "md:min-h-[640px]",
} as const;

export const REVAMP_TYPO = {
  hero: "text-4xl font-bold tracking-hero sm:text-5xl lg:text-6xl",
  sectionTitle: "text-3xl font-bold tracking-title sm:text-4xl",
  sectionSub: "text-lg text-muted-foreground",
  cardTitle: "text-lg font-semibold",
  statValue: "text-4xl font-bold sm:text-5xl",
  statLabel:
    "text-sm font-medium uppercase tracking-wide text-muted-foreground",
} as const;

/** Primary pill CTA — Kinde-style rounded-full buttons */
export const REVAMP_CTA = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 font-semibold text-accent-foreground transition-colors hover:bg-accent/90",
  primaryLg:
    "inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 font-semibold text-foreground transition-colors hover:border-accent hover:text-accent",
} as const;
