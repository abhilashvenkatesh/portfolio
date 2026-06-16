## Context

`/projects` currently ships the POR-171 minimal bridge: a `PageHeader` plus a grid of bare cards (year badge, name, tagline, GitHub/demo icons, "Read case study" link) rendered by `app/projects/page.tsx`. The page is a Server Component (SSG) wrapping each card in the `FadeIn` client component.

POR-170 turns those bare cards into the full showcase cards from the source-of-truth prototype (`documentation/design/projects.html`): a Problem section, a distinct IMPACT callout, tech-stack tags, a hover treatment (background lift, accent border, accent top-line), and conditional demo links — while keeping the card's link through to its detail page.

The `Project` data model already carries every field needed (`problem`, `impact`, `stack`, `demo`), so this is a presentation-only change. No data, route, or content changes.

## Goals / Non-Goals

**Goals**
- Render Problem, IMPACT callout, and tech-stack tags on each card per DESIGN.md §358/§362/§349.
- Add a CSS-only hover treatment (bg lift → accent border → animated accent top-line).
- Show GitHub link always; demo link only when `project.demo` exists.
- Preserve staggered fade-in and the card→detail-page link.
- Add a single new theme token `--color-accent-border`.

**Non-Goals**
- No changes to the `Project` schema, `content/projects.json`, or the detail page.
- No new client components; the page stays a Server Component (SSG).
- Not swapping placeholder seed projects for real ones (separate content task).

## Project Facts Preflight

- Dependencies checked: `package.json` — `lucide-react` present (used for `ExternalLink`); no new deps needed.
- Icon/export availability checked: `lucide-react` exports `ExternalLink` (confirmed in `node_modules/lucide-react/dist/lucide-react.d.ts:7518`). `GithubIcon` is the inline SVG in `components/ui/icons.tsx` (lucide v1.x has no brand icons). Both already imported by `app/projects/page.tsx`.
- Design tokens/classes checked: `styles/globals.css` `@theme` defines `--color-surface`, `--color-surface-alt`, `--color-neutral`, `--color-accent`, `--color-accent-dim`. **No `--color-accent-border` exists yet** — must be added. DESIGN.md §262 defines accent-border as accent at 30–38% opacity; prototype `portfolio.css` values: light `oklch(0.58 0.18 38 / 0.30)`, dark `oklch(0.65 0.18 38 / 0.38)`. DESIGN.md §358 (card hover: bg3 fill = `surface-alt`, accent-border border, accent line `width 0% → 60%` gradient top edge), §362 (impact callout: `bg`=`neutral` fill, `2px solid accent` left border, `8px` radius, `12px 14px` padding, DM Mono 11px accent uppercase label), §349 (Tag: `surface-alt` fill, muted text, DM Mono 11px, `4px` radius, `3px 9px` padding).
- Existing components/helpers checked: `components/ui/FadeIn.tsx` (client; `delay?: number` ms prop; honours `prefers-reduced-motion`), `components/ui/PageHeader.tsx`, `components/ui/icons.tsx` (`GithubIcon`), `lib/content.ts` (`getProjects`, `projectSlug`). All exist.
- Scripts checked: `package.json` — `typecheck`, `lint` (`eslint .`), `design-lint`, `validate-content`, `build`, `test` available.

## Decisions

**1. CSS-only hover via Tailwind `group` / `group-hover`, not React state.**
The prototype uses `useState(hovered)` only because it is plain in-browser React. The same UX is achievable with `group` on the card root and `group-hover:` utilities on the border, background, and accent line. Keeping it CSS-only means `app/projects/page.tsx` stays a Server Component — no `"use client"`, no hydration cost, SSG preserved (Vercel best-practice: avoid client JS for purely visual state). Alternative (client component with `useState`) rejected: adds a bundle/hydration cost for zero behavioural gain.

**2. Add one theme token `--color-accent-border`.** Hover border needs the translucent accent that DESIGN.md §262 already documents but `globals.css` never declared. Add to `@theme` (light) and `[data-theme="dark"]` override using the prototype's exact oklch values. Tailwind v4 auto-derives `border-accent-border` / `bg-accent-border`. Alternative (reuse opaque `border-accent`) rejected: harsher than the prototype and inconsistent with the documented design system.

**3. Accent top-line animates `width` 0 → 60%.** Per DESIGN.md §358, a 1px gradient bar (`linear-gradient(90deg, accent, transparent)`) pinned top-left, `w-0 group-hover:w-[60%]` with a width transition. Lives in an absolutely-positioned child of the `relative overflow-hidden` card.

**4. Card root is a non-link `group` container; the project title is the detail link.** Avoids nesting the GitHub/demo anchors inside a card-wide `<a>` (invalid HTML, a11y trap). The `<h2>` title wraps in a `Link` to `/projects/[slug]`; GitHub/demo icon links sit in the top-right corner as separate anchors. This keeps every link independently focusable while satisfying "activate a card → reach detail".

**5. Section labels reuse the prototype's register.** "Problem" and "IMPACT" labels: DM Mono 11px, accent colour, uppercase, `0.06em` tracking — matching §362 and the prototype's Problem block. Tagline switches to DM Mono per the prototype.

## Risks / Trade-offs

- [New token could drift from DESIGN.md] -> Use the exact oklch values from `portfolio.css`; DESIGN.md §262 already specifies the 30–38% opacity range, so it is documented, not invented.
- [`design-lint` runs on DESIGN.md] -> No DESIGN.md edit is required (accent-border already documented); the token addition is in `globals.css`, outside the lint target. Run `npm run design-lint` anyway to confirm green.
- [Touch-only devices get no hover] -> Acceptable; hover is progressive enhancement. All content (problem, impact, stack, links) is visible without hover.
- [Padding change p-6 → 28/28/24] -> Cosmetic alignment to §358; low risk, visually verified against prototype.

## Migration Plan

Presentation-only edit to one route file plus one token in `globals.css`. Deploy via normal Vercel SSG build. Rollback = revert the two files; no data or schema migration. At archive time, the `projects-listing-bridge` capability is renamed: `openspec/specs/projects-listing-page/spec.md` is created from the ADDED requirements and the emptied `openspec/specs/projects-listing-bridge/` folder is deleted (its REMOVED delta), and the stale `projects-listing-bridge` Linear mirror document is superseded by an `OpenSpec: projects-listing-page` document.

## Open Questions

None. Design tree fully resolved during grilling (card→detail link kept; capability renamed; accent-border token added). No in-force ADRs affected.
