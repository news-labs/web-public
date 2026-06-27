import { WWW_ORIGIN } from "@/lib/nav-config";

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Newsfork",
    url: WWW_ORIGIN,
    logo: `${WWW_ORIGIN}/logo.svg`,
    sameAs: ["https://github.com/news-labs", "https://x.com/newsfork"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@newsfork.com",
      contactType: "customer support",
    },
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Newsfork",
    url: WWW_ORIGIN,
    description:
      "Government news intelligence REST API with News-V scoring, semantic search, and MCP tools.",
  };
}

export function buildFaqPageJsonLd(items: FaqJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
