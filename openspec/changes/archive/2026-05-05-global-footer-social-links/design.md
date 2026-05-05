## Context

No footer exists. `Base.astro` has `<Nav>` and `<main><slot /></main>` but nothing after `</main>`. Architecture docs show `Footer.astro` as a planned file at `src/components/layout/Footer.astro`. The footer is purely presentational — no interactivity, no state — making it a zero-JS Astro component.

## Goals / Non-Goals

**Goals:**
- `Footer.astro` renders copyright year and three social icon links (GitHub, LinkedIn, email)
- Mounted in `Base.astro` so every page inherits it automatically
- Dark mode support via Tailwind `dark:` variants
- Responsive — works on mobile and desktop

**Non-Goals:**
- React island (no interactivity needed)
- Additional links beyond GitHub, LinkedIn, email
- Newsletter signup or contact form

## Decisions

### 1. Pure Astro component, no React

Footer has zero interactivity. A `.astro` file renders to static HTML with no client JS. Using React would add unnecessary hydration overhead.

### 2. Inline SVG icons, no icon library

Adding `react-icons` or `heroicons` npm package for three icons is overkill. Inline SVG keeps zero new dependencies and full control over size/stroke. GitHub, LinkedIn, and email (envelope) icons are small, well-known SVGs.

### 3. Copyright year via `new Date().getFullYear()` at build time

Static site — year is baked in at build time. Accurate for the vast majority of visitors. No JS needed. Alternative (JS `new Date()` at runtime) adds a script just for a year — not worth it.

### 4. `sticky footer` via flexbox on `<body>`

`Base.astro` body uses `min-h-screen`. Wrapping `<main>` in `flex-1` pushes footer to bottom on short pages without JS or fixed positioning. This is the standard CSS flexbox sticky footer pattern.

## Risks / Trade-offs

- **Year staleness at build boundary**: If the site isn't rebuilt on Jan 1, copyright year lags by one day. Acceptable for a personal portfolio — Vercel redeploys on every push anyway.
- **SVG maintenance**: Inline SVGs are copy-pasted — no automatic updates if brand icons change. Acceptable given infrequency of change.
