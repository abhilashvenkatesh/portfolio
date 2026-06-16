## Context

The site currently has only the home page (`app/page.tsx` → `Hero`). POR-168 adds the first Phase-3 content page, `/about`. The header component (`components/ui/PageHeader.tsx`), the bio content loader (`lib/content.ts#getAboutBio`), and the résumé asset (`public/resume.pdf`) already exist; `content/about.json` is present but empty (`[]`). The Nav already links `/about` and `/blog`, so this route fills a dead link. Business brief: Linear POR-168. Acceptance criteria: `specs/about-page/spec.md` (ABOUT-1..5).

## Goals / Non-Goals

**Goals**
- SSG `/about` route: page header, three-paragraph bio, square photo placeholder, "Download résumé" CTA, "Blog →" cross-link.
- Bio sourced from `content/about.json` (no hardcoded copy).
- Establish reusable page-layout + scroll-reveal conventions for sibling content pages.

**Non-Goals**
- Skills section (ABOUT-6 / POR-169 — this change blocks it).
- Real photo (placeholder silhouette only; real image is a later content swap).
- The `/blog` page itself (separate issue; the link target may 404 until built).

## Project Facts Preflight

- **Dependencies checked**: `package.json` — Next 15, React 19, Tailwind v4, `next/link`, `next/image` available. No new deps needed.
- **Icon/export availability checked**: No `lucide-react` icons used (brand-icon caveat irrelevant). Download icon rendered as inline SVG (matches prototype `documentation/design/about.html`). N/A for package exports.
- **Design tokens/classes checked**: `styles/globals.css` confirms `--color-primary/secondary/accent/accent-dim/surface/surface-alt` → Tailwind classes `text-primary`, `text-secondary`, `text-accent`, `bg-accent`, `bg-accent-dim`, `border-surface-alt`. `documentation/DESIGN.md` L343: **Primary CTA = accent fill, black text, 8px radius (`rounded-lg`), `10px 20px` padding, DM Mono 13px weight 600, hover `opacity:0.85`** — explicitly "Used for 'Download résumé' on About". L347: Secondary/Outline = accent text, 1px accent border, 6px radius (`rounded-md`). `accent-border` is an opacity-derived value, not a Tailwind color token; hover border uses `hover:border-accent` (pattern from `components/home/ChatLauncher.tsx:78`).
- **Existing components/helpers checked**: `components/ui/PageHeader.tsx` exists (props `label`, `subtitle`, optional `intro`; renders grid-line fade SVG). `lib/content.ts#getAboutBio()` exists → `string[]` from `about.json`. `components/ui/FadeIn.tsx` does **not** exist (CLAUDE.md references it aspirationally) — create it. No `app/about/` dir. `public/resume.pdf` exists.
- **Scripts checked**: `package.json` confirms `typecheck`, `lint`, `design-lint`, `validate-content`, `build` — the CI gate order.

## Decisions

**1. `/about` is a Server Component (SSG).**
Matches the architecture rule (every page SSG except `/chat`). Bio read happens at build time via `getAboutBio()`. Alternatives (client fetch) rejected — no runtime data, no `fs` at runtime.

**2. Bio paragraphs live in `content/about.json` as `string[]`.**
Reuses the existing `getAboutBio()` loader with zero new plumbing. Populate the empty array with the three paragraphs from the prototype (they already name the required employers: ThoughtWorks, Rapido, Australia Post, Fabric Group). Keeps copy out of the component per the no-hardcoded-content rule.

**3. Reuse `PageHeader` with `label="About me"`, `subtitle="11+ years building systems across 3 countries and 4 industries."`**
The component already renders the grid-line fade background (ABOUT-1). The prototype split the subtitle across two visual lines; `PageHeader` takes a single string — render it as one subtitle string (semantically identical, satisfies the spec text). No `intro` prop needed.

**4. Introduce `components/ui/FadeIn.tsx` — a `'use client'` IntersectionObserver reveal wrapper.**
Documented in CLAUDE.md as the standard reveal wrapper and used by the prototype for bio/photo stagger. Building it here (first use) unblocks every future content page. Props: `children`, optional `delay` (ms). `opacity-0 translate-y-[14px]` → visible over 500ms; `motion-reduce` disables transform (consistent with `ScrollIndicator`'s `motion-reduce:animate-none`). A Server Component page can pass server-rendered children into a client wrapper — no serialization concern, children are already-rendered RSC output.

**5. Layout: two-column grid (bio `1fr`, photo `auto`) on desktop, stacked on mobile.**
Tailwind: `grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-20`. Photo placeholder `aria-hidden` square `rounded-[14px] border border-surface-alt bg-surface-alt` with centered inline-SVG silhouette + "photo" caption — matches prototype. Mobile stacks bio above photo (ABOUT-3). To keep the photo above the bio visually optional — spec only requires stacking; bio-first is fine.

**6. "Download résumé" = anchor `<a href="/resume.pdf" download>` styled as primary CTA.**
`download` attribute triggers a file download (ABOUT-4). `hover:opacity-85` for the dim. Inline download SVG icon. Plain `<a>` (not `next/link`) because it targets a static asset for download, not client-side nav.

**7. "Blog →" = `next/link` to `/blog`, secondary/outline style.**
Default `text-secondary border border-surface-alt`; `hover:border-accent hover:text-accent` (ABOUT-5). `next/link` for client-side nav once the blog page exists.

## Risks / Trade-offs

- **`/blog` route does not exist yet** → the link 404s until a later issue ships it. Mitigation: link target is correct per Nav config; acceptable dead-end, documented as out-of-scope. No code change needed when blog lands.
- **Placeholder silhouette vs real photo** → visitors see a generic silhouette. Mitigation: spec explicitly allows placeholder; real photo is a content/asset swap with no code change.
- **New `FadeIn` client component adds a small client bundle** → negligible (IntersectionObserver wrapper, no deps). Mitigation: keep it minimal; it replaces no-animation with progressive reveal and degrades gracefully under `prefers-reduced-motion`.
- **`design-lint` enforces tokens** → using a raw hex (e.g. `#000` for CTA text) could fail. Mitigation: use `text-black` (Tailwind utility, not a hex literal in a design-system context) per DESIGN.md L343 which specifies black text for the accent CTA.

## Migration Plan

Additive only — new route + new component + content population. No existing behaviour changes, no data migration. Deploy via normal Vercel build; CI gate order `typecheck → lint → design-lint → validate-content → build`. Rollback = revert the change commit (route simply disappears; Nav link returns to a dead link, its prior state).

## Open Questions

- None blocking. Photo asset and the `/blog` destination page are tracked by separate issues; neither blocks this change.
