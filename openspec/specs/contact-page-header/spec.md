# Spec: contact-page-header

## Purpose

Defines the header section of the Contact page — the AccentTag label, h1 headline, grid-line background texture, and the requirement that all header content is sourced from `content/contact.json`.

## Requirements

### Requirement: contact-page-header-renders

The Contact page SHALL render a header section that identifies the page and invites the visitor to connect.

#### Scenario: visitor navigates to /contact

GIVEN a visitor loads `/contact`
WHEN the page finishes rendering
THEN an AccentTag with label "Get in touch" SHALL be visible
AND an h1 element with text "Let's work together" SHALL be visible

### Requirement: contact-page-header-grid-texture

The Contact page header SHALL display a subtle grid-line background texture that fades out toward the content area, consistent with the inner-page header pattern.

#### Scenario: header background is visible

GIVEN a visitor loads `/contact`
WHEN the page header is rendered
THEN a decorative grid-line background SHALL be present behind the header content
AND the grid SHALL fade out away from the top of the section
AND the grid SHALL be non-interactive and purely decorative (pointer-events none)

#### Scenario: grid adapts to dark theme

GIVEN the dark theme is active
WHEN a visitor loads `/contact`
THEN the grid lines SHALL remain visible using the dark-mode surface-alt color
AND the text and AccentTag SHALL remain legible against the dark background

### Requirement: contact-page-header-content-sourced-from-json

The Contact page header label and subtitle SHALL be sourced from `content/contact.json` and SHALL NOT be hardcoded in any component.

#### Scenario: header content loaded from JSON

GIVEN `content/contact.json` contains `header.label` and `header.subtitle` fields
WHEN the Contact page is server-rendered at build time
THEN the rendered header SHALL display the values from `content/contact.json`
AND no hardcoded strings SHALL appear in `ContactPage` or `PageHeader` component source
