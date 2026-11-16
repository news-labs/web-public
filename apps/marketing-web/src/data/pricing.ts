/**
 * Marketing pricing for www.newsfork.com.
 * Quota / RPM / price must match edge-api-gateway `src/plans.ts` (GET /v1/plans).
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
      "1,000 weighted units / month",
      "10 countries",
      "24-hour data freshness",
      "Keyword search",
      "Community support",
      "Public docs",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$10",
    period: "/ month",
    description: "For teams building production applications.",
    cta: "Start 14-day trial",
    ctaHref: "https://account.newsfork.com/signup?plan=pro",
    highlight: true,
    badge: "Most popular",
    features: [
      "50,000 weighted units / month",
      "All 100+ countries",
      "Real-time data (<5 min freshness)",
      "Semantic search + RAG",
      "Webhooks & streaming",
      "News-V scoring",
      "MCP tools for AI agents",
      "14-day free trial (card required)",
      "Email support",
      "99.9% uptime SLA",
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
    a: "Any call to the Newsfork REST API — search, article fetch, feed query, semantic query, or MCP tool invocation — counts as one request. Webhook deliveries do not count.",
  },
  {
    q: "Can I upgrade or downgrade at any time?",
    a: "Yes. Plan changes take effect immediately and are prorated to the current billing period.",
  },
  {
    q: "Is there a free trial for the Pro plan?",
    a: "Yes. The first Pro subscription includes a 14-day free trial. A credit card is required at checkout; you are not charged until the trial ends. Cancel any time from Manage billing.",
  },
  {
    q: "How do I upgrade to Pro?",
    a: "Create a free account at account.newsfork.com, then choose Upgrade to Pro on the dashboard (or follow Start 14-day trial from pricing). Stripe Checkout opens Manage billing for later changes.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit cards and other local payment methods via Stripe. Pro is $10/month or $100/year.",
  },
  {
    q: "What happens if I exceed my monthly quota?",
    a: "We notify you at 80% and 100% of your quota. Requests beyond the limit return a 429 response. You can purchase add-on packs or upgrade your plan.",
  },
  {
    q: "Do MCP tool calls count toward my quota?",
    a: "Yes. Each MCP tool invocation (search, article fetch, trending, etc.) counts as one API request, the same as REST endpoints.",
  },
  {
    q: "Are webhooks billed separately?",
    a: "No. Webhook deliveries are included with the Pro plan and do not count toward your monthly request quota.",
  },
];

export const HOME_FAQ: FaqItem[] = [
  {
    q: "What counts as one API request?",
    a: "Any call to the Newsfork REST API — search, article fetch, feed query, semantic query, or MCP tool invocation — counts as one request. Webhook deliveries do not count.",
  },
  {
    q: "Which countries and categories are included?",
    a: "Free and Pro include the full corpus — filter with ?country=SG and list sources with /v1/sources. Coverage grows as new official sources are onboarded.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. The Free plan includes 1,000 weighted units per month (most news calls = 1 unit), 10 countries, 24-hour data freshness, and keyword search — no credit card required.",
  },
  {
    q: "How does News-V scoring work?",
    a: "Every article receives a composite score from 1.0 to 10.0 across five dimensions: timeliness, impact, relevance, urgency, and source authority. Full scoring metadata is available on the Pro plan.",
  },
];
