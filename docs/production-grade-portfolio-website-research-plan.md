# A production-grade portfolio plan inspired by haffee.vercel.app

**Build a Next.js 16 App Router site styled with Tailwind v4 and shadcn/ui, edit content through Keystatic (a Git-based CMS), animate with Motion plus a touch of GSAP, and deploy on Vercel.** That single sentence is the recommendation; the rest of this document is the reasoning, the runway, and the long-term operating manual.

This plan is written for a beginner who is willing to put in real upfront effort for long-term payoff. It is opinionated on purpose: every category resolves to one defended choice, with the runners-up explained so you understand the trade-offs. You should expect a **3–5 month build** at evenings/weekends pace from "I know basic HTML" to "shipped portfolio with a CMS, blog, project pages, and polished animations."

---

## What haffee.vercel.app actually is

Before designing your site, it helps to know what you're emulating. The reference is **Hafeez Mohamad's** software-engineer portfolio. Reconnaissance of the live HTML confirmed the stack with high confidence:

- **Framework: Next.js**, confirmed by the canonical `/_next/image?url=…&w=…&q=…` optimization endpoint serving every raster image, and reinforced by the developer literally listing "Next.js" in his own `<meta name="keywords">` tag.
- **Hosting: Vercel** (the `*.vercel.app` domain plus active Next.js image optimization).
- **Styling: Tailwind CSS** (the developer states he uses Tailwind for his other projects, and the layout has the utility-class single-page-app signature).
- **Animations: most likely Framer Motion / Motion** — common pairing, not directly visible in the HTML view but consistent with the polished section reveals and the smooth-scroll anchor navigation.
- **Content source: no CMS.** Every image lives in the site's own `/public/assets/` directory. Project descriptions, experience entries, education, and certifications are clearly hard-coded TypeScript data files. The LeetCode contribution heatmap is fetched at build time.
- **Site shape:** a **single long-scroll page** with anchor-based section navigation styled with slash prefixes (`/Experience`, `/Skills`, `/Projects`). No `/blog`, no per-project detail pages, no `/about` route.
- **SEO is excellent**: full Open Graph + Twitter Card meta, canonical link, `robots`/`googlebot` tags, a 1200×630 OG image, and the `<title>` and `<meta description>` are dialed in.

**What this means for you:** Hafeez built a beautiful site by *constraining scope*. He didn't add a blog, a CMS, project detail pages, or per-post OG images. **You are going to do more than he did**, because you want all three of (projects, blog, polish). The architecture below scales to that without ever feeling heavyweight.

The single most important takeaway: **his polish comes from restraint and craft, not from importing every animation library on npm.** Your aesthetic budget should be spent on typography, spacing, color, and one or two signature interactions — not on a custom cursor plus parallax plus scroll-hijacking plus shader backgrounds.

---

## The recommended stack at a glance

