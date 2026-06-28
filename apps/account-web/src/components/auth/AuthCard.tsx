"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthSocialDivider } from "@/components/auth/AuthSocialDivider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ONBOARDING_PANEL_CLASS } from "@/lib/onboarding-layout";
import {
  ACCOUNT_SIGNIN_URL,
  ACCOUNT_SIGNUP_URL,
  buildContinueUrl,
  buildGoogleAuthUrl,
  EMAIL_RE,
} from "@/lib/account-urls";

export type AuthFlow = "login" | "signup";

interface AuthCardProps {
  flow: AuthFlow;
  initialEmail?: string;
  plan?: string;
  oauthError?: string;
}

export function AuthCard({ flow, initialEmail = "", plan, oauthError }: AuthCardProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(oauthError ?? null);

  const isLogin = flow === "login";
  const title = isLogin ? "Log in" : "Create account";
  const subtitle = isLogin
    ? "Sign in with your email and password. We will email a verification code next."
    : "Enter your email to get started. Free tier includes 1,000 requests per month — no credit card required.";

  const query = new URLSearchParams();
  if (plan) query.set("plan", plan);

  const googleHref = buildGoogleAuthUrl(flow, query);
  const alternateHref = isLogin ? ACCOUNT_SIGNUP_URL : ACCOUNT_SIGNIN_URL;
  const alternateLabel = isLogin ? "Sign up" : "Log in";
  const forgotHref = buildContinueUrl("forgot", query);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      setError("Enter a valid email address.");
      return;
    }

    const params = new URLSearchParams(query);
    params.set("email", normalized);
    if (password && isLogin) {
      params.set("has_password", "1");
    }

    window.location.href = buildContinueUrl(flow, params);
  }

  return (
    <div className={ONBOARDING_PANEL_CLASS}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

      {error && (
        <div
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
          />
        </div>

        {isLogin && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none ring-accent focus:ring-2"
            />
          </div>
        )}

        <Button type="submit" variant="accent" size="lg">
          {isLogin ? "Log in" : "Continue"}
        </Button>
      </form>

      <AuthSocialDivider />
      <GoogleSignInButton href={googleHref} label={isLogin ? "Log in with Google" : "Continue with Google"} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? "New to the platform? " : "Already have an account? "}
        <Link href={alternateHref} className="font-medium text-foreground underline-offset-2 hover:underline">
          {alternateLabel}
        </Link>
        {isLogin && (
          <>
            <span className="mx-1">·</span>
            <a href={forgotHref} className="font-medium text-foreground underline-offset-2 hover:underline">
              Forgot password
            </a>
          </>
        )}
      </p>
    </div>
  );
}
