# Debug: the complaint-canary project image doesn't show

- **Date:** 2026-10-31
- **Branch:** `feature/website` (uncommitted working tree)
- **Status:** Fixed (uncommitted). The recommended options were chosen: A1, B1 and C1. See "Resolution" at the end.

## Symptom

The "Complaint Canary" project shows a grey "Screenshot" box on the homepage card (`/#projects`) and a "Project Screenshot" box on `/projects/complaint-canary`. The diagram in `public/complaint-canary.png` doesn't appear in either place.

## Summary

Two independent problems each hide the image, and a third would hide it in production:

1. **Root cause: no component renders `project.image`.** The card and the detail page both show hard-coded placeholder `<div>`s. They have done so since the MVP scaffold, and that placeholder was never replaced.
2. **The file is at the wrong path.** The data points to `/images/projects/complaint-canary.png`, which returns 404. The file is at `/complaint-canary.png`.
3. **The image isn't in git.** `public/complaint-canary.png` is untracked and the `projects.ts` entry is uncommitted. Vercel builds from git, so even a correct local fix wouldn't deploy.

Fixing only #2, as CLAUDE.md's Known risks section suggests, would change nothing visible. Fixing only #1 would show a broken image.

## Reproduction and evidence

I tested against the dev server already running on `:3000` (Next.js 16.3.6), using read-only GET requests:

| Request | Result |
| --- | --- |
| `GET /` | 200. The HTML contains `>Screenshot<` and **no `<img>`** for complaint-canary. |
| `GET /projects/complaint-canary` | 200. Contains `Project Screenshot` and **0** references to the image path. |
| `GET /images/projects/complaint-canary.png` (the declared path) | **404** |
| `GET /complaint-canary.png` (where the file actually is) | 200 `image/png` |
| `GET /projects/complaint-canary/opengraph-image` | 200. This is a generated text card and doesn't use `project.image`. That's by design. |

The only place `complaint-canary.png` appears on the homepage is the serialized RSC props: `ProjectCard` is a `"use client"` component, so its whole `project` object goes over the wire. The value is passed to the component but never used:

```
...promoted through DEV, QA and PROD as one tested image.","image":"/images/projects/complaint-canary.png","techStack":[...
```

`node .claude/skills/content-audit/audit.mjs` reports the same thing:

```
ERROR [projects] src/data/projects.ts: [complaint-canary] image /images/projects/complaint-canary.png not found under public/ (a file with that name exists at /complaint-canary.png; move it or fix the path)
```

## Issues

### 1. Root cause: `project.image` is never read

| Location | What renders |
| --- | --- |
| `src/components/project-card.tsx:13-19` | `<div …>Screenshot</div>` inside a fixed `h-[140px]` box |
| `src/app/projects/[slug]/page.tsx:47-52` | `<div …>Project Screenshot</div>` inside an `h-[240px] md:h-[320px]` box |

- **Where it came from:** commits `710d0f3` (card) and `8ab0422` (detail page). Both copy the placeholders from `docs/superpowers/plans/2026-05-11-portfolio-phase1-mvp.md` (lines ~1013 and ~1955), which was written before any screenshots existed.
- **What the spec says:** the design spec requires a card with a "screenshot" and a detail page with a "Hero banner with project screenshot" (`docs/superpowers/specs/2026-05-11-portfolio-website-design.md:37,46`). So the current behaviour is unfinished scaffolding, not a design decision.
- **Working pattern to copy:** `src/components/hero.tsx:81` already renders `/profile.jpg` with `next/image`. Local `public/` images need no `next.config.ts` changes.

### 2. The file and the data disagree on the path

- **Data:** `src/data/projects.ts` declares `image: "/images/projects/complaint-canary.png"`.
- **Disk:** the file is at `public/complaint-canary.png`, and `public/images/` doesn't exist.
- **Convention:** `/images/projects/<slug>.png` is used by every project entry and the README's "Adding a Project" section, so **the file should move to match the data**, not the other way round.

### 3. The image and its data entry aren't committed

`git status` shows `?? public/complaint-canary.png` and ` M src/data/projects.ts`. Nothing in `.gitignore` excludes the file; it just hasn't been added. A deploy built from the current `HEAD` contains neither.

### 4. Latent: the other two projects point at images that don't exist

`streaming-pipeline` (`/images/projects/streaming-pipeline.png`) and `portfolio-website` (`/images/projects/portfolio.png`) have no files. Today the placeholder hides this. Once #1 is fixed, those cards would show **broken-image icons**. Because `Project.image` is a required `string`, there's no way to say "no screenshot yet" except a fake path.

### 5. The image doesn't suit the current frames

