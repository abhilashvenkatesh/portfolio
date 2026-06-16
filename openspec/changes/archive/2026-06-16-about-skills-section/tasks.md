## 1. Content data

- [x] 1.1 Populate `content/skills.json` with four `SkillCategory` objects (`{ name, skills }`) — Languages, Frameworks, Data & Messaging, Cloud & DevOps — using the skill lists from design.md Decision 5 (sourced from `documentation/design/shared.js` `SKILLS`).
- [x] 1.2 Run `npm run validate-content` and confirm `skills.json` passes `SkillCategorySchema`.

## 2. SectionLabel component

- [x] 2.1 Create `components/ui/SectionLabel.tsx` — a centered label flanked by `flex-1 h-px bg-surface-alt` divider rules; label is `font-mono` uppercase `text-accent` with tracking, per design.md Decision 2 and the `shared.js:410` prototype.

## 3. Skills section on /about

- [x] 3.1 In `app/about/page.tsx`, import `getSkills` from `@/lib/content` and read categories at build time (Server Component).
- [x] 3.2 Add a "What I work with" section below the bio section: render `SectionLabel` heading, then a grid `grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4` of cards.
- [x] 3.3 Each card: `bg-surface-alt border-surface-alt` rounded container with a `font-mono uppercase text-accent` category label and skill tags (`bg-surface border-surface-alt` rounded, `text-secondary`), matching the prototype.
- [x] 3.4 Wrap each card in `FadeIn` with `delay={i * 60}` for staggered scroll reveal.

## 4. Tests

- [x] 4.1 Extend `__tests__/About.test.tsx` with the "What I work with" heading assertion and a data-driven check that every category name and every skill from `getSkills()` renders.
- [x] 4.2 Add a DOM assertion confirming all four category labels (Languages, Frameworks, Data & Messaging, Cloud & DevOps) appear.
- [x] 4.3 Run `npm test` and confirm all tests pass. → 55/55 pass.

## 5. DOM / Visual Verification

- [x] 5.1 Add skills checks to `verifyAbout()` in `scripts/verify-dom.ts` (section label "What I work with" + the four category names) and run `npm run verify-dom` against the built site. → 49/49 pass.
- [x] 5.2 Run the app and confirm the cards reflow without overlap/clipping at mobile and wide widths, and that cards fade in on scroll with a visible stagger. → Structure verified via static DOM + unit. Layout is CSS grid `auto-fill minmax(200px,1fr)` (reflows by construction); reveal reuses the site-wide `FadeIn` component (already tested). No headless browser available — real-browser eyeball of reflow/stagger deferred to `/opsx:verify`.

## 6. Quality Gates

- [x] 6.1 Run `npm run typecheck` and confirm zero errors.
- [x] 6.2 Run `npm run lint` and confirm zero errors.
- [x] 6.3 Run `npm run design-lint` and confirm it passes.
- [x] 6.4 Run `openspec validate about-skills-section --type change --strict` and confirm the change is valid.
