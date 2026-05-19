import { describe, it, expect } from "vitest";
import { subjects } from "@/data/subjects";

describe("subject registry", () => {
  it("exports a non-empty array of subjects", () => {
    expect(subjects.length).toBeGreaterThan(0);
  });

  it("each subject has a slug and label", () => {
    for (const subject of subjects) {
      expect(subject.slug).toBeTruthy();
      expect(subject.label).toBeTruthy();
    }
  });

  it("subjects are sorted alphabetically by label", () => {
    const labels = subjects.map((s) => s.label);
    const sorted = [...labels].sort((a, b) => a.localeCompare(b));
    expect(labels).toEqual(sorted);
  });

  it("slugs are URL-safe (lowercase, hyphens only)", () => {
    for (const subject of subjects) {
      expect(subject.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});