| Layer | Pick | Why in one line |
|---|---|---|
| **Framework** | Next.js 16, App Router | Industry standard for production React; first-class on Vercel; deepest tutorial coverage. |
| **Language** | TypeScript (after a 4–8 week JavaScript warm-up) | Catches real bugs, types your CMS frontmatter, signals craft to recruiters. |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Lowest cognitive load, accessible primitives via Radix, every modern starter uses it. |
| **Animated components** | Aceternity UI and Magic UI | Drop-in "wow" sections that already use Motion correctly. |
| **Custom animation** | Motion (formerly Framer Motion) via `motion/react` | Declarative React animations, tree-shakeable to ~4.6 kB with `LazyMotion`. |
| **Scroll polish** | CSS `scroll-behavior` + Motion `whileInView`; add **GSAP ScrollTrigger** only for one signature scene | Both libraries are now free; GSAP is the gold standard but heavier and imperative. |
| **CMS** | **Keystatic** (Git-based, GUI editor, your content stays as Markdown in your repo) | Production GUI without vendor lock-in, $0 ongoing, perfect for projects + blog. |
| **Fonts** | `next/font/google` with **Geist** (or Inter) | Self-hosted, zero CLS, GDPR-friendly automatically. |
| **Dark mode** | `next-themes` with Tailwind v4 `@custom-variant dark` | Battle-tested, no flash, system-aware. |
| **Images** | `next/image` with images co-located in repo | Production-grade out of the box; no Cloudinary until you actually need it. |
| **Contact form** | **Resend** + React Email + **Cloudflare Turnstile** + honeypot, in a Next.js Route Handler | Sends from your own domain, free at portfolio scale, no third-party form vendor. |
| **Analytics** | **Vercel Web Analytics** + Speed Insights | Cookieless, no GDPR banner, one-line install. |
| **SEO** | Built-in App Router `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, JSON-LD | All native; abandon `next-seo`/`next-sitemap`. |
| **RSS** | A `app/feed.xml/route.ts` using the `feed` package | Five-minute job; readers and aggregators will thank you. |
| **Hosting** | **Vercel Hobby** | Best Next.js integration; switch only on commercial use or scale. |
| **Domain** | **Porkbun** (flat-rate, honest pricing, real support) | Keep registrar separate from DNS/host for portability. |
| **Email at domain** | **Cloudflare Email Routing** (free forwarding) → Zoho Free if you need to send | Professional `hello@yourname.com` for $0. |
| **Node** | **Node 24 LTS** via **fnm** | Active LTS until April 2028; fnm is fast and cross-platform. |
| **Package manager** | **pnpm 10** | Fast, disk-efficient, strict dependency isolation. |
| **Editor** | **VS Code** + Copilot free tier | Every tutorial assumes it; Cursor later when you want AI agent workflows. |
| **Lint/format** | Default **ESLint + Prettier** at first; migrate to **Biome** once comfortable | ESLint has full Next.js coverage; Biome is faster and simpler later. |
| **Testing** | **Playwright** smoke tests only (2–3 critical paths) | Real signal, almost no maintenance; skip Vitest unless you have utilities to test. |
| **CI** | Vercel preview deploys + a tiny GitHub Actions workflow for typecheck/lint | Quality gates on every PR, free. |
| **Dependency updates** | **Renovate** with `config:recommended` + automerge minor | Grouped PRs, dependency dashboard, quieter than Dependabot. |

This is the **whole stack**. Every later section explains how the pieces fit and how to learn them in the right order.

---

## A frank note on Next.js vs Astro

There is one genuine fork in the road. **Astro 5** is, on the merits, the better technical fit for a content-heavy portfolio: it ships HTML by default, lets you drop in React components as islands (so shadcn/ui, Aceternity, Magic UI, and Motion all still work), has first-class typed Content Collections for MDX, and is roughly 2–3× faster on content-focused sites than Next.js. The State of JS 2024 survey ranked it #1 for interest and retention.

**Despite that, the recommendation is Next.js**, because:

1. The reference site you want to emulate is built with Next.js, and the patterns you'll see in tutorials match.
2. Next.js's ecosystem, hiring relevance, and tutorial volume are an order of magnitude larger.
3. If your portfolio ever grows a guestbook, a dashboard, auth, or any dynamic feature, Next.js absorbs it without a rewrite.
4. The App Router's mental model (Server Components by default, opt into client with `'use client'`) is essentially Astro's islands architecture in different clothing — learning it is transferable.

If you are *certain* your site will stay 100% content-and-marketing forever, choose **Astro**. Otherwise choose **Next.js 16 App Router**, which is the rest of this plan's assumption.

---

## Frontend design system

### Design tokens and components

Adopt **shadcn/ui** as your foundation. It is not a library you install; it's a CLI that copies accessible React components (built on Radix UI primitives, styled with Tailwind) directly into your repo. You own the code, you can change it, and there's no upstream to fight. It topped the JavaScript Rising Stars 2024 list — for good reason. Start with a small set: `Button`, `Card`, `Sheet` (for mobile nav), `Dialog`, `Dropdown`, and `Tabs`.

Layer **Aceternity UI** and **Magic UI** on top for the "wow" sections — animated heroes, beam backgrounds, marquees, text reveal, 3D card effects. Both copy-paste into your repo just like shadcn. Pick one signature Aceternity hero, one Magic UI accent (e.g., an animated beam under your name), and stop. Resist the urge to use ten of them.

### Typography

Use `next/font/google` to self-host **Geist** (Vercel's Swiss-inspired sans) for body and **Geist Mono** for code, or **Inter** if you want a slightly more neutral feel. `next/font` automatically computes a matched fallback to eliminate layout shift, subsets the font, and serves it from your own domain (good for performance and GDPR). Expose each face as a CSS variable (`variable: '--font-geist'`) and consume it in Tailwind.

Set a **fluid type scale** with `clamp()` so headings breathe naturally across breakpoints. Utopia.fyi has a free calculator; a starter scale like `clamp(2.5rem, 2rem + 2.5vw, 4.5rem)` for the hero `h1` works well. Always include a `rem` floor and ceiling so users who scale their browser fonts are respected.

### Color and dark mode

Define your palette as CSS custom properties under Tailwind v4's `@theme` block, then flip them in a `.dark` class. Use `next-themes` to manage the toggle: it injects an inline blocking script in `<head>` that reads `localStorage` and sets the class on `<html>` **before** first paint, which is what prevents the dreaded white flash. Wrap your root layout in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` and add `suppressHydrationWarning` to the `<html>` tag.

