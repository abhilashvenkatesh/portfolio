## Purpose

Defines behaviour for the `ScrollReveal` React island — a scroll-triggered entry animation applied to below-fold content sections across all portfolio pages. Content starts hidden and fades/slides into view when it enters the viewport, firing once per element.

---

## Requirements

### Requirement: Elements below the fold start hidden

Content wrapped in `ScrollReveal` SHALL be visually hidden on initial page load via CSS opacity and transform, before JavaScript hydrates, so there is no flash of visible content that then disappears.

#### Scenario: Initial hidden state before hydration

- **WHEN** the page HTML is rendered with `<ScrollReveal client:visible>` wrapping a section
- **THEN** the wrapper element SHALL have `opacity: 0` and a translateY offset applied via CSS class before React hydrates

#### Scenario: No layout shift from hidden state

- **WHEN** the `.reveal` initial state is applied
- **THEN** the element SHALL occupy its full space in the document flow (no `display:none` or `height:0`)

---

### Requirement: Elements animate in on viewport entry

`ScrollReveal` SHALL observe wrapped content with `IntersectionObserver` and add a visible CSS class when the element intersects the viewport, triggering a fade-in and upward slide transition.

#### Scenario: Animation fires on scroll into view

- **WHEN** a `.reveal` element enters the browser viewport
- **THEN** the element SHALL transition to `opacity: 1` and `transform: translateY(0)` within ≤400ms

#### Scenario: Animation uses fade and slide

- **WHEN** the reveal transition plays
- **THEN** opacity SHALL animate from 0 to 1 and vertical translation SHALL animate from a positive offset to 0 (slide up into place)

---

### Requirement: Animation fires once only

The reveal animation SHALL fire a maximum of one time per element per page load. Scrolling back up past the element and then down again SHALL NOT re-trigger the animation.

#### Scenario: No replay on scroll-back

- **WHEN** an element has already revealed (`.reveal-visible` applied)
- **AND** the user scrolls back above it and then scrolls down again
- **THEN** the element SHALL remain fully visible with no re-animation

#### Scenario: Observer disconnects after fire

- **WHEN** the `IntersectionObserver` callback fires for an element
- **THEN** `observer.unobserve(element)` SHALL be called immediately so the observer no longer tracks that element

---

### Requirement: Reduced motion respected

On systems where `prefers-reduced-motion: reduce` is set, scroll-reveal transitions SHALL be disabled so content is immediately visible without animation.

#### Scenario: No animation in reduced-motion mode

- **WHEN** the user's OS/browser reports `prefers-reduced-motion: reduce`
- **THEN** `.reveal` elements SHALL be immediately visible (no opacity or transform animation)
- **AND** the IntersectionObserver SHALL still fire and apply `.reveal-visible` (functional, just not animated)

---

### Requirement: ScrollReveal applied across all pages

Every page in the portfolio SHALL wrap its below-fold content sections with `<ScrollReveal client:visible>` so the animation is consistent site-wide.

#### Scenario: All pages include ScrollReveal

- **WHEN** any portfolio page is loaded (index, about, projects, experience, blog index, contact)
- **THEN** at least one `ScrollReveal` island SHALL be present wrapping content that is below the initial viewport

#### Scenario: Nav and hero excluded

- **WHEN** the page loads
- **THEN** the global navigation and the primary hero/above-fold section SHALL NOT be wrapped in `ScrollReveal` (they are immediately visible)
