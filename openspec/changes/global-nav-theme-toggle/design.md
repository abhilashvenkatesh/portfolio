## Context

Portfolio site built on Astro 4.x + React 18 + Tailwind CSS. All pages share a `Base.astro` layout. Nav is a React island (`client:load`) because it requires immediate interactivity (theme toggle, mobile menu). Theme strategy uses Tailwind `darkMode: 'class'` — a `dark` class on `<html>` drives all dark-mode variants. No nav component exists yet.

## Goals / Non-Goals

**Goals:**
- Sticky nav bar rendered on every page via `Base.astro`
- Active-link detection from current URL (Astro passes `Astro.url` to layout)
- Light/dark toggle persisting via `localStorage` key `portfolio-theme`
- Respect `prefers-color-scheme` on first visit (no stored preference)
- Mobile-responsive (hamburger menu for narrow viewports)

**Non-Goals:**
- Animated page transitions (handled separately by Astro View Transitions)
- Server-side theme detection (no SSR in this project)
- Sub-navigation or dropdown menus

## Decisions

### 1. React island vs. Astro component

**Decision**: `Nav.tsx` as React island with `client:load`.

**Rationale**: Theme toggle requires DOM access (`localStorage`, `<html>` class mutation) and mobile menu requires local state. Pure Astro components can't hold reactive state. `client:load` ensures the toggle is available immediately — no layout shift waiting for hydration.

**Alternative considered**: Inline `<script>` tag in `Base.astro` for theme-only logic, Astro component for static markup. Rejected: splits nav logic across two files, harder to maintain, mobile menu still needs React state.

### 2. Theme persistence strategy

**Decision**: `localStorage` key `portfolio-theme` (`"light"` | `"dark"`), toggling `dark` class on `<html>`.

**Rationale**: Matches architecture spec exactly. Tailwind `darkMode: 'class'` is the planned strategy. No cookies, no server involvement needed for a static site.

**Flash of unstyled theme (FOUT) mitigation**: Inline `<script>` in `Base.astro` `<head>` reads `localStorage` and applies `dark` class synchronously before React hydrates. This prevents light flash on dark-mode reload.

### 3. Active-link detection

**Decision**: Pass `currentPath` prop from `Base.astro` (via `Astro.url.pathname`) into `Nav.tsx`. Compare against each link's href.

**Rationale**: Astro knows the current route at build time. Passing it as a prop avoids `window.location` reads inside React (which differ between SSR/hydration contexts).

### 4. Mobile menu

**Decision**: Hamburger toggle using React `useState`. Hidden on `md:` breakpoint and above (Tailwind responsive utilities).

**Rationale**: Simple state, no external library needed.

## Risks / Trade-offs

- **FOUT on theme**: Mitigated by inline script in `<head>` (see Decision 2). Without it, dark-mode users see a white flash.
- **Hydration mismatch**: If `Nav.tsx` renders differently server-side vs. client (e.g., reads `localStorage` during render), React will warn. Mitigation: read `localStorage` only in `useEffect`, not during render. Initial render uses a neutral state.
- **View Transitions + React island**: Astro View Transitions may re-run page lifecycle but React islands persist across navigations. Active-link prop must update — handled because `Base.astro` re-renders on each page with the correct `currentPath`.

## Migration Plan

1. Scaffold `Nav.tsx` with static markup (no interactivity)
2. Add theme toggle logic + FOUT-prevention script
3. Wire into `Base.astro` replacing any placeholder header
4. Verify on all 7 routes manually + dark/light toggle persistence
5. No rollback complexity — additive change, no data migration