The file is a **2820×1460 (1.93:1) architecture diagram**: dense labels on a white background, not a UI screenshot. That matters for each frame:

| Frame | Approximate size at desktop | Effect on this image |
| --- | --- | --- |
| Card thumbnail | ~452×140 px (3.2:1); `max-w-5xl`, 2 columns, `p-6` | `object-cover` crops about 40% of the height. `object-contain` shrinks it to ~270 px wide. The labels are unreadable either way. |
| Detail hero | ~704×320 px (2.2:1); `max-w-3xl`, `md:px-8` | `object-contain` fits it at ~22% scale, so the diagram text is about 5 px. That's legible only if the reader opens the full-size image. |
| Dark mode | | A solid white rectangle on the dark `bg-card`, which looks harsh unless it's framed deliberately. |

None of this stops the image from showing, but it decides whether the fix looks right. See Decisions below.

### 6. No alt text source

`Project` has no field for alt text, and an architecture diagram needs a real description (CLAUDE.md > Coding conventions > Accessibility).

### Not an issue

- **`next.config.ts`:** needs no `images` config for local files.
- **OG image:** `/projects/[slug]/opengraph-image` is a deliberate text card and works.
- **The blog post:** `content/blog/complaint-canary.mdx` doesn't reference the diagram. Embedding it there is optional and covered under Out of scope.

## Fix plan

The steps are ordered so that each one can be verified on its own. Step 1 adds a test that fails now and should pass at the end.

### Step 1: Failing test for project image paths

Add `src/__tests__/projects.test.ts` (node env, uses `fs`):

- Slugs are unique and match `^[a-z0-9]+(-[a-z0-9]+)*$`.
- Every project that declares `image` has a path that starts with `/images/projects/` and **exists under `public/`**.

It should fail today with 3 failures. This test stops issues #2 and #4 from coming back silently.

### Step 2: Make `image` optional and add alt text

In `src/types/index.ts`:

```ts
image?: string;      // "/images/projects/<slug>.png"; omit until a real screenshot exists
imageAlt?: string;   // describe the content; defaults to "<title> screenshot"
```

In `src/data/projects.ts`:
- **complaint-canary:** keep `image`. Add `imageAlt`, for example `"Complaint Canary architecture: public sources feed a Dagster + dbt pipeline on a Compute Engine VM, loading Cloud Storage and BigQuery, with Cloud Logging and Monitoring alerts"`.
- **streaming-pipeline and portfolio-website:** remove the `image` lines, which point at files that don't exist.

### Step 3: Put the file where the data says

```bash
mkdir -p public/images/projects
mv public/complaint-canary.png public/images/projects/complaint-canary.png
```

This is a plain `mv` because the file is untracked, so `git mv` doesn't apply.

### Step 4: Render the image (fixes the root cause)

Create one shared component, `src/components/project-image.tsx` (named export, server-safe, no `"use client"`). It renders `next/image` with `fill` inside a `relative` frame when `project.image` is set, and the existing placeholder when it isn't:

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Project } from "@/types";

