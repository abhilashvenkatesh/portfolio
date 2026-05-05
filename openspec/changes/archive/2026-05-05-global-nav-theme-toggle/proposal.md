## Why

Portfolio has no persistent navigation — visitors can't move between sections or toggle themes without manual URL changes. This is the foundational layout component needed before any page content can be built.

## What Changes

- Add `Nav.tsx` React island with sticky positioning, rendered on every page via `Base.astro`
- Implement theme toggle that reads/writes `localStorage` key `portfolio-theme` and toggles `dark` class on `<html>`
- Wire up active-link detection based on current URL path
- Mount with `client:load` directive for immediate interactivity

## Capabilities

### New Capabilities

- `global-nav`: Persistent sticky navigation bar with site name, page links (Home, About, Projects, Experience, Blog, Contact), active-link highlighting, and light/dark theme toggle with localStorage persistence

### Modified Capabilities

<!-- none — no existing specs -->

## Impact

- **New file**: `src/components/layout/Nav.tsx` (React island)
- **Modified**: `src/layouts/Base.astro` — import and render `<Nav client:load />`
- **Modified**: `src/styles/global.css` — any nav-specific CSS custom properties
- **Dependencies**: Tailwind `darkMode: 'class'` already planned in architecture; no new deps required
- **All pages**: inherit nav automatically via `Base.astro` layout
