# Architecture Design — Abhilash Portfolio Website

**Date:** 2026-05-07
**Status:** Approved
**Requirements source:** `documentation/requirements.md`, `documentation/epics.md`
**Design source:** `documentation/DESIGN.md`, `documentation/design/*.html`

---

## Overview

Personal portfolio website for Abhilash Venkatesh (Lead Application Developer). 8 pages: Home, About, Projects, Experience, Blog (listing + post), Contact, Chat. AI chat runs entirely in-browser via WebLLM (no backend). All content lives in human-editable data files.

**Stack:**

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- AI Chat: WebLLM (in-browser, WebGPU)
- Blog content: MDX files with gray-matter frontmatter
- Deployment: Vercel (free tier, static edge caching)
- CI: GitHub Actions

---

## 1. Project Structure

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout: Nav, Footer, ThemeProvider, anti-flash script
│   ├── page.tsx                # Home (SSG)
│   ├── about/
│   │   └── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── experience/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog listing (SSG)
│   │   └── [slug]/
│   │       ├── page.tsx        # Blog post (generateStaticParams)
│   │       └── not-found.tsx   # POST-6: invalid slug fallback
│   ├── contact/
│   │   └── page.tsx
│   └── chat/
│       └── page.tsx            # 'use client' — WebLLM only
│
├── components/
│   ├── layout/
│   │   ├── Nav.tsx             # Fixed nav, blur-on-scroll, mobile menu, theme toggle
│   │   └── Footer.tsx          # Social links, copyright
│   ├── ui/
│   │   ├── FadeIn.tsx          # IntersectionObserver scroll animation
│   │   ├── PageHeader.tsx      # Inner-page header with grid background
│   │   ├── Button.tsx          # Primary (text), Primary (icon), Secondary variants
│   │   ├── Tag.tsx             # Neutral tech stack tag
│   │   └── AccentTag.tsx       # Accent-dim label badge
│   ├── home/
│   │   ├── HeroSection.tsx     # Full-viewport hero
│   │   ├── StatsBar.tsx        # 3 statistics
│   │   ├── ChatLauncher.tsx    # 'use client' — input + suggestion chips
│   │   └── ScrollIndicator.tsx # Animated mouse/dot SVG
│   ├── projects/
│   │   └── ProjectCard.tsx     # Card with hover accent line, impact callout
│   ├── experience/
│   │   └── TimelineEntry.tsx   # Timeline dot, role details, stagger animation
│   ├── blog/
│   │   ├── BlogCard.tsx        # Card: tag, date, readTime, title, summary, CTA
│   │   ├── TagFilter.tsx       # 'use client' — filter state, instant filtering
│   │   └── Prose.tsx           # MDX prose styles (h2, code, blockquote, etc.)
│   ├── contact/
│   │   ├── ContactCard.tsx     # Email / LinkedIn / Phone card
│   │   └── AvailabilityBadge.tsx  # Pulsing dot + status text
│   └── chat/
│       ├── WebLLMProvider.tsx  # 'use client' — engine init, model loading context
│       ├── ChatThread.tsx      # Scrollable message list, auto-scroll
│       ├── ChatMessage.tsx     # User (right) / assistant (left) bubble
│       ├── ChatInput.tsx       # Text input + send button, disabled states
│       └── SuggestionChips.tsx # 6 chips shown before first user message
│
├── content/
│   ├── identity.json           # DATA-9: name, title, employer, location
│   ├── home.json               # DATA-6: roleBadge, headline, subheading, bio, stats[3], suggestions[4]
│   ├── projects.json           # DATA-1: Project[]
│   ├── skills.json             # DATA-2: SkillCategory[]
│   ├── experience.json         # DATA-4: ExperienceEntry[] (most recent first)
│   ├── contact.json            # DATA-5: email, linkedin, phone, availability{show, message}
│   ├── about.json              # DATA-8: bio paragraphs [3]
│   ├── chat-chips.json         # DATA-7: suggestion chips [6]
│   └── blog/
│       ├── why-boring-systems-win.mdx
│       ├── go-concurrency-patterns.mdx
│       ├── postgresql-performance-tuning.mdx
│       └── api-design-lessons.mdx
│
├── lib/
│   ├── types.ts                # All TypeScript interfaces
│   ├── content.ts              # Typed JSON loaders (fs.readFileSync, build-time only)
│   └── blog.ts                 # MDX frontmatter parsing, slug list, full post loader
│
├── scripts/
│   ├── validate-content.ts     # Schema check: all required fields present in data files
│   └── validate-design.ts      # Design lint: no hardcoded hex, no forbidden weights/radii
│
├── public/
│   ├── resume.pdf
│   └── avatar.jpg
│
└── styles/
    └── globals.css             # Tailwind v4 @theme tokens + dark mode vars
