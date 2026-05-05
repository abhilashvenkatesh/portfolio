# Spec: Global Navigation

## Purpose

TBD — global navigation bar present on every page of the portfolio, including site name, page links, active-link highlighting, theme toggle, and mobile responsiveness.

## Requirements

### Requirement: Nav bar appears on every page
The nav bar SHALL be rendered at the top of every page in the portfolio. It SHALL be included in `Base.astro` so all pages inherit it automatically without per-page configuration.

#### Scenario: Nav visible on home page
- **WHEN** a visitor loads the home page (`/`)
- **THEN** the nav bar is visible at the top of the page

#### Scenario: Nav visible on all section pages
- **WHEN** a visitor loads any page (About, Projects, Experience, Blog, Contact)
- **THEN** the nav bar is visible at the top of that page

### Requirement: Nav bar is sticky
The nav bar SHALL remain visible at the top of the viewport when the user scrolls down a page.

#### Scenario: Sticky on scroll
- **WHEN** a visitor scrolls down a long page
- **THEN** the nav bar remains fixed at the top of the viewport

### Requirement: Nav bar displays site name and page links
The nav bar SHALL display the site owner's name on the left side and navigation links on the right side. Links SHALL point to: Home (`/`), About (`/about`), Projects (`/projects`), Experience (`/experience`), Blog (`/blog`), Contact (`/contact`).

#### Scenario: Site name visible
- **WHEN** a visitor views the nav bar
- **THEN** the site owner's name is displayed on the left

#### Scenario: All six nav links present
- **WHEN** a visitor views the nav bar
- **THEN** links to Home, About, Projects, Experience, Blog, and Contact are all visible

### Requirement: Active page link is visually highlighted
The nav link corresponding to the current page SHALL be visually distinguished from inactive links (e.g., different color, underline, or font weight).

#### Scenario: Active link highlighted
- **WHEN** a visitor is on the Projects page
- **THEN** the Projects nav link appears visually distinct from the other links

#### Scenario: Only one link active at a time
- **WHEN** a visitor is on any page
- **THEN** exactly one nav link is highlighted as active

### Requirement: Theme toggle switches between light and dark mode
The nav bar SHALL include a toggle button that switches the site between light and dark visual themes. The toggle SHALL apply the `dark` class to the `<html>` element to activate Tailwind dark-mode variants.

#### Scenario: Toggle to dark mode
- **WHEN** a visitor clicks the theme toggle while in light mode
- **THEN** the site switches to dark mode (dark class added to `<html>`)

#### Scenario: Toggle back to light mode
- **WHEN** a visitor clicks the theme toggle while in dark mode
- **THEN** the site switches to light mode (dark class removed from `<html>`)

### Requirement: Selected theme persists across page reloads
The chosen theme SHALL be stored in `localStorage` under the key `portfolio-theme`. On page load, the stored theme SHALL be applied before the page is rendered to avoid a flash of the wrong theme.

#### Scenario: Dark mode persists after reload
- **WHEN** a visitor selects dark mode and reloads the page
- **THEN** the site loads in dark mode without a light-mode flash

#### Scenario: Light mode persists after reload
- **WHEN** a visitor selects light mode and reloads the page
- **THEN** the site loads in light mode

#### Scenario: First visit respects system preference
- **WHEN** a visitor has no stored theme preference
- **THEN** the site uses the system `prefers-color-scheme` setting, falling back to light mode

### Requirement: Mobile-responsive navigation
The nav bar SHALL adapt to narrow viewports. On small screens, page links SHALL be hidden behind a hamburger menu button. On medium and larger screens (`md:` breakpoint), links SHALL always be visible.

#### Scenario: Hamburger visible on mobile
- **WHEN** a visitor views the site on a narrow viewport (< md breakpoint)
- **THEN** a hamburger menu button is visible and page links are hidden

#### Scenario: Menu opens on tap
- **WHEN** a visitor taps the hamburger button on mobile
- **THEN** the page links expand and become visible

#### Scenario: Links always visible on desktop
- **WHEN** a visitor views the site on a medium or larger viewport
- **THEN** all nav links are visible without needing to open a menu
