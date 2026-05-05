## Why

Portfolio pages feel static — content below the fold appears all at once with no visual hierarchy or sense of progression. Subtle scroll-triggered animations make the reading experience feel polished and intentional, signalling craftsmanship to visitors and recruiters.

## What Changes

- Content sections and cards below the fold start hidden (invisible, slightly translated)
- Elements animate in (fade + slide up) when they enter the viewport via `IntersectionObserver`
- Animations fire once — no replay on scroll-back
- `ScrollReveal.tsx` React island wired up with `client:visible` across all pages
- Animation uses Tailwind CSS transition/opacity/translate utilities — no new dependencies

## Capabilities

### New Capabilities

- `scroll-reveal`: Viewport-triggered entry animation system — wraps content in an `IntersectionObserver`-backed component that fades/slides elements in when they enter the viewport, fires once, and does not cause layout shift

### Modified Capabilities

- `global-nav`: No requirement changes — nav is above the fold and excluded from scroll-reveal

## Impact

- `src/components/ui/ScrollReveal.tsx` — implement or extend the existing component stub
- All page `.astro` files (`index.astro`, `about.astro`, `projects.astro`, `experience.astro`, `blog/index.astro`, `contact.astro`) — wrap below-fold sections with `<ScrollReveal client:visible>`
- `src/styles/global.css` — add initial hidden state CSS if needed to prevent FOUC before JS hydrates
- No new npm dependencies — uses native `IntersectionObserver` API and Tailwind utilities
