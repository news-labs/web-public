export interface BlogPost {
  slug: string;
  date: string;
  category: "Product" | "Engineering" | "Company";
  title: string;
  excerpt: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "introducing-news-v-scoring",
    date: "2026-06-15",
    category: "Product",
    title: "Introducing News-V: Five-Dimension Article Scoring",
    excerpt:
      "Every government news article is scored across timeliness, impact, relevance, urgency, and source authority — automatically, in real time.",
    content: [
      "Government news is noisy. Thousands of press releases, policy updates, and regulatory notices are published every day across 100+ countries. Not all of it matters equally — and ranking by publish date alone misses the signal.",
      "News-V is our answer. Every article that enters the Newsfork pipeline receives a composite score from 1.0 to 10.0, computed across five weighted dimensions:",
      "**Timeliness (20%)** — How recently was the article published relative to the event it describes?",
      "**Impact (30%)** — What is the scale of affected population or consequence?",
      "**Relevance (20%)** — How well does the topic align with the target audience or query context?",
      "**Urgency (15%)** — Does the article require time-sensitive action?",
      "**Source authority (15%)** — What is the credibility of the publishing domain?",
      "Category-specific weight overrides apply for breaking news, policy announcements, economic data, and health alerts. A breaking health advisory from a ministry of health scores differently than a routine directory update.",
      "News-V scores are available on every article returned by the REST API and MCP tools. Pro and Enterprise plans include full scoring metadata; Free tier includes composite scores on keyword search results.",
      "We built News-V on Cloudflare Workers AI with deterministic post-processing — same input, same score, every time. No black-box randomness in production pipelines.",
    ],
  },
  {
    slug: "semantic-search-rag-api",
    date: "2026-05-28",
    category: "Engineering",
    title: "Semantic Search and RAG on Government News",
    excerpt:
      "How we built natural-language search over 65,000+ government news domains using Cloudflare Vectorize and edge-native re-ranking.",
    content: [
      "Keyword search fails on government news. Users ask 'What did the EU announce about digital markets this week?' — not `category:policy AND region:eu`.",
      "Newsfork's semantic search pipeline embeds every article at ingestion time using Workers AI, stores vectors in Cloudflare Vectorize, and serves queries through `/v1/rag/query`.",
      "The retrieval pipeline has three stages:",
      "**Embed** — The query is converted to a vector using the same model as ingestion embeddings.",
      "**Retrieve** — Vectorize returns the top-k candidates with faceted filters (country, category, date range, News-V score floor).",
      "**Re-rank** — A cross-encoder re-ranks candidates and generates a cited answer with confidence scores.",
      "Every RAG response includes source citations with document IDs, so you can fetch full articles via `/v1/news/{docId}` or display attribution in your UI.",
      "Semantic search is available on Pro and Enterprise plans. The Free tier includes keyword search across 10 countries with 24-hour freshness.",
      "Latency target: sub-200ms for retrieval, sub-500ms end-to-end including generation — all at the edge, no round-trip to a central GPU cluster.",
    ],
  },
  {
    slug: "mcp-tools-for-ai-agents",
    date: "2026-05-10",
    category: "Product",
    title: "Seven MCP Tools for AI Agent News Consumption",
    excerpt:
      "Newsfork exposes seven Model Context Protocol tools so AI agents can search, read, and subscribe to government news without custom scrapers.",
    content: [
      "AI agents need real-world context. Government news — policy changes, regulatory announcements, diplomatic statements — is among the most valuable and least accessible data for LLM applications.",
      "Newsfork exposes seven MCP tools at `api.newsfork.com/v1/mcp/*`:",
      "**search** — Find articles by keyword, category, and language across 100+ countries.",
      "**article** — Fetch full article content, metadata, and News-V scores by ID.",
      "**media** — Retrieve audio, video, or image URLs associated with an article.",
      "**trending** — Get trending topics and keywords over 1h, 6h, 24h, or 7d windows.",
      "**entity-graph** — Query relationships between persons, organisations, and locations.",
      "**subscribe-feed** — Create real-time feed subscriptions for agent workflows.",
      "**sources** — List available news sources filtered by country and category.",
      "Each MCP tool invocation counts as one API request toward your monthly quota. Webhook deliveries from feed subscriptions do not count.",
      "Connect your agent framework to Newsfork MCP endpoints using your existing API key — no separate auth flow required.",
    ],
  },
  {
    slug: "seed-contracts-explained",
    date: "2026-04-22",
    category: "Engineering",
    title: "Seed Contracts: Compliant Crawl Policies by Country",
    excerpt:
      "Every domain in Newsfork is covered by a seed contract that defines what to crawl, when, and under what terms.",
    content: [
      "Web scraping without policy is a liability. Government news domains have robots.txt rules, attribution requirements, crawl-delay directives, and country-specific licensing terms.",
      "Newsfork's seed contract system defines crawl policies per country and category before any request is made:",
      "**Scope** — Which domains, URL patterns, and content types are in scope.",
      "**Cadence** — How often each domain is crawled, respecting crawl-delay.",
      "**Extraction** — What fields to extract (title, body, metadata, attachments).",
      "**Compliance** — Attribution rules, retention periods, and GDPR-aware handling.",
      "Seed contracts are version-controlled in a Git-backed ledger. Every crawl decision is auditable — what was crawled, when, and under which contract version.",
      "Enterprise customers can define custom seed contracts for proprietary domain lists or restricted collections. Contact enterprise@newsfork.com for details.",
      "The `/v1/seeds` endpoint returns active contracts for your tier. Pro and Enterprise plans include full contract metadata; Free tier includes country-level summaries.",
    ],
  },
  {
    slug: "newsfork-launch",
    date: "2026-03-31",
    category: "Company",
    title: "Newsfork: The Government News Intelligence Layer",
    excerpt:
      "We're launching Newsfork — the infrastructure layer that makes government news as easy to query as any REST API.",
    content: [
      "Government news is one of the most valuable — and most neglected — data sources in the world. Ministries, agencies, and legislative bodies publish thousands of documents every day. Most of it is never indexed, analysed, or made accessible to developers.",
      "Today we're launching Newsfork: a complete government news intelligence stack built on Cloudflare's global edge network.",
      "**100+ countries** — Verified government news domains with automated discovery and validation.",
      "**65,000+ domains** — Continuously growing index with deduplication and canonicalisation.",
      "**News-V scoring** — Five-dimension AI scoring on every article.",
      "**Semantic search** — Natural-language RAG queries with citations.",
      "**Edge-native API** — Sub-50ms response times from 300+ Cloudflare locations.",
      "**MCP tools** — Seven tools for AI agent news consumption.",
      "Start free with 1,000 API requests per month — no credit card required. Get your API key at api.newsfork.com/signup.",
      "Read the docs at docs.newsfork.com. Questions? hello@newsfork.com.",
    ],
  },
];

export const BLOG_CATEGORIES = ["All", "Product", "Engineering", "Company"] as const;

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
