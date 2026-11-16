"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";

function SignupContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const plan = searchParams.get("plan") ?? undefined;

  return (
    <AuthCard
      flow="signup"
      initialEmail={email}
      plan={plan}
    />
  );
}

export function SignupPageClient() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <SignupContent />
    </Suspense>
  );
}
