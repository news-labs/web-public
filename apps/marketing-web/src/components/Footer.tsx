"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { DOCS_SITE_BASE_URL } from "@/lib/nav-config";
import { openCookieSettings } from "@/lib/cookie-consent";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  action?: "cookie-settings";
};

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Product: [
    { label: "Overview", href: "/product/" },
    { label: "Pricing", href: "/pricing/" },
    { label: "API Reference", href: `${DOCS_SITE_BASE_URL}/v1/api/`, external: true },
    { label: "Changelog", href: "/blog/" },
  ],
  Solutions: [
    { label: "Enterprise", href: "/contact/?intent=enterprise" },
    { label: "Use Cases", href: "/product/" },
    { label: "CuFork Ads", href: "https://cufork.newsfork.com", external: true },
  ],
  Developers: [
    { label: "Docs", href: `${DOCS_SITE_BASE_URL}/getting-started/`, external: true },
    { label: "MCP Tools", href: `${DOCS_SITE_BASE_URL}/v1/api/`, external: true },
    { label: "System Status", href: "/developers/system-status/" },
  ],
  Company: [
    { label: "About", href: "/about/" },
    { label: "Blog", href: "/blog/" },
    { label: "Help Center", href: `${DOCS_SITE_BASE_URL}/resources/faq/`, external: true },
    { label: "Contact", href: "/contact/" },
  ],
  Legal: [
    { label: "Terms of Service", href: `${DOCS_SITE_BASE_URL}/legal/terms-of-service/`, external: true },
    { label: "Privacy Policy", href: `${DOCS_SITE_BASE_URL}/legal/privacy-policy/`, external: true },
    { label: "Cookie Policy", href: `${DOCS_SITE_BASE_URL}/legal/cookie-policy/`, external: true },
    {
      label: "Data Processing Agreement",
      href: `${DOCS_SITE_BASE_URL}/legal/data-processing-agreement/`,
      external: true,
    },
    {
      label: "Service Level Agreement",
      href: `${DOCS_SITE_BASE_URL}/legal/service-level-agreement/`,
      external: true,
    },
    {
      label: "Supplemental product practices",
      href: `${DOCS_SITE_BASE_URL}/legal/supplemental-practices/`,
      external: true,
    },
  ],
  Settings: [{ label: "Cookie settings", href: "#", action: "cookie-settings" }],
};

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    "text-sm text-muted-foreground transition-colors hover:text-accent text-left";

  if (link.action === "cookie-settings") {
    return (
      <button type="button" onClick={openCookieSettings} className={className}>
        {link.label}
      </button>
    );
  }

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(var(--nf-footer-bg))]">
      <PageContainer className="py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="mb-4 text-sm font-semibold text-foreground">{title}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-3">
          <a
            href="https://github.com/news-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-accent"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://x.com/newsfork"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-accent"
            aria-label="X (Twitter)"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2026 Newsfork. All rights reserved.</p>
        </div>
      </PageContainer>
    </footer>
  );
}
