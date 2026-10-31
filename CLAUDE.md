# CLAUDE.md

Guidance for Claude Code in this repository. Lines are facts confirmed from the files named in brackets. Lines marked **TODO** are inferences or open questions to confirm.

## Project

- **Name:** `portfolio` [package.json]. Anthony Wong's personal portfolio site [README.md].
- **What it is:** a single long-scroll homepage (hero/about, experience, education, projects, blog preview, contact), project detail pages, an MDX blog with subject filtering, dark mode, dynamic OG images, sitemap and robots [README.md, src/app/page.tsx].
- **Deployment:** Vercel. CD comes from Vercel's Git integration: preview deploys on PRs, production on merge to `main` [README.md, docs/superpowers/specs/2026-05-11-cicd-pipeline-design.md]. There is no Vercel config file in the repo.
a custom CLAUDE.md file that satisfies the following:
    - Write only the facts you can confirm from the project files.
    - Mark as "TODO" for inferences you make from uncertain information or assumptions.
    - Include project structure, common commands, coding conventions, restrictions, and completion criteria.
## Tech stack

| Area | Choice | Source |
| --- | --- | --- |
| Framework | Next.js 16 App Router, React 19.2.4, TypeScript 5 (strict) | package.json, tsconfig.json |
| Styling | Tailwind CSS v4, CSS-first config (no `tailwind.config`), `tw-animate-css` | postcss.config.mjs, src/app/globals.css |
| UI primitives | shadcn/ui, style `base-nova`, built on `@base-ui/react` (not Radix) | components.json, package.json |
| Animation | `motion/react` with `LazyMotion` + `m.*` (strict mode) | src/components/motion-wrapper.tsx |
| Theme | `next-themes`, class strategy, system default | src/app/layout.tsx |
| Blog | `next-mdx-remote/rsc`, `gray-matter`, `reading-time` | src/lib/mdx.ts |
| Email | Resend, lazily initialized | src/lib/resend.ts |
| Icons | `lucide-react`, `react-icons` (si/fa) | src/components/icons.tsx |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` | src/app/layout.tsx |
| Tests | Vitest 4, node environment, `globals: false` | vitest.config.ts |
| Lint | ESLint 9 flat config with `eslint-config-next` (core-web-vitals + typescript) | eslint.config.mjs |
| Package manager | pnpm (`packageManager: pnpm@11.0.9`) | package.json |
| Node | 24 | .nvmrc |

There is no Prettier or other formatter configured.

## Project structure

```
content/blog/*.mdx         Blog posts (YAML frontmatter). Filename = URL slug.
public/                    Static assets: profile.jpg, resume.pdf, images
src/app/                   App Router
  page.tsx                 Homepage, assembles the section components
  layout.tsx               Root layout: fonts, ThemeProvider, MotionProvider, Toaster, analytics
  globals.css              All color tokens (@theme, plus .dark overrides), prose styles
  api/contact/route.ts     Only dynamic route: POST, then email via Resend
  blog/                    Index (server page + blog-client.tsx for URL state), [slug] detail, OG image
  projects/[slug]/         Project detail page and OG image (no projects index page)
  sitemap.ts, robots.ts, opengraph-image.tsx (edge runtime)
src/components/            Feature components (kebab-case files, named exports)
src/components/ui/         shadcn-generated primitives (button, card, sheet, sonner)
src/data/                  Typed content: experiences, education, projects, subjects
src/lib/                   mdx.ts (post loading), subjects.ts (filter logic), contact.ts (contact validation/email/config),
                           rate-limit.ts (in-memory limiter), resend.ts, utils.ts (cn)
src/types/index.ts         Experience, Education, Project, BlogPost types
src/__tests__/             Vitest tests
docs/superpowers/          Design specs and implementation plans (dated YYYY-MM-DD-*)
```

## Architecture

- **Static by default.** The homepage, blog index and project pages are prerendered. `[slug]` routes use `generateStaticParams` [src/app/blog/[slug]/page.tsx, src/app/projects/[slug]/page.tsx].
- **Content model:** structured data lives in `src/data/*.ts`, and posts are read from `content/blog` with `fs` at build time [src/lib/mdx.ts]. There is no CMS.
- **Server/client split:** server components read data and pass it down as props. Client components (`"use client"`) are limited to interactive pieces: navbar, theme toggle, contact form, blog preview, subject filter, blog-client, motion wrappers.
- **Subject filtering:** `src/data/subjects.ts` is the registry. `filterPostsBySubject` in `src/lib/subjects.ts` is the pure logic, and `SubjectFilter` is the shared view. The homepage keeps the selection in `useState`; `/blog` keeps it in `?subject=`.
- **Route params** are `Promise<{ slug }>` and are awaited (Next 16 async params).
- **OG images:** the homepage OG image uses the edge runtime. Blog and project OG images use Node because they read the filesystem.

## Configuration

- **Environment variables** [.env.example, README.md]:
  - `RESEND_API_KEY`: needed for the contact form. Without it, `/api/contact` returns 500 at request time. The build still works because the client is lazily initialized [src/lib/resend.ts].
  - `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`: optional. They default to `anthonywong2718@gmail.com` and Resend's sandbox sender `Portfolio Contact <onboarding@resend.dev>` [src/lib/contact.ts]. The sandbox sender only delivers to the Resend account owner's address.
  - `NEXT_PUBLIC_SITE_URL`: used by metadata, the sitemap and robots. Defaults to `http://localhost:3000`.
  - Local values go in `.env.local`, which is gitignored. Never print or commit its contents.
- **CI** [.github/workflows/ci.yml]: runs on PRs to `main`. Steps: `pnpm install --frozen-lockfile`, then lint, then `tsc --noEmit`, then test, then build.
- **Path alias:** `@/*` maps to `./src/*` [tsconfig.json, vitest.config.ts].
- **Gitignored:** `.claude/` and `.superpowers/` are ignored [.gitignore]. Anything Claude puts under `.claude/` (skills, settings, hooks) is local only and not shared through git.

## Commands

```bash
pnpm install            # install deps (use pnpm only, see Restrictions)
pnpm dev                # dev server at http://localhost:3000
pnpm build              # production build (also prerenders all MDX/project pages)
pnpm start              # serve the production build
pnpm lint               # ESLint
pnpm tsc --noEmit       # type check (no package.json script for this)
pnpm test               # vitest run (all tests)
pnpm vitest run src/__tests__/subjects.test.ts   # single test file
pnpm dlx shadcn@latest add <component>           # add/update a shadcn primitive
```

## Coding conventions (observed in src/)

- TypeScript strict. Shared types go in `src/types/index.ts`; types used by a single module stay with it (e.g. `Subject` in `src/data/subjects.ts`).
- File names are kebab-case. Components are function components with **named exports** (`export function Hero`). Next.js route files use default exports.
- Double quotes and semicolons. `src/components/ui/*` and `src/lib/utils.ts` are shadcn-generated and use their own style; leave them as they are.
- Style with Tailwind utility classes and the theme tokens (`bg-background`, `text-muted-foreground`, `text-accent`, `bg-accent-muted`, `border-border`). Don't hard-code hex colors in components. The exception is OG images, which can't use Tailwind.
- Merge class names with `cn()` from `@/lib/utils`.
- Animations: wrap content in `FadeUp` or `FadeUpOnScroll`. Use `m.*`, never `motion.*` (`LazyMotion strict` will throw). Keep the `useReducedMotion` fallback.
- Accessibility: use `aria-label` on icon-only links and buttons, `type="button"` on non-submit buttons, and keep the skip link and `#main-content` (see commit 6ce28c6).
- Section anchors (`#home`, `#experience`, `#education`, `#projects`, `#blog`, `#contact`) are part of the navbar contract. Nav links must be absolute (`/#...`), and `src/__tests__/navbar.test.ts` checks this.
- Brand icons are looked up by the exact string used in data files, through `iconMap` in `src/components/icons.tsx`.
- Commit messages use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`) [git log].
- Feature work follows a spec, then a plan, then implementation, kept in `docs/superpowers/{specs,plans}/YYYY-MM-DD-<topic>.md` [docs/].

## Content how-to (summary; full steps in README.md "Adding New Content")

- **Blog post:** add `content/blog/<slug>.mdx` with frontmatter `title`, `publishedAt` (`YYYY-MM-DD`), `subjects` (slugs from `src/data/subjects.ts`), `tags`, `summary`. Nothing validates frontmatter, so check every subject slug against the registry yourself.
- **Subject:** add `{ slug, label }` to `src/data/subjects.ts`, **kept sorted by label**. The slug must match `^[a-z0-9]+(-[a-z0-9]+)*$`. Both rules are enforced by `src/__tests__/subjects.test.ts`.
- **Project / experience / education:** append to the arrays in `src/data/*.ts`. Newest experience goes first.
- **Theme colors:** edit `src/app/globals.css` in both the `@theme` block and the `.dark` block.

## Restrictions

- Use **pnpm** only. Don't run `npm install`, which creates `package-lock.json`. CI uses `pnpm install --frozen-lockfile`, so `pnpm-lock.yaml` must stay in sync with `package.json`.
- Don't hand-edit `src/components/ui/*`; regenerate it with the shadcn CLI [README.md].
- Don't commit `.env.local` or any secrets. Don't change the contact recipient or sender (`DEFAULT_CONTACT_TO`/`DEFAULT_CONTACT_FROM` in `src/lib/contact.ts`, or the `CONTACT_*` env vars) without asking.
- Don't add a CMS, a database, or new runtime dependencies without asking. The design deliberately avoids them [docs/superpowers/specs/2026-05-11-portfolio-website-design.md].
- Don't push to `main` directly. Work on a branch and open a PR so CI runs.

## Definition of done

A change is complete only when all of these pass locally (the same steps as CI):

1. `pnpm lint`
2. `pnpm tsc --noEmit`
3. `pnpm test`
4. `pnpm build`

Also:
- New pure logic in `src/lib/` or `src/data/` gets a Vitest test in `src/__tests__/`.
- Content changes: every frontmatter `subjects` slug exists in `src/data/subjects.ts`, and any referenced asset exists under `public/`.
- UI changes: check them in `pnpm dev` in light and dark mode, at mobile (<768px) and desktop widths.
- Update README.md when you add a feature, a content type, or an env var.

## Known risks and limitations

Facts:
- **Mixed lockfiles:** `package-lock.json` (untracked) sits next to `pnpm-lock.yaml` [git status]. It should be deleted, not committed.
- **Next/ESLint version drift:** an uncommitted change sets `next` to `^16.3.6`, while `eslint-config-next` stays pinned at `16.2.6` [package.json].
- **Broken RSS link:** the footer links to `/feed.xml` [src/components/footer.tsx], but no feed route exists in `src/app/`.
- **Single project, single post:** `src/data/projects.ts` has one entry (`complaint-canary`), so the `md:grid-cols-2` projects grid shows one half-width card. `content/blog/` has one post. A project without an `image` falls back to a placeholder whose `bg-muted` is almost invisible in dark mode [src/components/projects-section.tsx, src/components/project-image.tsx].
- **Deprecated `priority`:** `src/components/hero.tsx` uses `next/image`'s `priority`, which Next 16 deprecates in favour of `preload` [node_modules/next/dist/shared/lib/get-img-props.d.ts].
- **Contact API rate limiting is best-effort:** the limit is 1 message per IP per minute, held in memory with a bounded, pruned `Map`. On Vercel each instance has its own memory, so the limit doesn't hold across instances and resets on cold start. This risk was accepted (no shared store). Use a Vercel Firewall rule for durable limits [src/lib/rate-limit.ts].
- **Sandbox sender:** mail is sent from `onboarding@resend.dev`, which only delivers to the Resend account owner. `anthonywong.dev` has no MX records (checked 2026-10-31 with `dig`), so it can't receive mail or act as a verified sender without DNS setup [src/lib/contact.ts].
- **No frontmatter validation:** `getAllPosts` trusts frontmatter as-is [src/lib/mdx.ts]. A post missing `title` or `publishedAt` renders as broken output rather than failing the build.
- **Test coverage:** tests cover pure logic, data, and the `/api/contact` route (with Resend mocked via `vi.mock`) [src/__tests__/contact-route.test.ts]. There are no component or e2e tests, and no DOM test environment.

TODO (inferences to verify):
- TODO: `RESEND_API_KEY` must also be set in the Vercel project's environment variables for production. This hasn't been confirmed from the repo.
- TODO: `new Date("YYYY-MM-DD")` parses as UTC, and the client-side `SubjectFilter` formats it in the viewer's timezone. Visitors west of UTC may see the date shifted by a day and get a hydration mismatch. Consider formatting with `timeZone: "UTC"`.
- TODO: `docs/production-grade-portfolio-website-research-plan.md` recommends Keystatic and GSAP. Neither is used, and the spec superseded it.
- TODO: `pnpm-workspace.yaml` both allows and ignores builds for `sharp` and `unrs-resolver`. It's unclear which is intended.

## Claude Code hooks and skills [.claude/]

`.claude/` is gitignored, so these are local only. To share them, narrow the ignore rule (for example to `.claude/settings.local.json` and `.claude/.state/`).

**Hooks** [.claude/settings.json, scripts in .claude/hooks/]:
- **PreToolUse Bash** (`block-npm-yarn.sh`): denies `npm i/install/ci/add` and `yarn` when they appear in command position. `pnpm`, `npm run` and `npx` are allowed.
- **PreToolUse Write/Edit/MultiEdit/NotebookEdit** (`protect-files.sh`): denies writes to `.env*` (except `.env.example`) and to `src/components/ui/*`.
- **PostToolUse Write/Edit/MultiEdit** (`eslint-fix.sh`): runs `pnpm exec eslint --fix` on edited `.ts`/`.tsx` files. Problems it can't fix are sent back to Claude (exit 2).
- **Stop** (`stop-gate.sh`): runs `pnpm lint`, `pnpm tsc --noEmit` and `pnpm test`, and blocks the stop on failure. It skips the run if the working tree matches the last passing state (cached in `.claude/.state/`). After 3 consecutive blocks it lets the turn end with a warning. It doesn't run the build; that belongs to the definition-of-done step.

**Skills** [.claude/skills/]:
- **`new-blog-post`:** scaffold `content/blog/<slug>.mdx` with valid frontmatter, check `subjects` against the registry, and check referenced images.
- **`new-project`:** add an entry to `src/data/projects.ts`, put the image at the declared path, and optionally pair it with a blog post. Project `techStack` doesn't go through `BrandIcon`, so new tech names need no `iconMap` entry.
- **`content-audit`:** `node .claude/skills/content-audit/audit.mjs [--post <slug>] [--json]`. A read-only check of frontmatter, subjects, `public/` assets, internal links and anchors, and `iconMap` coverage. It exits 1 on errors, and it flags every content risk listed above.
- **`pre-pr`:** checks lockfile and secret hygiene, runs the four CI gates and the content audit, and drafts a Conventional Commit and PR description.
