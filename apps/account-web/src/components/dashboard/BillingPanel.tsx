"use client";

import { useEffect, useRef, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/button";
import { accountApi, describeError } from "@/lib/account-api";
import {
  CARD,
  billingNote,
  isPaidBilling,
  resolveProCheckoutPlan,
  featureLabel,
  NUM,
} from "@/lib/dashboard-format";
import { CONTACT_PRO_URL, PRICING_URL } from "@/lib/account-urls";

export function BillingPanel() {
  const { overview, billing, refresh } = useDashboard();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [activationStalled, setActivationStalled] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const planCheckoutStarted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("checkout");
    if (result !== "success" && result !== "cancel") return;
    setCheckoutResult(result);
    window.history.replaceState(null, "", window.location.pathname);
    if (result !== "success") return;
    setActivating(true);
    setActivationStalled(false);
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      void refresh();
      if (tries >= 5) {
        window.clearInterval(timer);
        setActivationStalled(true);
        setActivating(false);
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!activating && !activationStalled) return;
    if (isPaidBilling(billing) || (overview && overview.plan.id !== "free")) {
      setActivating(false);
      setActivationStalled(false);
      setCheckoutResult(null);
    }
  }, [activating, activationStalled, billing, overview]);

  useEffect(() => {
    if (!overview || planCheckoutStarted.current) return;
    const params = new URLSearchParams(window.location.search);
    const checkoutPlan = resolveProCheckoutPlan(params.get("plan"));
    if (!checkoutPlan) return;
    window.history.replaceState(null, "", window.location.pathname);
    if (overview.plan.id !== "free" || isPaidBilling(billing)) return;
    if (!billing) {
      setNotice("Online checkout is not available yet. Contact hello@newsfork.com to upgrade.");
      return;
    }
    planCheckoutStarted.current = true;
    setNotice("Opening Stripe Checkout for your Pro trial…");
    void accountApi
      .checkout(checkoutPlan)
      .then(({ url }) => {
        window.location.assign(url);
      })
      .catch((err) => {
        planCheckoutStarted.current = false;
        setNotice(describeError(err));
      });
  }, [overview, billing]);

  if (!overview) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrade, change cards, download invoices, or cancel — payment details live in Stripe Customer Portal.
          </p>
        </div>
      </div>
    );
  }

  const paid = isPaidBilling(billing);
  const canUpgrade = overview.plan.id === "free" && !paid;
  const canManage = billing !== null && (paid || billing.hasBillingAccount);
  const note = billingNote(billing);
  const plan = overview.plan;

  async function go(action: "pro_monthly" | "pro_annual" | "portal") {
    setBusy(true);
    setError(null);
    try {
      const { url } = action === "portal" ? await accountApi.portal() : await accountApi.checkout(action);
      window.location.assign(url);
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upgrade, change cards, download invoices, or cancel — payment details live in Stripe Customer Portal.
        </p>
      </div>

      {checkoutResult === "cancel" && (
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="status">
          Checkout was canceled. You can upgrade any time.
        </div>
      )}
      {(checkoutResult === "success" || activating || activationStalled) && !isPaidBilling(billing) && overview?.plan.id === "free" && (
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="status">
          {activationStalled ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                Still activating Pro — Stripe webhooks can take a minute. Refresh or open the Customer Portal if this
                persists.
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setActivationStalled(false);
                  setActivating(true);
                  void refresh();
                  let tries = 0;
                  const timer = window.setInterval(() => {
                    tries += 1;
                    void refresh();
                    if (tries >= 5) {
                      window.clearInterval(timer);
                      setActivating(false);
                      setActivationStalled(true);
                    }
                  }, 3000);
                }}
              >
                Retry refresh
              </Button>
            </div>
          ) : (
            "Thanks! Your Pro subscription is activating — this page updates automatically (usually under 15s)."
          )}
        </div>
      )}
      {notice && (
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="status">
          {notice}
        </div>
      )}

      <section className={CARD}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plan</p>
            <h2 className="mt-1 text-xl font-semibold">
              {plan.name}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {plan.monthlyPriceUsd === 0 ? "$0" : plan.monthlyPriceUsd === null ? "Custom" : `$${plan.monthlyPriceUsd}/mo`}
              </span>
            </h2>
            {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li>
                {plan.monthlyUnits === null ? "Unlimited" : NUM.format(plan.monthlyUnits)} weighted units / month
              </li>
              {plan.features.map((f) => (
                <li key={f}>{featureLabel(f)}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            {canUpgrade &&
              (billing ? (
                <>
                  <Button type="button" disabled={busy} onClick={() => void go("pro_monthly")}>
                    Upgrade to Pro · $10/mo
                  </Button>
                  <Button type="button" variant="outline" disabled={busy} onClick={() => void go("pro_annual")}>
                    Upgrade · $100/yr
                  </Button>
                </>
              ) : (
                <a
                  href={CONTACT_PRO_URL}
                  className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-medium text-accent-foreground hover:opacity-90"
                >
                  Upgrade to Pro
                </a>
              ))}
            {canManage && (
              <Button type="button" variant="outline" disabled={busy} onClick={() => void go("portal")}>
                Manage billing
              </Button>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </section>

      <section className={CARD}>
        <h2 className="text-lg font-semibold">Payment methods & invoices</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add or remove cards, update billing address, and download invoices in Stripe Customer Portal. We do not store
          card numbers on Newsfork.
        </p>
        {canManage ? (
          <Button type="button" className="mt-4" variant="outline" disabled={busy} onClick={() => void go("portal")}>
            Open Customer Portal
          </Button>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Portal unlocks after your first Checkout. Upgrade to Pro to add a payment method.
          </p>
        )}
        <a href={PRICING_URL} className="mt-4 inline-block text-sm text-foreground underline-offset-2 hover:underline">
          Compare plans
        </a>
      </section>

      <section className={CARD}>
        <h2 className="text-lg font-semibold">Cancel subscription</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cancellation applies at period end from the Customer Portal. Your Free plan and API keys remain until you delete
          the account in Settings.
        </p>
        {canManage ? (
          <Button type="button" className="mt-4" variant="outline" disabled={busy} onClick={() => void go("portal")}>
            Cancel in Portal
          </Button>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No paid subscription on this account.</p>
        )}
      </section>
    </div>
  );
}
