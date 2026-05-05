# Portfolio Website — Architecture

## Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Astro 4.x | Islands architecture, zero-JS by default, native SSG |
| UI Components | React 18 | Islands for all interactive UI; future-proof for heavier JS |
| Styling | Tailwind CSS 3.x | Utility-first, dark mode via `dark:` variants, Astro first-class support |
| Content | Astro Content Collections | Type-safe blog posts as `.md` files |
| Structured Data | TypeScript data file | Projects, experience, skills — no CMS needed for v1 |
| Page Transitions | Astro View Transitions | SPA-like navigation, no full-page reloads |
| Deployment | Vercel | Static output via `@astrojs/vercel/static` adapter |

---

## Project Structure

```
abhilash-portfolio/
├── public/
│   ├── resume.pdf
│   └── avatar.jpg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.tsx            # React island — theme toggle, mobile menu
│   │   │   └── Footer.astro
│   │   ├── blog/
│   │   │   └── TagFilter.tsx      # React island — filters posts by tag
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   └── Stats.astro
│   │   └── ui/
│   │       └── ScrollReveal.tsx   # React island — IntersectionObserver animations
│   ├── content/
│   │   ├── config.ts              # Content Collections schema definition
│   │   └── blog/
│   │       ├── why-boring-systems-win.md
│   │       ├── go-concurrency-patterns.md
│   │       ├── postgres-performance-tuning.md
│   │       └── api-design-lessons.md
│   ├── data/
│   │   └── index.ts               # Projects, experience, skills — typed exports
│   ├── layouts/
│   │   └── Base.astro             # <head>, Nav, Footer, ViewTransitions
│   ├── pages/
│   │   ├── index.astro            # /
│   │   ├── about.astro            # /about
│   │   ├── projects.astro         # /projects
│   │   ├── experience.astro       # /experience
│   │   ├── contact.astro          # /contact
│   │   ├── blog/
│   │   │   ├── index.astro        # /blog — tag filter + post list
│   │   │   └── [slug].astro       # /blog/[slug] — one HTML file per post
│   │   └── 404.astro
│   └── styles/
│       └── global.css             # Tailwind directives + CSS custom properties for theme
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

---

## Routing

All routes are statically generated at build time. No server routes.

| URL | File | Strategy |
|-----|------|----------|
| `/` | `pages/index.astro` | Static |
| `/about` | `pages/about.astro` | Static |
| `/projects` | `pages/projects.astro` | Static |
| `/experience` | `pages/experience.astro` | Static |
| `/blog` | `pages/blog/index.astro` | Static |
| `/blog/[slug]` | `pages/blog/[slug].astro` | `getStaticPaths()` — one page per post |
| `/contact` | `pages/contact.astro` | Static |

`/blog/[slug].astro` uses `getStaticPaths()` to pull all entries from Content Collections and generate one HTML file per post at build time.

---

## Component Architecture

### React Islands

Interactive components mount as React islands with Astro client directives. Everything else is zero-JS Astro components.

| Component | Directive | Why |
|-----------|-----------|-----|
| `Nav.tsx` | `client:load` | Theme toggle and mobile menu needed immediately |
| `TagFilter.tsx` | `client:load` | Blog filter is above the fold, needs instant interactivity |
| `ScrollReveal.tsx` | `client:visible` | Deferred until element enters viewport |

### Theme Toggle

- Reads/writes `localStorage` key `portfolio-theme`
- Toggles `dark` class on `<html>` element
- Tailwind `darkMode: 'class'` strategy
- Default: `prefers-color-scheme` media query, fallback to light

### View Transitions

`<ViewTransitions />` component placed in `Base.astro` `<head>`. Provides animated page-to-page navigation. Individual elements can opt into named transitions via `transition:name`.

---

## Content Layer

### Blog — Content Collections

Each post is a Markdown file in `src/content/blog/`. Frontmatter schema defined in `src/content/config.ts`:

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tag: z.string(),
    date: z.date(),
    readTime: z.string(),
  }),
});

export const collections = { blog };
```