Because Tailwind v4 drops `tailwind.config.js`, add the dark variant directly in your CSS: `@custom-variant dark (&:where(.dark, .dark *));`. Then `dark:bg-zinc-900` works exactly like in v3.

### Responsive approach

Design **mobile-first** (`sm:` for ≥640 px is the first breakpoint you reach for, not the last). The shadcn `Sheet` component gives you a polished slide-out drawer for the mobile menu. Test on a real phone, not just the DevTools emulator — animations especially feel different on a touchscreen.

### Accessibility (treat this as non-negotiable)

A portfolio that fails accessibility audits sends the wrong signal. Bake in:

- **`prefers-reduced-motion`** respected everywhere — Motion ships a `useReducedMotion()` hook; use it to swap any transform/scale animation for a simple opacity fade. Don't use the "nuclear" global CSS reset that sets all animation durations to `0.01ms` because it can paradoxically accelerate JS-driven animations.
- **Visible focus rings** on every interactive element. If you replace the browser default, supply something better, not nothing.
- **Skip-to-content link** as the first focusable element in the document.
- **Semantic HTML** — `<main>`, `<nav>`, `<article>`, `<section>` with proper headings (one `h1` per page).
- **`aria-hidden="true"`** on decorative animations; `aria-live="polite"` on the contact-form success message.
- **Keyboard test** every route: can you tab through the whole page without a mouse? Does focus visibly move into a route after client-side navigation? (Move focus to the new `h1` on route change.)
- **Tooling**: install the **axe DevTools** extension, run **Lighthouse** on every preview deploy, target ≥95 on the Accessibility category.

WCAG 2.1 SC 2.3.3 (Animation from Interactions) and 2.2.2 (Pause, Stop, Hide) are the two guidelines you'll bump up against on an animated portfolio. Provide motion-free alternatives, and never auto-play motion longer than five seconds without a pause control.

---

## Animation strategy

Animations are where beginner portfolios most often go wrong — either too little (looks static) or too much (looks like a 2014 Awwwards reject). Use this **four-tier pyramid**, only climbing as a specific need demands.

**Tier 1: CSS and Tailwind.** Hover states, focus rings, button press, card lift on hover, loading skeletons, smooth-scroll-to-anchor (`scroll-behavior: smooth` on `html`). About **70% of your motion needs live here.** Free, accessible, and zero JS.

**Tier 2: Motion (`motion/react`).** This is the rebrand of Framer Motion, now an independent project at **motion.dev**. Install the `motion` npm package and import from `motion/react`. Use it for:

- Page-load hero reveal: `<motion.h1 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.6}} />`.
- Scroll reveals on project cards: `whileInView={{opacity: 1, y: 0}}` with `viewport={{once: true, margin: "-100px"}}`.
- Page route transitions via `AnimatePresence` (or the native View Transitions API, which is now in Baseline as of Firefox 144 in 2026).
- Stagger lists via `staggerChildren` variants.
- Component mount/unmount.

Critically, wrap your app in `<LazyMotion features={domAnimation}>` and use the `<m.div>` component instead of `<motion.div>` — this drops the initial bundle from ~34 kB to **~4.6 kB**, with the rest lazy-loaded.

**Tier 3: GSAP + ScrollTrigger.** Since April 30, 2025, **GSAP and every Club GreenSock plugin (ScrollTrigger, SplitText, MorphSVG, DrawSVG, Flip) are 100% free**, including for commercial use. Webflow now funds development. Use GSAP only for one signature scene: a scroll-scrubbed pinned hero, a kinetic typography intro with SplitText (the rewritten 2025 version is 50% smaller), or an SVG line-drawing reveal. GSAP doesn't tree-shake — adding it is all-or-nothing, ~23 kB core — so don't pull it in for fades that Motion already does.

**Tier 4: Lenis smooth scroll.** Only add this if your GSAP scroll-scrubbed scene feels jittery against native scroll. Lenis hijacks the wheel/trackpad to smooth it out, which is also why **accessibility practitioners consider scroll-jacking an anti-pattern**. If you use it, **wire it to bypass entirely when `prefers-reduced-motion: reduce` is set**, and test it doesn't break native sticky positioning or modals. For most beginners, skip Lenis. The reference site doesn't appear to use it.