```

---

## 2. Data Layer

### TypeScript Types (`lib/types.ts`)

```typescript
export interface Identity {
  name: string;
  title: string;
  employer: string;
  location: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  year: number;
  problem: string;
  impact: string;
  stack: string[];
  github: string;
  demo?: string; // omit field if no demo — PROJ-7
}

export interface SkillCategory {
  name: string; // "Languages" | "Frameworks" | "Data & Messaging" | "Cloud & DevOps"
  skills: string[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  period: string; // e.g. "Aug 2023 — Present"
  bullets: string[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO 8601: "2025-04-18"
  readTime: number; // minutes
  tag: string; // "Systems Design" | "Go" | "PostgreSQL" | "API Design"
  summary: string; // one sentence
}

export interface BlogPost extends BlogPostMeta {
  content: string; // compiled MDX content (React component source)
}

export interface ContactInfo {
  email: string;
  linkedin: string; // full URL
  phone: string;
  availability: {
    show: boolean;
    message: string;
  };
}

export interface HomeContent {
  roleBadge: string;
  headline: string;
  subheading: string;
  bio: string;
  stats: Array<{ value: string; label: string }>; // exactly 3
  suggestions: string[]; // exactly 4
}
```

### Content Loaders (`lib/content.ts`)

All reads happen at **build time** inside Server Components or `generateStaticParams`. No runtime file I/O.

```typescript
import fs from "fs";
import path from "path";

const CONTENT = path.join(process.cwd(), "content");

export const getIdentity = (): Identity =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "identity.json"), "utf8"));

export const getProjects = (): Project[] =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "projects.json"), "utf8"));

export const getSkills = (): SkillCategory[] =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "skills.json"), "utf8"));

export const getExperience = (): ExperienceEntry[] =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "experience.json"), "utf8"));

export const getContactInfo = (): ContactInfo =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "contact.json"), "utf8"));

export const getHomeContent = (): HomeContent =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "home.json"), "utf8"));

export const getAboutBio = (): string[] =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "about.json"), "utf8"));

export const getChatChips = (): string[] =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, "chat-chips.json"), "utf8"));
```

### Blog Loader (`lib/blog.ts`)

Uses `gray-matter` for frontmatter parsing, `next-mdx-remote/rsc` for MDX compilation.

```typescript
export const getAllBlogMeta = (): BlogPostMeta[] => {
  /* reads blog/*.mdx */
};
export const getAllBlogSlugs = (): string[] => {
  /* returns slug list */
};
export const getBlogPost = (slug: string): BlogPost | null => {
  /* single post */
};
```

---

## 3. Theme System

Design tokens from `DESIGN.md` implemented as Tailwind v4 CSS custom properties. Two themes share one set of variable names, scoped by `data-theme` attribute on `<html>`.

### `styles/globals.css`

```css
@import "tailwindcss";

@theme {
  /* Light (Sand) — default */
  --color-primary: #0c0a09;
  --color-secondary: #78716c;
  --color-accent: #c0612b;
  --color-neutral: #f5f0e8;
  --color-surface: #fdfaf4;
  --color-surface-alt: #ede8de;
  --color-accent-dim: #efdfd1;

  --font-sans: "DM Sans", sans-serif;
  --font-mono: "DM Mono", monospace;

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-card: 12px;
  --radius-xl: 14px;
  --radius-full: 100px;
}

