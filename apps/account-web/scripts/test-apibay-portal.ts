import {
  buildApibayGoogleOauthUrl,
  buildApibayPortalUrl,
  getApibayPortalConfig,
  sanitizeHubNextUrl,
  sanitizeReturnUrl,
} from "../functions/lib/apibay-portal";

const config = getApibayPortalConfig();

const signup = buildApibayPortalUrl(
  "signup",
  config,
  new URLSearchParams("plan=pro&email=test@example.com"),
);
if (!signup.includes("api.newsfork.com/signup") || !signup.includes("plan=pro")) {
  throw new Error(`signup URL failed: ${signup}`);
}

const login = buildApibayPortalUrl("login", config, new URLSearchParams("email=user@example.com"));
if (!login.includes("/login") || !login.includes("email=user")) {
  throw new Error(`login URL failed: ${login}`);
}

const oauth = buildApibayGoogleOauthUrl("signup", config, new URLSearchParams("plan=pro"));
if (!oauth.includes("/oauth/google") || !oauth.includes("plan=pro")) {
  throw new Error(`oauth URL failed: ${oauth}`);
}

const blocked = sanitizeReturnUrl("https://evil.example/phish", config.accountOrigin);
if (blocked !== null) throw new Error("allowlist should block evil host");

const allowed = sanitizeReturnUrl("https://api.newsfork.com/dashboard", config.accountOrigin);
if (!allowed) throw new Error("allowlist should permit api.newsfork.com");

const brandOk = sanitizeReturnUrl("https://koryy.com/auth/callback", config.accountOrigin);
if (!brandOk) throw new Error("allowlist should permit koryy.com/auth/callback");

const brandWww = sanitizeReturnUrl("https://www.tokyy.com/auth/callback", config.accountOrigin);
if (!brandWww) throw new Error("allowlist should permit www.tokyy.com/auth/callback");

const brandBadPath = sanitizeReturnUrl("https://koryy.com/ops/push", config.accountOrigin);
if (brandBadPath !== null) throw new Error("brand hosts must only allow /auth/callback");

const hubNext = sanitizeHubNextUrl("https://koryy.com/auth/callback");
if (!hubNext) throw new Error("hub next should allow brand callback");

const hubEvil = sanitizeHubNextUrl("https://evil.example/auth/callback");
if (hubEvil !== null) throw new Error("hub next should block evil host");

const withReturn = buildApibayPortalUrl(
  "login",
  config,
  new URLSearchParams({
    email: "user@example.com",
    return_url: "https://account.newsfork.com/api/auth/hub-callback?next=https%3A%2F%2Fkoryy.com%2Fauth%2Fcallback",
  }),
);
if (!withReturn.includes("return_url=")) {
  throw new Error(`login should forward hub-callback return_url: ${withReturn}`);
}

console.log("✅ apibay-portal URL builders OK");
