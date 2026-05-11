# Portfolio Website Design Spec

A production-grade personal portfolio website inspired by haffee.vercel.app, built with Next.js 16, Tailwind CSS v4, and shadcn/ui. Serves both job hunting and personal brand goals with a projects showcase, blog, and contact form.

---

## Visual Direction

Reference: haffee.vercel.app — minimal, clean, dark-first design.

- **Color scheme**: Dark slate (`#0f172a`) backgrounds, lighter slate (`#1e293b`) for alternating sections, emerald (`#10b981`) accents
- **Light mode**: White/gray backgrounds with dark text, same emerald accents
- **Typography**: Geist (body) + Geist Mono (code/dates), fluid type scale with `clamp()`
- **Spacing**: 96–128px vertical rhythm between sections at desktop
- **Cards**: Rounded corners (16px), subtle borders (`#334155`), hover lift
- **Icons**: Emoji for section titles, SVG icons (lucide-react) for clickable actions (GitHub, LinkedIn, external links), download icon for Resume button

---

## Site Structure

### Pages

| Route | Type | Description |
|---|---|---|
| `/` | Static | Homepage — single long-scroll with all sections |
| `/projects/[slug]` | Dynamic SSG | Individual project detail page |
| `/blog` | Static | Blog index — all posts sorted by date |
| `/blog/[slug]` | Dynamic SSG | Individual blog post (MDX) |
| `/api/contact` | Route Handler | Contact form submission endpoint |

### Homepage Sections (top to bottom)

1. **Navbar** — Fixed top. Logo left, nav links right: 🏠 Home, 💼 Experience, 🚀 Projects, ✍️ Blog, 💬 Let's Talk (emerald CTA), dark mode toggle. Mobile: shadcn Sheet drawer.
2. **Hero + About** (merged) — Two-column layout. Left: greeting, name, description, skill pills, social links (GitHub icon + LinkedIn icon) with Resume button (emerald gradient, download icon) inline to their right. Right: photo.
3. **💼 Experience** — Vertical timeline with emerald gradient line. Each entry: title, period, summary, skill pills, key milestones. Emerald dots for recent roles, muted for older.
4. **🚀 Projects** — 2-column card grid. Each card: screenshot, title, summary, tech stack pills, GitHub icon + "Code" link, external-link icon + "Live Demo" link. Cards link to `/projects/[slug]`.
5. **✍️ Blog** — Preview of latest 2-3 posts as compact list rows. "View all posts →" links to `/blog`. Each row: title, date (📅), reading time (⏱️), arrow.
6. **💬 Contact** — Centered form: name, email, message fields, "📨 Send Message" button.
7. **Footer** — Copyright left, social icons (GitHub, LinkedIn, RSS) right.

No forward slashes before section titles.

### Project Detail Page (`/projects/[slug]`)

- Hero banner with project screenshot
- Title, summary, tech stack pills
- GitHub + Live Demo links with icons
- Full description
- "Back to projects" link
- Dynamic OG image

### Blog Post Page (`/blog/[slug]`)

- Title, date, reading time, tags
- MDX content with prose styling (`@tailwindcss/typography`)
- "Back to blog" link
- Dynamic OG image

### Blog Index Page (`/blog`)

- All posts sorted by date descending
- Same card style as homepage blog preview

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Motion (`motion/react`) with `LazyMotion` |
| Fonts | Geist + Geist Mono via `next/font/google` |
| Dark mode | `next-themes` + Tailwind v4 `@custom-variant dark` |
| Icons | `lucide-react` |
| Content (projects) | TypeScript data file (`src/data/projects.ts`) |
| Content (experiences) | TypeScript data file (`src/data/experiences.ts`) |
| Content (blog) | MDX files in `content/blog/` via `next-mdx-remote` |
| Contact form | Route Handler + Resend + honeypot |
| SEO | Built-in `metadata`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, JSON-LD |
| Analytics | Vercel Web Analytics + Speed Insights |
| Hosting | Vercel Hobby |
| Package manager | pnpm 10 |
| Node | Node 24 LTS via fnm |

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, theme provider, analytics)
│   ├── page.tsx                # Homepage (all sections)
│   ├── globals.css             # Tailwind v4 theme, dark mode, fluid type
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx     # Default OG image
│   ├── blog/
│   │   ├── page.tsx            # Blog index
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx
│   ├── projects/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx
│   └── api/
│       └── contact/
│           └── route.ts
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── navbar.tsx
│   ├── hero.tsx                # Merged hero + about
│   ├── experience-timeline.tsx
│   ├── project-card.tsx
│   ├── blog-preview.tsx
│   ├── contact-form.tsx
│   ├── footer.tsx
│   └── theme-toggle.tsx
├── data/
│   ├── projects.ts
│   └── experiences.ts
├── content/
│   └── blog/
│       └── my-first-post.mdx
├── lib/
│   ├── mdx.ts                  # MDX processing utilities
│   └── resend.ts               # Email sending helper
└── types/
    └── index.ts                # Shared TypeScript types
