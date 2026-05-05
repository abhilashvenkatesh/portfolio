## Why

Every page currently has no footer — visitors have no consistent place to find social links or copyright info. The footer is required by Epic 3 and needed before any page content epics ship.

## What Changes

- Create `src/components/layout/Footer.astro` with copyright text and social icon links
- Mount footer in `Base.astro` below `<main>` so it appears on every page
- Social links: GitHub, LinkedIn, email (mailto)

## Capabilities

### New Capabilities

- `global-footer`: Footer rendered on every page — copyright with current year, icon links to GitHub, LinkedIn, and email; social links open in new tab; email opens mail client

### Modified Capabilities

- None

## Impact

- New file: `src/components/layout/Footer.astro`
- Modified: `src/layouts/Base.astro` — add `<Footer />` below `<main>`
- No new npm dependencies — Tailwind covers styling, SVG icons inline
- No JS required — pure Astro static component
