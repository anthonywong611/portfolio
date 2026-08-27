# Portfolio Website Phase 1 MVP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a production-grade personal portfolio website with homepage (hero/about, experience timeline, projects, blog preview, contact form), project detail pages, blog pages with MDX, dark mode, animations, and SEO — all deployed on Vercel.

**Architecture:** Next.js 16 App Router with TypeScript. Single long-scroll homepage with anchor navigation. Content stored as TypeScript data files (projects, experiences) and MDX files (blog). Server-side contact form via Resend. Motion library for subtle scroll-reveal animations.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Motion (`motion/react`), next-themes, next-mdx-remote, Resend, lucide-react, Vercel Analytics

**Spec:** `docs/superpowers/specs/2026-05-11-portfolio-website-design.md`

---

## File Map

| File | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | Root layout: fonts, theme provider, skip-to-content, analytics |
| `src/app/page.tsx` | Homepage: assembles all sections |
| `src/app/globals.css` | Tailwind v4 theme, dark mode variant, fluid type, color tokens |
| `src/app/sitemap.ts` | Auto-generated sitemap for all routes |
| `src/app/robots.ts` | Crawler rules |
| `src/app/opengraph-image.tsx` | Default OG image (1200x630) |
| `src/app/blog/page.tsx` | Blog index page |
| `src/app/blog/[slug]/page.tsx` | Blog post page (MDX rendering) |
| `src/app/blog/[slug]/opengraph-image.tsx` | Per-post OG image |
| `src/app/projects/[slug]/page.tsx` | Project detail page |
| `src/app/projects/[slug]/opengraph-image.tsx` | Per-project OG image |
| `src/app/api/contact/route.ts` | Contact form POST handler (Resend) |
| `src/components/navbar.tsx` | Fixed navbar with mobile Sheet drawer |
| `src/components/hero.tsx` | Merged hero + about section |
| `src/components/experience-timeline.tsx` | Vertical timeline with cards |
| `src/components/project-card.tsx` | Project card for homepage grid |
| `src/components/projects-section.tsx` | Projects section with grid layout |
| `src/components/blog-preview.tsx` | Blog preview section for homepage |
| `src/components/contact-form.tsx` | Contact form client component |
| `src/components/footer.tsx` | Footer with social icons |
| `src/components/theme-toggle.tsx` | Dark mode toggle button |
| `src/components/motion-wrapper.tsx` | LazyMotion provider + fade-up component |
| `src/components/ui/` | shadcn/ui components (Button, Card, Sheet, Sonner) |
| `src/data/projects.ts` | Hardcoded project data array |
| `src/data/experiences.ts` | Hardcoded experience data array |
| `src/lib/mdx.ts` | MDX file reading + parsing utilities |
| `src/lib/resend.ts` | Resend email helper |
| `src/types/index.ts` | Shared TypeScript types (Experience, Project, BlogPost) |
| `content/blog/*.mdx` | Blog post MDX files |
| `.env.local` | Local environment variables (RESEND_API_KEY, NEXT_PUBLIC_SITE_URL) |
| `.env.example` | Template with empty values (committed) |
| `.nvmrc` | Node version pin (24) |

---

### Task 1: Initialize Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.nvmrc`, `.env.example`, `.env.local`
- Replace: `.gitignore`

- [ ] **Step 1: Create Next.js 16 project with pnpm**

Run:
```bash
cd /Users/anthony.wong/Projects/portfolio
pnpm create next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --turbopack
```

When prompted about overwriting existing files, accept. This scaffolds the project with Next.js 16, Tailwind CSS v4, TypeScript, App Router, and ESLint.

- [ ] **Step 2: Verify the scaffolded project runs**

Run:
```bash
pnpm dev
```

Open `http://localhost:3000` in the browser. You should see the default Next.js welcome page. Stop the dev server with Ctrl+C.

- [ ] **Step 3: Replace .gitignore with a proper Next.js one**

The current `.gitignore` is Python-focused. Replace its contents with:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# claude code
.claude/
.superpowers/
```

- [ ] **Step 4: Pin Node version and add env template**

Create `.nvmrc`:
```
24
```

Create `.env.example`:
```bash
# Required for contact form (get from https://resend.com)
RESEND_API_KEY=
# Your site URL (e.g., https://yourname.com or https://yourname.vercel.app)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Create `.env.local`:
```bash
RESEND_API_KEY=re_placeholder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 16 project with Tailwind v4 and TypeScript"
```

---

### Task 2: Install Dependencies and Configure shadcn/ui

**Files:**
- Modify: `package.json`
- Create: `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/sonner.tsx`, `src/lib/utils.ts`, `components.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
pnpm add motion next-themes next-mdx-remote gray-matter reading-time resend lucide-react @vercel/analytics @vercel/speed-insights
```

