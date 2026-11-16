"use client";

import { useState, type FormEvent } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/button";
import { accountApi, describeError, type ApiKeySummary } from "@/lib/account-api";
import { CARD, formatDate } from "@/lib/dashboard-format";

export function KeysPanel() {
  const { overview, keys, refresh } = useDashboard();
  const [label, setLabel] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!overview) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API keys</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and revoke keys for the Newsfork API.</p>
      </div>
    );
  }

  const max = overview.keys.max;
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
      await refresh();
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
      await refresh();
    } catch (err) {
      setError(describeError(err));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API keys</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {active.length} of {max} active keys. Send as{" "}
          <code className="rounded bg-muted px-1">Authorization: Bearer &lt;key&gt;</code>.
        </p>
      </div>

      <section className={CARD}>
        <form onSubmit={create} className="flex flex-wrap gap-2">
          <label htmlFor="key-label" className="sr-only">
            Key name
          </label>
          <input
            id="key-label"
            placeholder="Key name (e.g. production)"
            value={label}
            maxLength={80}
            onChange={(e) => setLabel(e.target.value)}
            className="min-w-56 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
          />
          <Button type="submit" variant="accent" disabled={busy || active.length >= max}>
            {busy ? "Creating…" : "Create key"}
          </Button>
        </form>

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
    </div>
  );
}
