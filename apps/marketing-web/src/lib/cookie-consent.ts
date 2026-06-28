export type CookieConsentLevel = "necessary" | "all" | "custom";

export interface CookieConsentPreferences {
  necessary: true;
  analytics: boolean;
  functional: boolean;
}

const STORAGE_KEY = "cookie_consent";

export const COOKIE_SETTINGS_EVENT = "newsfork:open-cookie-settings";
export const COOKIE_CONSENT_SAVED_EVENT = "newsfork:cookie-consent-saved";

export function getCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsentPreferences;
  } catch {
    return null;
  }
}

export function saveCookieConsent(preferences: CookieConsentPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_SAVED_EVENT));
}

export function openCookieSettings(): void {
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}

export function consentAllowsAnalytics(): boolean {
  const prefs = getCookieConsent();
  return prefs?.analytics ?? false;
}
