import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  accountLoginWithReturn,
  adminTenantPath,
  cmsBrandPath,
  isAllowedAdminReturnUrl,
  opsDomainPath,
} from "./admin-handoff.ts";

describe("admin-handoff", () => {
  it("builds cms brand paths as canonical entry", () => {
    assert.equal(cmsBrandPath("kory"), "https://cms.newsfork.com/kory/domain");
    assert.equal(adminTenantPath("kory"), "https://cms.newsfork.com/kory/domain");
    assert.equal(opsDomainPath("koryy.com"), "https://cms.newsfork.com/login");
  });

  it("allowlists admin + cms only (ops retired)", () => {
    assert.equal(isAllowedAdminReturnUrl("https://admin.newsfork.com/platform/"), true);
    assert.equal(isAllowedAdminReturnUrl("https://cms.newsfork.com/kory/"), true);
    assert.equal(isAllowedAdminReturnUrl("https://ops.koryy.com/domain"), false);
  });

  it("builds account login return_url", () => {
    assert.match(
      accountLoginWithReturn("https://cms.newsfork.com/kory/domain"),
      /return_url=/,
    );
  });
});