Astro infers the slug from the filename. Markdown body rendered via `<Content />` component — no custom renderer needed.

### Structured Data — TypeScript File

Projects, work experience, and skills live in `src/data/index.ts` as typed arrays:

```ts
// src/data/index.ts
export const projects: Project[] = [ ... ];
export const experience: Role[] = [ ... ];
export const skills: SkillGroup[] = [ ... ];
```

Pages import directly — no fetch, no API, no runtime cost.

---

## Styling

- Tailwind CSS with `darkMode: 'class'`
- `src/styles/global.css` contains `@tailwind` directives and CSS custom properties for any values Tailwind can't express (e.g. complex gradients from design)
- Astro component `<style>` blocks for component-scoped styles where Tailwind classes would be verbose
- Scroll-reveal animations: Tailwind `transition` + `opacity` + `translate` utilities toggled by `ScrollReveal.tsx`

---

## Data Flow

```
Build time:
  Content Collections (blog/*.md) ──► getStaticPaths() ──► /blog/[slug].html
  src/data/index.ts ──────────────► Astro pages ──────────► static HTML

Runtime:
  Nav.tsx ──► localStorage (theme)
  TagFilter.tsx ──► React state (active tag) ──► filtered post list render
  ScrollReveal.tsx ──► IntersectionObserver ──► CSS class toggle
```

No API calls at runtime. All data baked into HTML at build time.

---

## Build & Deploy

### Astro Config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [react(), tailwind()],
});
```

### Build Commands

```bash
npm run dev      # astro dev — local dev server with HMR
npm run build    # astro build — production static output to dist/
npm run preview  # astro preview — serve dist/ locally before deploy
```

---

## Version Control

### Repository

- Host: GitHub (`github.com/abhilash/abhilash-portfolio`)
- Default branch: `main` — always deployable, maps to production
- Feature work: short-lived branches off `main`, PR before merge

### Branch Strategy

```
main ──────────────────────────────────► production (vercel.com/abhilash/portfolio)
  └── feature/hero-section ──► PR ──► merge
  └── fix/nav-mobile-menu  ──► PR ──► merge
  └── content/new-blog-post ──► PR ──► preview URL
```

- Direct push to `main` allowed for solo dev (content updates, small fixes)
- PRs recommended for layout/component changes — triggers Vercel preview deploy

---

## CI/CD Pipeline

### Strategy: GitHub Actions + Vercel CLI

GitHub Actions runs checks on every push/PR, then deploys via Vercel CLI. More control than the Vercel GitHub App — lint and build must pass before deploy.

```
push / PR
   │
   ▼
GitHub Actions
   ├── Install deps (npm ci)
   ├── Type check (tsc --noEmit)
   ├── Astro build (astro build)
   │
   ├── [PR]   ──► vercel deploy --prebuilt       ──► Preview URL posted to PR
   └── [main] ──► vercel deploy --prebuilt --prod ──► Production deploy
```

### Workflow File

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npx tsc --noEmit

      - run: npm run build

      - name: Deploy to Vercel (preview)
        if: github.event_name == 'pull_request'
        run: npx vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      - name: Deploy to Vercel (production)
        if: github.ref == 'refs/heads/main'
        run: npx vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Required GitHub Secrets

| Secret | Where to get |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel dashboard → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `vercel link` → `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `vercel link` → `.vercel/project.json` → `projectId` |

---

## Vercel Infrastructure

Since `output: 'static'`, Vercel serves this as a pure CDN site — no compute at request time.

```
Browser
  │
  ▼
Vercel Edge Network (CDN — global PoPs)
  │  All assets cached at edge after first request
  │  HTML, JS, CSS, images served from nearest PoP
  │
  ├── abhilash.dev/           ──► index.html
  ├── abhilash.dev/about      ──► about.html
  ├── abhilash.dev/blog/[slug]──► blog/[slug].html  (pre-rendered)
  └── abhilash.dev/resume.pdf ──► public/resume.pdf
```

### Deployment Types

