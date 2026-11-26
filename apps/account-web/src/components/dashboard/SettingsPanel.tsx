"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/button";
import { accountApi, describeError, BILLING_ENABLED } from "@/lib/account-api";
import { CARD, formatDate, isPaidBilling } from "@/lib/dashboard-format";

export function SettingsPanel() {
  const { overview, billing, refresh, setOverview } = useDashboard();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!overview) return;
    setName(overview.consumer.name ?? "");
    setCompany(overview.consumer.company ?? "");
  }, [overview]);

  if (!overview) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Profile, sign-out, and account deletion.</p>
      </div>
    );
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const { consumer } = await accountApi.updateProfile({
        name: name.trim() || null,
        company: company.trim() || null,
      });
      setOverview({ ...overview!, consumer: { ...overview!.consumer, ...consumer } });
      setMessage("Profile saved.");
      await refresh();
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    void accountApi.logout().catch(() => undefined).then(() => window.location.assign("/login/"));
  }

  async function terminate() {
    if (deleteConfirm !== overview!.consumer.email) {
      setError("Type your email exactly to confirm account deletion.");
      return;
    }
    if (isPaidBilling(billing) && !billing?.cancelAtPeriodEnd) {
      setError("Cancel your Pro subscription in Billing → Customer Portal first.");
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await accountApi.deleteAccount();
      window.location.assign("/login/?deleted=1");
    } catch (err) {
      setError(describeError(err));
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Profile, sign-out, and account deletion.</p>
      </div>

      <section className={CARD}>
        <h2 className="text-lg font-semibold">Profile</h2>
        <form onSubmit={saveProfile} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="settings-email">
              Email
            </label>
            <input
              id="settings-email"
              value={overview.consumer.email}
              disabled
              className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">Email is your sign-in identity and cannot be changed here.</p>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="settings-name">
              Name
            </label>
            <input
              id="settings-name"
              value={name}
              maxLength={120}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="settings-company">
              Company
            </label>
            <input
              id="settings-company"
              value={company}
              maxLength={120}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
            />
          </div>
          <p className="text-xs text-muted-foreground">Member since {formatDate(overview.consumer.createdAt)}</p>
          {message && (
            <p className="text-sm text-foreground" role="status">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </section>

      <section className={CARD}>
        <h2 className="text-lg font-semibold">Session</h2>
        <p className="mt-2 text-sm text-muted-foreground">Sign out of this browser. API keys keep working until revoked.</p>
        <Button type="button" variant="outline" className="mt-4" onClick={logout}>
          Log out
        </Button>
      </section>

      <section className={CARD}>
        <h2 className="text-lg font-semibold text-destructive">Delete account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Permanently revokes API keys and sessions.{BILLING_ENABLED && " If you have an active Pro subscription, cancel it in Billing first."}
        </p>
        <label className="mt-4 block text-sm font-medium" htmlFor="delete-confirm">
          Type <span className="font-mono">{overview.consumer.email}</span> to confirm
        </label>
        <input
          id="delete-confirm"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none ring-accent focus:ring-2"
          autoComplete="off"
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4 border-destructive text-destructive hover:bg-destructive/10"
          disabled={deleting}
          onClick={() => void terminate()}
        >
          {deleting ? "Deleting…" : "Delete account"}
        </Button>
      </section>
    </div>
  );
}