The honest order of operations: **build the entire site without any animation library**, then add Motion in one pass for reveals and one page transition, then *consider* whether one GSAP signature scene actually elevates the work. If you can't articulate what that scene is, you don't need GSAP.

### Cursor effects and other micro-flourishes

Magnetic buttons, custom cursors, and parallax are seductive and almost always overdone. If you want one, use Motion's `useMotionValue` + `useTransform` to build a magnetic button in ~30 lines, gate it behind `@media (any-hover: hover) and (pointer: fine)` so it doesn't run on touch, and disable it with `useReducedMotion()`. **Never let a custom cursor replace the keyboard focus indicator** — keyboard users won't see it.

---

## Choosing the CMS: why Keystatic wins

You have three realistic paths and they're all defensible.

**Plain MDX in your repo (with Velite)** is what Lee Robinson, Josh Comeau, and most professional developers actually use for their own sites. Content is `.mdx` files; Velite parses them into typed objects at build time with Zod schemas. Zero recurring cost, zero vendor risk, but **no GUI** — every edit is a VS Code session and a `git push`. Note that **Contentlayer is effectively unmaintained** in 2026; do not start a new project with it. Velite is the successor.

**Sanity** is the most polished hosted CMS, with a real-time Studio that works on mobile, a 20-seat free tier, 10,000 documents, and an excellent image pipeline. It is also overkill for a solo portfolio — multiple developers have publicly migrated *off* Sanity *back* to MDX for personal sites in 2024–2025 citing "I was running an entire CMS infrastructure for myself."

**Keystatic**, by Thinkmill (the team behind KeystoneJS), is the Goldilocks choice for a beginner with long-term goals:

- **Content stays in your Git repo** as Markdown/MDX/JSON/YAML — zero vendor lock-in.
- A **real GUI** with rich-text editing, image upload, schema validation, and field types, served from a route in your own Next.js app (e.g., `/keystatic`).
- Define `collections` for blog posts and projects, plus `singletons` for the About and Homepage content; everything is typed via the schema.
- **MIT-licensed and free forever**; Keystatic Cloud Free covers 1–3 editors if you want OAuth without configuring GitHub yourself.
- Setup is a single CLI command and ~15 minutes; the schema lives in `keystatic.config.ts` next to your code.

The honest weak spot is image handling at scale (default is "store in Git" — fine for under ~100 screenshots; Cloud Images is newer). The other limitation: no multi-stage editorial workflow or content scheduling. Neither matters for a portfolio.

**Choose Keystatic.** If you would genuinely never want a GUI and you live in VS Code, fall back to MDX + Velite. Both let you swap to the other later because the content is just files.

### Skip these for now

**Payload CMS** is excellent but requires running a Node server and a Postgres/Mongo database; it was acquired by Figma on June 17, 2025 and remains MIT/self-hostable, but it's overkill for a portfolio. **TinaCMS** has a unique inline visual-editing UX but its release cadence has been spotty; revisit only if WYSIWYG-on-page matters to you. **Contentful** and **Hygraph** are enterprise-pitched and pricey. **Notion-as-CMS** is tempting for mobile drafting but has rate limits, render quirks, and proprietary lock-in.

---

## Hosting, domain, and email

**Hosting: Vercel Hobby.** It is purpose-built for Next.js, includes 100 GB Fast Data Transfer per month, 1 M Edge Requests, 1 M function invocations, 4 hours of Active CPU, automatic preview deployments per pull request, free SSL, and a global CDN. The 2026 **Fluid Compute Active CPU pricing model** means CPU billing pauses during I/O waits, so your sparse Resend/contact-form invocations are effectively free.

Two important caveats: Hobby is for **non-commercial use only** (a portfolio is fine; a freelance landing page taking client payments is not), and limits are **hard caps with no overage** — deployments pause until the next 30-day cycle. Realistically, a beginner portfolio uses <1% of these limits.

You will outgrow Vercel in three scenarios: commercial use (move to **Netlify Starter**, which allows commercial use, or upgrade to Vercel Pro at $20/month), persistent traffic above the cap (move to **Cloudflare Pages + OpenNext** for unlimited bandwidth on the free tier), or a need for true long-running compute (Cloudflare Workers or self-hosted on **Hetzner** at ~€4/month). Note that `@cloudflare/next-on-pages` is deprecated; the supported path is `@opennextjs/cloudflare`.

