import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const send = vi.fn();
vi.mock("@/lib/resend", () => ({ getResend: () => ({ emails: { send } }) }));

const { POST } = await import("@/app/api/contact/route");

let ipCounter = 0;
function post(body: unknown, ip = `10.0.0.${++ipCounter}`) {
  return POST(
    new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `${ip}, 70.0.0.1` },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const valid = { name: "Ada", email: "ada@example.com", message: "Hello", website: "" };

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "email_123" }, error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/contact", () => {
  it("sends the email and returns success", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({ replyTo: "ada@example.com", to: "anthonywong2718@gmail.com" });
  });

  it("reports failure when Resend returns an error instead of throwing", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "You can only send testing emails to your own email address" } });
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/couldn't send/i);
  });

  it("returns 500 when the Resend client cannot be created (e.g. missing API key)", async () => {
    send.mockRejectedValue(new Error("RESEND_API_KEY environment variable is not set"));
    const res = await post(valid);
    expect(res.status).toBe(500);
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const res = await post({ ...valid, website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 400 with the validation message for bad input", async () => {
    const res = await post({ ...valid, message: "x".repeat(10_000) });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/message/i);
    expect(send).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed JSON body", async () => {
    const res = await post("{not json");
    expect(res.status).toBe(400);
  });

  it("rate limits a second submission from the same IP", async () => {
    expect((await post(valid, "203.0.113.9")).status).toBe(200);
    const res = await post(valid, "203.0.113.9");
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toMatch(/^\d+$/);
    expect(send).toHaveBeenCalledOnce();
  });

  it("does not count invalid submissions against the rate limit", async () => {
    await post({ ...valid, email: "nope" }, "203.0.113.10");
    expect((await post(valid, "203.0.113.10")).status).toBe(200);
  });
});
