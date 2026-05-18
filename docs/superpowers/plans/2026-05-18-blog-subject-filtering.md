# Blog Subject Filtering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add subject-based filtering to the blog section with a two-panel layout (subjects sidebar + article list) on both the home page and /blog page.

**Architecture:** Central subject registry in `src/data/subjects.ts` defines valid subjects. Blog posts reference subjects by slug in frontmatter. A shared `SubjectFilter` client component renders the two-panel layout with responsive behavior (sidebar on desktop, horizontal pills on mobile). The home page uses local state; the /blog page syncs selection to URL query params.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, `useSearchParams` for URL state

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/data/subjects.ts` | Create | Subject registry — type + data |
| `src/types/index.ts` | Modify | Add `subjects` field to `BlogPost` type |
| `src/lib/mdx.ts` | Modify | Parse `subjects` from frontmatter |
| `src/lib/subjects.ts` | Create | Helper to filter posts by subject |
| `src/components/subject-filter.tsx` | Create | Shared two-panel layout component |
| `src/components/blog-preview.tsx` | Modify | Integrate `SubjectFilter` for home page |
| `src/app/blog/page.tsx` | Modify | Split into server layout + client filter component |
| `src/app/blog/blog-client.tsx` | Create | Client component for /blog with URL state |
| `content/blog/first-data-pipeline.mdx` | Modify | Add `subjects` frontmatter |
| `content/blog/building-my-portfolio.mdx` | Modify | Add `subjects` frontmatter |
| `src/__tests__/subjects.test.ts` | Create | Tests for subject registry |
| `src/__tests__/subject-filter-logic.test.ts` | Create | Tests for filtering logic |

---

### Task 1: Subject Registry & Type

**Files:**
- Create: `src/data/subjects.ts`
- Modify: `src/types/index.ts`
- Test: `src/__tests__/subjects.test.ts`

- [ ] **Step 1: Write the failing test for subject registry**

Create `src/__tests__/subjects.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { subjects, type Subject } from "@/data/subjects";

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/__tests__/subjects.test.ts`
Expected: FAIL — cannot find module `@/data/subjects`

- [ ] **Step 3: Create subject registry**

Create `src/data/subjects.ts`:

```ts
export type Subject = {
  slug: string;
  label: string;
};

export const subjects: Subject[] = [
  { slug: "data-engineering", label: "Data Engineering" },
  { slug: "full-stack-development", label: "Full Stack Development" },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/__tests__/subjects.test.ts`
Expected: PASS — all 4 tests pass

- [ ] **Step 5: Add `subjects` field to `BlogPost` type**

Modify `src/types/index.ts` — add `subjects: string[];` to the `BlogPost` type after the `tags` field:

```ts
export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  subjects: string[];
  coverImage?: string;
  summary: string;
  content: string;
  readingTime: string;
};
```

- [ ] **Step 6: Run all tests to verify nothing breaks**

Run: `pnpm test`
Expected: All tests pass (the mdx parser will need updating in Task 2 to satisfy the type, but tests don't import mdx yet so this is safe)

- [ ] **Step 7: Commit**

```bash
git add src/data/subjects.ts src/types/index.ts src/__tests__/subjects.test.ts
git commit -m "feat: add subject registry and BlogPost subjects type"
```

---

### Task 2: MDX Parser & Frontmatter Updates

**Files:**
- Modify: `src/lib/mdx.ts`
- Modify: `content/blog/first-data-pipeline.mdx`
- Modify: `content/blog/building-my-portfolio.mdx`

- [ ] **Step 1: Update MDX parser to include `subjects`**

Modify `src/lib/mdx.ts` — add `subjects: data.subjects ?? [],` to the return object in the `files.map()` callback, after the `tags` line:

```ts
return {
  slug: filename.replace(/\.mdx$/, ""),
  title: data.title,
  publishedAt: data.publishedAt,
  tags: data.tags ?? [],
  subjects: data.subjects ?? [],
  coverImage: data.coverImage,
  summary: data.summary,
  content,
  readingTime: readingTime(content).text,
} satisfies BlogPost;
```

- [ ] **Step 2: Add `subjects` frontmatter to first-data-pipeline.mdx**

Add `subjects: ["data-engineering"]` to the frontmatter of `content/blog/first-data-pipeline.mdx`, after the `tags` line:

```yaml
---
title: "What I Learned from My First Data Pipeline"
publishedAt: "2026-04-15"
subjects: ["data-engineering"]
tags: ["Python", "Data Engineering", "Kafka"]
summary: "Lessons from building a real-time event streaming pipeline — from Kafka basics to exactly-once delivery."
---
```

- [ ] **Step 3: Add `subjects` frontmatter to building-my-portfolio.mdx**

Add `subjects: ["full-stack-development"]` to the frontmatter of `content/blog/building-my-portfolio.mdx`, after the `tags` line:

```yaml
---
title: "Building My First Portfolio with Next.js"
publishedAt: "2026-05-11"
subjects: ["full-stack-development"]
tags: ["Next.js", "React", "Portfolio"]
summary: "A walkthrough of how I built this portfolio site with Next.js 16, Tailwind CSS v4, and shadcn/ui — from blank repo to deployed."
---
```

- [ ] **Step 4: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/mdx.ts content/blog/first-data-pipeline.mdx content/blog/building-my-portfolio.mdx
git commit -m "feat: parse subjects from blog frontmatter"
```

