import type { BillingPlan, BillingStatus } from "@/lib/account-api";

export const CARD = "rounded-xl border border-border/60 bg-card p-6 shadow-sm";
export const NUM = new Intl.NumberFormat("en-US");

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export function featureLabel(feature: string): string {
  if (feature === "semantic") return "Semantic search & ask";
  if (feature === "mcp") return "MCP tools";
  return "News & sources API";
}

/** Marketing / signup deep-links that should open Stripe Checkout once the session is ready. */
export function resolveProCheckoutPlan(plan: string | null): BillingPlan | null {
  if (plan === "pro_annual") return "pro_annual";
  if (plan === "pro" || plan === "pro_monthly") return "pro_monthly";
  return null;
}

export function isPaidBilling(billing: BillingStatus | null): boolean {
  return billing !== null && billing.tier !== "free" && billing.status !== "canceled";
}

export function billingNote(billing: BillingStatus | null): string | null {
  if (!billing || billing.tier === "free") return null;
  if (billing.status === "trialing" && billing.trialEnd) return `Trial ends ${formatDate(billing.trialEnd)}`;
  if (billing.status === "past_due") return "Payment failed — update your payment method in Manage billing.";
  if (billing.cancelAtPeriodEnd && billing.currentPeriodEnd) return `Cancels on ${formatDate(billing.currentPeriodEnd)}`;
  if (billing.currentPeriodEnd) return `Renews ${formatDate(billing.currentPeriodEnd)}`;
  return null;
}