[data-theme="dark"] {
  --color-primary: #f0f0f2;
  --color-secondary: #6b6b72;
  --color-accent: oklch(0.65 0.18 38);
  --color-neutral: #080809;
  --color-surface: #0f0f11;
  --color-surface-alt: #161618;
  --color-accent-dim: oklch(0.65 0.18 38 / 0.12);
}
```

### Anti-Flash Script

Inline `<script>` in `app/layout.tsx` `<head>` (before body renders) reads `localStorage` and sets `data-theme` before React hydration:

```html
<script dangerouslySetInnerHTML={{ __html: `
  const t = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
` }} />
```

### ThemeProvider

Minimal client component that exposes `theme` and `toggleTheme` via React context. `Nav.tsx` consumes this context for the sun/moon icon toggle. Preference written to `localStorage` on toggle.

---

## 4. Shared Components & Animations

### `FadeIn.tsx` (Client Component)

Wraps children in a `<div>` observed by `IntersectionObserver`. On entry: transitions from `opacity-0 translate-y-[14px]` to `opacity-100 translate-y-0` over 500ms. Accepts `delay?: number` (ms) for stagger.

Used site-wide for:

- Project cards (80ms stagger per card — PROJ-8)
- Experience timeline entries (80ms stagger — EXP-4)
- Blog cards (70ms stagger — BLOG-5)
- About skill cards (staggered — ABOUT-6)
- Blog post sections (40ms stagger — POST per section)

### `PageHeader.tsx` (Server Component)

Inner-page header shared by About, Projects, Experience, Blog, Contact pages. Props: `label`, `subtitle`, `intro?`. Background: 60px × 60px SVG grid line pattern, radial-gradient mask `80% × 60%` ellipse so edges dissolve. Fulfils XC-3.

### `Nav.tsx` (Client Component)

- Fixed position, `z-50`, height 60px
- `usePathname()` → active link: `bg-surface-alt text-primary font-medium`
- Scroll listener: after 40px → `backdrop-filter: blur(12px)` + `bg-neutral/90` (NAV-5)
- Mobile: links hidden at `< 640px`, hamburger shows, drawer opens with all nav items (NAV-6)
- "Hire me" button: `mailto:` link from `contact.json` (NAV-3, DATA-5)
- Theme toggle: sun/moon icon, calls `ThemeProvider.toggleTheme()` (NAV-4)

### Card Hover Animation

CSS-only via Tailwind `group` utilities. Accent top-border line on hover:

```html
<div class="group relative ...">
  <div
    class="absolute top-0 left-0 h-[2px] w-0 bg-accent
              transition-[width] duration-300 group-hover:w-[60%]"
  />
  <!-- card content -->