- [ ] **Step 2: Initialize shadcn/ui**

```bash
pnpm dlx shadcn@latest init
```

Accept defaults: New York style, Zinc base color, CSS variables. This creates `components.json` and `src/lib/utils.ts`.

- [ ] **Step 3: Add required shadcn/ui components**

```bash
pnpm dlx shadcn@latest add button card sheet sonner
```

This installs the four shadcn components into `src/components/ui/`.

- [ ] **Step 4: Verify the project still builds**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui, motion, next-themes, and other dependencies"
```

---

### Task 3: Types, Data Files, and Global CSS

**Files:**
- Create: `src/types/index.ts`, `src/data/experiences.ts`, `src/data/projects.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Create shared TypeScript types**

Create `src/types/index.ts`:

```typescript
export type Experience = {
  title: string;
  period: string;
  summary: string;
  skills: string[];
  milestones: string[];
  current: boolean;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
  summary: string;
  content: string;
  readingTime: string;
};
```

- [ ] **Step 2: Create experience data**

Create `src/data/experiences.ts`:

```typescript
import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    title: "Senior Data Engineer",
    period: "Jan 2025 — Present",
    summary:
      "Led migration of legacy ETL pipelines to a modern streaming architecture, reducing data latency from hours to minutes and improving reliability across 12 downstream services.",
    skills: ["Python", "Apache Kafka", "dbt", "Snowflake"],
    milestones: [
      "Reduced pipeline failure rate by 73%",
      "Migrated 40+ batch jobs to real-time streaming",
      "Built internal monitoring dashboard used by 3 teams",
    ],
    current: true,
  },
  {
    title: "Full Stack Developer",
    period: "Jun 2023 — Dec 2024",
    summary:
      "Built and maintained customer-facing React applications and Node.js microservices, collaborating with design and product teams to ship features on a two-week sprint cycle.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    milestones: [
      "Shipped checkout redesign that increased conversion by 12%",
      "Introduced end-to-end testing, catching 30+ bugs pre-release",
      "Mentored 2 junior developers through onboarding",
    ],
    current: false,
  },
  {
    title: "Data Analyst Intern",
    period: "Jan 2023 — May 2023",
    summary:
      "Analyzed customer behavior data to identify churn patterns and built dashboards that informed the retention team's quarterly strategy.",
    skills: ["Python", "SQL", "Tableau", "Pandas"],
    milestones: [
      "Built churn prediction model with 84% accuracy",
      "Created 5 executive dashboards adopted company-wide",
      "Presented findings to C-suite, leading to new retention program",
    ],
    current: false,
  },
];
```

- [ ] **Step 3: Create project data**

Create `src/data/projects.ts`:

```typescript
import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "streaming-pipeline",
    title: "Real-Time Streaming Pipeline",
    summary:
      "Event-driven data pipeline processing 50K+ events/sec with exactly-once delivery guarantees.",
    description:
      "A production data pipeline built with Apache Kafka and Python that processes real-time event streams from multiple sources. Features exactly-once delivery semantics, dead letter queues for failed messages, and a monitoring dashboard built with Grafana. Reduced data latency from 4 hours to under 30 seconds for downstream analytics consumers.",
    image: "/images/projects/streaming-pipeline.png",
    techStack: ["Python", "Apache Kafka", "Docker", "Grafana", "PostgreSQL"],
    githubUrl: "https://github.com/anthonywong",
    liveUrl: undefined,
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    summary:
      "This very site — a production-grade Next.js portfolio with MDX blog, dark mode, and animations.",
    description:
      "A personal portfolio website built with Next.js 16, Tailwind CSS v4, and shadcn/ui. Features a merged hero/about section, experience timeline, project showcase, blog with MDX support, contact form via Resend, dynamic OG images, and subtle Motion animations. Designed mobile-first with full dark mode support and accessibility baked in.",
    image: "/images/projects/portfolio.png",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Resend"],
    githubUrl: "https://github.com/anthonywong/portfolio",
    liveUrl: "https://anthonywong.dev",
  },
];
```

- [ ] **Step 4: Set up global CSS with Tailwind v4 theme and dark mode**

Replace the contents of `src/app/globals.css` with:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-geist: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-geist-mono: "Geist Mono", ui-monospace, monospace;

  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-border: #e2e8f0;
  --color-card: #ffffff;
  --color-card-foreground: #0f172a;
  --color-section-alt: #f8fafc;
  --color-accent: #10b981;
  --color-accent-foreground: #ffffff;
  --color-accent-muted: rgba(16, 185, 129, 0.13);
}

.dark {
  --color-background: #0f172a;
  --color-foreground: #e2e8f0;
  --color-muted: #1e293b;
  --color-muted-foreground: #94a3b8;
  --color-border: #334155;
  --color-card: #1e293b;
  --color-card-foreground: #e2e8f0;
  --color-section-alt: #1e293b;
  --color-accent: #10b981;
  --color-accent-foreground: #ffffff;
  --color-accent-muted: rgba(16, 185, 129, 0.13);
}

