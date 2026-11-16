import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSessionProtectedPath, sanitizeDashboardNext } from "./dashboard-gate.ts";

describe("dashboard-gate", () => {
  it("protects home and dashboard paths", () => {
    assert.equal(isSessionProtectedPath("/"), true);
    assert.equal(isSessionProtectedPath("/dashboard"), true);
    assert.equal(isSessionProtectedPath("/dashboard/keys/"), true);
    assert.equal(isSessionProtectedPath("/login/"), false);
    assert.equal(isSessionProtectedPath("/api/account/me"), false);
  });

  it("sanitizes next like the client helper", () => {
    assert.equal(sanitizeDashboardNext("/dashboard/keys/"), "/dashboard/keys/");
    assert.equal(sanitizeDashboardNext("//evil.example/dashboard/"), null);
    assert.equal(sanitizeDashboardNext("/login/"), null);
  });
});