</div>
```

Card background + border transition: `transition-colors duration-250`.

---

## 5. Routing & Page Rendering

All pages statically generated at build time. No dynamic server rendering at request time.

| Route          | Rendering                      | Data                                         |
| -------------- | ------------------------------ | -------------------------------------------- |
| `/`            | SSG                            | `home.json`, `identity.json`                 |
| `/about`       | SSG                            | `about.json`, `skills.json`, `identity.json` |
| `/projects`    | SSG                            | `projects.json`                              |
| `/experience`  | SSG                            | `experience.json`                            |
| `/blog`        | SSG                            | `blog/*.mdx` frontmatter only                |
| `/blog/[slug]` | SSG via `generateStaticParams` | `blog/[slug].mdx` full content               |
| `/contact`     | SSG                            | `contact.json`, `identity.json`              |
| `/chat`        | Client-only                    | `chat-chips.json` (bundled)                  |

### Blog Static Generation

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = getBlogPost(params.slug);
  return { title: `${post?.title} — Abhilash` };
}
```

### Metadata

Each page exports `metadata` or `generateMetadata` for SEO:

- Title pattern: `"<Page> — Abhilash Venkatesh"`
- Blog posts: title from frontmatter + description from summary
- OG tags for social sharing

### Not-Found

`app/blog/[slug]/not-found.tsx` renders "Post not found." + "← Back to blog" link (POST-6). Triggered when `getBlogPost(slug)` returns `null` and the page calls `notFound()`.

---

## 6. Chat Architecture (WebLLM)

### Constraints

- **WebGPU required:** Chrome 113+, Edge 113+. No Firefox, no Safari/iOS.
- **First-visit model download:** ~2GB cached in browser Cache API. Subsequent loads are instant.
- **Load time:** 10–30 seconds on first visit (model init).
- **Graceful fallback:** if `navigator.gpu` is undefined, show fallback with direct contact links (email, LinkedIn) instead of chat UI.

### Model

`Llama-3.2-3B-Instruct-q4f16_1-MLC` (~2.1GB)
Alternative: `Phi-3.5-mini-instruct-q4f16_1-MLC` (~1.8GB) if load time is a concern.

### System Prompt (Build-time Generated)

`lib/chat-context.ts` reads all content files at build time and serialises a structured markdown string:

```
You are a chat assistant for Abhilash Venkatesh's portfolio.
Answer questions ONLY about Abhilash's background, skills, experience, projects, and contact details.
Refer to Abhilash in the third person. Keep answers to 2-4 sentences.
Do not answer unrelated questions.

## Identity
Name: Abhilash Venkatesh
Title: Lead Application Developer
...

## Experience
[serialised from experience.json]

## Projects
[serialised from projects.json]

## Skills
[serialised from skills.json]

## Contact
Email: ...
LinkedIn: ...
```

This string is a `const` in the page bundle — no runtime file I/O.

### State Machine

```
unsupported → (WebGPU absent) → show fallback contact links
idle → (user opens page) → loading
loading → (initProgressCallback) → show download progress bar (0–100%)
loading → (model ready) → ready
ready → (user types + sends) → thinking
thinking → (stream complete) → ready
ready / thinking → (API error) → show error fallback (CHAT-9)
```

### Home → Chat Handoff

`ChatLauncher.tsx` navigates to `/chat?q=<encoded question>`. On mount, chat page reads `searchParams.get('q')`, queues it as the first user message, sends it automatically once state is `ready` (CHAT-8).

### Components

- **`WebLLMProvider`** — Context: `{ state, progress, sendMessage }`. Initialises engine, exposes streaming send.
- **`ChatThread`** — Scrollable `div` with `overflow-y-auto`. `useEffect` on messages → `scrollIntoView` (CHAT-7).
- **`ChatMessage`** — User: right-aligned, `bg-accent-dim`, `text-accent`. Assistant: left-aligned, `bg-surface`. Both show avatar + label (CHAT-5).
- **`ChatInput`** — Disabled when state ≠ `ready`. Placeholder switches to "Thinking…" when state = `thinking` (CHAT-6). Enter key + button submit (CHAT-4).
- **`SuggestionChips`** — Visible only when `messages.length === 1` (welcome only). Clicking sends immediately (CHAT-3).

---

## 7. Testing Strategy

### Type Checking (Primary correctness gate)

```bash
tsc --noEmit
```

Runs in CI on every push. Catches type mismatches in data schemas, component props, and content loader return types.

### Content Validation (`scripts/validate-content.ts`)

Runs at CI and optionally as a `next build` pre-step. Validates:

- All required fields present in each JSON data file (uses `zod` schemas matching `lib/types.ts`)
- All blog MDX files have valid frontmatter (slug, date, readTime, tag, summary are present and correctly typed)
- All project `github` fields are non-empty strings
- `contact.json` availability has both `show: boolean` and `message: string`
- Exits non-zero on any violation, blocking deploy

### Build Test

`next build` in CI. Catches broken imports, missing content files, MDX parse errors. If build fails, deploy is blocked.

### E2E (Playwright — optional, smoke only)

Critical paths:

- Home page loads, hero headline visible
- Blog listing shows 4 cards, tag filter shows only matching posts
- Blog post renders article body
- Contact cards have correct `href` attributes
- Chat page shows either loading state or "not supported" message

---

## 8. CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run typecheck # tsc --noEmit
      - run: npm run lint # next lint (eslint)
      - run: npm run design-lint # scripts/validate-design.ts
      - run: npm run validate-content # scripts/validate-content.ts
      - run: npm run build # next build
```

Full gate order: `typecheck → lint → design-lint → validate-content → build`

### `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "design-lint": "tsx scripts/validate-design.ts",
    "validate-content": "tsx scripts/validate-content.ts"
  }
}
```

### Vercel Deployment

- Push to `main` → auto-deploy to production
- Pull requests → Vercel preview URL (auto-generated)
- No API routes → zero serverless function invocations → free tier is sufficient
- All 8 pages pre-rendered to static HTML, served from Vercel CDN edge
- Chat page served as a static shell; WebLLM loads entirely in the browser

### Branch Strategy

- `main` → production
- Feature branches → Vercel preview URLs
- No staging environment needed

---

## 9. Key Dependencies

| Package              | Purpose                                |
| -------------------- | -------------------------------------- |
| `next`               | App Router, SSG, image optimisation    |
| `react`, `react-dom` | UI framework                           |
| `typescript`         | Type safety                            |
| `tailwindcss` v4     | Styling with design tokens             |
| `gray-matter`        | MDX frontmatter parsing                |
| `next-mdx-remote`    | MDX rendering in App Router            |
| `@mlc-ai/web-llm`    | In-browser LLM inference (chat page)   |
| `zod`                | Content validation schemas (CI script) |
| `tsx`                | Run TypeScript scripts in CI           |

---

## 10. Design Constraints (from DESIGN.md)

These are enforced by `validate-design.ts` and serve as hard rules for implementation:

- DM Mono used **only** for: logotype, tags, labels, metadata, code, stat labels
- Accent color (`--color-accent`) used for **one role per component** — not fill + border + text simultaneously (exception: availability indicator)
- Font weight stops at 600 (`font-semibold`). Never 700+
- Border radius scale: 4 / 6 / 8 / 10 / 12 / 14 / 100px only. No arbitrary values
- `12px` (`rounded-card`) for all content cards: project, blog, contact, message bubbles
- No pure `#ffffff` or `#000000` in palette — exception: `#000` text on accent-fill buttons
- No box shadows in dark mode — depth through background layering only
- Hero grid decoration appears only in hero and page header sections
- Heading letter-spacing: `-0.02em` to `-0.03em` on all headings above 24px
- Single burnt-orange accent. No second accent color
