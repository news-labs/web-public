"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";

function LoginContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const plan = searchParams.get("plan") ?? undefined;
  const returnUrl = searchParams.get("return_url") ?? undefined;

  return (
    <AuthCard
      flow="login"
      initialEmail={email}
      plan={plan}
      returnUrl={returnUrl}
    />
  );
}

export function LoginPageClient() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
