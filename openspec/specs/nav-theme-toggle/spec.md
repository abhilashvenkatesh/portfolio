# nav-theme-toggle Specification

## Purpose
TBD - created by archiving change nav-light-dark-theme-toggle. Update Purpose after archive.
## Requirements
### Requirement: Theme toggle button appears in nav on every page
The nav SHALL render a theme toggle button (sun/moon icon) visible on all pages and all viewport sizes, including mobile.

#### Scenario: Toggle button present on all pages
- **WHEN** any page renders
- **THEN** the nav SHALL display the theme toggle button

#### Scenario: Mobile viewport shows toggle button
- **WHEN** the viewport width is below 640px
- **THEN** the theme toggle button SHALL remain visible in the nav alongside the logo wordmark

---

### Requirement: Toggle button switches theme instantly
Clicking the theme toggle button SHALL immediately switch the site between light and dark modes by toggling the `data-theme` attribute on the `<html>` element.

#### Scenario: Light to dark toggle
- **WHEN** the current theme is light and the user clicks the toggle button
- **THEN** `data-theme="dark"` SHALL be set on `<html>`
- **THEN** all page colours SHALL update to dark-mode tokens without a page reload

#### Scenario: Dark to light toggle
- **WHEN** the current theme is dark and the user clicks the toggle button
- **THEN** `data-theme` SHALL be removed or set to `"light"` on `<html>`
- **THEN** all page colours SHALL update to light-mode tokens without a page reload

---

### Requirement: Toggle button icon reflects the active theme
The toggle button MUST display a sun icon when the current theme is dark (indicating click switches to light) and a moon icon when the current theme is light (indicating click switches to dark).

#### Scenario: Moon icon in light mode
- **WHEN** the active theme is light
- **THEN** the toggle button SHALL display the moon icon

#### Scenario: Sun icon in dark mode
- **WHEN** the active theme is dark
- **THEN** the toggle button SHALL display the sun icon

---

### Requirement: Theme preference is persisted in localStorage
After the user toggles the theme, the preference SHALL be written to `localStorage` under the key `"theme"`. On subsequent page loads the stored value SHALL be applied before first paint.

#### Scenario: Preference survives navigation
- **WHEN** the user toggles to dark mode and navigates to another page
- **THEN** the dark theme SHALL be active on the new page without any flash

#### Scenario: Preference survives reload
- **WHEN** the user toggles to dark mode and reloads the page
- **THEN** the dark theme SHALL be active immediately (no light flash before React hydration)

---

### Requirement: Toggle button conforms to design spec
The toggle button MUST be 36×36 px, use `surface-alt` background fill, and have 8px border radius, as specified in DESIGN.md.

#### Scenario: Button dimensions and styling
- **WHEN** the toggle button is rendered
- **THEN** it SHALL be 36×36 px, fill with `--color-surface-alt`, and have 8px border radius

