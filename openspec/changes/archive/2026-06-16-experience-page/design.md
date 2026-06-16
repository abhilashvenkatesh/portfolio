## Context

The Nav (`components/layout/Nav.tsx:15`) already links `/experience`, but the route does not exist — it currently 404s. POR-172 adds it as the next Phase-3 content page, mirroring the conventions `/about` established. `PageHeader` (grid-fade header), `FadeIn` (scroll-reveal), the `getExperience()` loader (`lib/content.ts:24`), the `ExperienceEntry` type (`lib/types.ts:25`), and `public/resume.pdf` all already exist; `content/experience.json` is present but empty (`[]`). Business brief: Linear POR-172. Acceptance criteria: `specs/experience-page/spec.md` (EXP-1..5, DATA-4, XC-4). Visual source of truth: `documentation/design/experience.html` and `documentation/DESIGN.md` L364 (Timeline component spec).

## Goals / Non-Goals

**Goals**
- SSG `/experience` route: page header, vertical role timeline, scroll-staggered reveal, bottom résumé CTA card.
- Role entries sourced from `content/experience.json` via `getExperience()` (no hardcoded copy).
- Most-recent role marker distinguished (accent + `accent-dim` ring); past roles neutral.

**Non-Goals**
- A real résumé PDF — `public/resume.pdf` is a 316-byte blank placeholder; supplying the real file is a later content swap, not this change.
- Other content pages (`/projects`, `/blog`, `/contact`).
- Filtering/sorting controls — order is fixed by the content file (most-recent-first).

## Project Facts Preflight

- **Dependencies checked**: `package.json` — Next 15, React 19, Tailwind v4. No new deps.
- **Data layer checked**: `lib/types.ts:25` `ExperienceEntry { title; company; period; bullets: string[] }` already matches the prototype shape (prototype's `exp.role` maps to `title`). `lib/content.ts:24` `getExperience()` reads `experience.json` → `ExperienceEntry[]`. No type/loader change needed — only populate the JSON.
- **Design tokens/classes checked**: `documentation/DESIGN.md` L364 (**Timeline**) is the authoritative component spec — vertical 1px border line; entry `32px` left padding; dot `11×11px`, `-5px` left offset; current role accent fill + accent border + `accent-dim` ring (`0 0 0 4px`); past roles `bg3` fill + border colour; period badge `bg2` fill, 1px border, `100px` radius (full pill), Mono 12px muted; company name DM Mono 14px accent. Tailwind tokens confirmed in `styles/globals.css`: `text-accent`, `bg-accent`, `bg-accent-dim`, `border-surface-alt`, `text-secondary`, `text-primary`. `accent-dim` (#efdfd1) → `ring-accent-dim`. Primary CTA (DESIGN L343): accent fill / black text / `rounded-lg` / `px-5 py-2.5` / Mono 13px wt 600 / `hover:opacity-85` — identical to the About résumé button already in `app/about/page.tsx:33-53`.
- **Existing components checked**: `components/ui/PageHeader.tsx` (props `label`, `subtitle`; renders grid-fade SVG — satisfies EXP-1). `components/ui/FadeIn.tsx` (`'use client'`, props `children` + `delay`; `motion-reduce` disables transform — satisfies EXP-4). No `app/experience/` dir.
- **Scripts checked**: `package.json` — `typecheck`, `lint`, `design-lint`, `validate-content`, `build` gate order.

## Decisions

**1. `/experience` is a Server Component (SSG).**
Matches the architecture rule (every page SSG except `/chat`). Entries read at build time via `getExperience()`. No runtime data; no client fetch.

**2. Role entries live in `content/experience.json` as `ExperienceEntry[]`, most-recent-first.**
Reuses the existing loader/type with zero plumbing changes (DATA-4 — single external data file, order preserved). The component maps over the array; `index === 0` is the current role.
*Data sourcing:* `public/resume.pdf` is a blank placeholder, so entries are drafted from the real career arc documented in `content/about.json` — **Fabric Group → Australia Post → Rapido → ThoughtWorks** (Melbourne; insurance/logistics/mobility/retail; 11+ years). Exact date ranges and per-role bullets are best-effort drafts that the user should confirm/correct; structure and order are authoritative.

**3. Reuse `PageHeader` with `label="Experience"`, `subtitle="Where I've worked"`.**
Already renders the fading grid-line background (EXP-1). No new header component.

**4. Timeline rendered inline in the page from a single `EXPERIENCE.map`, each entry wrapped in `FadeIn delay={i * 80}`.**
Matches the prototype (`documentation/design/experience.html`) stagger of 80ms. A column wrapper holds an absolutely-positioned 1px left line (`bg-surface-alt`); each entry is `relative pl-8 pb-14` with an absolutely-positioned `-left-[5px] top-2` dot. Current-role dot (`i === 0`): `bg-accent border-accent ring-4 ring-accent-dim`; past dots: `bg-surface border-surface-alt` (neutral). This keeps the page a Server Component (FadeIn is the only client boundary; reused, not new). Extracting a `TimelineEntry` component is optional — inline map is simplest and mirrors `/about`'s skills map.

**5. Entry header layout: title + company stacked left, period pill right, wrapping on narrow widths.**
`flex justify-between items-start flex-wrap gap-1.5`. Title `font-semibold text-primary` (bold per EXP-3); company `font-mono text-sm text-accent`; period badge `font-mono text-xs text-secondary bg-surface-alt border border-surface-alt rounded-full px-2.5 py-0.5 whitespace-nowrap`. Bullets: `list-none` column, each row `flex gap-3 text-secondary` with a leading accent `–` dash (`text-accent shrink-0`), matching the prototype.

**6. Bottom CTA card reuses the About résumé button styling.**
Card: `rounded-xl border border-surface-alt bg-surface-alt p-7 flex items-center justify-between flex-wrap gap-4`, wrapped in `FadeIn` with a stagger delay. Left: "Want the full picture?" (`font-semibold text-primary`) + "Download my résumé for a complete work history." (`text-sm text-secondary`). Right: `<a href="/resume.pdf" download>` styled exactly as the About primary CTA (accent fill, black text, `rounded-lg px-5 py-2.5 font-mono text-[13px] font-semibold hover:opacity-85`) with the inline download SVG icon (XC-4 — same PDF as About).

**7. Content shell width.**
Timeline column `max-w-[720px] mx-auto` per the prototype (narrower than the `max-w-5xl` used elsewhere), inside the standard `px-6` page padding with `pb-24`.

## Risks / Trade-offs

- **Placeholder résumé** — the CTA downloads a blank PDF until a real file is supplied. Wiring is correct and unchanged when the file is swapped; flagged on POR-172.
- **Draft career data** — periods/bullets are inferred from `about.json`, not a real résumé. The user must confirm accuracy before this is considered content-complete; the spec only constrains structure and ordering, so corrections are pure content edits with no code impact.

## Migration Plan

Additive only — new route + populated content file. No data migration, no breaking change. `/experience` goes from 404 to live on deploy.

## Open Questions

- Exact date ranges and bullet wording per role — pending user confirmation against the real résumé (does not block implementation of structure).
