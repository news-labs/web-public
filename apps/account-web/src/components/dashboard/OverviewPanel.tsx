"use client";

import Link from "next/link";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/button";
import { CARD, NUM, featureLabel, formatDate, billingNote, isPaidBilling } from "@/lib/dashboard-format";
import { accountApi, describeError } from "@/lib/account-api";
import { API_BASE_URL, API_DOCS_URL, PRICING_URL } from "@/lib/account-urls";
import { useState } from "react";

export function OverviewPanel() {
  const { overview, billing, days, refresh } = useDashboard();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  if (!overview) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Plan, usage, and quick links for your API account.</p>
      </div>
    );
  }

  const { plan, usage } = overview;
  const price =
    plan.monthlyPriceUsd === null ? "Custom" : plan.monthlyPriceUsd === 0 ? "$0" : `$${plan.monthlyPriceUsd}/mo`;
  const note = billingNote(billing);
  const paid = isPaidBilling(billing);
  const canUpgrade = plan.id === "free" && !paid;
  const canManage = billing !== null && (paid || billing.hasBillingAccount);
  const { used, limit, remaining, resetAt } = usage.month;
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  async function go(action: "pro_monthly" | "pro_annual" | "portal") {
    setBusy(true);
    setActionError(null);
    try {
      const { url } = action === "portal" ? await accountApi.portal() : await accountApi.checkout(action);
      window.location.assign(url);
    } catch (err) {
      setActionError(describeError(err));
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Plan, usage, and quick links for your API account.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={CARD} aria-labelledby="plan-heading">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current plan</p>
              <h2 id="plan-heading" className="mt-1 text-xl font-semibold">
                {plan.name} <span className="text-sm font-normal text-muted-foreground">{price}</span>
              </h2>
              {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
            </div>
            <div className="flex flex-col items-end gap-1">
              {canUpgrade && billing && (
                <div className="flex gap-2">
                  <Button type="button" size="sm" disabled={busy} onClick={() => void go("pro_monthly")}>
                    Upgrade · $10/mo
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => void go("pro_annual")}>
                    $100/yr
                  </Button>
                </div>
              )}
              {canManage && (
                <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => void go("portal")}>
                  Manage billing
                </Button>
              )}
            </div>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            <li>{plan.monthlyUnits === null ? "Unlimited" : NUM.format(plan.monthlyUnits)} requests / month</li>
            <li>
              {usage.rateLimitPerMinute === null ? "Custom" : NUM.format(usage.rateLimitPerMinute)} requests / minute
            </li>
            {plan.features.map((f) => (
              <li key={f}>{featureLabel(f)}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/dashboard/billing/" className="text-foreground underline-offset-2 hover:underline">
              Billing
            </Link>
            <a href={PRICING_URL} className="text-foreground underline-offset-2 hover:underline">
              Compare plans
            </a>
          </div>
          {actionError && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              {actionError}
            </p>
          )}
        </section>

        <section className={CARD} aria-labelledby="usage-heading">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">This month</p>
          <h2 id="usage-heading" className="mt-1 text-xl font-semibold">
            {NUM.format(used)}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / {limit === null ? "unlimited" : NUM.format(limit)} requests
            </span>
          </h2>
          {limit !== null && (
            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
            </div>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {remaining !== null ? `${NUM.format(remaining)} remaining · ` : ""}Resets {formatDate(resetAt)} (UTC month)
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Last 30 days: {days.length === 0 ? "no requests yet" : `${days.reduce((n, d) => n + d.units, 0)} units`}
          </p>
          <Link href="/dashboard/usage/" className="mt-4 inline-block text-sm text-foreground underline-offset-2 hover:underline">
            View usage
          </Link>
        </section>

        <section className={`${CARD} lg:col-span-2`} aria-labelledby="quickstart-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="quickstart-heading" className="text-lg font-semibold">
              Quickstart
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={() => void refresh()}>
              Refresh
            </Button>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 text-xs">
            {`curl -H "Authorization: Bearer $NEWSFORK_API_KEY" \\
  "${API_BASE_URL}/v1/news?country=SG&limit=5"`}
          </pre>
          <p className="mt-3 text-sm text-muted-foreground">
            Manage keys on the{" "}
            <Link href="/dashboard/keys/" className="text-foreground underline-offset-2 hover:underline">
              API keys
            </Link>{" "}
            page.{" "}
            <a href={API_DOCS_URL} className="text-foreground underline-offset-2 hover:underline">
              Read the docs
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
