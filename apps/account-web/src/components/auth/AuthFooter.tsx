import { DOCS_LEGAL_BASE } from "@/lib/account-urls";

const links = [
  { label: "Terms of Service", href: `${DOCS_LEGAL_BASE}/terms-of-service/` },
  { label: "Privacy Policy", href: `${DOCS_LEGAL_BASE}/privacy-policy/` },
  { label: "Cookie Policy", href: `${DOCS_LEGAL_BASE}/cookie-policy/` },
  { label: "Support", href: "mailto:hello@newsfork.com" },
];

export function AuthFooter() {
  return (
    <footer className="py-8 text-center text-xs text-muted-foreground">
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {links.map((link, index) => (
          <span key={link.href} className="inline-flex items-center gap-3">
            <a href={link.href} className="hover:text-foreground underline-offset-2 hover:underline">
              {link.label}
            </a>
            {index < links.length - 1 && <span className="text-border" aria-hidden>·</span>}
          </span>
        ))}
      </nav>
    </footer>
  );
}
