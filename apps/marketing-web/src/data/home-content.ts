import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Database,
  Search,
  Shield,
  Zap,
} from "lucide-react";

export const ACCOUNT_SIGNIN_URL = "https://account.newsfork.com/login";
export const ACCOUNT_SIGNUP_URL = "https://account.newsfork.com/signup";

/** @deprecated Use ACCOUNT_SIGNIN_URL */
export const SIGNIN_URL = ACCOUNT_SIGNIN_URL;
/** @deprecated Use ACCOUNT_SIGNUP_URL */
export const SIGNUP_URL = ACCOUNT_SIGNUP_URL;

export const HOME_STATS = [
  { value: "100+", label: "Countries covered" },
  { value: "65K+", label: "Verified gov. domains" },
  { value: "<50ms", label: "Edge response (p95)" },
];

export const PROBLEM_CARDS = [
  {
    title: "Fragmented sources",
    description:
      "Government news lives across thousands of ministry sites—no unified index or schema.",
  },
  {
    title: "Manual monitoring",
    description:
      "Policy teams chase RSS feeds and spreadsheets instead of building on structured data.",
  },
  {
    title: "Stale intelligence",
    description:
      "Leaders and LLM apps act on yesterday's crawl—not real-time, scored, cited news.",
  },
];

export interface ModuleCard {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export const API_MODULES: ModuleCard[] = [
  {
    icon: Database,
    title: "News Collection",
    description: "Seed contracts crawl 65K+ verified domains on policy.",
    href: "/product/#collection",
  },
  {
    icon: BarChart3,
    title: "News-V Scoring",
    description:
      "Five-dimension AI scoring: timeliness, impact, relevance, urgency, authority.",
    href: "/product/#scoring",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Natural-language RAG queries with citations and confidence scores.",
    href: "/product/#search",
  },
  {
    icon: Zap,
    title: "Edge API",
    description: "Cloudflare Workers—sub-50ms globally, no cold starts, OpenAPI 3.1.",
    href: "/product/#edge",
  },
  {
    icon: Shield,
    title: "Policy Intelligence",
    description: "Per-country crawl contracts, robots.txt compliance, GDPR-aware retention.",
    href: "/product/#policy",
  },
  {
    icon: Bot,
    title: "MCP for AI Agents",
    description: "Seven MCP tools for search, articles, trending, entity graph, feeds.",
    href: "/product/#mcp",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The best fit for teams that need government news as structured API data—not another scraper pipeline.",
    author: "Policy Research Lead",
    role: "Global Think Tank",
    company: "Atlantic Policy Institute",
  },
  {
    quote:
      "News-V scoring and semantic search let us ship a policy dashboard in days instead of months of custom crawling.",
    author: "Head of Data Products",
    role: "Media Intelligence",
    company: "Northstar Analytics",
  },
  {
    quote:
      "Edge-native delivery with sub-50ms latency made Newsfork the obvious choice for our real-time alerting stack.",
    author: "Principal Engineer",
    role: "Platform Team",
    company: "GovSignal",
  },
];

export const PRICING_BAND = {
  headline: "Plans that scale with your API usage",
  subline: "Start with 1,000 free requests per month. Upgrade when you need real-time data, semantic search, and MCP tools.",
};

export const CODE_EXAMPLE = {
  command: `curl https://api.newsfork.com/v1/news \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G --data-urlencode "country=us" \\
  --data-urlencode "category=policy" \\
  --data-urlencode "limit=10"`,
  response: `{
  "data": [
    {
      "id": "doc_8f2a1b",
      "title": "Federal Reserve announces policy update",
      "country": "us",
      "category": "policy",
      "newsVScore": 8.4,
      "publishedAt": "2026-06-27T14:30:00Z"
    }
  ],
  "meta": { "count": 10, "latencyMs": 42 }
}`,
};

export const TRIPLE_CTA = [
  {
    title: "See a live demo",
    description: "Walk through search, scoring, and MCP tools.",
    cta: "Book demo",
    href: "/contact/?intent=demo",
  },
  {
    title: "Start for free",
    description: "1,000 requests/month, no credit card.",
    cta: "Get API key",
    href: SIGNUP_URL,
    external: true,
  },
  {
    title: "Talk to sales",
    description: "Custom seeds, dedicated workers, SLA.",
    cta: "Contact sales",
    href: "/contact/?intent=enterprise",
  },
];
