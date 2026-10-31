import { NextRequest, NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import {
  buildContactEmail,
  getContactConfig,
  isHoneypotFilled,
  validateContact,
} from "@/lib/contact";
import { createRateLimiter } from "@/lib/rate-limit";

// One message per IP per minute. In-memory and per serverless instance (best-effort);
// see src/lib/rate-limit.ts.
const limiter = createRateLimiter({ windowMs: 60_000 });

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn they were caught.
  if (isHoneypotFilled(body)) {
    return NextResponse.json({ success: true });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { allowed, retryAfterMs } = limiter.check(clientIp(request));
  if (!allowed) {
    return NextResponse.json(
      { error: "Please wait a moment before sending another message." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  try {
    // The Resend SDK reports API failures in `error` rather than throwing.
    const { error } = await getResend().emails.send(
      buildContactEmail(result.data, getContactConfig()),
    );
    if (error) {
      console.error("[contact] Resend rejected the email:", error.name, error.message);
      return NextResponse.json(
        { error: "Sorry, your message couldn't send right now. Please try again later." },
        { status: 502 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Failed to send:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
