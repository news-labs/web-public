/**
 * Marketing copy for www.newsfork.com/pricing.
 * Quota / RPM / price must match the gateway plan SSOT: edge-api-gateway `src/plans.ts`
 * (served at https://api.newsfork.com/v1/plans).
 */

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  ctaHref: string;
  highlight: boolean;
  badge?: string;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for prototyping and evaluation.",
    cta: "Get API key",
    ctaHref: "https://account.newsfork.com/signup",
    highlight: false,
    features: [
      "1,000 API requests / month",
      "10 requests / minute",
      "Government news & sources API",
      "Country, language, date and keyword filters",
      "Self-serve API keys & usage dashboard",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "/ month",
    description: "For teams building production applications.",
    cta: "Talk to us",
    ctaHref: "/contact/?intent=pro",
    highlight: true,
    badge: "Most popular",
    features: [
      "50,000 API requests / month",
      "100 requests / minute",
      "Everything in Free",
      "Semantic search + RAG answers",
      "MCP tools for AI agents (beta)",
      "News score on every document",
      "Email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure and custom contracts.",
    cta: "Contact sales",
    ctaHref: "/contact/?intent=enterprise",
    highlight: false,
    features: [
      "Custom request volume and rate limits",
      "Custom seed contracts (sources)",
      "Private data pipeline",
      "Contracted SLA",
      "Priority support",
      "Invoice billing",
    ],
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const PRICING_FAQ: FaqItem[] = [
  {
    q: "What counts as an API request?",
    a: "Each authenticated call to the Newsfork API counts as weighted units: news, article and source lookups are 1, semantic search is 2, RAG answers are 3, and MCP tool calls are weighted by tool. Every response returns X-Quota-Used and X-Quota-Remaining headers.",
  },
  {
    q: "When does my quota reset?",
    a: "Quotas reset at the start of each calendar month (UTC). Your dashboard at account.newsfork.com shows usage for the current month and the last 30 days.",
  },
  {
    q: "What happens if I exceed my quota or rate limit?",
    a: "Requests beyond the monthly quota or per-minute limit return HTTP 429 with a Retry-After header and the reset time. Upgrade to Pro or contact us for higher limits.",
  },
  {
    q: "How do I upgrade to Pro?",
    a: "Create a free account first, then contact us from the dashboard. Self-serve card checkout is coming soon.",
  },
  {
    q: "Do MCP tool calls count toward my quota?",
    a: "Yes. MCP tools are available on Pro and Enterprise and are metered against the same monthly quota as REST endpoints.",
  },
  {
    q: "Can Enterprise customers pay by invoice?",
    a: "Yes. Enterprise plans support annual invoicing, custom contracts, and procurement-friendly billing terms.",
  },
];

export const HOME_FAQ: FaqItem[] = [
  {
    q: "What counts as one API request?",
    a: "Each authenticated API call counts as weighted units — 1 for news and source lookups, more for semantic search, RAG answers and MCP tools. Usage headers on every response show what is left this month.",
  },
  {
    q: "Which countries and categories are included?",
    a: "All plans include every country in the corpus — filter with ?country=SG and list sources with /v1/sources. Coverage grows continuously as new official sources are onboarded.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. The Free plan includes 1,000 API requests per month at 10 requests per minute, with self-serve API keys — no credit card required.",
  },
  {
    q: "How does News-V scoring work?",
    a: "Every article receives a composite score from 1.0 to 10.0 across five dimensions: timeliness, impact, relevance, urgency, and source authority. Full scoring metadata is available on Pro and Enterprise plans.",
  },
];
