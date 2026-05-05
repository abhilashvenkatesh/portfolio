## Context

`ScrollReveal.tsx` already exists as a React island stub in `src/components/ui/`. The architecture doc specifies it uses `IntersectionObserver` to toggle CSS classes. Currently, content below the fold appears immediately with no animation — the component is either empty or not wired up to pages.

The constraint is Tailwind CSS 4.x (no config file), static output, and `client:visible` directive — meaning the island only hydrates when the element enters the viewport. Initial hidden state must be CSS-only to avoid layout shift before JS loads.

## Goals / Non-Goals

**Goals:**
- Fade + slide-up entry animation on below-fold content sections and cards
- Single-fire: animation triggers once per element, never replays on scroll-back
- Zero layout shift: hidden state via CSS opacity + transform (not `display:none` or `visibility:hidden`)
- Works across all pages without per-page configuration
- No new npm dependencies

**Non-Goals:**
- Stagger delays between individual list items within a section (too distracting for a portfolio)
- Parallax or scroll-speed-tied animations
- Animation on elements above the fold (nav, hero)
- Reduced-motion handling beyond `prefers-reduced-motion` CSS media query

## Decisions

### Decision: CSS initial state via global class, toggled by JS

**Chosen**: Add a `.reveal` CSS class in `global.css` that sets `opacity: 0; transform: translateY(1rem)`. `ScrollReveal.tsx` adds a `.reveal-visible` class when the observer fires, which transitions to `opacity: 1; transform: translateY(0)`. The `IntersectionObserver` uses `once: true` semantics (`observer.unobserve(entry.target)` after first intersection).

**Alternative considered**: Tailwind inline classes toggled by React state. Rejected — Tailwind 4.x purges classes not present in source; dynamically computed class strings are unreliable without safelisting.

**Why CSS classes**: Explicit CSS classes are always in the stylesheet regardless of dynamic toggling, and the initial hidden state is applied before JS hydrates, preventing flash of visible unstyled content.

### Decision: `client:visible` directive on `ScrollReveal`

**Chosen**: Keep `client:visible` as the hydration strategy. Astro defers hydration until the element enters the viewport — semantically correct for a scroll-reveal component.

**Alternative considered**: `client:idle`. Rejected — idle fires on page load during browser idle time, not viewport entry. Content near the top of long pages could animate before scrolled to.

### Decision: Wrapper component pattern (not HOC or hook)

**Chosen**: `<ScrollReveal>` wraps children as a `<div>` with the reveal class. Usage:

```astro
<ScrollReveal client:visible>
  <section>...</section>
</ScrollReveal>
```

**Alternative considered**: A custom hook `useScrollReveal(ref)`. Rejected — hooks require the consumer to manage refs and apply classes manually; wrapper is simpler to use in `.astro` files.

### Decision: `prefers-reduced-motion` via CSS only

Apply `@media (prefers-reduced-motion: reduce)` in `global.css` to disable transitions on `.reveal` and `.reveal-visible`. The component fires and removes the observer regardless — only the visual transition is suppressed.

## Risks / Trade-offs

- **SSR/hydration gap**: Between page load and React hydration, `.reveal` elements are invisible. If JS fails or is blocked, content stays hidden. → Mitigation: keep animation duration short (≤400ms) and ensure content is meaningful without animation. Add `noscript` fallback via CSS if needed (`@media scripting: none { .reveal { opacity: 1; transform: none; } }`).
- **`client:visible` double-trigger**: Astro's `client:visible` uses its own `IntersectionObserver` to hydrate the island. The component then sets up a second observer for the reveal. This means two observers per `ScrollReveal` instance. → Acceptable — the Astro observer fires once and disconnects; the reveal observer also fires once then unobserves.
- **Tailwind 4.x utility purging**: Custom transition durations or easing not in source files will be purged. → Use only standard Tailwind utilities (`transition`, `duration-300`, `ease-out`) or define animation entirely in CSS classes in `global.css`.
