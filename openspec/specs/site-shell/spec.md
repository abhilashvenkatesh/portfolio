# Capability: site-shell

## Purpose

Defines the persistent chrome shared across all pages: fixed navigation bar, wordmark, "Hire me" CTA, theme toggle with localStorage persistence, scroll-triggered frosted-glass blur, footer with social links, PageHeader SVG grid texture, and the anti-flash inline script.

## Requirements

### Requirement: Navigation bar SHALL be fixed and visible on every page

A fixed navigation bar SHALL appear at the top of every page at all times, giving visitors access to all primary sections without scrolling.

#### Scenario: Nav bar is visible on initial page load

GIVEN a visitor opens any page of the portfolio
WHEN the page renders
THEN a navigation bar is visible at the top of the viewport
AND it contains links to Projects, About, Experience, Blog, Chat, and Contact

#### Scenario: Nav bar stays visible while scrolling

GIVEN a visitor is on a page with content taller than the viewport
WHEN the visitor scrolls down
THEN the navigation bar remains fixed at the top of the viewport

#### Scenario: Active page link is visually distinguished

GIVEN a visitor is on the Projects page
WHEN the navigation bar renders
THEN the "Projects" link has a distinct background fill and medium font weight
AND all other links have no background fill

---

### Requirement: Wordmark MUST link to the home page

The "abhilash" wordmark in the top-left of the nav MUST be a link to the home page (`/`).

#### Scenario: Clicking wordmark navigates home

GIVEN a visitor is on the Experience page
WHEN they click the "abhilash" wordmark in the top-left of the nav
THEN they are navigated to the home page (`/`)

---

### Requirement: "Hire me" button SHALL open a pre-addressed email client

The "Hire me" button in the nav SHALL open the visitor's email client pre-addressed to the contact email sourced from `content/contact.json`.

#### Scenario: Hire me button opens mailto link

GIVEN `content/contact.json` contains `email: "abhilashfeb30@gmail.com"`
WHEN a visitor clicks the "Hire me" button in the nav
THEN their default email client opens with `to:` pre-filled as `abhilashfeb30@gmail.com`

#### Scenario: Hire me button shows hover fill

GIVEN a visitor views the "Hire me" button
WHEN they hover over it
THEN the button shows a subtle background fill

---

### Requirement: Theme toggle MUST switch and persist light/dark preference

The theme toggle MUST switch all page colours between light and dark modes instantly, and MUST persist the preference across sessions via `localStorage`.

#### Scenario: Clicking toggle switches to dark mode

GIVEN the current theme is light (default)
WHEN the visitor clicks the sun/moon toggle in the nav
THEN all page colours switch to the dark palette immediately with no page reload

#### Scenario: Clicking toggle switches back to light mode

GIVEN the current theme is dark
WHEN the visitor clicks the toggle
THEN all page colours switch to the light palette immediately

#### Scenario: Theme preference persists across navigation

GIVEN the visitor has switched to dark mode
WHEN they navigate to a different page
THEN the dark theme remains active without any flash of light-mode content

#### Scenario: Theme preference persists across browser sessions

GIVEN the visitor set dark mode and closed the browser tab
WHEN they reopen the portfolio in the same browser
THEN the dark theme is applied before the page renders (no flash)

---

### Requirement: Nav background SHALL apply frosted-glass blur after scrolling 40px

The nav background SHALL apply a frosted-glass blur effect when the visitor scrolls more than 40px, visually separating it from page content.

#### Scenario: Blur activates on scroll past threshold

GIVEN the visitor is at the top of a page (scroll position 0)
WHEN they scroll down more than 40px
THEN the nav background shows a frosted-glass blur (`backdrop-filter: blur(12px)`) and semi-transparent neutral background

#### Scenario: Blur deactivates when scrolled back to top

GIVEN blur is active because the visitor scrolled down
WHEN they scroll back to the top of the page (within 40px)
THEN the blur effect is removed and the nav background returns to its default (transparent / non-blurred) state

#### Scenario: Nav border-bottom remains visible at all scroll positions

GIVEN any scroll position
WHEN the nav bar is visible
THEN the nav border-bottom is always present to visually separate nav from content

---

### Requirement: Footer SHALL appear on every page with social links and copyright

A footer SHALL appear at the bottom of every page with icon links to GitHub, LinkedIn, and Email, and MUST include a copyright line.

#### Scenario: Footer renders on all pages

GIVEN a visitor views any page of the portfolio
WHEN the page renders
THEN a footer is visible at the bottom containing GitHub, LinkedIn, and Email icon links and the text "© 2025 Abhilash"

