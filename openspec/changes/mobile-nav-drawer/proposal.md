---
linear_story_id: "POR-165"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-165/mobile-navigation-hamburgerdrawer"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-04T05:27:05Z
finished_at: 2026-06-04T05:42:02Z
session_ids: ["deff8e00-d7bc-4b63-aa0f-ca207936081f"]
---

## Why

On viewports below 640px the desktop nav links are hidden (`sm:hidden`) but no replacement exists — the `Nav` component carries a `TODO POR-165: mobile hamburger` placeholder, leaving mobile visitors with no way to reach Projects, About, Experience, Blog, Chat, or Contact. This closes requirement NAV-6 (mobile navigation) and unblocks full mobile usability of the site shell delivered in POR-164.

## What Changes

- Add a hamburger button to the mobile nav bar (`<640px`); mobile bar becomes **logo + hamburger only**.
- Add a right slide-in drawer panel with a dimmed backdrop, containing all six nav links (Projects, About, Experience, Blog, Chat, Contact), the **Hire me** button, and the **light/dark theme toggle**.
- On mobile, the theme toggle and Hire me button move **out** of the always-visible bar and **into** the drawer (desktop bar unchanged).
- Drawer dismisses on: Escape key, backdrop tap, selecting any link, and viewport resize past 640px.
- Accessibility: focus trap while open, focus return to the trigger on close, body scroll lock, `aria-expanded` / `aria-controls` on the trigger, labelled drawer region.
- No new dependencies; reuses existing `ThemeContext`, `NAV_LINKS`, and `email` prop already in `Nav`.

## Capabilities

### New Capabilities

<!-- none — this extends existing nav behaviour in the site-shell capability -->

### Modified Capabilities

- `site-shell`: Adds a mobile navigation drawer requirement — below 640px the collapsed desktop links are replaced by a hamburger trigger and slide-in drawer exposing all links, Hire me, and the theme toggle, with accessible open/close behaviour.

## Impact

- Code: `components/layout/Nav.tsx` (replace the `sm:hidden` placeholder; relocate toggle + Hire me into a shared link set rendered in both bar and drawer). Likely a new `components/layout/MobileDrawer.tsx` (client component).
- Tests: component tests for Nav/drawer (open/close, link set parity, a11y attributes).
- No content schema, API, or dependency changes. Theme + email continue to flow through existing context/props.
- Business details tracked in Linear POR-165.