```

---

## Data Models

### Experience

```typescript
type Experience = {
  title: string;       // e.g. "Senior Data Engineer"
  period: string;      // e.g. "Jan 2025 — Present"
  summary: string;     // 1-2 sentence description
  skills: string[];    // e.g. ["Python", "Kafka", "dbt"]
  milestones: string[];// e.g. ["Reduced failure rate by 73%"]
  current: boolean;    // true for current role (emerald dot)
};
```

### Project

```typescript
type Project = {
  slug: string;        // URL slug
  title: string;
  summary: string;     // Short, for card view
  description: string; // Longer, for detail page
  image: string;       // Path to screenshot in public/
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
};
```

### Blog Post Frontmatter

```typescript
type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string; // ISO date
  tags: string[];
  coverImage?: string;
  summary: string;
};
```

---

## Animation Strategy

Motion only. Subtle and professional.

| Element | Animation | Trigger |
|---|---|---|
| Hero text | Fade-up (`opacity: 0, y: 20` → `1, 0`) | Page mount |
| Experience cards | Fade-up with stagger | `whileInView`, `once: true` |
| Project cards | Fade-up with stagger | `whileInView`, `once: true` |
| Blog posts | Fade-up | `whileInView`, `once: true` |
| Card hover | Lift + border highlight | CSS only (Tailwind `hover:`) |
| Dark mode toggle | Color transition | CSS `transition-colors` |
| Navbar | Blur backdrop on scroll | CSS `backdrop-blur-md` |

**Performance**: `<LazyMotion features={domAnimation}>` + `<m.div>` (~4.6 kB initial).

**Accessibility**: All motion gated behind `useReducedMotion()` — falls back to opacity-only with no transforms. Respects `prefers-reduced-motion: reduce`.

---

## Contact Form

- Client Component with fields: name, email, message
- Hidden honeypot field (`name="website"`, `tabIndex={-1}`, `aria-hidden="true"`) for bot filtering
- POST to `/api/contact/route.ts`
- Route handler: check honeypot → call `resend.emails.send()` with `replyTo` set to sender's email
- Success/error feedback via shadcn Sonner toast
- Simple in-memory rate limiting: 1 submission per IP per minute
- Environment variable: `RESEND_API_KEY`

---

## SEO & Metadata

- `metadataBase` set in root layout
- Each page exports `metadata` or `generateMetadata()`
- `sitemap.ts`: all static routes + dynamic blog/project slugs
- `robots.ts`: allow all crawlers, link to sitemap
- `opengraph-image.tsx` per route segment for dynamic OG images (1200×630, via Satori/`next/og`)
- JSON-LD structured data:
  - Homepage: `Person` schema with `sameAs` (GitHub, LinkedIn)
  - Blog posts: `BlogPosting` with `author`, `datePublished`
  - Projects: `CreativeWork` with tech stack, links

---

## Dark Mode

- `next-themes` with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`
- `suppressHydrationWarning` on `<html>`
- Tailwind v4: `@custom-variant dark (&:where(.dark, .dark *));`
- Color palette defined as CSS custom properties under `@theme`, flipped in `.dark`
- Toggle component using shadcn Button + lucide `Sun`/`Moon` icons

---

## Responsive Design

- Mobile-first: base styles for mobile, `sm:` breakpoint and up
- Navbar: collapses to shadcn Sheet (slide-out drawer) on mobile
- Hero: stacks vertically on mobile — photo below text
- Projects: single column on mobile, 2 columns on `md:`
- Experience timeline: full width cards, timeline line stays
- Contact form: full width, centered

---

## Accessibility

- Skip-to-content link as first focusable element
- Semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, proper heading hierarchy (one `h1` per page)
- Visible focus rings on all interactive elements
- `aria-hidden="true"` on decorative elements
- `aria-live="polite"` on contact form success message
- `prefers-reduced-motion` respected via `useReducedMotion()`
- Keyboard navigable: full tab-through without a mouse
- Target: Lighthouse Accessibility ≥95

---

## Implementation Phases

### Phase 1 — MVP (build now)

1. Initialize Next.js 16 + Tailwind v4 + shadcn/ui + pnpm
2. Set up root layout with Geist fonts, theme provider, analytics
3. Build all homepage sections: Hero/About, Experience, Projects, Blog preview, Contact
4. Build navbar with mobile drawer + dark mode toggle
5. Build footer
6. Add hardcoded content (experiences + projects in TS data files)
7. Create 2 placeholder MDX blog posts
8. Build blog index + blog post pages with MDX rendering
9. Build project detail pages
10. Implement contact form with Resend
11. Add SEO: metadata, sitemap, robots, OG images
12. Add Motion animations (fade-up reveals, LazyMotion)
13. Deploy to Vercel
14. Add Vercel Analytics + Speed Insights

### Phase 2 — Polish (later)

- Custom domain (Porkbun → Vercel DNS)
- Cloudflare Email Routing for `hello@domain.com`
- Cloudflare Turnstile on contact form
- RSS feed (`app/feed.xml/route.ts`)
- JSON-LD structured data
- Fluid type scale refinement
- Lighthouse audit pass

### Phase 3 — CMS & Automation (later)

- Migrate content to Keystatic CMS
- Playwright smoke tests (homepage, blog, contact)
- GitHub Actions CI (typecheck + lint)
- Renovate for dependency updates
- Branch protection on `main`

---

## Environment Variables

| Variable | Scope | Required in Phase 1 |
|---|---|---|
| `RESEND_API_KEY` | Server only | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public | Yes |
| `TURNSTILE_SECRET_KEY` | Server only | No (Phase 2) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | No (Phase 2) |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Server only | No (Phase 3) |
