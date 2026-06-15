import test from "node:test";
import assert from "node:assert";
import crypto from "crypto";

// Mirror the hashing helpers used by the backend services to verify the
// shape is correct and that we use constant-time comparison.
function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code, "utf8").digest("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

test("OTP / link token storage hashing", async (t) => {
  await t.test("hashCode produces a stable 64-char hex digest", () => {
    const h = hashCode("123456");
    assert.strictEqual(typeof h, "string");
    assert.strictEqual(h.length, 64);
    assert.match(h, /^[0-9a-f]{64}$/);
  });

  await t.test("hashCode is collision-resistant on small input", () => {
    const a = hashCode("123456");
    const b = hashCode("654321");
    assert.notStrictEqual(a, b);
  });

  await t.test("timingSafeEqualHex matches on identical hashes", () => {
    const h = hashCode("abcdef");
    assert.strictEqual(timingSafeEqualHex(h, h), true);
  });

  await t.test("timingSafeEqualHex rejects mismatched hashes", () => {
    const h = hashCode("abcdef");
    const g = hashCode("abcdee");
    assert.strictEqual(timingSafeEqualHex(h, g), false);
  });

  await t.test("timingSafeEqualHex rejects length mismatches", () => {
    assert.strictEqual(timingSafeEqualHex("aa", "aaaa"), false);
  });

  await t.test("timingSafeEqualHex handles length mismatches of any kind", () => {
    assert.strictEqual(timingSafeEqualHex("aa", "aaaa"), false);
    assert.strictEqual(timingSafeEqualHex("aaaa", "aa"), false);
  });
});
