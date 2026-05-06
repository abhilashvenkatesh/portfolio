## Why

The About page is the primary trust-building page for recruiters and collaborators — it's where visitors decide whether to reach out. Currently it's a placeholder heading. Implementing it turns a blank stub into a page that communicates Abhilash's identity, values, and technical range.

## What Changes

- `src/pages/about.astro` — full page implementation replacing the stub
- `src/data/index.ts` — add typed `skills` data (Languages, Frameworks, Data & Messaging, Cloud & DevOps)
- `public/avatar.jpg` — profile photo (placeholder or real asset)
- Page layout: two-column (bio left, avatar right), skills grid below, résumé download button
- Three bio paragraphs sourced from design prototype
- Skills rendered as category-grouped tag badges
- "Download Résumé" button linking to `public/resume.pdf`
- `ScrollReveal` applied to below-fold sections (skills grid)

## Capabilities

### New Capabilities

- `about-page`: Static About page — profile photo, bio, résumé download CTA, skills grouped by category as tag badges

### Modified Capabilities

- `scroll-reveal`: No requirement changes — `ScrollReveal` is consumed here per existing spec

## Impact

- `src/pages/about.astro` — full rewrite of stub
- `src/data/index.ts` — add `skills: SkillGroup[]` export (if not present)
- `public/avatar.jpg` — profile photo asset needed before deploy
- No new npm dependencies
- No SSR, no API — all data statically rendered
