## 1. Content data

- [ ] 1.1 Populate `content/skills.json` with four `SkillCategory` objects (`{ name, skills }`) — Languages, Frameworks, Data & Messaging, Cloud & DevOps — using the skill lists from design.md Decision 5 (sourced from `documentation/design/shared.js` `SKILLS`).
- [ ] 1.2 Run `npm run validate-content` and confirm `skills.json` passes `SkillCategorySchema`.

## 2. SectionLabel component

- [ ] 2.1 Create `components/ui/SectionLabel.tsx` — a centered label flanked by `flex-1 h-px bg-surface-alt` divider rules; label is `font-mono` uppercase `text-accent` with tracking, per design.md Decision 2 and the `shared.js:410` prototype.

## 3. Skills section on /about

- [ ] 3.1 In `app/about/page.tsx`, import `getSkills` from `@/lib/content` and read categories at build time (Server Component).
- [ ] 3.2 Add a "What I work with" section below the bio section: render `SectionLabel` heading, then a grid `grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4` of cards.
- [ ] 3.3 Each card: `bg-surface-alt border-surface-alt` rounded container with a `font-mono uppercase text-accent` category label and skill tags (`bg-surface border-surface-alt` rounded, `text-secondary`), matching the prototype.
- [ ] 3.4 Wrap each card in `FadeIn` with `delay={i * 60}` for staggered scroll reveal.

## 4. Tests

- [ ] 4.1 Extend `__tests__/About.test.tsx` with the "What I work with" heading assertion and a data-driven check that every category name and every skill from `getSkills()` renders.
- [ ] 4.2 Add a DOM assertion confirming all four category labels (Languages, Frameworks, Data & Messaging, Cloud & DevOps) appear.
- [ ] 4.3 Run `npm test` and confirm all tests pass.

## 5. DOM / Visual Verification

- [ ] 5.1 Add skills checks to `verifyAbout()` in `scripts/verify-dom.ts` (section label "What I work with" + the four category names) and run `npm run verify-dom` against the built site.
- [ ] 5.2 Run the app and confirm the cards reflow without overlap/clipping at mobile and wide widths, and that cards fade in on scroll with a visible stagger.

## 6. Quality Gates

- [ ] 6.1 Run `npm run typecheck` and confirm zero errors.
- [ ] 6.2 Run `npm run lint` and confirm zero errors.
- [ ] 6.3 Run `npm run design-lint` and confirm it passes.
- [ ] 6.4 Run `openspec validate about-skills-section --type change --strict` and confirm the change is valid.