#### Scenario: Footer icon links change colour on hover

GIVEN a visitor views the footer
WHEN they hover over the GitHub, LinkedIn, or Email icon
THEN the icon changes to the accent colour

#### Scenario: Footer email link opens email client

GIVEN a visitor clicks the Email icon in the footer
WHEN clicked
THEN their email client opens pre-addressed to Abhilash's email

---

### Requirement: PageHeader component MUST render an SVG grid-line background texture

The `PageHeader` component MUST render a subtle SVG grid-line background pattern that fades out toward the content below using a radial-gradient mask.

#### Scenario: Grid texture appears on inner-page headers

GIVEN a visitor views the About page header
WHEN the `PageHeader` component renders
THEN a subtle grid-line SVG pattern is visible behind the header text
AND the pattern fades out toward the bottom using a radial-gradient mask

#### Scenario: Grid texture does not appear in non-header content areas

GIVEN a visitor views the projects card grid on the Projects page
WHEN the page renders
THEN no grid-line background texture appears behind the project cards

---

### Requirement: Anti-flash script SHALL set data-theme before React hydration

An inline script in `<head>` SHALL read `localStorage` and set `data-theme` on `<html>` before React hydration so visitors with a saved dark preference never see a flash of the light theme.

#### Scenario: Dark preference set with no flash

GIVEN the visitor previously saved dark mode preference to `localStorage`
WHEN the page begins rendering (before hydration)
THEN `data-theme="dark"` is set on the `<html>` element before any visible paint

#### Scenario: No saved preference defaults to system preference

GIVEN no `theme` key exists in `localStorage`
WHEN the anti-flash script runs
THEN `data-theme` is set based on `prefers-color-scheme` media query before first paint

---

### Requirement: Mobile viewports SHALL expose all navigation via a hamburger-triggered drawer

Below the 640px breakpoint the desktop navigation links are not shown. The navigation bar SHALL instead present a hamburger trigger that opens a drawer giving access to every destination available on desktop, so mobile visitors are never stranded without navigation. (Closes NAV-6.)

#### Scenario: Hamburger replaces inline links on small viewports

GIVEN a visitor on a viewport narrower than 640px
WHEN any page loads
THEN the inline desktop nav links are not visible
AND a hamburger trigger is visible in the navigation bar
AND the navigation bar shows only the wordmark and the hamburger trigger

#### Scenario: Desktop layout is unaffected

GIVEN a visitor on a viewport 640px or wider
WHEN any page loads
THEN the inline desktop nav links, theme toggle, and Hire me button are visible in the bar
AND no hamburger trigger is shown

#### Scenario: Opening the drawer reveals every destination

GIVEN a visitor on a viewport narrower than 640px
WHEN they activate the hamburger trigger
THEN a drawer opens containing links to Projects, About, Experience, Blog, Chat, and Contact
AND the drawer contains the Hire me action
AND the drawer contains the light/dark theme toggle
AND a dimmed backdrop covers the page behind the drawer

#### Scenario: Theme toggle works from within the drawer

GIVEN the mobile drawer is open
WHEN the visitor activates the theme toggle inside the drawer
THEN the active theme switches between light and dark
AND the preference persists across page loads

---

### Requirement: The mobile navigation drawer SHALL be dismissible and accessible

The drawer SHALL be closeable through every conventional gesture and SHALL meet keyboard and assistive-technology expectations while open.

#### Scenario: Dismiss by selecting a link

GIVEN the mobile drawer is open
WHEN the visitor selects any navigation link
THEN the app navigates to that destination
AND the drawer closes

#### Scenario: Dismiss by tapping the backdrop

GIVEN the mobile drawer is open
WHEN the visitor taps the dimmed backdrop outside the drawer panel
THEN the drawer closes
AND no navigation occurs

#### Scenario: Dismiss with the Escape key

GIVEN the mobile drawer is open
WHEN the visitor presses the Escape key
THEN the drawer closes
AND keyboard focus returns to the hamburger trigger

#### Scenario: Auto-close when returning to desktop width

GIVEN the mobile drawer is open
WHEN the viewport is resized to 640px or wider
THEN the drawer closes
AND the desktop navigation bar is shown

#### Scenario: Focus and scroll are managed while open

GIVEN the mobile drawer is open
THEN keyboard focus is trapped within the drawer
AND background page scrolling is locked
AND the hamburger trigger exposes its expanded state to assistive technology
