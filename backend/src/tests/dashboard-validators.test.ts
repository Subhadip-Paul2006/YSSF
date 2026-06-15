import test from "node:test";
import assert from "node:assert";
import {
  updateProfileSchema,
  verifyNgoSchema,
  updateCampaignStatusSchema,
  updateBlogStatusSchema,
} from "../validators/dashboard.schema.js";

test("Dashboard admin validators", async (t) => {
  await t.test("updateProfileSchema strips unknown fields and caps lengths", () => {
    const result = updateProfileSchema.safeParse({
      name: "A",
      phone: "+91 9999999999",
      panTaxId: "ABCDE1234F",
      role: "ADMIN", // not allowed — must be stripped
      emailVerified: true, // not allowed
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.name, "A");
      assert.ok(!("role" in result.data));
      assert.ok(!("emailVerified" in result.data));
    }
  });

  await t.test("updateProfileSchema rejects oversized strings", () => {
    const result = updateProfileSchema.safeParse({
      location: "x".repeat(5000),
    });
    assert.strictEqual(result.success, false);
  });

  await t.test("updateProfileSchema accepts a valid website URL", () => {
    const result = updateProfileSchema.safeParse({
      website: "https://example.org/path",
    });
    assert.strictEqual(result.success, true);
  });

  await t.test("updateProfileSchema rejects a non-URL website", () => {
    const result = updateProfileSchema.safeParse({
      website: "not a url",
    });
    assert.strictEqual(result.success, false);
  });

  await t.test("verifyNgoSchema accepts only the three status values", () => {
    assert.strictEqual(verifyNgoSchema.safeParse({ status: "approved" }).success, true);
    assert.strictEqual(verifyNgoSchema.safeParse({ status: "rejected" }).success, true);
    assert.strictEqual(verifyNgoSchema.safeParse({ status: "pending" }).success, true);
    assert.strictEqual(verifyNgoSchema.safeParse({ status: "garbage" }).success, false);
  });

  await t.test("updateCampaignStatusSchema rejects unknown statuses", () => {
    assert.strictEqual(updateCampaignStatusSchema.safeParse({ status: "active" }).success, true);
    assert.strictEqual(updateCampaignStatusSchema.safeParse({ status: "paused" }).success, true);
    assert.strictEqual(updateCampaignStatusSchema.safeParse({ status: "evil" }).success, false);
  });

  await t.test("updateBlogStatusSchema coerces booleans only", () => {
    assert.strictEqual(updateBlogStatusSchema.safeParse({ published: true }).success, true);
    assert.strictEqual(updateBlogStatusSchema.safeParse({ published: "true" }).success, false);
  });
});
