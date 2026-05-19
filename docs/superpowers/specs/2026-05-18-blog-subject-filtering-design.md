# Blog Subject Filtering — Design Spec

## Overview

Redesign the blog section to support subject-based filtering with a two-panel layout: subjects listed alphabetically on the left, filtered articles on the right. Applied to both the home page blog section and the `/blog` page.

## Data Model

### Subject Registry (`src/data/subjects.ts`)

Central registry of all valid subjects. Each subject has a slug (URL-safe) and display label.

```ts
export type Subject = {
  slug: string;   // e.g., "data-engineering"
  label: string;  // e.g., "Data Engineering"
};

export const subjects: Subject[] = [
  { slug: "data-engineering", label: "Data Engineering" },
  { slug: "full-stack-development", label: "Full Stack Development" },
  // ...add more as needed, sorted alphabetically
];
```

### BlogPost Type Changes

Add `subjects: string[]` field (array of slugs) to the `BlogPost` type in `src/types/index.ts`:

```ts
export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  subjects: string[];  // NEW — e.g., ["data-engineering"]
  coverImage?: string;
  summary: string;
  content: string;
  readingTime: string;
};
```

### Blog Post Frontmatter

Add `subjects` field to each MDX file's frontmatter:

```yaml
---
title: "What I Learned from My First Data Pipeline"
publishedAt: "2026-04-15"
subjects: ["data-engineering"]
tags: ["Python", "Data Engineering", "Kafka"]
---
```

A post can belong to one or more subjects. The `tags` field remains unchanged for fine-grained topic tagging.

### MDX Parser Changes (`src/lib/mdx.ts`)

`getAllPosts()` parses `subjects` from frontmatter via `data.subjects ?? []`. Unknown slugs (not in the registry) are silently ignored.

## Layout — Desktop

Two-panel layout with a fixed-width subject sidebar on the left and article list on the right.

### Subject Sidebar (Left Panel)

- Width: ~200px
- "Latest" pseudo-option at the top (represents no subject filter — shows most recent posts)
- Subjects listed alphabetically below "Latest"
- Active subject highlighted with accent background color
- Vertically scrollable if many subjects
- Separated from articles by a subtle border

### Article List (Right Panel)

- Fills remaining width
- Header shows the selected subject label (or "Latest") and optionally a "View more →" link
- Article cards use existing card styling: rounded border, hover accent highlight, arrow icon
- Each card shows: title, summary (on /blog page), date, reading time

## Layout — Mobile (< md breakpoint)

Subjects collapse into a horizontally scrollable row of pill buttons above the article list:

- "Latest" pill first, then subjects alphabetically
- Active pill has accent background
- Scrollable overflow for many subjects
- Article list renders below as a vertical stack

## Home Page Blog Section (`BlogPreview`)

- Replaces current simple list of 3 latest posts
- Uses local `useState` for selected subject
- Default state: no subject selected → shows 5 latest posts across all subjects
- Selecting a subject: shows up to 5 posts for that subject
- "View more →" link appears, linking to `/blog?subject=<slug>` (or `/blog` for "Latest")
- Section title remains "Blog"

## /blog Page

- Same two-panel layout, full version
- Reads `?subject=<slug>` from URL via `useSearchParams()`
- Subject selection updates URL via shallow navigation (no full page reload)
- Default state (no query param): shows all posts sorted by date
- Selected subject: shows all matching posts (no limit)
- Existing "Back to home" link preserved

## Shared Component: `SubjectFilter`

A shared presentational component used by both the home page section and /blog page.

**Props:**
- `posts: BlogPost[]` — all available posts
- `subjects: Subject[]` — subject registry
- `selectedSubject: string | null` — currently selected subject slug, or null for "Latest"
- `onSelectSubject: (slug: string | null) => void` — callback when subject is clicked
- `maxPosts?: number` — limit number of displayed posts (home page uses 5, /blog omits)
- `showViewMore?: boolean` — whether to show "View more →" link

**Rendering:**
- Desktop: flexbox with sidebar + content area
- Mobile: stacked with pill row on top

## URL Behavior

- `/blog` — default, shows latest posts
- `/blog?subject=data-engineering` — filtered by subject
- Clicking a subject on the /blog page updates the query param
- Clicking "Latest" removes the query param
- Browser back/forward navigates between subject selections

## Existing Blog Post Updates

Update frontmatter for existing posts:

- `first-data-pipeline.mdx`: add `subjects: ["data-engineering"]`
- `building-my-portfolio.mdx`: add `subjects: ["full-stack-development"]`

## Out of Scope

- Build-time validation of subject slugs in frontmatter
- Icons or descriptions for subjects
- Pagination within a subject
- Search functionality
