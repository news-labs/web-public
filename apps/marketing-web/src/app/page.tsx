import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">News-Labs</span>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/docs" className="hover:text-gray-900">Docs</Link>
          <Link href="https://api.news-labs.io" className="hover:text-gray-900">API</Link>
          <a
            href="https://github.com/news-labs"
            className="hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          Real-time government news intelligence
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Government news,<br />
          <span className="text-blue-600">at the edge</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          News-Labs collects, analyses, and distributes government news from 100+ countries
          using AI scoring, semantic search, and policy intelligence — all on Cloudflare's
          global edge network.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/docs"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Read the docs
          </Link>
          <a
            href="https://api.news-labs.io/v1/news"
            className="border border-gray-300 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try the API
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "News-V Scoring",
            desc: "Every article is scored across 5 dimensions: timeliness, impact, relevance, urgency, and source authority.",
          },
          {
            title: "Semantic Search",
            desc: "Ask questions in natural language. Our RAG engine finds relevant government news with citations.",
          },
          {
            title: "Policy Intelligence",
            desc: "Seed contracts define crawl policies per country and category. Built for compliance from day one.",
          },
          {
            title: "Edge-native",
            desc: "All workers run on Cloudflare's global network. Sub-50ms response times worldwide.",
          },
          {
            title: "100+ Countries",
            desc: "Government news domains from 100+ countries. Powered by 65k+ domain discovery records.",
          },
          {
            title: "Ad Platform",
            desc: "Integrated advertising platform with Stripe billing, campaign management, and contextual targeting.",
          },
        ].map((f) => (
          <div key={f.title} className="border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 mt-16">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 News-Labs</span>
          <div className="flex gap-4">
            <Link href="/docs/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/docs/terms" className="hover:text-gray-600">Terms</Link>
            <a href="https://github.com/news-labs" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
