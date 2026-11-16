"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

type CheckoutStatus = "success" | "cancel";

const MESSAGES: Record<CheckoutStatus, { title: string; body: string }> = {
  success: {
    title: "Subscription confirmed",
    body: "Thanks! Your plan is active. It can take up to a minute for your API key to pick up the new limits.",
  },
  cancel: {
    title: "Checkout canceled",
    body: "No payment was taken. You can restart checkout whenever you're ready.",
  },
};

function readStatus(): CheckoutStatus | null {
  const value = new URLSearchParams(window.location.search).get("checkout");
  return value === "success" || value === "cancel" ? value : null;
}

/** Shown after Stripe Checkout redirects back with `?checkout=success|cancel`. */
export function CheckoutStatusBanner() {
  const [status, setStatus] = useState<CheckoutStatus | null>(null);

  useEffect(() => {
    setStatus(readStatus());
  }, []);

  const dismiss = () => {
    setStatus(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    url.searchParams.delete("session_id");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  };

  if (!status) return null;
  const { title, body } = MESSAGES[status];
  const Icon = status === "success" ? CheckCircle2 : XCircle;

  return (
    <div className="container mx-auto max-w-3xl px-4 pt-8">
      <div
        role="status"
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          status === "success" ? "border-accent bg-accent/5" : "border-border bg-muted/40"
        }`}
      >
        <Icon
          size={20}
          className={`mt-0.5 shrink-0 ${status === "success" ? "text-accent" : "text-muted-foreground"}`}
        />
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
