## 1. CSS Foundation

- [x] 1.1 Add `.reveal` class to `src/styles/global.css` with `opacity: 0` and `transform: translateY(1rem)` and transition properties
- [x] 1.2 Add `.reveal-visible` class to `global.css` with `opacity: 1` and `transform: translateY(0)`
- [x] 1.3 Add `@media (prefers-reduced-motion: reduce)` rule to disable transitions on `.reveal` and `.reveal-visible`

## 2. ScrollReveal Component

- [x] 2.1 Implement `src/components/ui/ScrollReveal.tsx` — wrapper `<div>` that applies `.reveal` class and accepts `children` and optional `className` props
- [x] 2.2 Add `useEffect` that creates `IntersectionObserver`, adds `.reveal-visible` on intersection, then calls `unobserve` on the target
- [x] 2.3 Export the component with correct TypeScript props type (`{ children: React.ReactNode; className?: string }`)

## 3. Wire Up Pages

- [x] 3.1 Wrap below-fold sections in `src/pages/index.astro` with `<ScrollReveal client:visible>`
- [x] 3.2 Wrap below-fold sections in `src/pages/about.astro` with `<ScrollReveal client:visible>`
- [x] 3.3 Wrap below-fold sections in `src/pages/projects.astro` with `<ScrollReveal client:visible>`
- [x] 3.4 Wrap below-fold sections in `src/pages/experience.astro` with `<ScrollReveal client:visible>`
- [x] 3.5 Wrap below-fold sections in `src/pages/blog/index.astro` with `<ScrollReveal client:visible>`
- [x] 3.6 Wrap below-fold sections in `src/pages/contact.astro` with `<ScrollReveal client:visible>`

## 4. Verify

- [ ] 4.1 Run `npm run dev` and confirm content below the fold starts hidden and animates in on scroll
- [ ] 4.2 Confirm scrolling back up and down does not re-trigger animation
- [x] 4.3 Run `npx astro check` — zero type errors
- [x] 4.4 Run `npm test` — all existing tests pass (no test script yet; will apply when tests added)
- [x] 4.5 Run `npm run build` — build succeeds with no errors
