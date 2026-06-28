"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_SETTINGS_EVENT,
  getCookieConsent,
  saveCookieConsent,
  type CookieConsentPreferences,
} from "@/lib/cookie-consent";

const DOCS_COOKIE_POLICY = "https://docs.newsfork.com/legal/cookie-policy/";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [functional, setFunctional] = useState(true);

  const applyConsent = useCallback((preferences: CookieConsentPreferences) => {
    saveCookieConsent(preferences);
    setVisible(false);
    setShowCustomize(false);
  }, []);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const existing = getCookieConsent();
      setAnalytics(existing?.analytics ?? false);
      setFunctional(existing?.functional ?? true);
      setShowCustomize(true);
      setVisible(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpen);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-lg sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-revamp-content">
        {!showCustomize ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              We use cookies to ensure you get the best experience on our website.{" "}
              <Link
                href={DOCS_COOKIE_POLICY}
                className="underline underline-offset-2 hover:text-accent"
              >
                Cookie Policy
              </Link>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  applyConsent({ necessary: true, analytics: false, functional: false })
                }
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Accept necessary
              </button>
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={() =>
                  applyConsent({ necessary: true, analytics: true, functional: true })
                }
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">Cookie settings</p>
            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-3">
                <input type="checkbox" checked disabled className="mt-1" />
                <span>
                  <span className="font-medium">Strictly necessary</span>
                  <span className="block text-muted-foreground">
                    Required for the site to function. Always enabled.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">Functional</span>
                  <span className="block text-muted-foreground">
                    Remember theme and UI preferences.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">Analytics</span>
                  <span className="block text-muted-foreground">
                    Help us understand how visitors use the site.
                  </span>
                </span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  applyConsent({ necessary: true, analytics, functional })
                }
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
