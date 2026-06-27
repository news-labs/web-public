export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Newsfork",
        url: "https://www.newsfork.com",
        logo: "https://www.newsfork.com/logo.svg",
        sameAs: [
          "https://github.com/news-labs",
          "https://x.com/newsfork",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@newsfork.com",
          contactType: "customer support",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Newsfork API",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free tier with 1,000 API requests per month",
        },
        description:
          "Government news intelligence REST API with News-V scoring, semantic search, and MCP tools for AI agents.",
        url: "https://api.newsfork.com",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
