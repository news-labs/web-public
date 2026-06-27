import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { WebSiteJsonLd } from "@/components/seo/web-site-json-ld";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/www-json-ld";

/** @deprecated Use OrganizationJsonLd and WebSiteJsonLd from @/components/seo instead */
export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationJsonLd(), getWebSiteJsonLd()],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export { OrganizationJsonLd, WebSiteJsonLd };
