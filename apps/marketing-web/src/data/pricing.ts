/**
 * Canonical marketing pricing tiers for www.newsfork.com.
 * Keep in sync with newsfork/zuplo-api/modules/subscription-info.ts
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
    ctaHref: "https://api.newsfork.com/signup",
    highlight: false,
    features: [
      "1,000 API requests / month",
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
    price: "$79",
    period: "/ month",
    description: "For teams building production applications.",
    cta: "Start 14-day trial",
    ctaHref: "https://api.newsfork.com/signup?plan=pro",
    highlight: true,
    badge: "Most popular",
    features: [
      "50,000 API requests / month",
      "All 100+ countries",
      "Real-time data (<5 min freshness)",
      "Semantic search + RAG",
      "Webhooks & streaming",
      "News-V scoring",
      "MCP tools for AI agents",
      "Email support",
      "99.9% uptime SLA",
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
      "Unlimited API requests",
      "Dedicated edge workers",
      "Custom seed contracts",
      "Private data pipeline",
      "SLA up to 99.99%",
      "Priority support (Slack / phone)",
      "Custom data retention",
      "Audit log & compliance exports",
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
    a: "Yes, Pro comes with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit cards via Stripe. Enterprise customers can be invoiced.",
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
    a: "No. Webhook deliveries are included with Pro and Enterprise plans and do not count toward your monthly request quota.",
  },
  {
    q: "Can Enterprise customers pay by invoice?",
    a: "Yes. Enterprise plans support annual invoicing, custom contracts, and procurement-friendly billing terms.",
  },
];

export const HOME_FAQ: FaqItem[] = [
  {
    q: "What counts as one API request?",
    a: "Any call to the Newsfork REST API — search, article fetch, feed query, semantic query, or MCP tool invocation — counts as one request. Webhook deliveries do not count.",
  },
  {
    q: "Which countries and categories are included?",
    a: "Free tier includes keyword search across 10 countries. Pro and Enterprise include all 100+ countries with categories such as news, policy, research, alert, and data. See the category reference in our docs for the full taxonomy.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. The Free plan includes 1,000 API requests per month, 10 countries, 24-hour data freshness, and keyword search — no credit card required.",
  },
  {
    q: "How does News-V scoring work?",
    a: "Every article receives a composite score from 1.0 to 10.0 across five dimensions: timeliness, impact, relevance, urgency, and source authority. Full scoring metadata is available on Pro and Enterprise plans.",
  },
];
