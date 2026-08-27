# Anthony Wong — Portfolio

A production-grade personal portfolio website with a single long-scroll homepage, project detail pages, an MDX-powered blog, dark mode, scroll-reveal animations, and SEO — built with Next.js 16 and deployed on Vercel.

---

## Project Overview

This portfolio serves as a professional presence on the web. It showcases work experience, projects, and blog posts through a clean, accessible design with a consistent emerald accent theme. The site is fully static where possible (blog posts and project pages are pre-rendered at build time) with a single dynamic API route for the contact form.

Key features:

- Single long-scroll homepage with anchor navigation between sections
- Vertical experience timeline with skill pills and milestone highlights
- Project showcase with cards linking to detail pages
- Blog powered by MDX files with subject-based filtering, reading time, and tag support
- Server-side contact form via Resend with honeypot spam protection and rate limiting
- System-aware dark mode with manual toggle
- Subtle fade-up animations that respect `prefers-reduced-motion`
- Dynamic Open Graph images for every route
- Auto-generated sitemap and robots.txt

---

## Technology Stack

| Category | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19, TypeScript) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) with CSS-first configuration |
| Components | [shadcn/ui](https://ui.shadcn.com/) (Button, Card, Sheet, Sonner) |
| Animations | [Motion](https://motion.dev/) (`motion/react`) with `LazyMotion` for tree-shaking |
| Dark mode | [next-themes](https://github.com/pacocoursey/next-themes) |
| Blog / MDX | [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) (RSC), [gray-matter](https://github.com/jonschlinkert/gray-matter), [reading-time](https://github.com/ngryman/reading-time) |
| Contact form | [Resend](https://resend.com/) |
| Icons | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) (brand icons) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics), [Vercel Speed Insights](https://vercel.com/docs/speed-insights) |
| Package manager | pnpm |
| Deployment | Vercel |

---

## Project Structure

```
portfolio/
├── content/
│   └── blog/                          # MDX blog posts
│       ├── building-my-portfolio.mdx
│       └── first-data-pipeline.mdx
├── public/                            # Static assets (images, resume, favicon)
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts           # POST handler (Resend email)
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx           # Blog post detail page
│   │   │   │   └── opengraph-image.tsx
│   │   │   ├── blog-client.tsx        # Client component for subject filtering with URL state
│   │   │   ├── layout.tsx             # Blog layout (navbar + footer)
│   │   │   └── page.tsx               # Blog index page
│   │   ├── projects/
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx           # Project detail page
│   │   │   │   └── opengraph-image.tsx
│   │   │   └── layout.tsx             # Projects layout (navbar + footer)
│   │   ├── globals.css                # Tailwind v4 theme, dark mode, prose styles
│   │   ├── layout.tsx                 # Root layout (fonts, ThemeProvider, analytics)
│   │   ├── page.tsx                   # Homepage (assembles all sections)
│   │   ├── opengraph-image.tsx        # Default OG image
│   │   ├── sitemap.ts                 # Auto-generated sitemap
│   │   └── robots.ts                  # Crawler rules
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── sonner.tsx
│   │   ├── blog-preview.tsx           # Blog preview section with subject filtering (homepage)
│   │   ├── contact-form.tsx           # Contact form (client component)
│   │   ├── education-section.tsx      # Education cards with institution icons
│   │   ├── experience-timeline.tsx    # Vertical timeline with brand icons
│   │   ├── footer.tsx                 # Footer with social links
│   │   ├── hero.tsx                   # Hero + about section with profile photo
│   │   ├── icons.tsx                  # BrandIcon component with icon lookup map
│   │   ├── motion-wrapper.tsx         # LazyMotion provider, FadeUp, FadeUpOnScroll
│   │   ├── navbar.tsx                 # Fixed navbar with mobile Sheet drawer
│   │   ├── project-card.tsx           # Project card for homepage grid
│   │   ├── projects-section.tsx       # Projects grid section (homepage)
│   │   ├── subject-filter.tsx         # Shared subject filtering component (sidebar + pills)
│   │   └── theme-toggle.tsx           # Dark/light mode toggle
│   ├── data/
│   │   ├── education.ts              # Education entries (degree, institution, areas of study)
│   │   ├── experiences.ts             # Work experience entries (title, company, skills, milestones)
│   │   ├── projects.ts               # Project entries
│   │   └── subjects.ts               # Blog subject registry (slug + label)
│   ├── lib/
│   │   ├── mdx.ts                     # MDX file reading + parsing utilities
│   │   ├── resend.ts                  # Resend email client
│   │   ├── subjects.ts               # Subject filtering logic (filterPostsBySubject)
│   │   └── utils.ts                   # cn() utility (clsx + tailwind-merge)
│   └── types/
│       └── index.ts                   # Shared types (Experience, Education, Project, BlogPost)
├── .env.example                       # Environment variable template
├── .nvmrc                             # Node version pin (24)
├── components.json                    # shadcn/ui configuration
├── next.config.ts                     # Next.js configuration
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Architecture Overview

### Rendering Strategy

- **Homepage (`/`)** — Static. All sections are server components (or client components with server-passed props). Blog posts are read from the filesystem at build time.
- **Blog index (`/blog`)** — Static. Lists all MDX posts sorted by date.
- **Blog posts (`/blog/[slug]`)** — SSG via `generateStaticParams`. MDX is rendered server-side with `next-mdx-remote/rsc`.
- **Project pages (`/projects/[slug]`)** — SSG via `generateStaticParams`. Data comes from `src/data/projects.ts`.
- **Contact API (`/api/contact`)** — Dynamic serverless function. Validates input, checks honeypot, applies in-memory rate limiting, sends email via Resend.
- **OG images** — Dynamic image generation using `next/og` (`ImageResponse`). The homepage OG runs on Edge runtime; blog and project OG images run on Node.js (they read filesystem data).

### Content Model

Content is stored in two forms:

1. **TypeScript data files** (`src/data/`) — Structured data for experiences, education, projects, and blog subjects. Edited directly in code. Changes require a rebuild.
2. **MDX files** (`content/blog/`) — Blog posts with YAML frontmatter. Parsed at build time using `gray-matter` and `reading-time`. No CMS; files are committed to the repo.

### Theming

The color system is defined entirely in `src/app/globals.css` using Tailwind v4's `@theme` directive. A `.dark` class override (toggled by `next-themes`) swaps all color tokens. The emerald accent (`#10b981`) is consistent across both modes.

### Animations

Motion animations use `LazyMotion` with `domAnimation` features for minimal bundle size. Two reusable wrappers:

- `FadeUp` — Animates on mount (used in the hero section)
- `FadeUpOnScroll` — Animates when scrolling into viewport with `once: true` (used in timeline, projects, blog preview)

Both respect `prefers-reduced-motion` by falling back to opacity-only transitions.

---

## Setup

### Prerequisites

- **Node.js 24+** (see `.nvmrc`)
- **pnpm** (any recent version)

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | For contact form | API key from [resend.com](https://resend.com). Without it, the contact form will return a 500 error on submit. |
| `NEXT_PUBLIC_SITE_URL` | For SEO | Your deployed URL (e.g., `https://anthonywong.dev`). Defaults to `http://localhost:3000`. Used in sitemap, OG images, and metadata. |

---

## Development Workflow

### Start the Dev Server

```bash
pnpm dev
```

Opens at [http://localhost:3000](http://localhost:3000). Uses Turbopack for fast hot module replacement — edits to components, styles, and MDX content reflect instantly.

### Available Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Create optimized production build |
| `pnpm start` | Serve the production build locally |
| `pnpm test` | Run tests with Vitest |
| `pnpm lint` | Run ESLint |
| `pnpm tsc --noEmit` | Run TypeScript type checking |

### Recommended Workflow

1. Run `pnpm dev` to start the dev server
2. Make changes to components, data, or content
3. Preview changes in the browser (hot reload is automatic)
4. Run `pnpm lint` and `pnpm tsc --noEmit` to catch issues
5. Run `pnpm build` before committing to verify the production build succeeds

---

## Application Description

### Homepage (`/`)

A single long-scroll page composed of six sections, each with an anchor ID for navbar navigation:

| Section | Anchor | Description |
| --- | --- | --- |
| Hero + About | `#home` | Introduction with name, bio, skill pills with brand icons, social links (GitHub, LinkedIn), profile photo, and resume download button. |
| Experience | `#experience` | Vertical timeline with a gradient line. Each entry shows title, company (with brand icon), period, summary, skill pills (with brand icons), and key milestones. Current role has an emerald dot. |
| Education | `#education` | Education cards with institution icon, degree, period, and areas of study rendered as bullet points. |
| Projects | `#projects` | 2-column card grid. Each card has a screenshot placeholder, title, summary, tech stack pills, and links to GitHub/live demo. Cards link to detail pages. |
| Blog | `#blog` | Two-panel subject filtering layout. Desktop: alphabetical subject sidebar on the left, up to 5 filtered articles on the right. Mobile: horizontal scrollable pills above articles. Defaults to showing latest posts. "View more" links to the full blog index. |
| Contact | `#contact` | Form with name, email, and message fields. Includes a hidden honeypot field for spam prevention. Submissions are sent via the Resend API. |

### Blog (`/blog` and `/blog/[slug]`)

- **Index page** features the same two-panel subject filtering layout as the homepage. Subject selection is reflected in the URL query parameter (`/blog?subject=data-engineering`) for shareable, bookmarkable links. Browser back/forward navigates between subject selections. Shows all matching posts with summaries.
- **Detail page** renders MDX content with styled prose, tag pills, and a back link
- Posts are sorted by `publishedAt` date (newest first)

### Projects (`/projects/[slug]`)

- Detail page shows a screenshot placeholder, title, summary, tech stack pills, GitHub/live demo links, and a full description
- Data comes from `src/data/projects.ts`

### Shared Elements

- **Navbar** — Fixed at top with backdrop blur. Desktop: inline links + emerald "Let's Talk" CTA + theme toggle. Mobile (<768px): theme toggle + hamburger that opens a Sheet drawer.
- **Footer** — Copyright year, GitHub, LinkedIn, and RSS links.
- **Theme toggle** — Switches between light/dark mode. Uses `useSyncExternalStore` for hydration-safe mounting.
- **OG images** — Dynamically generated PNG images (1200x630) for the homepage, each blog post, and each project page.

---

## Components Description

### Layout Components

| Component | File | Description |
| --- | --- | --- |
| `Navbar` | `src/components/navbar.tsx` | Fixed navigation bar with desktop links, mobile Sheet drawer, and theme toggle. Client component (manages Sheet open state). |
| `Footer` | `src/components/footer.tsx` | Site footer with copyright and social icon links. Server component. |
| `ThemeToggle` | `src/components/theme-toggle.tsx` | Button that cycles between light and dark mode. Client component using `next-themes`. |

### Homepage Sections

| Component | File | Description |
| --- | --- | --- |
| `Hero` | `src/components/hero.tsx` | Two-column hero with text content (bio, skill pills with brand icons, social links, resume button) and profile photo. Wrapped in `FadeUp` animations. |
| `ExperienceTimeline` | `src/components/experience-timeline.tsx` | Vertical timeline reading from `src/data/experiences.ts`. Shows company name with brand icon and skill pills with brand icons. Each card wrapped in `FadeUpOnScroll`. |
| `EducationSection` | `src/components/education-section.tsx` | Education cards reading from `src/data/education.ts`. Shows institution icon, degree, period (top-right), and areas of study as bullet points. Wrapped in `FadeUpOnScroll`. |
| `BrandIcon` | `src/components/icons.tsx` | Shared icon component with a lookup map for skills, companies, and institutions. Uses Simple Icons, Font Awesome, and Lucide fallbacks. |
| `ProjectsSection` | `src/components/projects-section.tsx` | Grid wrapper that renders `ProjectCard` components from `src/data/projects.ts`. |
| `ProjectCard` | `src/components/project-card.tsx` | Individual project card with hover lift effect, screenshot placeholder, tech pills, and icon links. Wrapped in `FadeUpOnScroll`. |
| `BlogPreview` | `src/components/blog-preview.tsx` | Two-panel blog section with subject filtering via `SubjectFilter`. Uses local `useState` for subject selection. Shows up to 5 posts per subject. Wrapped in `FadeUpOnScroll`. |
| `SubjectFilter` | `src/components/subject-filter.tsx` | Shared presentational component for subject-based blog filtering. Desktop: sidebar with alphabetical subject list. Mobile: horizontal scrollable pills. Renders filtered article cards with optional summaries. Used by both `BlogPreview` and `BlogClient`. |
| `ContactForm` | `src/components/contact-form.tsx` | Form with client-side submission to `/api/contact`. Shows toast notifications via Sonner. Includes honeypot field. |

### Animation Components

| Component | File | Description |
| --- | --- | --- |
| `MotionProvider` | `src/components/motion-wrapper.tsx` | `LazyMotion` wrapper with `domAnimation` features. Wraps the app in the root layout. |
| `FadeUp` | `src/components/motion-wrapper.tsx` | Fade + slide up animation on mount. Used for hero content. |
| `FadeUpOnScroll` | `src/components/motion-wrapper.tsx` | Fade + slide up animation triggered on scroll into viewport (`once: true`). Used for timeline, projects, blog. |

### UI Primitives (shadcn/ui)

Located in `src/components/ui/`. These are generated by the shadcn CLI and should be updated via `pnpm dlx shadcn@latest add <component>` rather than edited manually.

- `button.tsx` — Button with variant and size props
- `card.tsx` — Card container with header, content, and footer slots
- `sheet.tsx` — Slide-out drawer (used for mobile nav)
- `sonner.tsx` — Toast notification provider

---

## Adding New Content

### Adding a Blog Post

1. Create a new `.mdx` file in `content/blog/`:

```bash
touch content/blog/my-new-post.mdx
```

2. Add frontmatter at the top of the file:

```yaml
---
title: "Your Post Title"
publishedAt: "2026-06-01"
subjects: ["data-engineering"]
tags: ["Tag1", "Tag2"]
summary: "A one-sentence description of the post."
---
```

The `subjects` field is an array of subject slugs from the registry in `src/data/subjects.ts`. A post can belong to one or more subjects. Posts without a `subjects` field will only appear under "Latest" (no subject filter).

3. Write your content below the frontmatter using standard Markdown syntax. The filename (without `.mdx`) becomes the URL slug: `/blog/my-new-post`.

4. The post will automatically appear on the blog index, blog preview on the homepage (under its subject), the sitemap, and get its own OG image.

### Adding a Blog Subject

Edit `src/data/subjects.ts` and add a new entry to the `subjects` array. Keep entries sorted alphabetically by label:

```typescript
{ slug: "philosophy", label: "Philosophy" },
```

The slug must be lowercase with hyphens only (e.g., `"full-stack-development"`). Blog posts reference subjects by slug in their frontmatter.

### Adding a Project

Edit `src/data/projects.ts` and add a new entry to the `projects` array:

```typescript
{
  slug: "my-project",              // URL slug: /projects/my-project
  title: "My Project",
  summary: "One-line description for the card.",
  description: "Full description shown on the detail page.",
  image: "/images/projects/my-project.png",
  techStack: ["React", "Node.js"],
  githubUrl: "https://github.com/user/repo",  // optional
  liveUrl: "https://example.com",              // optional
},
```

The project will appear on the homepage grid and get its own detail page, sitemap entry, and OG image.

### Adding a Work Experience

Edit `src/data/experiences.ts` and add a new entry to the `experiences` array:

```typescript
{
  title: "Job Title",
  company: "Company Name",
  period: "Jan 2026 — Present",
  summary: "What you did in this role.",
  skills: ["Skill1", "Skill2"],
  milestones: [
    "Achievement 1",
    "Achievement 2",
  ],
  current: true,  // true for current role, false for past
},
```

Place newer roles at the beginning of the array (they render top to bottom). To display a brand icon next to the company name, add an entry in the `iconMap` in `src/components/icons.tsx`.

### Adding an Education Entry

Edit `src/data/education.ts` and add a new entry to the `education` array:

```typescript
{
  degree: "Degree Name",
  institution: "Institution Name",
  period: "Sep 2020 — Jun 2024",
  areasOfStudy: ["Major 1", "Major 2"],
},
```

To display a brand icon for the institution, add an entry in the `iconMap` in `src/components/icons.tsx`.

### Adding a Brand Icon

Edit `src/components/icons.tsx` and add an entry to the `iconMap` object, keyed by the exact string used in data files (skill name, company name, or institution name):

```typescript
"New Brand": SiNewbrand,  // from react-icons/si
```

Icons are resolved from [Simple Icons](https://simpleicons.org/) (`react-icons/si`), [Font Awesome](https://fontawesome.com/) (`react-icons/fa`), or [Lucide](https://lucide.dev/) (`lucide-react`) as fallbacks.

---

## Updating Existing Content

### Editing a Blog Post

Open the corresponding `.mdx` file in `content/blog/` and edit the frontmatter or body content. Changes are picked up on the next build (or instantly in dev mode).

### Editing Projects or Experiences

Modify the relevant entry in `src/data/projects.ts` or `src/data/experiences.ts`. The TypeScript compiler will catch any missing or incorrectly typed fields.

### Changing the Color Theme

All color tokens are defined in `src/app/globals.css` under the `@theme` block (light mode) and `.dark` class (dark mode). The accent color is `#10b981` (emerald). To change it, update `--color-accent`, `--color-accent-foreground`, `--color-accent-muted`, and `--color-ring` in both blocks.

### Updating Social Links

Social URLs appear in three places:
- `src/components/hero.tsx` — GitHub and LinkedIn buttons
- `src/components/footer.tsx` — GitHub, LinkedIn, and RSS links
- `src/components/navbar.tsx` — Logo text (`Anthony Wong`)

### Replacing the Profile Photo

The hero photo is rendered via a Next.js `<Image>` component in `src/components/hero.tsx` pointing to `public/profile.jpg`. Replace that file with a new image (280x320 recommended). The image uses `object-cover` to fill the frame and `priority` for above-the-fold loading.

### Updating the Resume

Place your resume PDF at `public/resume.pdf`. The download button in the hero section links to `/resume.pdf`.