**Domain: Porkbun.** Flat-rate .com renewals around $11/year, free WHOIS privacy, free DNS, free email forwarding, real human support. **Cloudflare Registrar** is cheaper at-cost (~$10.44) but locks you into Cloudflare DNS. **Avoid GoDaddy** after their February 2026 ToS change that stripped consumer protections. Buying the domain on Porkbun while keeping the option to move DNS to Cloudflare later is the maximally flexible setup.

To connect Vercel: in your project settings, add `yourname.com` (apex) and `www.yourname.com`. Vercel will give you an A record (`76.76.21.21`) and a CNAME (`cname.vercel-dns.com`). Add those in Porkbun's DNS. SSL is issued automatically; you don't touch certificates. Pick the **apex** as canonical and 308-redirect `www` to it.

**Email: Cloudflare Email Routing**, free and unlimited, set up `hello@yourname.com` to forward to your personal Gmail. Replies will come from your Gmail address, which is fine while you're starting out. When you want to *send* from your domain, add **Zoho Mail Free** (5 GB, full mailbox, free up to 5 users) — about 10 minutes to configure MX records.

---

## Development environment setup

Install **Node 24 LTS** (supported until April 30, 2028) via **fnm**: `brew install fnm` on macOS, `winget install Schniz.fnm` on Windows, then `fnm install 24 && fnm use 24`. Commit a `.nvmrc` containing `24` so anyone (including future you) gets the right version. Note that the Node project announced a move to one major release per year starting with Node 27 in October 2026, with every release becoming LTS — the odd/even distinction is going away.

Enable **pnpm** via Corepack: `corepack enable && corepack prepare pnpm@latest --activate`. Pin in `package.json`: `"packageManager": "pnpm@10.x.x"`. pnpm gives you 2–3× faster installs than npm, ~70% disk savings via a global content-addressable store, and strict dependency isolation that catches bugs npm hides.

**VS Code** is still the right editor for a beginner — every tutorial assumes it, and Copilot's free tier (2,000 completions and 50 chats per month) covers learning. Install these extensions: ESLint, Tailwind CSS IntelliSense, Prettier, GitLens, Error Lens, Pretty TypeScript Errors, Auto Rename Tag, GitHub Pull Requests, and GitHub Copilot. Try **Cursor** later if you want first-class AI agent workflows for multi-file refactors.

For linting, **start with the default ESLint flat config that `create-next-app` ships**, plus Prettier. It includes Next.js–specific rules you actually want (`@next/next/no-img-element`, React Hooks rules, etc.). Once you have your bearings, **migrate to Biome 2.x** — a single Rust binary that's 10–25× faster and replaces both tools. Run `npx biome migrate eslint --include-inspired` then `npx biome migrate prettier --write`. Biome lacks full type-aware rules (roadmap late 2026) and the comprehensive Next.js preset, which is why it's a phase-2 swap, not phase-1.

---

## Git and CI

Even solo, **work on branches and merge via pull requests.** Three concrete reasons: Vercel auto-creates a preview deployment with a unique URL on every PR (huge for visual QA), branch protection prevents accidental force-pushes to `main`, and PR descriptions function as a built-in changelog for future-you. Use **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.) — they pair cleanly with automated changelog tools later.

In your repo, enable branch protection on `main`: require a PR before merging, require status checks (typecheck, lint, the Vercel preview), no force-push, no deletion. Disable direct pushes to `main`.

A minimal **GitHub Actions workflow** (`.github/workflows/ci.yml`) runs on every PR: `pnpm install --frozen-lockfile`, `pnpm tsc --noEmit`, `pnpm lint`, and `pnpm exec playwright test`. Vercel handles the actual build and deploy in parallel — the GHA job is your quality gate.

**Environment variables** live in three places: `.env.local` (your machine only, never committed), `.env.example` (a committed template with empty values), and the Vercel dashboard (separate Development / Preview / Production scopes). Anything that should reach the browser must be prefixed `NEXT_PUBLIC_`; everything else is server-only. The three secrets you'll actually need are `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and `KEYSTATIC_GITHUB_CLIENT_SECRET` (if you connect Keystatic Cloud).

**Testing for a portfolio is a question of signal vs. cost.** Use **Playwright** for two or three smoke tests — homepage loads, navigation works, contact form submits with a mocked Resend — and run them in CI on every PR. Skip Vitest unless you write non-trivial utility functions. Skip visual regression entirely; preview deployments give you better visual QA than Chromatic for a personal site.

