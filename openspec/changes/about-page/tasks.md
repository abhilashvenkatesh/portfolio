## 1. Content

- [ ] 1.1 Populate `content/about.json` with the three bio paragraphs (location/career arc; employers ThoughtWorks, Rapido, Australia Post, Fabric Group; engineering philosophy) as a `string[]` — sourced from the prototype copy.
- [ ] 1.2 Confirm `getAboutBio()` in `lib/content.ts` returns the three paragraphs (no loader change expected; verify shape).

## 2. FadeIn reveal wrapper

- [ ] 2.1 Create `components/ui/FadeIn.tsx` — `'use client'` IntersectionObserver wrapper, props `children` and optional `delay` (ms); transitions `opacity-0 translate-y-[14px]` → visible over 500ms; disables transform under `motion-reduce`.

## 3. About page

- [ ] 3.1 Create `app/about/page.tsx` as an SSG Server Component; read bio via `getAboutBio()`.
- [ ] 3.2 Render `PageHeader` with `label="About me"` and `subtitle="11+ years building systems across 3 countries and 4 industries."`.
- [ ] 3.3 Render the bio + photo in a `grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-20` layout, each wrapped in `FadeIn` (photo with a stagger `delay`); paragraphs in `text-secondary`.
- [ ] 3.4 Add the square photo placeholder: `rounded-[14px] border border-surface-alt bg-surface-alt`, centered inline-SVG silhouette + "photo" caption, `aria-hidden`.
- [ ] 3.5 Add the "Download résumé" primary CTA: `<a href="/resume.pdf" download>` styled `bg-accent text-black rounded-lg px-5 py-2.5 font-mono text-[13px] font-semibold hover:opacity-85`, with inline download SVG icon.
- [ ] 3.6 Add the "Blog →" secondary link: `next/link` to `/blog`, outline style `text-secondary border border-surface-alt rounded-md`, `hover:border-accent hover:text-accent`.

## 4. Tests

- [ ] 4.1 Add `__tests__/About.test.tsx` (or `AboutPage.test.tsx`) rendering the page: assert the three bio paragraphs render, the header label/subtitle text appears, and the photo placeholder is present.
- [ ] 4.2 Assert the résumé CTA links to `/resume.pdf` with the `download` attribute, and the "Blog →" link targets `/blog`.
- [ ] 4.3 Add a render/DOM test for `FadeIn` verifying it renders its children.
- [ ] 4.4 Run `npm test` and confirm all tests pass.

## 5. DOM / Visual Verification

- [ ] 5.1 Run `npm run verify-dom` (and/or capture screenshots) to verify the About page across desktop and mobile widths: two-column on desktop, stacked bio/photo on mobile.
- [ ] 5.2 Confirm no text overlap, clipping, or layout shift; CTA dim-on-hover and blog accent-on-hover states use design tokens (verified by design-lint).

## 6. Quality Gates

- [ ] 6.1 Run `npm run typecheck` and confirm zero errors.
- [ ] 6.2 Run `npm run lint` and confirm zero errors.
- [ ] 6.3 Run `npm run design-lint` and `npm run validate-content` and confirm both pass.
- [ ] 6.4 Run `npm run build` and confirm `/about` is emitted as a static (SSG) route.
- [ ] 6.5 Run `openspec validate about-page --type change --strict` and confirm the change is valid.
