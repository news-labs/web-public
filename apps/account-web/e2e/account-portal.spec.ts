import { test, expect } from "@playwright/test";

test.describe("account portal static UI", () => {
  test("login page shows auth form and signup link", async ({ page }) => {
    await page.goto("/login/");
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "https://account.newsfork.com/signup",
    );
  });

  test("signup page shows continue CTA", async ({ page }) => {
    await page.goto("/signup/");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "https://account.newsfork.com/login",
    );
  });

  test("signup preserves plan query in google auth link", async ({ page }) => {
    await page.goto("/signup/?plan=pro");
    const googleLink = page.getByRole("link", { name: "Continue with Google" });
    await expect(googleLink).toHaveAttribute("href", /plan=pro/);
  });

  test("robots.txt disallows crawlers", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain("Disallow: /");
  });
});
