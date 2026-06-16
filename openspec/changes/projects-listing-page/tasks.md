## 1. Theme token

- [ ] 1.1 Add `--color-accent-border` to the `@theme` block in `styles/globals.css` (light: `oklch(0.58 0.18 38 / 0.30)`) and the `[data-theme="dark"]` override (`oklch(0.65 0.18 38 / 0.38)`), matching the prototype `portfolio.css` values.

## 2. Project card markup (`app/projects/page.tsx`)

- [ ] 2.1 Make each card root a `group relative overflow-hidden` container with base classes `border border-surface-alt bg-surface` and hover classes `group-hover:border-accent-border group-hover:bg-surface-alt transition-colors`; keep `rounded-xl`, set padding to `px-7 pt-7 pb-6` (28/28/24) per DESIGN.md §358. Keep it wrapped in `FadeIn` with `delay={i * 80}`.
- [ ] 2.2 Add the absolutely-positioned accent top-line: a 1px child pinned `top-0 left-0`, `bg-[linear-gradient(90deg,var(--color-accent),transparent)]`, `w-0 group-hover:w-[60%]` with a width transition.
- [ ] 2.3 Keep the top row: year badge (left), GitHub link (always, `GithubIcon`) and demo link (`ExternalLink`, rendered only when `project.demo` is truthy) in the top-right; both `text-secondary hover:text-primary transition-colors` with `aria-label`s.
- [ ] 2.4 Wrap the `<h2>` project name in a `Link` to `/projects/${projectSlug(project.id)}`; render the tagline below it in DM Mono (`font-mono`) muted text.
- [ ] 2.5 Add the Problem block: label "Problem" (DM Mono 11px, `text-accent`, uppercase, `tracking-[0.06em]`) above `project.problem` in muted 14px text.
- [ ] 2.6 Add the IMPACT callout per §362: `bg-neutral` fill, `border-l-2 border-accent`, `rounded-md`, `px-3.5 py-3`; label "IMPACT" (DM Mono 11px accent uppercase) above `project.impact` in primary 14px text.
- [ ] 2.7 Render `project.stack` as tags per §349: each a DM Mono 11px chip, `bg-surface-alt` muted text, `rounded-xs`, `px-2.5 py-[3px]`, wrapped in a `flex flex-wrap gap-1.5` row at the bottom of the card.
- [ ] 2.8 Confirm the file remains a Server Component (no `"use client"`); hover state is CSS-only.

## 3. Tests

- [ ] 3.1 Extend `__tests__/Projects.test.tsx`: assert each project renders its name, tagline, year, problem text, impact text (with an "IMPACT" label), and one tag per `stack` entry.
- [ ] 3.2 Assert the GitHub link renders for every project and the demo link renders only for projects with a `demo` (use the two seed projects: `ledger-stream` has a demo, `pulse-cli` does not); assert the card title links to `/projects/<slug>`.
- [ ] 3.3 Run `npm test` and confirm all tests pass.

## 4. DOM / Visual Verification

- [ ] 4.1 Run the app (`npm run dev`) and verify `/projects` at desktop (2-col grid) and mobile (1-col) widths: header, both cards, Problem, IMPACT callout, tags, and GitHub/demo icons render; capture evidence.
- [ ] 4.2 Verify hover on a card lifts the background, switches the border to the accent colour, and animates the accent top-line in; confirm no text overlap, clipping, or layout shift, and that cards fade/slide in on scroll.

## 5. Quality Gates

- [ ] 5.1 Run `npm run typecheck` and confirm zero errors.
- [ ] 5.2 Run `npm run lint` and confirm zero errors.
- [ ] 5.3 Run `npm run design-lint`, `npm run validate-content`, and `npm run build` and confirm all pass.
- [ ] 5.4 Run `openspec validate projects-listing-page --type change --strict` and confirm the change is valid.
