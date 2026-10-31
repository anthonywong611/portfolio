/**
 * Pure contact-form logic shared by the API route (and the form's maxLength attributes).
 * No server-only imports, so this module is safe to use from client components.
 */

export const CONTACT_LIMITS = {
  name: 100,
  email: 254, // RFC 5321 maximum address length
  message: 5000,
} as const;

export const DEFAULT_CONTACT_TO = "anthonywong2718@gmail.com";
// Resend's sandbox sender. It only delivers to the Resend account owner's address.
// Set CONTACT_FROM_EMAIL to an address on a verified domain to send anywhere.
export const DEFAULT_CONTACT_FROM = "Portfolio Contact <onboarding@resend.dev>";

export type ContactData = { name: string; email: string; message: string };

export type ContactValidation =
  | { ok: true; data: ContactData }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(body: Record<string, unknown>, key: keyof ContactData): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(body: unknown): ContactValidation {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "All fields are required." };
  }
  const record = body as Record<string, unknown>;
  const data: ContactData = {
    name: field(record, "name"),
    email: field(record, "email"),
    message: field(record, "message"),
  };

  if (!data.name || !data.email || !data.message) {
    return { ok: false, error: "All fields are required." };
  }
  for (const key of ["name", "email", "message"] as const) {
    if (data[key].length > CONTACT_LIMITS[key]) {
      return {
        ok: false,
        error: `Your ${key} is too long (maximum ${CONTACT_LIMITS[key]} characters).`,
      };
    }
  }
  if (!EMAIL_RE.test(data.email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  return { ok: true, data };
}

/** The hidden "website" field is only filled in by bots. */
export function isHoneypotFilled(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const website = (body as Record<string, unknown>).website;
  return typeof website === "string" && website.trim().length > 0;
}

type Env = Record<string, string | undefined>;

export function getContactConfig(env: Env = process.env): { to: string; from: string } {
  return {
    to: env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO,
    from: env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_CONTACT_FROM,
  };
}

export function buildContactEmail(data: ContactData, config: { to: string; from: string }) {
  // Collapse control characters (CR/LF/tab...) so the subject stays one line.
   
  const subjectName = data.name.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
  return {
    from: config.from,
    to: config.to,
    replyTo: data.email,
    subject: `Portfolio contact from ${subjectName}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  };
}
