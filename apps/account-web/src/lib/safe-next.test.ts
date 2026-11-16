import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeDashboardNext } from "./safe-next";

describe("sanitizeDashboardNext", () => {
  it("allows dashboard paths with query", () => {
    assert.equal(sanitizeDashboardNext("/dashboard/"), "/dashboard/");
    assert.equal(sanitizeDashboardNext("/dashboard/keys/"), "/dashboard/keys/");
    assert.equal(
      sanitizeDashboardNext("/dashboard/billing/?checkout=success"),
      "/dashboard/billing/?checkout=success",
    );
  });

  it("rejects open redirects", () => {
    assert.equal(sanitizeDashboardNext("https://evil.example/dashboard/"), null);
    assert.equal(sanitizeDashboardNext("//evil.example/dashboard/"), null);
    assert.equal(sanitizeDashboardNext("/login/"), null);
    assert.equal(sanitizeDashboardNext("/dashboard/../login/"), null);
  });
});
