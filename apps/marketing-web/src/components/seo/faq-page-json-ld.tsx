import { buildFaqPageJsonLd, type FaqJsonLdItem } from "@/lib/www-json-ld";

export function FaqPageJsonLd({ items }: { items: FaqJsonLdItem[] }) {
  if (items.length === 0) return null;
  const jsonLd = buildFaqPageJsonLd(items);
  return (
    <script
      id="nf-faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
