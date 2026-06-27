import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Database,
  Search,
  Shield,
  Zap,
} from "lucide-react";

export interface ProductSection {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  features: string[];
  mockup: {
    label: string;
    lines: string[];
  };
}

export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    id: "collection",
    icon: Database,
    title: "Data Collection",
    subtitle: "65,000+ domains, 100+ countries",
    features: [
      "Seed contracts define per-country, per-category crawl policies",
      "Automated domain discovery and validation",
      "Content deduplication and canonicalisation",
      "Multilingual support with automatic language detection",
      "Historical archive with configurable retention",
    ],
    mockup: {
      label: "GET /v1/seeds",
      lines: [
        '{ "country": "kr", "domains": 1240,',
        '  "policy": "robots-compliant",',
        '  "freshness": "5m", "status": "active" }',
      ],
    },
  },
  {
    id: "scoring",
    icon: BarChart3,
    title: "AI Analysis",
    subtitle: "News-V scoring + semantic embeddings",
    features: [
      "5-dimension News-V score: timeliness, impact, relevance, urgency, authority",
      "Composite score clamped to 1.0–10.0 with category weight overrides",
      "Entity extraction — persons, organisations, locations",
      "Semantic embeddings for vector similarity search",
      "Quality signals: readability, bias indicators, source reputation",
    ],
    mockup: {
      label: "News-V Score",
      lines: [
        "timeliness:      8.2  (0.20)",
        "impact:          9.1  (0.30)",
        "relevance:       7.8  (0.20)",
        "urgency:         6.5  (0.15)",
        "authority:       8.9  (0.15)",
        "─────────────────────────",
        "composite:       8.4",
      ],
    },
  },
  {
    id: "search",
    icon: Search,
    title: "Semantic Search",
    subtitle: "Natural language RAG queries",
    features: [
      "Ask questions in plain English — no query syntax required",
      "Retrieval-Augmented Generation (RAG) with citations",
      "Faceted search: country, category, date, score range",
      "Trending topics and keywords (1h / 6h / 24h / 7d)",
      "Webhook support for article.published events",
    ],
    mockup: {
      label: "GET /v1/rag/query?q=...",
      lines: [
        '{ "answer": "Three ministries issued...",',
        '  "citations": [',
        '    { "docId": "doc_8f2a", "score": 0.94 }',
        '  ], "confidence": 0.91 }',
      ],
    },
  },
  {
    id: "edge",
    icon: Zap,
    title: "Edge API",
    subtitle: "Cloudflare Workers, sub-50ms globally",
    features: [
      "Global edge deployment — 300+ Cloudflare locations",
      "Sub-50ms p95 response time worldwide",
      "OpenAPI 3.1 spec with auto-generated SDKs",
      "Bearer API key auth with usage metering",
      "Rate limiting, quotas, and per-key analytics",
    ],
    mockup: {
      label: "Response headers",
      lines: [
        "HTTP/2 200 OK",
        "x-newsfork-latency-ms: 42",
        "x-ratelimit-remaining: 9847",
        "content-type: application/json",
      ],
    },
  },
  {
    id: "policy",
    icon: Shield,
    title: "Policy Intelligence",
    subtitle: "Compliance-first architecture",
    features: [
      "Per-country content licensing and attribution rules",
      "Robots.txt compliance and crawl-delay enforcement",
      "GDPR-aware data handling and retention policies",
      "Audit log for all data access operations",
      "Domain allow/blocklist management",
    ],
    mockup: {
      label: "Seed contract",
      lines: [
        "country:     jp",
        "attribution: required",
        "robots:      compliant",
        "retention:   90d (GDPR-aware)",
        "audit:       git-backed ledger",
      ],
    },
  },
  {
    id: "mcp",
    icon: Bot,
    title: "MCP for AI Agents",
    subtitle: "Seven tools for agentic news consumption",
    features: [
      "search — keyword, category, language filters",
      "article — full article content by ID",
      "trending — topics and keywords by window",
      "entity-graph — relationships between entities",
      "subscribe-feed — real-time feed subscriptions",
      "sources — available news sources by country",
    ],
    mockup: {
      label: "MCP tools",
      lines: [
        "GET /v1/mcp/search",
        "GET /v1/mcp/article/{id}",
        "GET /v1/mcp/trending",
        "GET /v1/mcp/entity-graph",
        "POST /v1/mcp/subscribe-feed",
        "GET /v1/mcp/sources",
        "GET /v1/mcp/media/{id}",
      ],
    },
  },
];