For dependencies, install the **Mend Renovate** GitHub App, accept its onboarding PR, use the `config:recommended` preset, and add `:automergeMinor` so patch and minor updates merge themselves after CI passes. Renovate's grouping and dependency-dashboard issue produce far less noise than Dependabot for a solo dev. Hold majors (especially Next.js) for 2–4 weeks after release, then upgrade on a dedicated branch with `npx @next/codemod@latest`.

---

## SEO and discovery

The App Router has built-in metadata primitives that obsolete the old `next-seo` and `next-sitemap` packages. Set `metadataBase` once in your root layout, then export `metadata` (or `generateMetadata()` for dynamic routes) from every page. Drop these files into `app/`:

- **`sitemap.ts`** returning a `MetadataRoute.Sitemap` array, including your static routes plus a `posts.map()` over your Keystatic-sourced blog posts and projects.
- **`robots.ts`** allowing all crawlers and pointing to the sitemap.
- **`opengraph-image.tsx`** in each route segment that needs a unique OG image — Next.js compiles your JSX → SVG → PNG at the edge via Satori (the `next/og` package) at 1200×630 and wires it into `<meta property="og:image">` automatically. This is how you get **per-blog-post and per-project dynamic OG images** without designing them by hand.
- **`feed.xml/route.ts`** using the `feed` npm package to emit RSS for the blog.

For **structured data**, embed JSON-LD `<script>` tags: a `Person` schema on your home page (with `sameAs` linking to GitHub, LinkedIn, X), `BlogPosting` on each blog post with `author` and `datePublished`, and `CreativeWork` (or `SoftwareApplication`) on each project page. Validate with Google's Rich Results test.

This combination — strong meta tags, per-page OG images, sitemap, JSON-LD — is exactly what makes a portfolio surface well in Google *and* in newer LLM-powered search (Perplexity, ChatGPT search, Gemini), which lean heavily on structured data.

---

## Analytics

**Vercel Web Analytics** plus **Vercel Speed Insights**, both installed with one line each (`<Analytics />` and `<SpeedInsights />` in your root layout). Free 50K events/month on Hobby, cookieless, no GDPR banner required, includes Core Web Vitals. If you ever leave Vercel, switch to **Umami Cloud** (free 100K events/month, MIT-licensed). **Do not use Google Analytics 4** — it ships ~80 kB of script, requires a cookie banner in the EU/UK, and has been ruled non-compliant by several EU DPAs. **PostHog** is overkill for a portfolio.

---

## Contact form

A custom Next.js Route Handler at `app/api/contact/route.ts` that calls **Resend** is the right architecture. Resend's free tier is 3,000 emails/month — more than any portfolio will ever use — and it pairs with **React Email** so your notification template is just a JSX component. The flow:

1. The contact form is a Client Component that includes a hidden **honeypot** input (e.g., `name="website"` with `tabIndex={-1}` and `aria-hidden="true"`).
2. It also renders a **Cloudflare Turnstile** widget — invisible, free, privacy-friendly, no cookies.
3. On submit, POST to `/api/contact` with the form fields plus the Turnstile token.
4. The route handler first checks the honeypot (dropped if filled), then verifies the Turnstile token against Cloudflare's siteverify endpoint, then calls `resend.emails.send()` with your React Email template, with `replyTo` set to the sender's email so you can reply directly from Gmail.

This stack costs $0, owns the sending reputation of your own domain (better deliverability than third-party form services), and avoids ever outgrowing a vendor's free-tier submission cap.

---

## Implementation roadmap

The plan is structured so every phase produces something deployable. Resist the urge to leap ahead — phase 1 deployed beats phase 4 on your laptop.

### Phase 0 — Foundations (4–8 weeks, before touching Next.js)

You cannot skip fundamentals and have them not bite you later. Spend a focused 4–8 weeks on:

1. **HTML and CSS basics** via the **MDN Learn track** (developer.mozilla.org/en-US/docs/Learn). Free, authoritative.
2. **Modern JavaScript** via **javascript.info**, in order through Part 1 (functions, objects, async/await, modules, DOM). Free, currently the best modern JS resource on the web.
3. **React** via **react.dev/learn** — do the entire "Learn React" guide and the Tic-Tac-Toe tutorial. Free.
4. Optional but recommended once you can afford it: **The Joy of React** by Josh Comeau (joyofreact.com), which is the clearest beginner-to-intermediate React course currently available and includes a Next.js module.

