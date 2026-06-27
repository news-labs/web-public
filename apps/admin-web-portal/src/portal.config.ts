import {
  Calendar,
  FileText,
  Globe,
  History,
  LayoutDashboard,
  Link2,
  Palette,
  Rocket,
} from "lucide-react";
import type { PortalConfig } from "@core-labs/admin-shell";

export const WEB_PORTAL: PortalConfig = {
  id: "web",
  title: "News-Labs Web",
  subtitle: "Enter your web admin API key or sign in with Google",
  storageKey: "nl_web_admin_key",
  apiBaseUrl: import.meta.env.VITE_API_URL ?? "",
  version: "Web Admin v0.2",
  navItems: [
    { href: "/", label: "Sites", icon: LayoutDashboard },
    { href: "/sites", label: "Site Config", icon: Globe },
    { href: "/content", label: "Content", icon: FileText },
    { href: "/design", label: "Design", icon: Palette },
    { href: "/deploy", label: "Deploy", icon: Rocket },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/history", label: "History", icon: History },
    { href: "/redirects", label: "Redirects", icon: Link2 },
  ],
};