| Trigger | URL | Purpose |
|---------|-----|---------|
| Push to `main` | `abhilash.dev` (custom domain) | Production |
| PR opened/updated | `portfolio-git-<branch>-abhilash.vercel.app` | Preview — unique per PR |
| `vercel deploy` (manual) | `portfolio-<hash>.vercel.app` | Ad-hoc preview |

### Custom Domain

Connect `abhilash.dev` (or chosen domain) in Vercel dashboard → Domains. Vercel provisions SSL automatically via Let's Encrypt.

### Caching Behaviour

Vercel sets long-lived cache headers for hashed assets (JS/CSS bundles). HTML files get shorter TTL so content updates propagate quickly. No manual cache config needed — Vercel handles this for static output.

### No Serverless Functions

`output: 'static'` means zero serverless functions provisioned. No cold starts, no compute costs. Pure CDN delivery.

---

## SEO

- Each `.astro` page sets `<title>` via `Base.astro` props: `<Base title="Projects — Abhilash">`
- `Base.astro` renders `<meta name="description">` per page
- Static HTML means content is fully crawlable without JS

---

## Testing

### Approach — Vitest Unit Testing

**Vitest** + `@testing-library/react` + jsdom. Tests run in CI after `npx astro check`, before the Astro build. No browser binary.

#### Stack

| Tool | Role |
|------|------|
| `vitest` | Test runner, jsdom environment |
| `@testing-library/react` | React component rendering + queries |
| `@testing-library/jest-dom` | Extended DOM matchers |
| `@testing-library/user-event` | Simulates user interactions |
| `jsdom` | Browser environment for Vitest |

#### File Layout

```
src/
  __tests__/
    Nav.test.tsx     # theme toggle, hamburger, active link
    data.test.ts     # data/index.ts smoke tests
vitest.config.ts     # root-level config
src/test-setup.ts    # matchMedia mock, jest-dom import
```

`vitest.config.ts` uses `@vitejs/plugin-react` (not `@astrojs/react`) — tests run outside Astro's build pipeline. Tests must not import from `astro:*` namespaces.

#### `Nav.tsx` Test Cases

| Behaviour | Assertion |
|-----------|-----------|
| Site name renders | `getByText('Abhilash Venkatesh')` present |
| Active link gets `aria-current="page"` | `currentPath="/"` → home `<a>` has attribute |
| Inactive links have no `aria-current` | all other links lack it |
| Trailing-slash path normalized | `currentPath="/about/"` → about link active |
| Hamburger button present | `getByRole('button', { name: /open menu/i })` exists |
| Hamburger click reveals mobile links | click → mobile nav links visible |
| Second click closes menu | click again → hidden |
| Theme toggle renders | `getByRole('button', { name: /switch to/i })` exists |
| Theme toggle writes localStorage | click → `localStorage.getItem('portfolio-theme')` updated |
| `dark` class toggled on `<html>` | click → `document.documentElement.classList` updated |

#### `data/index.ts` Smoke Tests

| Behaviour | Assertion |
|-----------|-----------|
| `projects` non-empty | `projects.length > 0` |
| Each project has required fields | `title`, `description`, `tech` non-empty |
| `experience` non-empty | `experience.length > 0` |
| Each role has required fields | `company`, `title`, `period` present |
| `skills` non-empty | `skills.length > 0` |
| Each skill group valid | `name` string, `items` non-empty array |

#### npm Scripts

```json
"test": "vitest run",
"test:watch": "vitest"
```

#### CI Sequence

```
npm ci → npx astro check → npm test → npm run build → vercel deploy
```

Tests fail fast — build and deploy skipped on test failure.

#### Dependencies

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## Key Constraints (from Requirements)

- No backend, no server-side rendering, no API calls at runtime
- No CMS in v1 — all content in source files
- Blog post body as Markdown (handled by Content Collections)
- Résumé links to `public/resume.pdf`
- Contact email: `abhilashfeb30@gmail.com`
- Social URLs (GitHub, LinkedIn) updated before launch