**Skip TypeScript for this phase.** Add it once you write your first portfolio component in JavaScript and feel the pain of untyped props. Then read the official handbook at typescriptlang.org/docs/handbook and Matt Pocock's free totaltypescript.com tutorials.

### Phase 1 — Minimum viable site (1–2 weeks)

The goal is a *deployed* site at `yourname.vercel.app` you can show a friend on day three.

1. `pnpm create next-app@latest yourname --typescript --tailwind --app --eslint`.
2. Push to a fresh GitHub repo, connect to Vercel.
3. Buy the domain at Porkbun, point DNS at Vercel, configure SSL (automatic).
4. Set up **Cloudflare Email Routing** for `hello@yourdomain.com`.
5. Build the **hero**, **about**, **projects (static list)**, and **contact (placeholder)** sections as a single long-scroll page with anchor navigation — match the reference site's shape.
6. Use the default Tailwind theme, install **shadcn/ui** (`pnpm dlx shadcn@latest init`), add `Button` and `Card`.
7. Configure `next/font` with Geist.
8. Add `app/sitemap.ts`, `app/robots.ts`, and a static `app/opengraph-image.tsx`.
9. Install `next-themes` and add a working dark-mode toggle.
10. Install **Vercel Web Analytics** and Speed Insights.

**Working through the Next.js Foundations course at nextjs.org/learn/dashboard-app in parallel is the single best use of your time during this phase.** It is the official, free, App Router–first course and it builds a real production-shape app.

### Phase 2 — Design and polish (1–2 weeks)

Now make it beautiful.

1. Establish your color palette in `app/globals.css` under `@theme`, with `.dark` overrides via Tailwind v4's `@custom-variant dark`.
2. Set a fluid type scale using `clamp()`. Decide on heading family (Geist or Cal Sans) vs body family (Inter or Geist).
3. Add a **skip-to-content link**, semantic landmarks (`<main>`, `<nav>`), visible focus styles, and proper heading hierarchy.
4. Add **per-section spacing rhythm** — pick a vertical rhythm (e.g., 96–128 px between sections at desktop) and stick to it. This single discipline does more for "looks designed" than any animation.
5. Add one Aceternity UI element (e.g., the Spotlight or BackgroundBeams hero) and one Magic UI accent (e.g., a marquee of tech logos). Stop there.
6. Run Lighthouse, aim for ≥95 on Accessibility and Performance.

### Phase 3 — Animations (1–2 weeks)

1. Install **Motion** (`pnpm add motion`). Wrap the app in `<LazyMotion features={domAnimation} strict>`.
2. Add scroll-reveal animations to project cards via `<m.div whileInView={...} viewport={{once: true}}>`.
3. Add hero text fade-up on mount.
4. Add a route-transition wrapper using `AnimatePresence` keyed by `usePathname()`, *or* opt into the View Transitions API (now Baseline in 2026 with Firefox 144 support).
5. Add `useReducedMotion()` checks to swap transforms for opacity-only animations.
6. **Decide deliberately**: do you need one GSAP signature scene? If yes — install `gsap` and set up one pinned scroll-scrubbed hero or a SplitText kinetic intro. If no, do not install GSAP. Most beginners will not need it.

### Phase 4 — CMS and blog (2–3 weeks)

1. Install **Keystatic** with the Next.js integration (`pnpm dlx create-keystatic@latest`). It mounts at `/keystatic` and shows the GUI in dev.
2. Define `keystatic.config.ts`:
   - A `projects` collection with fields for title, slug, summary, hero image, tech stack, links, and an MDX body.
   - A `posts` collection for the blog with title, slug, publishedAt, tags, cover image, MDX body.
   - A `homepage` singleton for hero copy and the about paragraph.
