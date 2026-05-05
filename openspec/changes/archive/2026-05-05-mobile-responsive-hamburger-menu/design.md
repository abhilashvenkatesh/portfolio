## Context

`Nav.tsx` is a React island (`client:load`) that currently renders all nav links horizontally for all viewport sizes. The `global-nav` spec already mandates a hamburger menu for `< md` breakpoints, but it is unimplemented. Page content has no systematic mobile audit — some layouts may overflow at 375px.

Tailwind CSS v4 is available via `@tailwindcss/vite`; responsive prefixes (`md:`, `sm:`) are fully supported. React state is already available in the island.

## Goals / Non-Goals

**Goals:**
- Hamburger toggle in `Nav.tsx` with CSS-animated open/close (grid height transition)
- Nav links collapse on `< md`, always visible on `md+`
- Tapping a nav link closes the mobile menu
- All pages scroll vertically without horizontal overflow at 375px
- Touch targets ≥ 44px height/width

**Non-Goals:**
- Animated slide-in drawer (full-width dropdown is sufficient per the issue)
- Per-page layout redesign beyond overflow fixes
- Breakpoint changes to `md` threshold

## Decisions

### 1. React state for hamburger toggle (not CSS checkbox hack)

`Nav.tsx` is already a React island with hydration. Adding `useState(false)` for `isMenuOpen` is idiomatic, readable, and keeps the toggle logic in one place. The CSS checkbox hack would require hidden inputs and label wiring — more brittle and no benefit here.

### 2. Full-width inline dropdown, not a side drawer

The issue specifies "full-width dropdown or drawer." The menu renders inline below the nav bar (not absolute-positioned), using a CSS grid height animation (`grid-rows-[0fr]` → `grid-rows-[1fr]`) for smooth open/close. Inline flow avoids z-index/overlay complexity and body scroll-lock. A drawer would require portal/overlay management.

### 3. Tailwind responsive classes over media query JS

Use `hidden md:flex` / `md:hidden` to show/hide menu items — zero JS for the responsive breakpoint. Only the open/close toggle needs React state. This avoids a resize event listener and matches the existing Tailwind-first approach.

### 4. Close menu on link click via `onClick` handler

Each mobile nav link gets `onClick={() => setIsMenuOpen(false)}`. Simple, explicit, no global event listener needed.

### 5. Overflow audit via browser DevTools + Tailwind fixes

Use `overflow-x-hidden` on `<body>` or `<main>` as a guard, then fix root causes (fixed widths, missing `max-w-full`, negative margins) in individual components rather than masking with a blanket `overflow-hidden`.

## Risks / Trade-offs

- **Hydration flash on menu state**: Menu starts closed on server (SSR not used — static output), so no mismatch risk. Menu state is ephemeral and intentionally reset on page load.
- **`overflow-x-hidden` on body can hide legitimate horizontal elements**: Fix root causes first; apply body overflow only as a safety net.
- **Touch target size**: Nav links must be padded to ≥ 44px height. Verify with DevTools device emulation before marking done.

## Migration Plan

No data migration. Change is purely UI. Deploy via standard `main` → Vercel pipeline. Rollback: revert the Nav.tsx commit.
