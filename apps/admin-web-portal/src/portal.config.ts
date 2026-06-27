import {
  BarChart3,
  Calendar,
  Eye,
  FileText,
  FolderTree,
  GitBranch,
  Globe,
  History,
  Image,
  Languages,
  LayoutDashboard,
  LayoutTemplate,
  LineChart,
  Link2,
  MapPin,
  Megaphone,
  Palette,
  Rocket,
  Search,
  Send,
  Settings2,
  Shield,
  Zap,
} from "lucide-react";
import type { PortalConfig } from "@core-labs/admin-shell";

export const ADMIN_UI_BASENAME = "/cp";

export const WEB_PORTAL: PortalConfig = {
  id: "web",
  title: "News-Labs Web",
  subtitle: "Enter your web admin API key or sign in with Google",
  storageKey: "nl_web_admin_key",
  apiBaseUrl: import.meta.env.VITE_API_URL ?? "",
  version: "Web Admin v1.0",
  pinnedNavItems: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
  navGroups: [
    {
      id: "sites",
      label: "Sites",
      icon: Globe,
      defaultExpanded: true,
      items: [
        { href: "/sites", label: "All Sites", icon: Globe },
        { href: "/brands", label: "Brands & Domains", icon: Megaphone },
        { href: "/regions", label: "Regions", icon: MapPin },
        { href: "/locales", label: "Locales & Languages", icon: Languages },
      ],
      sections: [
        { label: "Overview", itemHrefs: ["/sites"] },
        { label: "Configuration", itemHrefs: ["/brands", "/regions", "/locales"] },
      ],
    },
    {
      id: "design",
      label: "Design",
      icon: Palette,
      items: [
        { href: "/templates", label: "Template Library", icon: LayoutTemplate },
        { href: "/templates/overrides", label: "Template Overrides", icon: Settings2 },
        { href: "/design/tokens", label: "Design Tokens", icon: Palette },
        { href: "/preview", label: "Live Preview", icon: Eye },
        { href: "/design/components", label: "Component Gallery", icon: LayoutDashboard },
      ],
      sections: [
        { label: "Templates", itemHrefs: ["/templates", "/templates/overrides", "/design/tokens"] },
        { label: "Preview", itemHrefs: ["/preview", "/design/components"] },
      ],
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      items: [
        { href: "/content", label: "Content Index", icon: FileText },
        { href: "/categories", label: "Categories", icon: FolderTree },
        { href: "/media", label: "Image Library", icon: Image },
        { href: "/media/cdn", label: "CDN Assets", icon: Zap },
      ],
      sections: [
        { label: "Metadata", itemHrefs: ["/content", "/categories"] },
        { label: "Media", itemHrefs: ["/media", "/media/cdn"] },
      ],
    },
    {
      id: "seo",
      label: "SEO",
      icon: Search,
      items: [
        { href: "/seo/meta", label: "Meta Templates", icon: Search },
        { href: "/seo/hreflang", label: "hreflang", icon: Languages },
        { href: "/seo/sitemap", label: "Sitemap Policy", icon: Globe },
        { href: "/redirects", label: "Redirects", icon: Link2 },
        { href: "/seo/url-preview", label: "URL Policy Preview", icon: Eye },
      ],
      sections: [
        { label: "Policy", itemHrefs: ["/seo/meta", "/seo/hreflang", "/seo/sitemap"] },
        { label: "Routing", itemHrefs: ["/redirects", "/seo/url-preview"] },
      ],
    },
    {
      id: "publishing",
      label: "Publishing",
      icon: Send,
      items: [
        { href: "/schedule", label: "Publish Calendar", icon: Calendar },
        { href: "/schedule/bulk", label: "Bulk Schedule", icon: Calendar },
        { href: "/publish-log", label: "Publish Log", icon: Send },
        { href: "/history", label: "Build History", icon: History },
        { href: "/deploy", label: "Deploy", icon: Rocket },
      ],
      sections: [
        { label: "Schedule", itemHrefs: ["/schedule", "/schedule/bulk"] },
        { label: "Operations", itemHrefs: ["/publish-log", "/history", "/deploy"] },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      items: [
        { href: "/analytics", label: "Site Overview", icon: BarChart3 },
        { href: "/analytics/regions", label: "By Region", icon: MapPin },
        { href: "/analytics/languages", label: "By Language", icon: Languages },
        { href: "/analytics/seo", label: "SEO Health", icon: Shield },
        { href: "/analytics/web-vitals", label: "Core Web Vitals", icon: LineChart },
      ],
      sections: [
        { label: "Traffic", itemHrefs: ["/analytics", "/analytics/regions", "/analytics/languages"] },
        { label: "Quality", itemHrefs: ["/analytics/seo", "/analytics/web-vitals"] },
      ],
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: GitBranch,
      items: [
        { href: "/integrations/github", label: "Template Repos", icon: GitBranch },
        { href: "/integrations/ci", label: "CI Runs", icon: Rocket },
        { href: "/history/changes", label: "Change History", icon: History },
        { href: "/audit", label: "Audit Log", icon: Shield },
      ],
      sections: [
        { label: "GitHub", itemHrefs: ["/integrations/github", "/integrations/ci"] },
        { label: "Audit", itemHrefs: ["/history/changes", "/audit"] },
      ],
    },
  ],
};
