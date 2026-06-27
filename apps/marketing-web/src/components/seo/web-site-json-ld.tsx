import { getWebSiteJsonLd } from "@/lib/www-json-ld";

export function WebSiteJsonLd() {
  const jsonLd = getWebSiteJsonLd();
  return (
    <script
      id="nf-website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