export function ProjectImage({
  project, sizes, className, imgClassName, label = "Screenshot",
}: {
  project: Project; sizes: string; className?: string; imgClassName?: string; label?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {project.image ? (
        <Image
          src={project.image}
          alt={project.imageAlt ?? `${project.title} screenshot`}
          fill
          sizes={sizes}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          {label}
        </div>
      )}
    </div>
  );
}
```

- **`project-card.tsx`:** replace lines 14-19 with `<ProjectImage project={project} className="mb-4 h-[140px] rounded-lg" sizes="(min-width: 1024px) 452px, (min-width: 768px) 50vw, 100vw" … />`, keeping the `<Link>`. Pass the `imgClassName` chosen in Decision A.
- **`projects/[slug]/page.tsx`:** replace lines 48-52 with the same component at `h-[240px] md:h-[320px]` and `sizes="(min-width: 768px) 704px, 100vw"`, using `object-contain`. Wrap it in `<a href={project.image} target="_blank" rel="noopener noreferrer" aria-label="Open full-size …">` so readers can open the diagram at full resolution. For load priority, follow the pattern in `hero.tsx`, since this is the page's largest image.

### Step 5: Apply the framing choices from Decisions A and B

These are class changes only: `object-position`, a `bg-white` frame with padding, and an optional dark-mode treatment.

### Step 6: Documentation

- **README "Adding a Project":** `image` is optional, and the file must exist at `public/images/projects/<slug>.png`. Mention `imageAlt`.
- **CLAUDE.md Known risks:** remove the "Project images unused or missing" bullet.

### Step 7: Commit together

`public/images/projects/complaint-canary.png`, `src/data/projects.ts`, the type, the components, the test and the docs go in one `feat:` commit. Stage them with explicit paths so the untracked `package-lock.json` isn't included.

## Decisions needed from you

**A. Card thumbnail treatment** (140 px tall frame, 1.93:1 diagram)
1. *(Recommended)* `object-contain` on a white inset frame (`bg-white p-2`). Shows the whole diagram as a recognisable shape, and the detail page is where people read it.
2. `object-cover object-left-top`. Fills the frame but shows only the top-left (sources and VM), so it reads as a crop.
3. Make a separate cropped thumbnail (`complaint-canary-thumb.png`). This needs a `thumbnail?` field and a hand-made asset.

**B. Dark mode:** the diagram has an opaque white background.
1. *(Recommended)* Keep it, inside a deliberate white frame with a rounded border, as if it were a printed figure. No asset work.
2. Export a dark-theme version of the diagram and switch on theme. This needs a second asset and a theme-aware `<picture>` or CSS.

**C. The other two projects:** remove their `image` fields so they show the placeholder *(recommended, no fake data)*, or supply real screenshots now.

## Verification

1. **New test:** `pnpm vitest run src/__tests__/projects.test.ts` fails before Steps 2-3 and passes after.
2. **Content audit:** `node .claude/skills/content-audit/audit.mjs` shows no `[projects]` image errors.
3. **Dev server:** `curl -o /dev/null -w '%{http_code}' localhost:3000/images/projects/complaint-canary.png` returns 200. The homepage and `/projects/complaint-canary` HTML each contain an `<img` whose `src` goes through `/_next/image?url=%2Fimages%2Fprojects%2Fcomplaint-canary.png`.
4. **Visual check** (you): card and detail page in light and dark mode, at <768 px and desktop. The other two cards still show the placeholder, with no broken-image icons. The full-size link opens the diagram.
5. **Definition of done:** `pnpm lint && pnpm tsc --noEmit && pnpm test && pnpm build`.

## Out of scope (suggested follow-ups)

- **Embed the diagram in the blog post.** Add it to `content/blog/complaint-canary.mdx` near the architecture section, at `/images/projects/complaint-canary.png` or a copy under `/images/blog/`.
- **Use the screenshot in the OG image.** The project OG card could include it, but the current text card is intentional.
- **Placeholder GitHub URLs.** `streaming-pipeline` and `portfolio-website` use `github.com/anthonywong`; this is unrelated to the image and already in CLAUDE.md's Known risks.

## Resolution (2026-10-31)

I implemented the plan with the recommended options: **A1** (whole diagram, `object-contain`, white inset frame), **B1** (same white frame in dark mode) and **C1** (made-up image paths removed).

| Step | Change |
| --- | --- |
| 1 | `src/__tests__/projects.test.ts` (5 tests). **Before the fix:** 2 failed, because 3 declared images were missing and complaint-canary had no alt text. **After:** all 5 pass. |
| 2 | `Project.image` is optional and `imageAlt` was added (`src/types/index.ts`). complaint-canary got a descriptive `imageAlt`; the fake `image` paths on streaming-pipeline and portfolio-website were removed. |
| 3 | Moved `public/complaint-canary.png` to `public/images/projects/complaint-canary.png`. |
| 4 | New `src/components/project-image.tsx`, used by `project-card.tsx` and `projects/[slug]/page.tsx`. The detail page image links to the full-size file and uses `preload`; Next 16 deprecates `priority`. |
| 5 | Card frame gets `border border-border`. Without it, the white frame had no visible edge on the white card in light mode (found in screenshots). |
| 6 | Updated README "Adding a Project", CLAUDE.md Known risks, and the local `new-project` and `content-audit` skills. The audit now accepts an optional `image` and requires `imageAlt` when one is set. |

**Verification:**
- **Rendering check against the dev server:** before the fix, 3 checks failed (no `<img>` on either page, no full-size link). After, all 7 pass: the declared path returns 200, both pages render an `<img>` with alt text via `/_next/image`, the full-size link is present, the optimized image is served, and streaming-pipeline keeps its placeholder.
- **Screenshots** (headless Edge, using emulated `prefers-color-scheme` and a mobile viewport): homepage and detail page in light and dark mode, at 1280px and 390px. No horizontal overflow (`scrollWidth == clientWidth`).
- **CI gates:** `pnpm lint`, `pnpm tsc --noEmit`, `pnpm test` (17/17) and `pnpm build` all pass. The build prerenders all 3 `/projects/*` pages.

**Not done:** Step 7 (commit). The image is still untracked and nothing is committed, so the fix won't reach Vercel until it is.
