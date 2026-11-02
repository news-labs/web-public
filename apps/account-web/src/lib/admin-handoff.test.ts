import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  accountLoginWithReturn,
  adminTenantPath,
  isAllowedAdminReturnUrl,
  opsDomainPath,
} from "./admin-handoff.ts";

describe("F4 admin/ops return URLs", () => {
  it("builds admin and ops paths", () => {
    assert.equal(adminTenantPath("kory"), "https://admin.newsfork.com/t/kory/domain");
    assert.equal(opsDomainPath("koryy.com"), "https://ops.koryy.com/domain");
  });

  it("allowlists admin/cms/ops only", () => {
    assert.equal(isAllowedAdminReturnUrl("https://admin.newsfork.com/t/kory/"), true);
    assert.equal(isAllowedAdminReturnUrl("https://ops.koryy.com/domain"), true);
    assert.equal(isAllowedAdminReturnUrl("https://evil.example/"), false);
    assert.throws(() => accountLoginWithReturn("https://evil.example/"), /redirect_not_allowed/);
    assert.match(accountLoginWithReturn("https://ops.koryy.com/domain"), /return_url=/);
  });
});
