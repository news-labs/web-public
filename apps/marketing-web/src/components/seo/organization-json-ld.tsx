import { getOrganizationJsonLd } from "@/lib/www-json-ld";

export function OrganizationJsonLd() {
  const jsonLd = getOrganizationJsonLd();
  return (
    <script
      id="nf-organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
