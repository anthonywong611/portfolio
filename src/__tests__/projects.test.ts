import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { projects } from "@/data/projects";

const publicDir = path.resolve(__dirname, "../../public");

describe("project data", () => {
  it("slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("slugs are URL-safe (lowercase, hyphens only)", () => {
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("declared images live under /images/projects/", () => {
    for (const project of projects.filter((p) => p.image)) {
      expect(project.image, project.slug).toMatch(/^\/images\/projects\/[^/]+\.(png|jpe?g|webp|avif)$/);
    }
  });

  it("declared images exist in public/", () => {
    const missing = projects
      .filter((p) => p.image && !fs.existsSync(path.join(publicDir, p.image)))
      .map((p) => `${p.slug}: ${p.image}`);
    expect(missing).toEqual([]);
  });

  it("projects with an image have alt text describing it", () => {
    for (const project of projects.filter((p) => p.image)) {
      expect(project.imageAlt?.trim(), project.slug).toBeTruthy();
    }
  });
});
