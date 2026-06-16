## 1. Content

- [x] 1.1 Populate `content/experience.json` with the role entries as `ExperienceEntry[]`, most-recent-first — **Fabric Group → Australia Post → Rapido → ThoughtWorks** (derived from `content/about.json`). Each entry: `title`, `company`, `period`, `bullets: string[]`. Dates/bullets are best-effort drafts.
- [x] 1.2 Flag to the user that `period` ranges and `bullets` are inferred (no real résumé) and need confirmation; treat any corrections as a content-only edit.
- [x] 1.3 Confirm `getExperience()` in `lib/content.ts` returns the entries unchanged (no loader/type change expected; verify shape against `ExperienceEntry`).

## 2. Experience page

- [x] 2.1 Create `app/experience/page.tsx` as an SSG Server Component; read entries via `getExperience()`.
- [x] 2.2 Render `PageHeader` with `label="Experience"` and `subtitle="Where I've worked"`.
- [x] 2.3 Wrap content in a `max-w-[720px] mx-auto` column inside `px-6 pb-24`.
- [x] 2.4 Render the timeline: a `relative` wrapper with an absolutely-positioned 1px left line (`bg-surface-alt`); map over entries, each `relative pl-8 pb-14`, wrapped in `FadeIn delay={i * 80}`.
- [x] 2.5 Render each entry's marker dot absolutely at `-left-[5px] top-2`, `h-[11px] w-[11px] rounded-full border`. Current role (`i === 0`): `bg-accent border-accent ring-4 ring-accent-dim`. Past roles: `bg-surface border-surface-alt`.
- [x] 2.6 Render the entry header: `flex justify-between items-start flex-wrap gap-1.5` — title `font-semibold text-primary`, company `font-mono text-sm text-accent`; period pill `font-mono text-xs text-secondary bg-surface-alt border border-surface-alt rounded-full px-2.5 py-0.5 whitespace-nowrap`.
- [x] 2.7 Render bullets as a `list-none` column (`flex flex-col gap-2.5 mt-4`); each `<li>` `flex gap-3 text-secondary` with a leading accent `–` dash (`text-accent shrink-0`).
- [x] 2.8 Render the bottom CTA card wrapped in `FadeIn` (stagger delay): `rounded-xl border border-surface-alt bg-surface-alt p-7 flex items-center justify-between flex-wrap gap-4`. Left: "Want the full picture?" (`font-semibold text-primary`) + "Download my résumé for a complete work history." (`text-sm text-secondary`).
- [x] 2.9 Add the "Download résumé" CTA: `<a href="/resume.pdf" download>` styled `bg-accent text-black rounded-lg px-5 py-2.5 font-mono text-[13px] font-semibold inline-flex items-center gap-2 hover:opacity-85`, with the inline download SVG icon (reuse the markup from `app/about/page.tsx`).

## 3. Tests

- [x] 3.1 Add `__tests__/Experience.test.tsx` rendering the page: assert the header label/subtitle text, every entry's title/company/period renders, and bullets render.
- [x] 3.2 Assert the timeline order matches `content/experience.json` (most-recent-first) and the first entry's marker carries the distinguishing accent/ring class.
- [x] 3.3 Assert the bottom CTA card text "Want the full picture?" appears and the résumé link targets `/resume.pdf` with the `download` attribute.
- [x] 3.4 Run `npm test` and confirm all tests pass.

## 4. DOM / Visual Verification

- [x] 4.1 Run `npm run verify-dom` (and/or capture screenshots) to verify the Experience page across desktop and mobile widths: continuous left line, markers aligned, period pill wraps without overlap on narrow widths.
- [x] 4.2 Confirm the current-role marker shows the accent + ring glow, entries stagger-reveal on scroll, and the CTA dims on hover (token usage verified by design-lint).

## 5. Quality Gates

- [x] 5.1 Run `npm run typecheck` and confirm zero errors.
- [x] 5.2 Run `npm run lint` and confirm zero errors.
- [x] 5.3 Run `npm run design-lint` and `npm run validate-content` and confirm both pass.
- [x] 5.4 Run `npm run build` and confirm `/experience` is emitted as a static (SSG) route.
- [x] 5.5 Run `openspec validate experience-page --type change --strict` and confirm the change is valid.
