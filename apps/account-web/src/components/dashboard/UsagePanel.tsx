"use client";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { CARD, NUM, formatDate } from "@/lib/dashboard-format";

export function UsagePanel() {
  const { overview, days } = useDashboard();
  if (!overview) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Weighted request units for the current UTC month and the last 30 days.
        </p>
      </div>
    );
  }

  const { used, limit, remaining, resetAt } = overview.usage.month;
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const peak = Math.max(1, ...days.map((d) => d.units));
  const totalUnits = days.reduce((n, d) => n + d.units, 0);
  const totalRequests = days.reduce((n, d) => n + d.requests, 0);
  const totalRejected = days.reduce((n, d) => n + d.rejected, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Weighted request units for the current UTC month and the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={CARD}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">This month</p>
          <p className="mt-2 text-2xl font-semibold">
            {NUM.format(used)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / {limit === null ? "∞" : NUM.format(limit)}
            </span>
          </p>
          {limit !== null && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct}>
              <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
            </div>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {remaining !== null ? `${NUM.format(remaining)} remaining · ` : ""}Resets {formatDate(resetAt)}
          </p>
        </div>
        <div className={CARD}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">30-day units</p>
          <p className="mt-2 text-2xl font-semibold">{NUM.format(totalUnits)}</p>
          <p className="mt-2 text-xs text-muted-foreground">{NUM.format(totalRequests)} requests</p>
        </div>
        <div className={CARD}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Rejected</p>
          <p className="mt-2 text-2xl font-semibold">{NUM.format(totalRejected)}</p>
          <p className="mt-2 text-xs text-muted-foreground">Rate limit or quota 429s</p>
        </div>
      </div>

      <section className={CARD} aria-labelledby="daily-heading">
        <h2 id="daily-heading" className="text-lg font-semibold">
          Last 30 days
        </h2>
        {days.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          <div className="mt-4 flex h-40 items-end gap-1" aria-label="Daily usage chart">
            {days.map((d) => (
              <div
                key={d.day}
                title={`${d.day}: ${d.units} units, ${d.requests} requests, ${d.rejected} rejected`}
                className="flex-1 rounded-t bg-accent/70"
                style={{ height: `${Math.max(4, Math.round((d.units / peak) * 100))}%` }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
