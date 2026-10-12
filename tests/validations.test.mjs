import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

// Schemas to test
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8),
});

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1).max(16000),
  })).min(1),
  model: z.string().optional(),
});

const generateDocumentSchema = z.object({
  templateType: z.enum(["email", "proposal", "report", "meeting", "plan"]),
  topic: z.string().min(3).max(200),
  keyPoints: z.array(z.string()).min(1),
  tone: z.enum(["professional", "persuasive", "concise", "executive", "technical"]).default("professional"),
});

test("Validation: loginSchema rejects invalid emails and short passwords", () => {
  const invalidEmail = loginSchema.safeParse({ email: "not-an-email", password: "password123" });
  assert.equal(invalidEmail.success, false);

  const shortPassword = loginSchema.safeParse({ email: "user@example.com", password: "123" });
  assert.equal(shortPassword.success, false);

  const valid = loginSchema.safeParse({ email: "user@example.com", password: "secretpassword" });
  assert.equal(valid.success, true);
});

test("Validation: signupSchema enforces password length >= 8 and full name", () => {
  const shortPass = signupSchema.safeParse({
    fullName: "Alex",
    email: "alex@example.com",
    password: "12345",
  });
  assert.equal(shortPass.success, false);

  const valid = signupSchema.safeParse({
    fullName: "Alex Morgan",
    email: "alex@example.com",
    password: "strongpassword123",
  });
  assert.equal(valid.success, true);
});

test("Validation: chatRequestSchema validates messages array and roles", () => {
  const emptyMessages = chatRequestSchema.safeParse({ messages: [] });
  assert.equal(emptyMessages.success, false);

  const invalidRole = chatRequestSchema.safeParse({
    messages: [{ role: "hacker", content: "hello" }],
  });
  assert.equal(invalidRole.success, false);

  const valid = chatRequestSchema.safeParse({
    messages: [{ role: "user", content: "Review our quarterly KPIs" }],
  });
  assert.equal(valid.success, true);
});

test("Validation: generateDocumentSchema requires valid template and key points", () => {
  const invalidTemplate = generateDocumentSchema.safeParse({
    templateType: "unsupported_template",
    topic: "Enterprise Deal",
    keyPoints: ["Point 1"],
  });
  assert.equal(invalidTemplate.success, false);

  const valid = generateDocumentSchema.safeParse({
    templateType: "proposal",
    topic: "Enterprise Deal",
    keyPoints: ["Point 1", "Point 2"],
    tone: "executive",
  });
  assert.equal(valid.success, true);
});
