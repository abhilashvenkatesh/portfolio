## 1. Project Scaffolding

- [x] 1.1 Initialize Astro project with React and Tailwind integrations (`npm create astro`, add `@astrojs/react`, `@astrojs/tailwind`)
- [x] 1.2 Configure `astro.config.mjs` with `output: 'static'`, React and Tailwind integrations
- [x] 1.3 Configure `tailwind.config.mjs` with `darkMode: 'class'` and content paths
- [x] 1.4 Create `src/styles/global.css` with Tailwind directives

## 2. Base Layout

- [x] 2.1 Create `src/layouts/Base.astro` accepting `title` and `description` props
- [x] 2.2 Add `<head>` with charset, viewport, title, and meta description
- [x] 2.3 Add inline `<script>` in `<head>` to read `localStorage('portfolio-theme')` and apply `dark` class to `<html>` before render (FOUT prevention)
- [x] 2.4 Import and render `<Nav client:load currentPath={Astro.url.pathname} />` in layout

## 3. Nav Component

- [x] 3.1 Create `src/components/layout/Nav.tsx` as a React functional component accepting `currentPath: string` prop
- [x] 3.2 Define nav links array: Home `/`, About `/about`, Projects `/projects`, Experience `/experience`, Blog `/blog`, Contact `/contact`
- [x] 3.3 Render site owner name on the left using Tailwind classes
- [x] 3.4 Render nav links on the right, applying active styles when `href === currentPath`
- [x] 3.5 Add `sticky top-0 z-50` positioning classes to nav wrapper

## 4. Theme Toggle

- [x] 4.1 Add `useState` for current theme, initialized from `localStorage` in `useEffect` (fallback: `prefers-color-scheme`, then `light`)
- [x] 4.2 Implement `toggleTheme` handler that flips theme state, writes to `localStorage('portfolio-theme')`, and mutates `document.documentElement.classList`
- [x] 4.3 Render theme toggle button in nav with sun/moon icon (or text label) reflecting current theme
- [x] 4.4 Verify no hydration mismatch — initial render uses neutral/undefined theme state, `useEffect` applies actual theme

## 5. Mobile Menu

- [x] 5.1 Add `useState` for `menuOpen` boolean
- [x] 5.2 Render hamburger button visible only on `< md` breakpoint (`md:hidden`)
- [x] 5.3 Render nav links hidden on mobile by default (`hidden md:flex`), toggled visible when `menuOpen` is true
- [x] 5.4 Close menu when a nav link is clicked

## 6. Verification

- [x] 6.1 Manually visit all 7 routes (`/`, `/about`, `/projects`, `/experience`, `/blog`, `/contact`, `/404`) and confirm nav renders on each
- [x] 6.2 Verify correct active link highlighted on each route
- [x] 6.3 Toggle theme, reload page — confirm theme persists
- [x] 6.4 Test on narrow viewport — confirm hamburger appears and opens/closes correctly
- [x] 6.5 Test first visit (clear localStorage) — confirm system `prefers-color-scheme` is respected