body {
  font-family: var(--font-geist);
  background: var(--color-background);
  color: var(--color-foreground);
}

/* Fluid type scale */
h1 {
  font-size: clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem);
}

h2 {
  font-size: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
}

/* Skip to content */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: white;
  font-weight: 600;
  border-radius: 0 0 0.5rem 0;
}

.skip-to-content:focus {
  left: 0;
}
```

Note: shadcn/ui may have generated additional CSS variables during `init`. Keep those and merge the above into the file. The key additions are the `@custom-variant dark`, the color tokens, the `.dark` overrides, and the fluid type scale.

- [ ] **Step 5: Verify typecheck passes**

```bash
pnpm tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/data/experiences.ts src/data/projects.ts src/app/globals.css
git commit -m "feat: add types, data files, and Tailwind v4 theme with dark mode tokens"
```

---

### Task 4: Root Layout with Fonts, Theme Provider, and Skip-to-Content

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/theme-toggle.tsx`

- [ ] **Step 1: Create the theme toggle component**

Create `src/components/theme-toggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
      )}
    </Button>
  );
}
```

- [ ] **Step 2: Update root layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Anthony Wong — Software Engineer",
    template: "%s | Anthony Wong",
  },
  description:
    "Software engineer building impactful solutions at the intersection of data and design.",
  openGraph: {
    title: "Anthony Wong — Software Engineer",
    description:
      "Software engineer building impactful solutions at the intersection of data and design.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the app renders with dark mode toggle**

Temporarily add a toggle to the home page to test. Edit `src/app/page.tsx`:

```tsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-foreground">Anthony Wong</h1>
        <p className="text-muted-foreground">Portfolio coming soon</p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
```

Run: `pnpm dev`

Open `http://localhost:3000`. Verify:
1. Page loads with Geist font
2. Dark mode toggle switches between light/dark
3. No flash of wrong theme on reload
4. "Skip to content" link appears on Tab key press

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/components/theme-toggle.tsx
git commit -m "feat: add root layout with Geist fonts, theme provider, and skip-to-content"
```

---

### Task 5: Navbar with Mobile Drawer

**Files:**
- Create: `src/components/navbar.tsx`

- [ ] **Step 1: Create the navbar component**

Create `src/components/navbar.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#home", label: "🏠 Home" },
  { href: "#experience", label: "💼 Experience" },
  { href: "#projects", label: "🚀 Projects" },
  { href: "#blog", label: "✍️ Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-accent transition-colors hover:text-accent/80"
        >
          Anthony Wong
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            💬 Let&apos;s Talk
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetTitle className="text-lg font-bold text-accent">
                Anthony Wong
              </SheetTitle>
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="text-base text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href="#contact"
                    className="mt-2 rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    💬 Let&apos;s Talk
                  </a>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Add navbar to homepage and verify**

Update `src/app/page.tsx`:

```tsx
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section id="home" className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Sections coming soon...</p>
        </section>
      </main>
    </>
  );
}
```

Run: `pnpm dev`

Verify:
1. Navbar is fixed at top with blur backdrop
2. Desktop: all links visible, "Let's Talk" has emerald background
3. Mobile (resize to <768px): hamburger menu opens Sheet drawer
4. Dark mode toggle works in both desktop and mobile nav

- [ ] **Step 3: Commit**

```bash
git add src/components/navbar.tsx src/app/page.tsx
git commit -m "feat: add navbar with desktop links, mobile Sheet drawer, and theme toggle"
```

---

### Task 6: Hero + About Section

**Files:**
- Create: `src/components/hero.tsx`

- [ ] **Step 1: Create the hero component**

Create `src/components/hero.tsx`:

```tsx
import Image from "next/image";
import { Github, Linkedin, Download } from "lucide-react";

const skills = [
  { emoji: "🐍", name: "Python" },
  { emoji: "📘", name: "TypeScript" },
  { emoji: "⚛️", name: "React" },
  { emoji: "🗄️", name: "SQL" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="px-4 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-16">
        {/* Left: text content */}
        <div className="flex-1">
          <p className="mb-2 font-mono text-sm text-accent">👋 Hi, I&apos;m</p>
          <h1 className="mb-4 font-bold text-foreground">Anthony Wong</h1>
          <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
            Software engineer building impactful solutions at the intersection
            of data and design. I love turning messy problems into clean,
            maintainable systems — whether that&apos;s a streaming data pipeline or
            a polished web app.
          </p>

          {/* Skill pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full bg-accent-muted px-3 py-1 text-xs text-accent"
              >
                {skill.emoji} {skill.name}
              </span>
            ))}
          </div>

          {/* Social links + Resume */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/anthonywong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-[18px] w-[18px]" />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/anthonywong"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-[18px] w-[18px]" />
              LinkedIn
            </a>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-accent to-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-shadow hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)]"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </div>
        </div>

        {/* Right: photo */}
        <div className="flex-shrink-0">
          <div className="h-[320px] w-[280px] overflow-hidden rounded-2xl border-2 border-border bg-muted">
            {/* Replace with your actual photo — use next/image for optimization */}
            <div className="flex h-full w-full items-center justify-center text-5xl text-muted-foreground">
              📷
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add hero to homepage and verify**

Update `src/app/page.tsx`:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
      </main>
    </>
  );
}
```

Run: `pnpm dev`

Verify:
1. Two-column layout: text left, photo right
2. Skill pills display with emoji
3. GitHub and LinkedIn buttons have icons
4. Resume button has emerald gradient and download icon
5. On mobile: stacks vertically, photo below text

- [ ] **Step 3: Commit**

```bash
git add src/components/hero.tsx src/app/page.tsx
git commit -m "feat: add merged hero + about section with social links and resume button"
```

---

### Task 7: Experience Timeline

**Files:**
- Create: `src/components/experience-timeline.tsx`

- [ ] **Step 1: Create the experience timeline component**

Create `src/components/experience-timeline.tsx`:

```tsx
import { experiences } from "@/data/experiences";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="bg-section-alt px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-bold text-foreground">💼 Experience</h2>

        <div className="relative pl-8">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent to-border" />

          {experiences.map((exp, i) => (
            <div
              key={i}
              className="relative mb-10 last:mb-0"
            >
              {/* Dot */}
              <div
                className={`absolute -left-8 top-1.5 h-4 w-4 rounded-full border-[3px] ${
                  exp.current
                    ? "border-background bg-accent shadow-[0_0_0_2px_theme(colors.accent)]"
                    : "border-background bg-border shadow-[0_0_0_2px_theme(colors.border)]"
                }`}
              />

              {/* Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                  <h3 className="text-lg font-semibold text-foreground">
                    {exp.title}
                  </h3>
                  <span
                    className={`whitespace-nowrap font-mono text-sm ${
                      exp.current ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    📅 {exp.period}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {exp.summary}
                </p>

                {/* Skills */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-accent-muted px-2.5 py-0.5 text-xs text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Milestones */}
                <div className="border-t border-border pt-3">
                  <p className="mb-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    🏆 Key Milestones
                  </p>
                  <ul className="list-disc pl-4 text-sm leading-relaxed text-muted-foreground">
                    {exp.milestones.map((milestone, j) => (
                      <li key={j}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to homepage and verify**

Update `src/app/page.tsx`:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
      </main>
    </>
  );
}
```

Run: `pnpm dev`

Verify:
1. Timeline line with emerald gradient appears
2. Three experience cards render with all fields
3. Current role has emerald dot, past roles have muted dots
4. Skill pills and milestones display correctly
5. Section alternates background color

- [ ] **Step 3: Commit**

```bash
git add src/components/experience-timeline.tsx src/app/page.tsx
git commit -m "feat: add experience timeline section with vertical line and cards"
```

---

### Task 8: Project Card and Projects Section

**Files:**
- Create: `src/components/project-card.tsx`, `src/components/projects-section.tsx`

- [ ] **Step 1: Create the project card component**

Create `src/components/project-card.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
      {/* Screenshot */}
      <Link href={`/projects/${project.slug}`}>
        <div className="mb-4 h-[140px] overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Screenshot
          </div>
        </div>
      </Link>

      {/* Title */}
      <Link href={`/projects/${project.slug}`}>
        <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </h3>
      </Link>

      {/* Summary */}
      <p className="mb-3 text-sm text-muted-foreground">{project.summary}</p>

      {/* Tech stack */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded bg-accent-muted px-2 py-0.5 text-xs text-accent"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-3.5 w-3.5" />
            Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the projects section component**

Create `src/components/projects-section.tsx`:

```tsx
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";

export function ProjectsSection() {
  return (
    <section id="projects" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 font-bold text-foreground">🚀 Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to homepage and verify**

Update `src/app/page.tsx`:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsSection } from "@/components/projects-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
        <ProjectsSection />
      </main>
    </>
  );
}
```

Run: `pnpm dev`

Verify:
1. 2-column grid of project cards on desktop, single column on mobile
2. Cards have hover lift effect and border color change
3. Title links to `/projects/[slug]`
4. GitHub and Live Demo links display with icons
5. Tech stack pills render

- [ ] **Step 4: Commit**

```bash
git add src/components/project-card.tsx src/components/projects-section.tsx src/app/page.tsx
git commit -m "feat: add projects section with card grid, hover effects, and icon links"
```

---

### Task 9: Blog Preview Section and MDX Infrastructure

**Files:**
- Create: `src/lib/mdx.ts`, `src/components/blog-preview.tsx`, `content/blog/building-my-portfolio.mdx`, `content/blog/first-data-pipeline.mdx`

- [ ] **Step 1: Create MDX utilities**

Create `src/lib/mdx.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { BlogPost } from "@/types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug: filename.replace(/\.mdx$/, ""),
      title: data.title,
      publishedAt: data.publishedAt,
      tags: data.tags ?? [],
      coverImage: data.coverImage,
      summary: data.summary,
      content,
      readingTime: readingTime(content).text,
    } satisfies BlogPost;
  });

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
```

- [ ] **Step 2: Create two placeholder blog posts**

Create `content/blog/building-my-portfolio.mdx`:

```mdx
---
title: "Building My First Portfolio with Next.js"
publishedAt: "2026-05-11"
tags: ["Next.js", "React", "Portfolio"]
summary: "A walkthrough of how I built this portfolio site with Next.js 16, Tailwind CSS v4, and shadcn/ui — from blank repo to deployed."
---

Building a portfolio website is one of those projects that sounds simple but quickly reveals how many decisions go into even a "simple" site. Here's what I learned building mine.

## The Stack

I went with **Next.js 16** using the App Router, **Tailwind CSS v4** for styling, and **shadcn/ui** for accessible component primitives. The content lives as TypeScript data files for projects and MDX for blog posts.

## What I'd Do Differently

If I were starting over, I'd spend more time on the design system before writing components. Getting the color tokens, spacing rhythm, and type scale right upfront saves a lot of tweaking later.

## What's Next

I'm planning to add a CMS (Keystatic) so I can edit content from a browser, and Playwright tests for the critical paths.
```

Create `content/blog/first-data-pipeline.mdx`:

```mdx
---
title: "What I Learned from My First Data Pipeline"
publishedAt: "2026-04-15"
tags: ["Python", "Data Engineering", "Kafka"]
summary: "Lessons from building a real-time event streaming pipeline — from Kafka basics to exactly-once delivery."
---

My first real data engineering project was building a streaming pipeline that needed to process 50,000 events per second with exactly-once delivery. Here's what I learned.

## Start Simple

The temptation is to over-engineer from day one. I started with a simple Kafka consumer and producer, validated the data flow, then added complexity incrementally — dead letter queues, monitoring, alerting.

## Monitoring Is Not Optional

You can't debug a streaming pipeline by reading logs. I set up Grafana dashboards from the start and it saved me countless hours of guessing what went wrong.

## Key Takeaway

Build the simplest version first, instrument everything, and add complexity only when you have data showing you need it.
```

- [ ] **Step 3: Create the blog preview component**

Create `src/components/blog-preview.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-section-alt px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-bold text-foreground">✍️ Blog</h2>
          <Link
            href="/blog"
            className="text-sm text-accent transition-colors hover:text-accent/80"
          >
            View all posts →
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50"
            >
              <div>
                <h3 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  📅 {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · ⏱️ {post.readingTime}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add to homepage and verify**

Update `src/app/page.tsx`:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsSection } from "@/components/projects-section";
import { BlogPreview } from "@/components/blog-preview";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
        <ProjectsSection />
        <BlogPreview />
      </main>
    </>
  );
}
```

Run: `pnpm dev`

Verify:
1. Blog preview shows 2 posts with titles, dates, reading times
2. "View all posts →" link is visible
3. Hover shows arrow icon and border highlight
4. Section has alternating background

- [ ] **Step 5: Commit**

```bash
git add src/lib/mdx.ts src/components/blog-preview.tsx content/blog/ src/app/page.tsx
git commit -m "feat: add blog preview section with MDX infrastructure and 2 placeholder posts"
```

---

### Task 10: Contact Form and API Route

**Files:**
- Create: `src/components/contact-form.tsx`, `src/lib/resend.ts`, `src/app/api/contact/route.ts`

- [ ] **Step 1: Create Resend helper**

Create `src/lib/resend.ts`:

```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

- [ ] **Step 2: Create the contact API route**

Create `src/app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const rateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    // Rate limiting (1 per IP per minute)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const lastSubmission = rateLimitMap.get(ip);
    const now = Date.now();
    if (lastSubmission && now - lastSubmission < 60_000) {
      return NextResponse.json(
        { error: "Please wait a moment before sending another message." },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, now);

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "hello@anthonywong.dev",
      subject: `Portfolio contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create the contact form component**

Create `src/components/contact-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      website: formData.get("website"), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Something went wrong.");
        return;
      }

      toast.success("Message sent! I'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-2 font-bold text-foreground">💬 Contact</h2>
        <p className="mb-8 text-muted-foreground">
          Have a question or want to work together?
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md text-left"
        >
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div className="mb-3">
            <label
              htmlFor="name"
              className="mb-1 block text-sm text-muted-foreground"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              className="mb-1 block text-sm text-muted-foreground"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="message"
              className="mb-1 block text-sm text-muted-foreground"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="What's on your mind?"
              className="w-full resize-none rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {pending ? "Sending..." : "📨 Send Message"}
          </Button>

          <div aria-live="polite" className="sr-only" />
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add to homepage and verify**

Update `src/app/page.tsx`:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsSection } from "@/components/projects-section";
import { BlogPreview } from "@/components/blog-preview";
import { ContactForm } from "@/components/contact-form";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
        <ProjectsSection />
        <BlogPreview />
        <ContactForm />
      </main>
    </>
  );
}
```

Run: `pnpm dev`

Verify:
1. Contact form renders with name, email, message fields
2. Submit shows toast notification (will error without valid Resend key — that's expected)
3. Honeypot field is invisible
4. Form validates required fields

- [ ] **Step 5: Commit**

```bash
git add src/lib/resend.ts src/app/api/contact/route.ts src/components/contact-form.tsx src/app/page.tsx
git commit -m "feat: add contact form with Resend API, honeypot, and rate limiting"
```

---

### Task 11: Footer

**Files:**
- Create: `src/components/footer.tsx`

- [ ] **Step 1: Create the footer component**

Create `src/components/footer.tsx`:

```tsx
import { Github, Linkedin, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Anthony Wong
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/anthonywong"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/anthonywong"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="/feed.xml"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label="RSS Feed"
          >
            <Rss className="h-4 w-4" />
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add footer to homepage**

Update `src/app/page.tsx` — add `<Footer />` after the closing `</main>` tag:

```tsx
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsSection } from "@/components/projects-section";
import { BlogPreview } from "@/components/blog-preview";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Hero />
        <ExperienceTimeline />
        <ProjectsSection />
        <BlogPreview />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
```

Run: `pnpm dev`

Verify: Footer renders with copyright and social icons.

- [ ] **Step 3: Commit**

```bash
git add src/components/footer.tsx src/app/page.tsx
git commit -m "feat: add footer with social icons"
```

---

### Task 12: Blog Pages (Index + Post Detail)

**Files:**
- Create: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Install Tailwind typography plugin**

```bash
pnpm add @tailwindcss/typography
```

Add the import to the top of `src/app/globals.css` (after the `@import "tailwindcss";` line):

```css
@import "tailwindcss";
@import "@tailwindcss/typography";
```

- [ ] **Step 2: Create blog index page**

Create `src/app/blog/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, data, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 md:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <h1 className="mb-10 font-bold text-foreground">✍️ Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/50"
            >
              <div>
                <h2 className="mb-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mb-2 text-sm text-muted-foreground">
                  {post.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  📅{" "}
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · ⏱️ {post.readingTime}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create blog post detail page**

Create `src/app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 md:px-8">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <header className="mb-10">
        <h1 className="mb-3 font-bold text-foreground">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          📅{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          · ⏱️ {post.readingTime}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-accent-muted px-2.5 py-0.5 text-xs text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground prose-code:text-accent">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Verify both blog pages**

Run: `pnpm dev`

Verify:
1. `/blog` shows list of 2 posts with summaries, dates, reading times
2. Click a post → navigates to `/blog/building-my-portfolio`
3. Post renders with MDX content, prose styling, tag pills
4. "Back to blog" link works
5. Dark mode renders prose correctly

- [ ] **Step 5: Commit**

```bash
git add src/app/blog/ src/app/globals.css
git commit -m "feat: add blog index and post detail pages with MDX rendering"
```

---

### Task 13: Project Detail Page

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create the project detail page**

Create `src/app/projects/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 md:px-8">
      <Link
        href="/#projects"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      {/* Hero image placeholder */}
      <div className="mb-8 h-[240px] overflow-hidden rounded-2xl border border-border bg-muted md:h-[320px]">
        <div className="flex h-full w-full items-center justify-center text-lg text-muted-foreground">
          Project Screenshot
        </div>
      </div>

      <h1 className="mb-3 font-bold text-foreground">{project.title}</h1>
      <p className="mb-4 text-lg text-muted-foreground">{project.summary}</p>

      {/* Tech stack */}
      <div className="mb-6 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded bg-accent-muted px-3 py-1 text-sm text-accent"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="mb-8 flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            View Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </a>
        )}
      </div>

      {/* Description */}
      <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-muted-foreground">
        <p>{project.description}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm dev`

Navigate to `/projects/streaming-pipeline`. Verify:
1. Back link to `/#projects` works
2. Title, summary, tech stack pills render
3. GitHub link renders (Live Demo hidden when undefined)
4. Full description displays
5. Navigate to `/projects/portfolio-website` — both links visible

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/
git commit -m "feat: add project detail page with tech stack, links, and description"
```

---

### Task 14: SEO — Sitemap, Robots, and OG Images

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`, `src/app/projects/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Create sitemap**

Create `src/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const blogPosts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...blogPosts,
    ...projectPages,
  ];
}
```

- [ ] **Step 2: Create robots.txt**

Create `src/app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Create default OG image**

Create `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Anthony Wong — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: "#f1f5f9" }}>
          Anthony Wong
        </div>
        <div style={{ fontSize: 28, color: "#10b981", marginTop: 16 }}>
          Software Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 4: Create blog post OG image**

Create `src/app/blog/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/mdx";

export const runtime = "edge";
export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Blog Post";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#10b981",
            marginBottom: 16,
          }}
        >
          ✍️ Blog
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#f1f5f9",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 24 }}>
          Anthony Wong
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 5: Create project OG image**

Create `src/app/projects/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";

export const runtime = "edge";
export const alt = "Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? "Project";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#10b981",
            marginBottom: 16,
          }}
        >
          🚀 Project
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#f1f5f9",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 24 }}>
          Anthony Wong
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 6: Verify**

Run: `pnpm dev`

Check:
1. `http://localhost:3000/sitemap.xml` — should list all routes
2. `http://localhost:3000/robots.txt` — should show allow rules and sitemap link
3. `http://localhost:3000/opengraph-image` — should render PNG with name and title

- [ ] **Step 7: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/opengraph-image.tsx src/app/blog/[slug]/opengraph-image.tsx src/app/projects/[slug]/opengraph-image.tsx
git commit -m "feat: add sitemap, robots.txt, and dynamic OG images for all routes"
```

---

### Task 15: Motion Animations

**Files:**
- Create: `src/components/motion-wrapper.tsx`
- Modify: `src/components/hero.tsx`, `src/components/experience-timeline.tsx`, `src/components/project-card.tsx`, `src/components/blog-preview.tsx`

- [ ] **Step 1: Create the Motion wrapper components**

Create `src/components/motion-wrapper.tsx`:

```tsx
"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 20 }
      }
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0 }
      }
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function FadeUpOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 20 }
      }
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

