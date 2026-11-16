"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  AccountApiError,
  accountApi,
  describeError,
  type ApiKeySummary,
  type DailyUsage,
  type Overview,
} from "@/lib/account-api";
import { API_BASE_URL, API_DOCS_URL, CONTACT_PRO_URL, PRICING_URL } from "@/lib/account-urls";

const CARD = "rounded-xl border border-border/60 bg-card p-6 shadow-sm";
const NUM = new Intl.NumberFormat("en-US");

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function featureLabel(feature: string): string {
  if (feature === "semantic") return "Semantic search & ask";
  if (feature === "mcp") return "MCP tools";
  return "News & sources API";
}

function PlanCard({ overview }: { overview: Overview }) {
  const { plan, usage } = overview;
  const price = plan.monthlyPriceUsd === null ? "Custom" : plan.monthlyPriceUsd === 0 ? "$0" : `$${plan.monthlyPriceUsd}/mo`;
  return (
    <section className={CARD} aria-labelledby="plan-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current plan</p>
          <h2 id="plan-heading" className="mt-1 text-xl font-semibold">
            {plan.name} <span className="text-sm font-normal text-muted-foreground">{price}</span>
          </h2>
        </div>
        {plan.id === "free" && (
          <a href={CONTACT_PRO_URL} className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
            Upgrade to Pro
          </a>
        )}
      </div>
      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
        <li>{plan.monthlyUnits === null ? "Unlimited" : NUM.format(plan.monthlyUnits)} requests / month</li>
        <li>{usage.rateLimitPerMinute === null ? "Custom" : NUM.format(usage.rateLimitPerMinute)} requests / minute</li>
        {plan.features.map((f) => (
          <li key={f}>{featureLabel(f)}</li>
        ))}
      </ul>
      <a href={PRICING_URL} className="mt-4 inline-block text-sm text-foreground underline-offset-2 hover:underline">
        Compare plans
      </a>
    </section>
  );
}

