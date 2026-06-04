## Context

`components/layout/Nav.tsx` (client component) renders the fixed nav bar. Below 640px (`sm:hidden` / `hidden sm:flex`) the inline links are hidden and a placeholder `<div className="flex sm:hidden flex-1" /> {/* TODO POR-165 */}` occupies the space. The theme toggle and Hire me button currently live in an always-visible right cluster. POR-164 delivered this shell; POR-165 completes NAV-6 by adding a mobile drawer. Tailwind v4, no router-level state, `ThemeContext` already provides `theme`/`toggleTheme`. `NAV_LINKS` and the `email` prop already exist in `Nav`.

## Goals / Non-Goals

**Goals**
- Mobile (`<640px`): bar shows wordmark + hamburger only; drawer exposes all 6 links + Hire me + theme toggle.
- Accessible, fully dismissible drawer (Esc, backdrop, link click, resize).
- Reuse existing context/props; no new dependencies; desktop unchanged.

**Non-Goals**
- No change to desktop nav, footer, or theme persistence logic.
- No nested/multi-level menus, no animation library, no new content schema.
- No change to the 640px breakpoint already established in DESIGN.md.

## Project Facts Preflight

- Dependencies checked: `package.json` confirms `lucide-react` (no new deps needed); test stack `vitest` + `@testing-library/react` + `@testing-library/user-event` + `@testing-library/jest-dom` present.
- Icon/export availability checked: `lucide-react@1.17.0` exports `Menu`, `X`, `Sun`, `Moon` (verified via `require('lucide-react')`). Note: brand icons absent (known gotcha) — not needed here.
- Design tokens/classes checked: `styles/globals.css` confirms `--color-surface`, `--color-surface-alt`, `--color-neutral`, `--color-primary`, `--color-secondary`, `--color-accent`, `--color-accent-dim` for both themes → Tailwind classes `bg-surface`, `bg-neutral`, `border-surface-alt`, `text-primary/secondary/accent`, `bg-accent`, `hover:bg-accent-dim` already used in `Nav.tsx`. Breakpoint `sm` = 640px (DESIGN.md §responsive).
- Existing components/helpers checked: `components/layout/Nav.tsx` (has `NAV_LINKS`, `email` prop, `ThemeContext` consumption, `scrolled` state); `components/providers/ThemeProvider.tsx` exposes `ThemeContext { theme, toggleTheme }`; `__tests__/Nav.test.tsx` exists. No mobile drawer component exists yet.
- Scripts checked: `package.json` confirms `npm run test` (`vitest run`), `npm run typecheck`, `npm run lint`, `npm run build`.

## Decisions

**D1 — New `MobileDrawer.tsx` client component vs. inline in Nav.** Extract a `components/layout/MobileDrawer.tsx`. Nav owns the open/closed boolean and the hamburger trigger; the drawer receives `open`, `onClose`, `links`, `email`, plus theme. Rationale: keeps Nav readable, isolates focus-trap/scroll-lock effects, and makes the drawer independently testable. Alternative (all inline) rejected — Nav already carries scroll state; piling drawer effects in worsens it.

**D2 — Single source for link list.** Continue exporting/using the existing `NAV_LINKS` array; render it in both the desktop bar and the drawer so the two can never drift (spec requires parity). No duplication of hrefs.

**D3 — Open state owned by Nav; link clicks close directly.** Nav holds `const [menuOpen, setMenuOpen] = useState(false)`. Each drawer link's `onClick` calls `onClose`, which closes the drawer on navigation. (Note: an initial `usePathname()` effect calling `setMenuOpen(false)` was dropped — the repo's `react-hooks/set-state-in-effect` lint rule forbids synchronous setState in an effect body, and the link `onClick` already covers the route-change dismissal scenario.) Alternative (drawer owns its own state) rejected — trigger lives in Nav and needs `aria-expanded`.

**D4 — Dismissal wiring.** Esc via `keydown` listener while open; backdrop via an overlay button/`onClick`; resize via `matchMedia('(min-width: 640px)')` `change` listener calling `onClose`; route change via pathname effect (D3). Listeners attach only while `open` and clean up on close/unmount.

**D5 — Focus + scroll management.** On open: record `document.activeElement`, move focus into the drawer (first focusable / close button), set `document.body.style.overflow = 'hidden'`. On close: restore overflow and return focus to the trigger. Focus trap: keydown Tab handler cycling within the panel. Trigger gets `aria-expanded`, `aria-controls`; panel gets `role="dialog"` + `aria-label`/`aria-modal`.

**D6 — Visual style (per DESIGN.md tokens).** Right slide-in panel ~80vw (max ~320px), `bg-surface`, `border-l border-surface-alt`, full height under the 60px nav. Backdrop: fixed inset, `bg-neutral/60` (or black/40) with `backdrop-blur-sm` optional, below panel z-index, above page. Transition via Tailwind `transition-transform translate-x-full → translate-x-0` (respect `prefers-reduced-motion` by gating duration). Reuse Sun/Moon toggle markup and the `bg-accent text-black` Hire me button styling from current Nav.

## Risks / Trade-offs

- [SSR/hydration: `matchMedia` and `document` unavailable server-side] -> Guard all DOM access inside `useEffect`; initial `menuOpen=false` so server and first client render match.
- [Body scroll-lock left stuck if component unmounts while open] -> Cleanup function always restores `overflow` in the same effect that set it.
- [Focus trap edge cases (no focusable, dynamic content)] -> Keep panel content static; always include the close button as a guaranteed focus target.
- [z-index conflicts with fixed nav (`z-50`)] -> Backdrop + panel use `z-50`/`z-[60]` so they sit above page but coordinate with the existing nav layer.
- [Reduced-motion users] -> Gate transition duration on `motion-reduce:` utilities.

## Close Triggers

- Nav link click (drawer `onClose` on link, plus `usePathname` effect — D3)
- Outside click / backdrop tap (D4)
- Esc key (D4, returns focus to trigger — D5)
- Viewport resize ≥640px via `matchMedia` change (D4)

## Migration Plan

Additive UI change, no data/route migration. Deploy with the rest of the site shell. Rollback = revert the Nav/MobileDrawer change; desktop nav and theme behaviour are untouched, so no state cleanup needed.

## Open Questions

None — all interaction and placement decisions resolved with the contributor (hamburger-only bar, right slide-in panel, full a11y + auto-close on resize).
