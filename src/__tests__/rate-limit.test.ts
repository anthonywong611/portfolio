import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows the first hit for a key", () => {
    const limiter = createRateLimiter({ windowMs: 60_000 });
    expect(limiter.check("1.1.1.1", 0)).toEqual({ allowed: true, retryAfterMs: 0 });
  });

  it("blocks a second hit inside the window and reports time left", () => {
    const limiter = createRateLimiter({ windowMs: 60_000 });
    limiter.check("1.1.1.1", 0);
    expect(limiter.check("1.1.1.1", 15_000)).toEqual({ allowed: false, retryAfterMs: 45_000 });
  });

  it("allows the key again once the window has passed", () => {
    const limiter = createRateLimiter({ windowMs: 60_000 });
    limiter.check("1.1.1.1", 0);
    expect(limiter.check("1.1.1.1", 60_000).allowed).toBe(true);
  });

  it("does not extend the window on blocked hits", () => {
    const limiter = createRateLimiter({ windowMs: 60_000 });
    limiter.check("1.1.1.1", 0);
    limiter.check("1.1.1.1", 59_000); // blocked
    expect(limiter.check("1.1.1.1", 60_000).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ windowMs: 60_000 });
    limiter.check("1.1.1.1", 0);
    expect(limiter.check("2.2.2.2", 1).allowed).toBe(true);
  });

  it("prunes expired entries so memory stays bounded", () => {
    const limiter = createRateLimiter({ windowMs: 1_000, maxKeys: 100 });
    for (let i = 0; i < 100; i++) limiter.check(`ip-${i}`, 0);
    limiter.check("late", 5_000); // all earlier entries have expired
    expect(limiter.size()).toBe(1);
  });

  it("never holds more than maxKeys, evicting the oldest first", () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxKeys: 3 });
    for (const ip of ["a", "b", "c", "d"]) limiter.check(ip, 0);
    expect(limiter.size()).toBe(3);
    expect(limiter.check("a", 1).allowed).toBe(true); // "a" was evicted
    expect(limiter.check("d", 1).allowed).toBe(false); // newest kept
  });
});
