import { test, expect, type Page } from "@playwright/test";

test.describe("account portal static UI", () => {
  test("login page asks for email and links to signup", async ({ page }) => {
    await page.goto("/login/");
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Email me a code" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "https://account.newsfork.com/signup",
    );
  });

  test("signup page collects optional profile fields and states weighted units", async ({ page }) => {
    await page.goto("/signup/");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
    await expect(page.getByText(/1,000 weighted units/i)).toBeVisible();
    await expect(page.getByLabel(/Company/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "https://account.newsfork.com/login",
    );
  });

  test("signup rejects an invalid email without calling the API", async ({ page }) => {
    await page.goto("/signup/");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Email").evaluate((el) => el.removeAttribute("type"));
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  });

  test("robots.txt disallows crawlers", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain("Disallow: /");
  });

  test("unauthenticated dashboard redirects to login when account API returns 401", async ({ page }) => {
    await page.route("**/v1/account/**", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "unauthorized" }),
      });
    });
    await page.goto("/dashboard/billing/");
    await expect(page).toHaveURL(/\/login\/\?next=/);
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  });
});

async function mockSignedInWithBrokenLogout(page: Page) {
  const month = { used: 0, limit: 1000, remaining: 1000, resetAt: null };
  const plan = { id: "free", name: "Free", monthlyPriceUsd: 0, monthlyUnits: 1000, rateLimitPerMinute: 60, maxActiveKeys: 2, features: ["core"] };
  const bodies: Record<string, unknown> = {
    me: {
      consumer: { id: "c1", email: "dev@example.com", name: null, company: null, plan: "free", createdAt: "2026-11-01T00:00:00Z" },
      plan,
      usage: { month, rateLimitPerMinute: 60 },
      keys: { active: 0, max: 2 },
    },
    keys: { keys: [] },
    usage: { days: [], month, monthlyLimit: 1000 },
  };
  await page.route("**/v1/account/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace("/v1/account/", "");
    if (path === "auth/logout") return route.abort();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "http://127.0.0.1:3099", "access-control-allow-credentials": "true" },
      body: JSON.stringify(bodies[path] ?? {}),
    });
  });
}

test("a failed log out stays on the dashboard and says so", async ({ page }) => {
  await mockSignedInWithBrokenLogout(page);
  await page.goto("/dashboard/");
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.getByText(/Log out failed/)).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/$/);
  await page.getByRole("navigation", { name: "Account" }).getByRole("link", { name: "API keys" }).click();
  await expect(page).toHaveURL(/\/dashboard\/keys\/$/);
  await expect(page.getByText(/Log out failed/)).toHaveCount(0);
});

test("a failed log out from settings stays there and says so", async ({ page }) => {
  await mockSignedInWithBrokenLogout(page);
  await page.goto("/dashboard/settings/");
  await page.getByRole("main").getByRole("button", { name: /log out|sign out/i }).click();
  await expect(page.getByText(/Log out failed/)).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard\/settings\/$/);
});
