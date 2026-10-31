import { describe, it, expect } from "vitest";
import {
  CONTACT_LIMITS,
  buildContactEmail,
  getContactConfig,
  isHoneypotFilled,
  validateContact,
} from "@/lib/contact";

const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" };

describe("validateContact", () => {
  it("accepts a valid submission and trims fields", () => {
    expect(validateContact({ name: "  Ada ", email: " ada@example.com ", message: " Hi \n" })).toEqual({
      ok: true,
      data: { name: "Ada", email: "ada@example.com", message: "Hi" },
    });
  });

  it.each([
    ["missing name", { ...valid, name: undefined }],
    ["blank message", { ...valid, message: "   " }],
    ["non-string email", { ...valid, email: 42 }],
    ["not an object", null],
  ])("rejects %s as missing fields", (_label, body) => {
    expect(validateContact(body)).toEqual({ ok: false, error: "All fields are required." });
  });

  it.each(["no-at-sign", "a@b", "a b@example.com", "@example.com", "ada@"])(
    "rejects invalid email %j",
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({ ok: false, error: "Please enter a valid email." });
    },
  );

  it.each([
    ["name", CONTACT_LIMITS.name],
    ["email", CONTACT_LIMITS.email],
    ["message", CONTACT_LIMITS.message],
  ] as const)("rejects a %s longer than %i characters", (field, max) => {
    const tooLong = field === "email" ? `${"a".repeat(max)}@example.com` : "x".repeat(max + 1);
    const result = validateContact({ ...valid, [field]: tooLong });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(new RegExp(`${field}.*${max}`, "i"));
  });

  it("accepts fields exactly at the limit", () => {
    expect(validateContact({ ...valid, name: "x".repeat(CONTACT_LIMITS.name), message: "y".repeat(CONTACT_LIMITS.message) }).ok).toBe(true);
  });
});

describe("isHoneypotFilled", () => {
  it("is true only when the hidden website field has content", () => {
    expect(isHoneypotFilled({ ...valid, website: "http://spam" })).toBe(true);
    expect(isHoneypotFilled({ ...valid, website: "" })).toBe(false);
    expect(isHoneypotFilled({ ...valid, website: null })).toBe(false);
    expect(isHoneypotFilled(valid)).toBe(false);
    expect(isHoneypotFilled(null)).toBe(false);
  });
});

describe("getContactConfig", () => {
  it("defaults to the Gmail inbox and the Resend sandbox sender", () => {
    expect(getContactConfig({})).toEqual({
      to: "anthonywong2718@gmail.com",
      from: "Portfolio Contact <onboarding@resend.dev>",
    });
  });

  it("uses CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL when set, ignoring blanks", () => {
    expect(getContactConfig({ CONTACT_TO_EMAIL: "me@x.dev", CONTACT_FROM_EMAIL: "Site <contact@x.dev>" })).toEqual({
      to: "me@x.dev",
      from: "Site <contact@x.dev>",
    });
    expect(getContactConfig({ CONTACT_TO_EMAIL: "  ", CONTACT_FROM_EMAIL: "" }).to).toBe("anthonywong2718@gmail.com");
  });
});

describe("buildContactEmail", () => {
  const config = { to: "me@x.dev", from: "Site <contact@x.dev>" };

  it("addresses the email and sets reply-to to the visitor", () => {
    const email = buildContactEmail(valid, config);
    expect(email).toMatchObject({ to: "me@x.dev", from: "Site <contact@x.dev>", replyTo: "ada@example.com" });
    expect(email.subject).toBe("Portfolio contact from Ada Lovelace");
    expect(email.text).toBe("Name: Ada Lovelace\nEmail: ada@example.com\n\nMessage:\nHello there");
  });

  it("strips line breaks and control characters from the subject", () => {
    const email = buildContactEmail({ ...valid, name: "Eve\r\nBcc: x@y.z\t" }, config);
    expect(email.subject).toBe("Portfolio contact from Eve Bcc: x@y.z");
  });
});
