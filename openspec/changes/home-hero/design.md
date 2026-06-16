## Context

`app/page.tsx` currently renders a "coming soon" placeholder. POR-166 replaces it with the home hero: role badge, headline + subheading, bio, a three-stat bar, and decorative grid + glow texture. The hero is the visual centrepiece of the site and the source-of-truth prototype is `documentation/design/index.html` (`Hero` component).

The hero is also the container that POR-167 will populate with the chat launcher and scroll indicator. This change builds the static shell only; it must leave the prototype's content order intact so POR-167 can slot its pieces in between the bio and the stats.

## Goals / Non-Goals

**Goals**
- Render the hero from `content/home.json` at build time (SSG), no hardcoded copy.
- Match the prototype layout: badge → headline → bio → (gap for launcher) → stats, centred, full-viewport-height section.
- Decorative grid pattern + radial glow that is theme-aware and does not obscure text or intercept pointer events.

**Non-Goals**
- Chat launcher (input, chips, browse hints) and scroll indicator — POR-167.
- Scroll/entrance animation — the prototype hero is static; no `FadeIn` dependency.
- Any change to `lib/types.ts` `HomeContent` (already covers every field).

## Project Facts Preflight

- **Dependencies checked**: `package.json` — no new deps needed. React 19 / Next 15 App Router, Tailwind v4, vitest + React Testing Library (existing `__tests__/*.test.tsx`).
- **Icon/export availability checked**: N/A — hero uses no icon library; grid is inline SVG, glow is a styled `div`.
- **Design tokens/classes checked**: `styles/globals.css` `@theme` exposes `--color-primary`, `--color-secondary`, `--color-accent`, `--color-accent-dim`, `--color-surface(-alt)`, `--color-neutral`, `--font-sans`, `--font-mono`, `--radius-*`. Tailwind v4 maps these to `text-primary` / `text-secondary` / `text-accent` / `bg-accent` / `bg-accent-dim` etc. Dark overrides live on `[data-theme="dark"]`. There is **no** `--border`/`--muted`/`--heading` token (prototype names) — map: heading→`text-primary`, muted→`text-secondary`, accent→`text-accent`.
- **Existing components/helpers checked**: `components/ui/PageHeader.tsx` already implements the grid-line SVG pattern with a radial mask via `currentColor` + `strokeOpacity="0.06"` (the XC-3 texture). `lib/content.ts` `getHomeContent()` and `lib/types.ts` `HomeContent` exist and cover roleBadge/headline/subheading/bio/stats/suggestions. No `FadeIn` component exists in `components/` despite a CLAUDE.md mention — do not depend on it. New folder `components/home/` will be introduced for page-specific components (POR-167 reuses it for the launcher).
- **Scripts checked**: `package.json` — `typecheck`, `lint` (`eslint .`), `design-lint` (`tsx scripts/validate-design.ts`), `validate-content` (`tsx scripts/validate-content.ts`, enforces `stats` length 3 via zod), `test` (`vitest run`), `build`. `scripts/verify-dom.ts` checks rendered home HTML against regexes.

## Decisions

**1. Hero is a Server Component composed in `app/page.tsx`; no `"use client"`.**
All content is read at build time and the texture is pure SVG/CSS — nothing needs the client. Keeps the home page fully SSG and zero-JS for the hero. Alternative (client component) rejected: no interactivity in scope.

**2. Reuse the PageHeader SVG-pattern approach for the grid, not the prototype's inline CSS `background-image`.**
PageHeader already establishes the repo idiom: an `aria-hidden` SVG `<pattern>` of grid lines stroked with `currentColor` at low opacity, masked by a radial gradient so it fades toward the centre. Driving the stroke from text color makes it theme-aware for free. The prototype's `linear-gradient` + `maskImage` works but hardcodes `var(--border)` which this repo doesn't define. Component: `components/home/HeroBackground.tsx` rendering the grid SVG plus the glow.

**3. Glow = absolutely-positioned blurred `div` using the accent token at low opacity.**
`bg-accent` + low opacity + `blur` (e.g. `bg-accent/[0.08] blur-[80px]`) reproduces the prototype's `oklch(... / 0.08)` radial glow while staying theme-aware (accent token differs per theme). Both grid and glow get `pointer-events-none` and `aria-hidden` and sit at `z-0` behind `z-10` content.

**4. Headline rendering: flat strings, hardcoded accent (per user decision).**
`home.json` keeps `headline` and `subheading` as plain strings. The component renders `headline` as the dominant `text-primary` heading, and `subheading` as a `text-secondary` light-weight line with the trailing clause **"scale to millions."** wrapped in a `text-accent` span. The accent clause is hardcoded in the component (matched/sliced from the subheading); editing that exact wording in JSON is the documented trade-off of this approach over a structured headline object.

**5. Content order leaves a gap for POR-167.**
Render order: `HeroBadge` → headline/subheading → bio → `{/* POR-167: chat launcher mounts here */}` → `HeroStats`. The scroll indicator (also POR-167) belongs at the section's bottom edge. Documenting these seams now avoids a layout reshuffle later.

**6. Update `content/home.json` copy to POR-166 values.**
`roleBadge` → "Lead Application Developer · Melbourne"; `bio` and the three `stats` → the issue wording ("30+ microservices shipped", "3 countries worked in", etc.). The existing `suggestions` array is left untouched (POR-167 consumes it). This is a data edit, not a schema change.

**7. Components live in `components/home/`.** `Hero.tsx` (composition), `HeroBackground.tsx` (grid + glow), `HeroStats.tsx` (stat bar). Badge is small enough to inline in `Hero.tsx` or extract as `HeroBadge.tsx`. Mirrors the `components/layout` / `components/ui` convention.

## Risks / Trade-offs

- **Hardcoded accent clause is brittle** → If a future editor changes the subheading wording, the accent span may not match. Mitigation: keep the slice resilient (suffix match) and note the coupling in a code comment; a structured headline object remains the escape hatch if it becomes a pain.
- **Texture competes with text in dark theme** → glow/grid could wash out contrast. Mitigation: keep grid `strokeOpacity` ~0.06 and glow opacity ~0.08, mask the grid to fade behind the headline, verify WCAG AA on the headline/bio in both themes (design-lint + manual).
- **Full-viewport hero feels empty without the launcher (POR-167 not yet built)** → Mitigation: acceptable interim state; the gap is intentional and the stats + bio still fill the column. Do not add filler that POR-167 must remove.

## Migration Plan

Pure additive front-end change. Deploy via the normal CI pipeline (`typecheck → lint → design-lint → validate-content → build`). Rollback = revert the commit; `home.json` copy revert is independent and safe. No data migration, no env changes.

## Open Questions

None blocking. The headline-accent modelling was resolved with the user (flat strings, hardcoded accent).
