# Spec: Mobile Nav Menu

## Purpose

A slide-down mobile navigation panel, toggled by a hamburger button in the nav header, that gives small-viewport visitors access to all nav links, the hire-me CTA, and the theme toggle — none of which are visible in the collapsed header row on mobile.

---

## Requirements

### Requirement: Hamburger button is visible on small screens only

A hamburger toggle button SHALL appear in the nav header on viewports below the `sm` breakpoint (640 px). On viewports at or above 640 px, the button SHALL be hidden.

#### Scenario: Hamburger visible on mobile

GIVEN the visitor opens any page on a viewport narrower than 640 px
WHEN the page renders
THEN a hamburger menu button SHALL be visible in the nav header at the far right

#### Scenario: Hamburger hidden on desktop

GIVEN the visitor is on a viewport 640 px wide or wider
WHEN the page renders
THEN no hamburger menu button SHALL be visible in the nav header

---

### Requirement: Mobile menu is closed by default

When any page first renders on a mobile viewport, the mobile menu SHALL be in its closed state — the dropdown panel SHALL NOT be visible.

#### Scenario: Menu closed on page load

GIVEN the visitor opens any page on a mobile viewport
WHEN the page finishes loading
THEN the mobile menu panel SHALL NOT be visible

---

### Requirement: Hamburger toggles the mobile menu

Tapping the hamburger button SHALL open the mobile menu if it is closed. Tapping it again SHALL close the menu.

#### Scenario: Open mobile menu

GIVEN the visitor is on a mobile viewport
AND the mobile menu is closed
WHEN the visitor taps the hamburger button
THEN the mobile menu panel SHALL become visible below the nav bar

#### Scenario: Close mobile menu via hamburger

GIVEN the visitor is on a mobile viewport
AND the mobile menu is open
WHEN the visitor taps the hamburger button
THEN the mobile menu panel SHALL no longer be visible

---

### Requirement: Mobile menu contains all navigation items

The mobile menu panel SHALL contain all six nav links, the hire-me CTA, and the theme toggle control.

#### Scenario: All nav links present in mobile menu

GIVEN the visitor is on a mobile viewport
AND the mobile menu is open
WHEN the visitor views the menu panel
THEN the following links SHALL all be visible: Projects, About, Experience, Blog, Chat, Contact

#### Scenario: Hire-me CTA present in mobile menu

GIVEN the visitor is on a mobile viewport
AND the mobile menu is open
WHEN the visitor views the menu panel
THEN a hire-me CTA link SHALL be visible in the panel

#### Scenario: Theme toggle present in mobile menu

GIVEN the visitor is on a mobile viewport
AND the mobile menu is open
WHEN the visitor views the menu panel
THEN the theme toggle control SHALL be visible in the panel

---

### Requirement: Tapping a nav link in the mobile menu closes the menu

After the visitor taps a nav link inside the mobile menu, the menu SHALL close and navigation SHALL proceed.

#### Scenario: Nav link tap closes menu and navigates

GIVEN the visitor is on a mobile viewport
AND the mobile menu is open
WHEN the visitor taps any nav link in the menu
THEN the mobile menu panel SHALL close
AND the browser SHALL navigate to the corresponding page

---

### Requirement: Tapping the backdrop closes the mobile menu

A transparent backdrop SHALL be rendered behind the mobile menu panel when the menu is open. Tapping outside the panel SHALL close the menu.

#### Scenario: Backdrop tap closes menu

GIVEN the visitor is on a mobile viewport
AND the mobile menu is open
WHEN the visitor taps the backdrop area outside the menu panel
THEN the mobile menu panel SHALL close

---

### Requirement: Mobile menu is full-width and anchored below the nav bar

The mobile menu panel SHALL span the full viewport width and SHALL appear immediately below the nav bar (not overlapping it).

#### Scenario: Panel spans full width

GIVEN the visitor is on a mobile viewport
AND the mobile menu is open
WHEN the visitor views the menu panel
THEN the panel SHALL span the full viewport width
AND the panel SHALL be positioned directly below the nav bar with no gap
