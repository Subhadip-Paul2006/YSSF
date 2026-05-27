import test from "node:test";
import assert from "node:assert";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

// Test 1: Bcrypt Hashing & Verification
test("Password Hashing - bcryptjs", async (t) => {
  await t.test("should securely hash a password and verify it", async () => {
    const password = "securepassword123";
    const hash = await bcrypt.hash(password, 10);
    
    assert.notStrictEqual(password, hash);
    
    const isMatch = await bcrypt.compare(password, hash);
    assert.strictEqual(isMatch, true);
    
    const isWrongMatch = await bcrypt.compare("wrongpassword", hash);
    assert.strictEqual(isWrongMatch, false);
  });
});

// Test 2: JWT Generation & Verification
test("JWT Session Tokens - jose", async (t) => {
  const TEST_SECRET = new TextEncoder().encode("test-secret-key-at-least-32-chars-long");

  await t.test("should sign a JWT payload and verify it correctly", async () => {
    const userId = "test-user-id-001";
    
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(TEST_SECRET);
      
    assert.strictEqual(typeof token, "string");
    
    const { payload } = await jwtVerify(token, TEST_SECRET);
    assert.strictEqual(payload.userId, userId);
  });

  await t.test("should fail verification with incorrect secret key", async () => {
    const userId = "test-user-id-001";
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .sign(TEST_SECRET);
      
    const WRONG_SECRET = new TextEncoder().encode("wrong-secret-key-at-least-32-chars");
    
    await assert.rejects(async () => {
      await jwtVerify(token, WRONG_SECRET);
    });
  });
});

// Test 3: Zod Input Validation Schema
test("Zod Request Validation Schemas", async (t) => {
  const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional().nullable(),
    role: z.string().default("volunteer"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  await t.test("should pass valid registration request body", () => {
    const validBody = {
      name: "John Doe",
      email: "john@example.com",
      role: "volunteer",
      password: "password123",
    };
    
    const parseResult = registerSchema.safeParse(validBody);
    assert.strictEqual(parseResult.success, true);
    if (parseResult.success) {
      assert.strictEqual(parseResult.data.name, "John Doe");
      assert.strictEqual(parseResult.data.role, "volunteer");
    }
  });

  await t.test("should fail registration request with invalid email format", () => {
    const invalidBody = {
      name: "John Doe",
      email: "invalidemail",
      role: "volunteer",
      password: "password123",
    };
    
    const parseResult = registerSchema.safeParse(invalidBody);
    assert.strictEqual(parseResult.success, false);
    if (!parseResult.success) {
      assert.strictEqual(parseResult.error.issues[0].message, "Invalid email format");
    }
  });

  await t.test("should fail registration request with short password", () => {
    const invalidBody = {
      name: "John Doe",
      email: "john@example.com",
      role: "volunteer",
      password: "123",
    };
    
    const parseResult = registerSchema.safeParse(invalidBody);
    assert.strictEqual(parseResult.success, false);
    if (!parseResult.success) {
      assert.strictEqual(parseResult.error.issues[0].message, "Password must be at least 6 characters");
    }
  });
});
