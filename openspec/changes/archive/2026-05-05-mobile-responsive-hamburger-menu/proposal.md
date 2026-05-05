## Why

Mobile visitors currently see broken layouts — nav links overflow horizontally and page content requires lateral scrolling on 375px viewports. The hamburger menu already specified in `global-nav` is not yet implemented.

## What Changes

- Implement hamburger menu button in `Nav.tsx` that toggles on `< md` breakpoint
- Add open/close state to nav; tapping a link closes the menu
- Ensure all touch targets meet the 44px minimum
- Audit and fix horizontal overflow across all pages at 375px width

## Capabilities

### New Capabilities

- `responsive-layout`: Single-column reflow for page content on mobile viewports — no horizontal scroll at 375px, legible text and card layouts without zoom

### Modified Capabilities

- `global-nav`: Implement the mobile hamburger menu requirements already defined in the spec (hamburger visible on `< md`, toggles open/close, links close menu on tap)

## Impact

- `src/components/layout/Nav.tsx` — primary change, adds hamburger toggle state and mobile menu UI
- `src/pages/*.astro` and page-level components — audit for overflow; fix widths/paddings causing horizontal scroll
- No new dependencies — Tailwind responsive utilities and React state are sufficient