3. Build `app/projects/[slug]/page.tsx` and `app/blog/[slug]/page.tsx` to render MDX via `next-mdx-remote` (or Keystatic's own renderer). Add `generateStaticParams` for SSG.
4. Add `opengraph-image.tsx` to each dynamic route so every post and project gets a unique OG image.
5. Add `app/feed.xml/route.ts` for RSS.
6. Add JSON-LD `BlogPosting` and `CreativeWork` to the respective page templates.
7. Configure **Keystatic Cloud** (or the local GitHub mode) so you can edit from the browser and the GUI commits to your repo, triggering a Vercel preview.

This is the phase where the architecture pays off. Adding a new project or blog post is now: open `/keystatic`, fill the form, click save, a PR is opened, Vercel deploys a preview, you merge.

### Phase 5 — Contact, SEO, and final polish (1 week)

1. Sign up for **Resend**, verify your domain (add the DKIM/SPF DNS records at Porkbun), generate an API key.
2. Build the React Email notification template.
3. Build the contact form Client Component with **Cloudflare Turnstile** and a honeypot.
4. Implement `app/api/contact/route.ts` with token verification and `resend.emails.send()`.
5. Audit metadata on every route. Run the Rich Results Test on a project page and a blog post.
6. Add Playwright smoke tests for home load, blog index, project detail, contact form submit (with a mocked POST).
7. Run a final Lighthouse pass and a manual keyboard-only walkthrough.
8. Submit your sitemap to Google Search Console and Bing Webmaster Tools.

### Phase 6 — Long-term maintenance (ongoing, ~1 hour/month)

1. Enable **Renovate** with `config:recommended` and `:automergeMinor`.
2. Spend ~30 minutes monthly reviewing the dependency dashboard issue. Auto-merge minor/patch after CI passes.
3. When Next.js releases a major, wait 2–4 weeks for early-adopter bug reports, then upgrade on a branch using `npx @next/codemod@latest`.
4. Add a new project after every meaningful piece of work; add blog posts as you write — both via Keystatic.
5. Once a quarter, run an axe audit, a Lighthouse audit, and refresh the cover photo or hero copy.
6. Once a year, consider whether your aesthetic still represents you. A portfolio that gets a *small* refresh every year ages much better than one that gets a complete rewrite every three.

---

## Honest maintenance accounting

Every choice in this stack has long-term cost. Here is what you're actually signing up for.

**Vercel Hobby** is genuinely free for a non-commercial portfolio at any realistic traffic level. The cost only materializes if you start taking client payments through the site or if your site goes unexpectedly viral. Migration to Cloudflare Pages via OpenNext is the escape hatch, and it's straightforward.

**Keystatic** is free and adds essentially zero ongoing burden because it's self-contained in your repo. The only risk vector is Thinkmill stopping development — and even then, your content (Markdown in Git) is unaffected; you'd just lose the GUI.

**Resend** at 3,000 emails/month is far more than any portfolio contact form will ever generate. The free tier has no expiry.

**Dependency churn** is the real ongoing cost. The modern JS ecosystem moves fast: Tailwind v3→v4 was a meaningful migration, Next.js ships a major every 6–12 months, React 19 introduced Server Components, Framer Motion became Motion, ESLint 8 became flat-config ESLint 9, and so on. With Renovate handling minors automatically and the discipline of upgrading majors on a branch, this is **roughly an hour per month** plus a half-day per Next.js major (about once a year).

**Content workflow** is the part most beginners underestimate. The architecture means *adding a project takes 15 minutes* and *writing a blog post takes as long as writing*. The trap is the design system: every time you build a new MDX component (a callout, a code-diff block, a video embed), you're committing to maintaining it. Resist building infrastructure you don't need yet.

---

## What you'll know how to do when this is done

You will have shipped a production-grade Next.js App Router site with TypeScript, Tailwind v4, a Git-based CMS, MDX content collections, dynamic OG images, JSON-LD structured data, RSS, a working contact form with bot protection, dark mode, accessible animations, preview deployments, and automated dependency management. That is, by 2026 standards, the same skill profile as a mid-level frontend engineer — proven on a real artifact, in a public repo, that you can hand to a recruiter.

The reference site, **haffee.vercel.app**, achieves its polish by doing a small set of things very well. This plan gives you the architecture to do *more* — projects, blog, dynamic per-page OG images, a CMS — without the bloat that usually comes with "more." Build it slowly, ship every phase, and let the constraints of restraint do the design work for you.

### A few final, opinionated guardrails

The portfolio will look better if you write **fewer projects with deeper case studies** than many shallow ones. Aim for three to six projects, each with a one-paragraph problem statement, a screenshot, a tech list, and a "what I'd do differently" note. Most beginners list every assignment they ever submitted; resist this.

The blog will exist or it won't. **Don't ship a blog with zero posts.** Either have two real posts ready at launch or hide the route until you do. An empty `/blog` is worse than no blog.

Finally: **the best portfolio is the one you actually finish.** This stack is overengineered on purpose for long-term payoff, but if you find yourself stuck for two weeks on a single animation, ship the static version and come back. Phase 1 deployed beats phase 6 on your laptop — every time.