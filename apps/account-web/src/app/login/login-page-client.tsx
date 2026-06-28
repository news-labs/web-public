"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";

function LoginContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const plan = searchParams.get("plan") ?? undefined;
  const oauthError = searchParams.get("error") ?? undefined;

  return (
    <AuthCard
      flow="login"
      initialEmail={email}
      plan={plan}
      oauthError={oauthError ? "Sign-in could not be completed. Please try again." : undefined}
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
