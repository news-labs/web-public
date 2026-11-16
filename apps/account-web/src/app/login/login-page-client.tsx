"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";

function LoginContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const plan = searchParams.get("plan") ?? undefined;
  const returnUrl = searchParams.get("return_url") ?? undefined;
  const deleted = searchParams.get("deleted") === "1";

  return (
    <div className="space-y-4">
      {deleted && (
        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="status">
          Your account was deleted. You can create a new one any time.
        </p>
      )}
      <AuthCard flow="login" initialEmail={email} plan={plan} returnUrl={returnUrl} />
    </div>
  );
}

export function LoginPageClient() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