- [ ] **Step 2: Wrap root layout with MotionProvider**

In `src/app/layout.tsx`, import `MotionProvider` and wrap the content:

```tsx
import { MotionProvider } from "@/components/motion-wrapper";
```

Then wrap the children inside ThemeProvider:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <a href="#main-content" className="skip-to-content">
    Skip to content
  </a>
  <MotionProvider>
    {children}
  </MotionProvider>
  <Toaster />
</ThemeProvider>
```

- [ ] **Step 3: Add FadeUp to hero**

In `src/components/hero.tsx`, wrap the text content in a `FadeUp` component. Add `"use client"` directive at the top (needed because FadeUp uses Motion hooks). Import:

```tsx
"use client";
import { FadeUp } from "@/components/motion-wrapper";
```

Wrap the left-side `<div className="flex-1">` content in `<FadeUp>`:

```tsx
<FadeUp>
  <div className="flex-1">
    {/* ... existing content ... */}
  </div>
</FadeUp>
```

And wrap the photo in `<FadeUp delay={0.2}>`:

```tsx
<FadeUp delay={0.2}>
  <div className="flex-shrink-0">
    {/* ... existing photo ... */}
  </div>
</FadeUp>
```

- [ ] **Step 4: Add FadeUpOnScroll to experience timeline cards**

In `src/components/experience-timeline.tsx`, add `"use client"` and import `FadeUpOnScroll`:

```tsx
"use client";
import { FadeUpOnScroll } from "@/components/motion-wrapper";
```

Wrap each experience card's outer `<div className="relative mb-10 last:mb-0">` content with `<FadeUpOnScroll delay={i * 0.1}>`:

```tsx
{experiences.map((exp, i) => (
  <FadeUpOnScroll key={i} delay={i * 0.1} className="relative mb-10 last:mb-0">
    {/* Dot */}
    {/* Card */}
  </FadeUpOnScroll>
))}
```

- [ ] **Step 5: Add FadeUpOnScroll to project cards**

In `src/components/project-card.tsx`, add `"use client"` and import `FadeUpOnScroll`:

```tsx
"use client";
import { FadeUpOnScroll } from "@/components/motion-wrapper";
```

Wrap the outer `<div className="group rounded-2xl ...">` with `<FadeUpOnScroll>`:

```tsx
export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <FadeUpOnScroll delay={index * 0.1}>
      <div className="group rounded-2xl border ...">
        {/* existing content */}
      </div>
    </FadeUpOnScroll>
  );
}
```

Update `src/components/projects-section.tsx` to pass index:

```tsx
{projects.map((project, i) => (
  <ProjectCard key={project.slug} project={project} index={i} />
))}
```

- [ ] **Step 6: Add FadeUpOnScroll to blog preview items**

In `src/components/blog-preview.tsx`, add `"use client"` and import `FadeUpOnScroll`:

```tsx
"use client";
import { FadeUpOnScroll } from "@/components/motion-wrapper";
```

Wrap each blog post Link in `<FadeUpOnScroll delay={index * 0.1}>`:

```tsx
{posts.map((post, i) => (
  <FadeUpOnScroll key={post.slug} delay={i * 0.1}>
    <Link href={`/blog/${post.slug}`} className="group flex ...">
      {/* existing content */}
    </Link>
  </FadeUpOnScroll>
))}
```

- [ ] **Step 7: Verify animations**

Run: `pnpm dev`

Verify:
1. Hero fades up on page load, photo slightly delayed
2. Scroll down — experience cards fade up as they enter viewport
3. Project cards fade up with stagger
4. Blog preview items fade up
5. Animations only play once (viewport `once: true`)
6. In browser DevTools, enable "Reduce motion" in rendering — verify animations fall back to opacity-only

- [ ] **Step 8: Commit**

```bash
git add src/components/motion-wrapper.tsx src/app/layout.tsx src/components/hero.tsx src/components/experience-timeline.tsx src/components/project-card.tsx src/components/projects-section.tsx src/components/blog-preview.tsx
git commit -m "feat: add Motion fade-up animations with reduced-motion support"
```

---

### Task 16: Add Blog Layout Wrapper with Navbar and Footer

**Files:**
- Create: `src/app/blog/layout.tsx`, `src/app/projects/layout.tsx`

- [ ] **Step 1: Create blog layout**

Create `src/app/blog/layout.tsx`:

```tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create projects layout**

