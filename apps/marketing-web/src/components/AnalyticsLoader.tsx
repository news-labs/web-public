"use client";

import { useEffect } from "react";
import {
  COOKIE_CONSENT_SAVED_EVENT,
  consentAllowsAnalytics,
} from "@/lib/cookie-consent";

const BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

function loadBeacon(): void {
  if (!BEACON_TOKEN || !consentAllowsAnalytics()) return;
  if (document.querySelector('script[data-cf-beacon-loaded="true"]')) return;

  const script = document.createElement("script");
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.defer = true;
  script.setAttribute("data-cf-beacon-loaded", "true");
  script.setAttribute("data-cf-beacon", JSON.stringify({ token: BEACON_TOKEN }));
  document.head.appendChild(script);
}

export function AnalyticsLoader() {
  useEffect(() => {
    loadBeacon();

    const handleConsentSaved = () => loadBeacon();
    window.addEventListener(COOKIE_CONSENT_SAVED_EVENT, handleConsentSaved);
    return () => window.removeEventListener(COOKIE_CONSENT_SAVED_EVENT, handleConsentSaved);
  }, []);

  return null;
}