---

### Task 3: Subject Filtering Logic

**Files:**
- Create: `src/lib/subjects.ts`
- Test: `src/__tests__/subject-filter-logic.test.ts`

- [ ] **Step 1: Write the failing test for filtering logic**

Create `src/__tests__/subject-filter-logic.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- src/__tests__/subject-filter-logic.test.ts`
Expected: FAIL — cannot find module `@/lib/subjects`

- [ ] **Step 3: Implement filtering logic**

Create `src/lib/subjects.ts`:

```ts
import type { BlogPost } from "@/types";

export function filterPostsBySubject(
  posts: BlogPost[],
  subjectSlug: string | null,
  maxPosts?: number
): BlogPost[] {
  const filtered =
    subjectSlug === null
      ? posts
      : posts.filter((post) => post.subjects.includes(subjectSlug));

  if (maxPosts !== undefined) {
    return filtered.slice(0, maxPosts);
  }

  return filtered;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- src/__tests__/subject-filter-logic.test.ts`
Expected: PASS — all 5 tests pass

- [ ] **Step 5: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/lib/subjects.ts src/__tests__/subject-filter-logic.test.ts
git commit -m "feat: add subject filtering logic with tests"
```

---

### Task 4: SubjectFilter Component

**Files:**
- Create: `src/components/subject-filter.tsx`

- [ ] **Step 1: Create the SubjectFilter component**

Create `src/components/subject-filter.tsx`:

```tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";
import type { Subject } from "@/data/subjects";
import { filterPostsBySubject } from "@/lib/subjects";

type SubjectFilterProps = {
  posts: BlogPost[];
  subjects: Subject[];
  selectedSubject: string | null;
  onSelectSubject: (slug: string | null) => void;
  maxPosts?: number;
  showViewMore?: boolean;
};

