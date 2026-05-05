# CLAUDE.md

## Project

Abhilash Venkatesh's personal portfolio — static site deployed to Vercel.

## Stack

| Layer | Version | Notes |
|-------|---------|-------|
| Framework | Astro 6.x | Islands architecture, zero-JS by default |
| UI components | React 19 | Islands only — `client:load` / `client:visible` |
| Styling | Tailwind CSS 4.x | Via `@tailwindcss/vite` — **no `tailwind.config.mjs`** |
| Dark mode | CSS `@custom-variant` | `@custom-variant dark (&:where(.dark, .dark *))` in `global.css` |
| Content | Astro Content Collections | Blog posts as `.md` in `src/content/blog/` |
| Deployment | Vercel (static) | `output: 'static'` — pure CDN, no serverless |

## Commands

```bash
npm run dev      # dev server at localhost:4321
npm run build    # static build → dist/
npm run preview  # serve dist/ locally
npx astro check  # type check (.astro + .ts + .tsx)
```

## Project Structure

```
src/
  components/
    layout/
      Nav.tsx          # React island (client:load) — theme toggle, mobile menu
    blog/
      TagFilter.tsx    # React island (client:load) — tag filtering
    ui/
      ScrollReveal.tsx # React island (client:visible) — scroll animations
  content/
    config.ts          # Content Collections schema
    blog/              # Markdown posts
  data/
    index.ts           # Projects, experience, skills — typed arrays, no fetch
  layouts/
    Base.astro         # Shared layout — head, FOUT script, Nav, Footer
  pages/               # File-based routing, all statically generated
  styles/
    global.css         # Tailwind directives + dark mode variant
```

## Key Patterns

### React Islands

Only use React where interactivity is needed. Everything else is `.astro`.

```astro
<Nav client:load currentPath={Astro.url.pathname} />
<TagFilter client:load />
<ScrollReveal client:visible />
```

### Dark Mode

Tailwind v4 — configured via CSS, not `tailwind.config.mjs`:

```css
/* src/styles/global.css */
@custom-variant dark (&:where(.dark, .dark *));
```

Toggle `dark` class on `<html>`. Persist via `localStorage('portfolio-theme')`.

FOUT-prevention script lives in `Base.astro` `<head>` as `is:inline` — runs synchronously before React hydrates.

### Active Link Detection

Pass `Astro.url.pathname` as `currentPath` prop from `Base.astro` into `Nav.tsx`. Compare against each link's `href`. Do not use `window.location` inside React (hydration mismatch risk).

### Adding a Page

1. Create `src/pages/<name>.astro`
2. Wrap content in `<Base title="<Page> — Abhilash Venkatesh">`
3. No nav changes needed — inherited from layout

### Adding a Blog Post

Create `src/content/blog/<slug>.md` with frontmatter:

```md
---
title: "Post Title"
summary: "One sentence summary"
tag: "backend"
date: 2025-01-15
readTime: "5 min"
---
```

### Data (Projects / Experience / Skills)

Edit `src/data/index.ts` — typed arrays, imported directly by pages. No API, no fetch.

## Constraints

- No SSR, no serverless functions, no runtime API calls
- No CMS — all content in source files
- No new npm dependencies without good reason (Tailwind v4 covers most UI needs)
- Contact email: `abhilashfeb30@gmail.com`
- Résumé: `public/resume.pdf`

## Deployment

- `main` → production (`abhilash.dev`) via GitHub Actions + Vercel CLI
- PR → preview URL (auto-posted to PR by CI)
- Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
