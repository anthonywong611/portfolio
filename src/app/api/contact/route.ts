import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const rateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    // Rate limiting (1 per IP per minute)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const lastSubmission = rateLimitMap.get(ip);
    const now = Date.now();
    if (lastSubmission && now - lastSubmission < 60_000) {
      return NextResponse.json(
        { error: "Please wait a moment before sending another message." },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, now);

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "hello@anthonywong.dev",
      subject: `Portfolio contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