Create `src/app/projects/layout.tsx`:

```tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify navigation flow**

Run: `pnpm dev`

Verify:
1. Homepage has navbar and footer
2. `/blog` has navbar and footer
3. `/blog/building-my-portfolio` has navbar and footer
4. `/projects/streaming-pipeline` has navbar and footer
5. All "Back to..." links work correctly

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/layout.tsx src/app/projects/layout.tsx
git commit -m "feat: add layout wrappers with navbar and footer for blog and project pages"
```

---

### Task 17: Final Build Verification and Env Setup

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Run full typecheck**

```bash
pnpm tsc --noEmit
```

Expected: No errors. If there are errors, fix them before proceeding.

- [ ] **Step 2: Run linter**

```bash
pnpm lint
```

Expected: No errors. Fix any warnings.

- [ ] **Step 3: Run production build**

```bash
pnpm build
```

Expected: Build succeeds. All pages are statically generated. Check the output for any warnings.

- [ ] **Step 4: Test production build locally**

```bash
pnpm start
```

Open `http://localhost:3000`. Walk through:
1. Homepage loads with all sections
2. Dark mode toggle works
3. Nav anchor links scroll to sections
4. Click a project → detail page loads
5. Click a blog post → post page loads
6. `/blog` index page loads
7. `/sitemap.xml` returns valid XML
8. `/robots.txt` returns valid rules
9. Tab through the page — focus is visible everywhere
10. "Skip to content" appears on first Tab

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A
git commit -m "fix: resolve build issues and verify production build"
```

---

### Task 18: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

Ensure the current branch is pushed to the remote:

```bash
git push -u origin feature/website
```

- [ ] **Step 2: Connect to Vercel**

If not already connected:

```bash
pnpm dlx vercel link
```

Follow the prompts to link the project.

- [ ] **Step 3: Add environment variables**

In the Vercel dashboard (or via CLI), add:
- `RESEND_API_KEY` — get from https://resend.com (sign up, create API key)
- `NEXT_PUBLIC_SITE_URL` — set to your Vercel deployment URL (e.g., `https://anthonywong.vercel.app`)

Via CLI:
```bash
pnpm dlx vercel env add RESEND_API_KEY
pnpm dlx vercel env add NEXT_PUBLIC_SITE_URL
```

- [ ] **Step 4: Deploy preview**

```bash
pnpm dlx vercel
```

This creates a preview deployment. Open the preview URL and verify everything works.

- [ ] **Step 5: Deploy to production**

Once the preview looks good:

```bash
pnpm dlx vercel --prod
```

- [ ] **Step 6: Verify production deployment**

Open the production URL. Check:
1. All pages load correctly
2. OG images work (paste URL into https://www.opengraph.xyz/)
3. Sitemap is accessible at `/sitemap.xml`
4. Contact form sends email (test with your own email)
5. Dark mode persists across page loads

- [ ] **Step 7: Commit Vercel config if generated**

```bash
git add .vercel/project.json 2>/dev/null; git commit -m "chore: add Vercel project config" 2>/dev/null || echo "No Vercel config to commit"
```
