## Purpose

Decorative background texture for the home page hero section, comprising a subtle grid line pattern and a soft radial glow. Both layers sit behind all hero content and are purely visual — they must not interfere with interactivity or legibility.

## Requirements

### Requirement: hero-grid-pattern

A subtle grid line pattern SHALL appear as a decorative background layer inside the home page hero section, behind all content.

#### Scenario: Grid pattern renders behind hero content

GIVEN a visitor navigates to the home page
WHEN the hero section renders
THEN a grid line pattern SHALL be visible as a background texture behind the hero content
AND the grid SHALL fade out toward the edges and bottom of the section so it does not form a hard boundary
AND the grid SHALL NOT obscure or compete with the headline, subheading, description, or any other hero content

#### Scenario: Grid pattern has no interactive behaviour

GIVEN the hero section is visible
WHEN a visitor interacts with any element in the hero
THEN the grid background SHALL NOT intercept pointer events
AND all interactive elements (links, buttons, chat launcher) SHALL remain fully functional

---

### Requirement: hero-radial-glow

A soft radial glow SHALL appear as a decorative background layer inside the home page hero section, centred behind the headline area.

#### Scenario: Radial glow renders at low opacity

GIVEN a visitor navigates to the home page
WHEN the hero section renders
THEN a blurred elliptical glow in the site accent colour SHALL be visible at low opacity behind the hero headline
AND the glow SHALL NOT obscure or compete with any text content
AND the glow SHALL NOT intercept pointer events

#### Scenario: Glow respects theme

GIVEN the site is viewed in either light or dark theme
WHEN the hero section renders
THEN the radial glow SHALL remain visually appropriate and subtle in both themes without requiring a theme-specific override