export function SubjectFilter({
  posts,
  subjects,
  selectedSubject,
  onSelectSubject,
  maxPosts,
  showViewMore,
}: SubjectFilterProps) {
  const filteredPosts = filterPostsBySubject(posts, selectedSubject, maxPosts);

  const selectedLabel =
    selectedSubject === null
      ? "Latest"
      : subjects.find((s) => s.slug === selectedSubject)?.label ?? "Latest";

  const viewMoreHref =
    selectedSubject === null ? "/blog" : `/blog?subject=${selectedSubject}`;

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile: horizontal pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 md:hidden">
        <button
          onClick={() => onSelectSubject(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
            selectedSubject === null
              ? "bg-accent/15 text-accent"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Latest
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.slug}
            onClick={() => onSelectSubject(subject.slug)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
              selectedSubject === subject.slug
                ? "bg-accent/15 text-accent"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {/* Desktop: sidebar */}
      <div className="hidden w-[200px] shrink-0 border-r border-border pr-4 md:block">
        <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Subjects
        </p>
        <button
          onClick={() => onSelectSubject(null)}
          className={`mb-1 block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
            selectedSubject === null
              ? "bg-accent/15 text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Latest
        </button>
        {subjects.map((subject) => (
          <button
            key={subject.slug}
            onClick={() => onSelectSubject(subject.slug)}
            className={`mb-1 block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
              selectedSubject === subject.slug
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {/* Article list */}
      <div className="min-w-0 flex-1 md:pl-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {selectedLabel}
          </h3>
          {showViewMore && (
            <Link
              href={viewMoreHref}
              className="text-sm text-accent transition-colors hover:text-accent/80"
            >
              View more &rarr;
            </Link>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No posts in this subject yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50"
              >
                <div>
                  <h4 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    &middot; {post.readingTime}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the project builds**

Run: `pnpm build`
Expected: Build succeeds (component is not imported yet, but should have no syntax errors)

- [ ] **Step 3: Commit**

```bash
git add src/components/subject-filter.tsx
git commit -m "feat: add SubjectFilter component"
```

---

### Task 5: Integrate SubjectFilter into Home Page BlogPreview

**Files:**
- Modify: `src/components/blog-preview.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite BlogPreview to use SubjectFilter**

Replace the contents of `src/components/blog-preview.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { subjects } from "@/data/subjects";
import { SubjectFilter } from "@/components/subject-filter";
import type { BlogPost } from "@/types";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-section-alt px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-bold text-foreground">Blog</h2>
        <SubjectFilter
          posts={posts}
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          maxPosts={5}
          showViewMore
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update home page to pass all posts instead of sliced 3**

Modify `src/app/page.tsx` — change `getAllPosts().slice(0, 3)` to `getAllPosts()`:

```ts
const posts = getAllPosts();
```

The `SubjectFilter` component handles limiting via `maxPosts={5}`.

- [ ] **Step 3: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 4: Verify the project builds**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/blog-preview.tsx src/app/page.tsx
git commit -m "feat: integrate subject filtering into home page blog section"
```

---

### Task 6: Integrate SubjectFilter into /blog Page

**Files:**
- Create: `src/app/blog/blog-client.tsx`
- Modify: `src/app/blog/page.tsx`

- [ ] **Step 1: Create the client component for /blog with URL state**

Create `src/app/blog/blog-client.tsx`:

```tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { subjects } from "@/data/subjects";
import { SubjectFilter } from "@/components/subject-filter";
import type { BlogPost } from "@/types";

export function BlogClient({ posts }: { posts: BlogPost[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedSubject = searchParams.get("subject") ?? null;

  function handleSelectSubject(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === null) {
      params.delete("subject");
    } else {
      params.set("subject", slug);
    }
    const query = params.toString();
    router.push(query ? `/blog?${query}` : "/blog", { scroll: false });
  }

  return (
    <SubjectFilter
      posts={posts}
      subjects={subjects}
      selectedSubject={selectedSubject}
      onSelectSubject={handleSelectSubject}
    />
  );
}
```

- [ ] **Step 2: Update /blog page to use BlogClient**

Replace the contents of `src/app/blog/page.tsx` with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/mdx";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, data, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 md:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="mb-10 font-bold text-foreground">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon!</p>
      ) : (
        <Suspense>
          <BlogClient posts={posts} />
        </Suspense>
      )}
    </div>
  );
}
```

Note: `<Suspense>` wraps `BlogClient` because `useSearchParams()` requires a Suspense boundary in Next.js App Router.

- [ ] **Step 3: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 4: Verify the project builds**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/app/blog/blog-client.tsx src/app/blog/page.tsx
git commit -m "feat: integrate subject filtering into /blog page with URL state"
```

---

### Task 7: Add Article Summary to SubjectFilter for /blog Page

The /blog page should show article summaries in the cards (matching the original /blog design), while the home page shows compact cards without summaries.

**Files:**
- Modify: `src/components/subject-filter.tsx`

- [ ] **Step 1: Add `showSummary` prop to SubjectFilter**

Modify `src/components/subject-filter.tsx`:

Add `showSummary?: boolean;` to the `SubjectFilterProps` type:

```ts
type SubjectFilterProps = {
  posts: BlogPost[];
  subjects: Subject[];
  selectedSubject: string | null;
  onSelectSubject: (slug: string | null) => void;
  maxPosts?: number;
  showViewMore?: boolean;
  showSummary?: boolean;
};
```

Add `showSummary` to the destructured props:

```ts
export function SubjectFilter({
  posts,
  subjects,
  selectedSubject,
  onSelectSubject,
  maxPosts,
  showViewMore,
  showSummary,
}: SubjectFilterProps) {
```

In the article card `<div>` (inside the `<Link>`), add the summary paragraph between the title `<h4>` and the date `<p>`:

```tsx
<h4 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
  {post.title}
</h4>
{showSummary && post.summary && (
  <p className="mb-2 text-sm text-muted-foreground">
    {post.summary}
  </p>
)}
<p className="text-sm text-muted-foreground">
```

- [ ] **Step 2: Pass `showSummary` from BlogClient**

Modify `src/app/blog/blog-client.tsx` — add `showSummary` prop to the `SubjectFilter`:

```tsx
<SubjectFilter
  posts={posts}
  subjects={subjects}
  selectedSubject={selectedSubject}
  onSelectSubject={handleSelectSubject}
  showSummary
/>
```

- [ ] **Step 3: Verify the project builds**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/subject-filter.tsx src/app/blog/blog-client.tsx
git commit -m "feat: add article summary display to /blog subject filter"
```

---

### Task 8: Final Verification

- [ ] **Step 1: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 2: Run linter**

Run: `pnpm lint`
Expected: No errors

- [ ] **Step 3: Run type checker**

Run: `pnpm exec tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Build the project**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Manual smoke test**

Run: `pnpm dev`

Verify:
1. Home page blog section shows two-panel layout with subjects sidebar
2. "Latest" is the default view, showing up to 5 most recent posts
3. Clicking a subject filters posts to that subject
4. "View more →" link navigates to `/blog?subject=<slug>`
5. `/blog` page shows two-panel layout with all posts
6. Clicking subjects on `/blog` updates the URL query param
7. Browser back/forward navigates between subject selections
8. Mobile view shows horizontal scrollable pills instead of sidebar
9. All article cards are clickable and navigate to `/blog/[slug]`
