import { test, expect } from "@playwright/test";

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

  test("signup page collects optional profile fields", async ({ page }) => {
    await page.goto("/signup/");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
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
});
