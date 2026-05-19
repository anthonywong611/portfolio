import { describe, it, expect } from "vitest";
import { navLinks, contactLink } from "@/components/navbar";

describe("navbar navigation links", () => {
  it("all nav links use absolute paths so they work from any page", () => {
    for (const link of navLinks) {
      expect(link.href, `"${link.label}" link should start with /`).toMatch(
        /^\//
      );
    }
  });

  it("contact link uses absolute path", () => {
    expect(
      contactLink.href,
      `"${contactLink.label}" link should start with /`
    ).toMatch(/^\//);
  });
});
