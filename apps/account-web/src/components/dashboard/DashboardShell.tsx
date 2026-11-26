"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { accountApi, AccountApiError, BILLING_ENABLED } from "@/lib/account-api";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/", label: "Overview" },
  { href: "/dashboard/usage/", label: "Usage" },
  { href: "/dashboard/keys/", label: "API keys" },
  ...(BILLING_ENABLED ? [{ href: "/dashboard/billing/", label: "Billing" }] : []),
  { href: "/dashboard/settings/", label: "Settings" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/") return pathname === "/dashboard" || pathname === "/dashboard/";
  return pathname === href || pathname.startsWith(href);
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted", className)} />;
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/dashboard/";
  const { overview, error, loading, redirecting } = useDashboard();
  const planLabel = overview?.plan.name ?? "…";
  const showBootstrap = redirecting || (loading && !overview);

  const [logoutFailed, setLogoutFailed] = useState(false);

  async function logout() {
    setLogoutFailed(false);
    try {
      await accountApi.logout();
    } catch (err) {
      // 401 means the session is already gone. Anything else may leave it active, so stay and say so.
      if (!(err instanceof AccountApiError && err.status === 401)) {
        setLogoutFailed(true);
        return;
      }
    }
    window.location.assign("/login/");
  }

  return (
    <div className="min-h-dvh bg-background md:flex">
      <aside className="flex w-full flex-col border-b border-border md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4 md:justify-start">
          <Logo href="/dashboard/" />
          {!showBootstrap && (
            <Button type="button" variant="outline" size="sm" className="md:hidden" onClick={logout}>
              Log out
            </Button>
          )}
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-0"
          aria-label="Account"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, item.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
              aria-disabled={showBootstrap}
              tabIndex={showBootstrap ? -1 : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-border p-4 md:block">
          {showBootstrap ? (
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-3 w-16" />
            </div>
          ) : (
            <>
              <p className="truncate text-sm font-medium">{overview?.consumer.email ?? "Loading…"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{planLabel}</p>
              <Button type="button" variant="outline" size="sm" className="mt-3 w-full" onClick={logout}>
                Log out
              </Button>
            </>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-4xl px-4 py-8">
          {logoutFailed && (
            <div className="mb-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="alert">
              Log out failed. You may still be signed in. Check your connection and try again.
            </div>
          )}
          {redirecting ? (
            <p className="text-sm text-muted-foreground" role="status">
              Redirecting to log in…
            </p>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="alert">
                  {error}
                </div>
              )}
              {showBootstrap ? (
                <div className="space-y-4" aria-busy="true" aria-label="Loading account">
                  <SkeletonBlock className="h-8 w-48" />
                  <SkeletonBlock className="h-4 w-72" />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <SkeletonBlock className="h-40 w-full" />
                    <SkeletonBlock className="h-40 w-full" />
                  </div>
                </div>
              ) : (
                children
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