function UsageCard({ overview, days }: { overview: Overview; days: DailyUsage[] }) {
  const { used, limit, remaining, resetAt } = overview.usage.month;
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const peak = Math.max(1, ...days.map((d) => d.units));
  return (
    <section className={CARD} aria-labelledby="usage-heading">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">This month</p>
      <h2 id="usage-heading" className="mt-1 text-xl font-semibold">
        {NUM.format(used)} <span className="text-sm font-normal text-muted-foreground">/ {limit === null ? "unlimited" : NUM.format(limit)} requests</span>
      </h2>
      {limit !== null && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        {remaining !== null ? `${NUM.format(remaining)} remaining · ` : ""}Resets {formatDate(resetAt)} (UTC month)
      </p>
      <div className="mt-5">
        <p className="text-xs text-muted-foreground">Last 30 days</p>
        {days.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No requests yet.</p>
        ) : (
          <div className="mt-2 flex h-24 items-end gap-1" aria-label="Daily usage">
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
      </div>
    </section>
  );
}

function KeysCard({
  keys,
  max,
  onChanged,
}: {
  keys: ApiKeySummary[];
  max: number;
  onChanged: () => Promise<void>;
}) {
  const [label, setLabel] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const active = keys.filter((k) => k.status === "active");

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await accountApi.createKey(label.trim());
      setCreated(res.apiKey);
      setCopied(false);
      setLabel("");
      await onChanged();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  async function revoke(key: ApiKeySummary) {
    if (!window.confirm(`Revoke ${key.label ?? key.keyPrefix}? Requests using it will fail immediately.`)) return;
    setError(null);
    try {
      await accountApi.revokeKey(key.id);
      await onChanged();
    } catch (err) {
      setError(describeError(err));
    }
  }

  return (
    <section className={`${CARD} lg:col-span-2`} aria-labelledby="keys-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="keys-heading" className="text-lg font-semibold">API keys</h2>
          <p className="text-sm text-muted-foreground">
            {active.length} of {max} active keys. Send as <code className="rounded bg-muted px-1">Authorization: Bearer &lt;key&gt;</code>.
          </p>
        </div>
        <form onSubmit={create} className="flex gap-2">
          <label htmlFor="key-label" className="sr-only">Key name</label>
          <input
            id="key-label"
            placeholder="Key name (e.g. production)"
            value={label}
            maxLength={80}
            onChange={(e) => setLabel(e.target.value)}
            className="w-56 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
          />
          <Button type="submit" variant="accent" disabled={busy || active.length >= max}>
            {busy ? "Creating…" : "Create key"}
          </Button>
        </form>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="alert">
          {error}
        </div>
      )}

      {created && (
        <div className="mt-4 rounded-lg border border-accent/40 bg-muted p-4" role="status">
          <p className="text-sm font-medium">Copy your new key now — it will not be shown again.</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="break-all rounded bg-background px-2 py-1 text-sm" data-testid="new-api-key">
              {created}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard?.writeText(created).then(() => setCopied(true));
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setCreated(null)}>
              Done
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Key</th>
              <th className="py-2 pr-4 font-medium">Created</th>
              <th className="py-2 pr-4 font-medium">Last used</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-muted-foreground">
                  No keys yet. Create one to start calling the API.
                </td>
              </tr>
            )}
            {keys.map((k) => (
              <tr key={k.id} className="border-t border-border">
                <td className="py-2 pr-4">{k.label ?? "—"}</td>
                <td className="py-2 pr-4 font-mono text-xs">{k.keyPrefix}…</td>
                <td className="py-2 pr-4">{formatDate(k.createdAt)}</td>
                <td className="py-2 pr-4">{formatDate(k.lastUsedAt)}</td>
                <td className="py-2 pr-4">{k.status}</td>
                <td className="py-2 text-right">
                  {k.status === "active" && (
                    <Button type="button" variant="outline" size="sm" onClick={() => void revoke(k)}>
                      Revoke
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function QuickstartCard() {
  return (
    <section className={`${CARD} lg:col-span-2`} aria-labelledby="quickstart-heading">
      <h2 id="quickstart-heading" className="text-lg font-semibold">Quickstart</h2>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-4 text-xs">
{`curl -H "Authorization: Bearer $NEWSFORK_API_KEY" \\
  "${API_BASE_URL}/v1/news?country=SG&limit=5"

curl -H "Authorization: Bearer $NEWSFORK_API_KEY" \\
  "${API_BASE_URL}/v1/sources"`}
      </pre>
      <p className="mt-3 text-sm text-muted-foreground">
        Every response includes <code>X-Quota-Remaining</code> and <code>X-RateLimit-Remaining</code> headers. Over the limit returns
        429 with <code>Retry-After</code>.{" "}
        <a href={API_DOCS_URL} className="text-foreground underline-offset-2 hover:underline">Read the docs</a>
      </p>
    </section>
  );
}

export function DashboardClient() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [keys, setKeys] = useState<ApiKeySummary[]>([]);
  const [days, setDays] = useState<DailyUsage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [me, keyList, usage] = await Promise.all([accountApi.me(), accountApi.keys(), accountApi.usage(30)]);
      setOverview(me);
      setKeys(keyList.keys);
      setDays(usage.days);
      setError(null);
    } catch (err) {
      if (err instanceof AccountApiError && err.status === 401) {
        window.location.replace("/login/");
        return;
      }
      setError(describeError(err));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function logout() {
    // Server-side GET clears the HttpOnly cookie even if the gateway revoke fails.
    window.location.assign("/api/auth/logout");
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Logo />
          <div className="flex items-center gap-3 text-sm">
            {overview && <span className="text-muted-foreground">{overview.consumer.email}</span>}
            <Button type="button" variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">API dashboard</h1>
        {error && (
          <div className="mt-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="alert">
            {error}
          </div>
        )}
        {!overview && !error && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
        {overview && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <PlanCard overview={overview} />
            <UsageCard overview={overview} days={days} />
            <KeysCard keys={keys} max={overview.keys.max} onChanged={load} />
            <QuickstartCard />
          </div>
        )}
      </main>
    </div>
  );
}
