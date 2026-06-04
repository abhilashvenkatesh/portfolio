# Spec: Persistent Navigation

## Purpose

A fixed navigation bar that remains visible at all times, covers all primary page sections, indicates the active page, and respects the site's light/dark theme.

---
## Requirements
### Requirement: Nav bar is always visible while scrolling
The nav bar SHALL be fixed to the top of the viewport at all times. Scrolling the page SHALL NOT cause the nav bar to leave the visible area.

#### Scenario: User scrolls down on a long page
- **WHEN** the user scrolls more than 100px down any page
- **THEN** the nav bar SHALL remain at the top of the viewport, fully visible

#### Scenario: Nav bar does not overlap page content
- **WHEN** the nav bar is rendered
- **THEN** the page content area SHALL begin below the nav bar (no content hidden behind it)

---

### Requirement: Nav links cover all primary sections
The nav bar SHALL contain exactly the following links in order: Projects, About, Experience, Blog, Chat, Contact. Each link SHALL navigate to its corresponding page route.

#### Scenario: All links present
- **WHEN** any page renders
- **THEN** the nav bar SHALL display all six links: Projects, About, Experience, Blog, Chat, Contact

#### Scenario: Links navigate correctly
- **WHEN** the user clicks a nav link
- **THEN** the browser SHALL navigate to the corresponding page without full reload (Next.js client navigation)

---

### Requirement: Active page link is visually distinguished
The nav link corresponding to the current page SHALL be visually distinct from inactive links using the `nav-link-active` design token (surface-alt background, primary text colour).

#### Scenario: Active state on current page
- **WHEN** the user is on the `/projects` page
- **THEN** the "Projects" nav link SHALL have the `nav-link-active` visual style applied
- **THEN** all other nav links SHALL have the default `nav-link` style

#### Scenario: Active state updates on navigation
- **WHEN** the user navigates from `/projects` to `/blog`
- **THEN** the "Blog" nav link SHALL have `nav-link-active` style
- **THEN** the "Projects" nav link SHALL revert to `nav-link` style

---

### Requirement: Nav respects the active theme
The nav bar SHALL render correctly in both light (default) and dark (`[data-theme="dark"]`) modes using the design system colour tokens. No hardcoded hex values SHALL appear in the component.

#### Scenario: Dark mode nav
- **WHEN** `data-theme="dark"` is set on the `<html>` element
- **THEN** the nav bar background, link text, and active link colours SHALL all use their dark-mode token overrides

---

### Requirement: Nav header layout is responsive to viewport width

The nav header layout SHALL adapt to viewport width. On viewports at or above the `sm` breakpoint (640 px), the header SHALL render four visible flex children in order: logo wordmark (left), nav links (centre), theme toggle button, hire-me CTA anchor (far right). The hire-me CTA and theme toggle SHALL be siblings of `<nav>`, not children. On viewports below 640 px, the header SHALL render two visible children: logo wordmark (left) and hamburger button (right); the nav links, theme toggle, and hire-me CTA SHALL be visually hidden from the header row and accessible only via the mobile menu panel.

#### Scenario: Header four-child layout on desktop

- **WHEN** any page renders on a viewport 640 px wide or wider
- **THEN** the `<header>` SHALL display the logo link, the `<nav>` element, the theme toggle button, and the hire-me CTA anchor — all visible
- **THEN** the theme toggle button SHALL appear between the nav links and the hire-me CTA
- **THEN** the hire-me CTA SHALL appear at the far right

#### Scenario: Header two-child layout on mobile

- **WHEN** any page renders on a viewport narrower than 640 px
- **THEN** the `<header>` SHALL display only two visible items: the logo wordmark on the left and the hamburger button on the right
- **THEN** the nav links, theme toggle, and hire-me CTA SHALL NOT be visible in the header row

#### Scenario: Nav links hidden from header on mobile

- **WHEN** the visitor is on a viewport narrower than 640 px
- **THEN** the six page-navigation links SHALL NOT be visible in the nav header row
- **THEN** those same links SHALL be accessible via the mobile menu

#### Scenario: Theme toggle hidden from header on mobile

- **WHEN** the visitor is on a viewport narrower than 640 px
- **THEN** the theme toggle button SHALL NOT be visible in the nav header row
- **THEN** the theme toggle SHALL be accessible via the mobile menu

#### Scenario: Hire-me CTA hidden from header on mobile

- **WHEN** the visitor is on a viewport narrower than 640 px
- **THEN** the hire-me CTA SHALL NOT be visible in the nav header row
- **THEN** the hire-me CTA SHALL be accessible via the mobile menu

### Requirement: Logo wordmark navigates to home page

The nav bar SHALL display the "abhilash" text wordmark in the top-left, styled as a link. Clicking it SHALL navigate to the home page (`/`) using client-side navigation.

#### Scenario: Logo present on every page

- **WHEN** any page renders
- **THEN** the nav bar SHALL display "abhilash" in the top-left, visually distinct from nav links (monospace font, tertiary/accent colour)

#### Scenario: Logo navigates home

- **WHEN** the user clicks the "abhilash" wordmark
- **THEN** the browser SHALL navigate to `/` without a full page reload (Next.js client navigation)

#### Scenario: Logo has no active-link state

- **WHEN** the user is on the home page (`/`)
- **THEN** the "abhilash" wordmark SHALL NOT receive `nav-link-active` styling (active state applies only to the six page-section links)

---

### Requirement: Nav applies frosted-glass blur effect when scrolled
When the visitor has scrolled below the top of the page, the nav bar SHALL apply a frosted-glass visual effect via `backdrop-blur` and a semi-transparent background. When the visitor is at the top of the page (scroll position 0), the nav bar SHALL revert to its default transparent background with no blur.

#### Scenario: Blur applied after scrolling down
- **WHEN** the user scrolls more than 0px down any page
- **THEN** the nav bar SHALL apply a `backdrop-filter: blur(...)` and a semi-transparent background colour

#### Scenario: Blur removed when back at top
- **WHEN** the user scrolls back to the top of the page (scrollY === 0)
- **THEN** the nav bar SHALL remove the blur and semi-transparent background, restoring its default appearance

---

### Requirement: Nav border-bottom is visible when scrolled
When the frosted-glass effect is active, the nav bar SHALL display a visible border-bottom to separate it from page content below. When at the top of the page, the border-bottom SHALL be transparent or absent.

#### Scenario: Border visible when scrolled
- **WHEN** the user has scrolled below the top of the page
- **THEN** the nav bar SHALL show a visible border-bottom using the appropriate design-system border token

#### Scenario: Border hidden at top
- **WHEN** the user is at the top of the page (scrollY === 0)
- **THEN** the nav bar border-bottom SHALL be transparent or not rendered

