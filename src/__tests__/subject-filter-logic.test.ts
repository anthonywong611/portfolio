import { describe, it, expect } from "vitest";
import { filterPostsBySubject } from "@/lib/subjects";
import type { BlogPost } from "@/types";

function makePost(overrides: Partial<BlogPost> & { slug: string }): BlogPost {
  return {
    title: overrides.slug,
    publishedAt: "2026-01-01",
    tags: [],
    subjects: [],
    summary: "",
    content: "",
    readingTime: "1 min read",
    ...overrides,
  };
}

describe("filterPostsBySubject", () => {
  const posts: BlogPost[] = [
    makePost({ slug: "a", subjects: ["data-engineering"], publishedAt: "2026-03-01" }),
    makePost({ slug: "b", subjects: ["full-stack-development"], publishedAt: "2026-02-01" }),
    makePost({ slug: "c", subjects: ["data-engineering", "full-stack-development"], publishedAt: "2026-01-01" }),
  ];

  it("returns all posts sorted by date when subject is null", () => {
    const result = filterPostsBySubject(posts, null);
    expect(result.map((p) => p.slug)).toEqual(["a", "b", "c"]);
  });

  it("filters posts by subject slug", () => {
    const result = filterPostsBySubject(posts, "data-engineering");
    expect(result.map((p) => p.slug)).toEqual(["a", "c"]);
  });

  it("returns posts matching subject when post has multiple subjects", () => {
    const result = filterPostsBySubject(posts, "full-stack-development");
    expect(result.map((p) => p.slug)).toEqual(["b", "c"]);
  });

  it("returns empty array for unknown subject", () => {
    const result = filterPostsBySubject(posts, "nonexistent");
    expect(result).toEqual([]);
  });

  it("respects maxPosts limit", () => {
    const result = filterPostsBySubject(posts, null, 2);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.slug)).toEqual(["a", "b"]);
  });
});
