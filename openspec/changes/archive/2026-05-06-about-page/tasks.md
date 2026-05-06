## 1. Data Layer

- [x] 1.1 Add `SkillGroup` interface to `src/data/index.ts` (`{ name: string; items: string[] }`)
- [x] 1.2 Add `skills: SkillGroup[]` export to `src/data/index.ts` with all four categories and items from the design prototype

## 2. About Page Implementation

- [x] 2.1 Replace `src/pages/about.astro` stub — import `Base`, `ScrollReveal`, and `skills` from data
- [x] 2.2 Implement page header section: "About me" heading and tagline ("I like hard problems.")
- [x] 2.3 Implement two-column layout: bio paragraphs (left) + avatar placeholder (right), responsive stack on mobile
- [x] 2.4 Add three bio paragraphs (sourced from design prototype)
- [x] 2.5 Add "Download résumé" accent-styled button linking to `/resume.pdf`
- [x] 2.6 Implement skills section heading ("What I work with")
- [x] 2.7 Render skills grid — iterate `skills`, render category card with name heading and tag badges per item
- [x] 2.8 Wrap skills section in `<ScrollReveal client:visible>`

## 3. Verify

- [x] 3.1 Run `npx astro check` — zero type errors
- [x] 3.2 Run `npm run build` — build succeeds
- [ ] 3.3 Run `npm run dev` and visually verify About page: layout, bio, skills, résumé button, scroll animation
