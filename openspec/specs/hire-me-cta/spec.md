# Spec: Hire-me CTA

## Purpose

A "Hire me" call-to-action anchor rendered in the nav header on every page, positioned to the far right of the header as a sibling of the `<nav>` element. Clicking it opens the visitor's email client pre-addressed to the site owner with the subject "Hire me". The email address is sourced from `content/contact.json` at build time and never hardcoded.

---

## Requirements

### Requirement: Hire-me CTA is visible on every page
The nav header SHALL render a "Hire me" anchor on every page, positioned as a sibling to the `<nav>` element (not inside it), anchored to the right end of the header.

#### Scenario: CTA present on all pages
- **WHEN** any page renders
- **THEN** the header SHALL display a "Hire me" anchor styled as `button-secondary`, visible alongside but separate from the nav links

#### Scenario: CTA is not a nav link
- **WHEN** the nav bar renders
- **THEN** the "Hire me" anchor SHALL NOT appear inside the `<nav>` element
- **THEN** the six page-navigation links (Projects, About, Experience, Blog, Chat, Contact) SHALL remain unchanged

---

### Requirement: CTA opens mailto with pre-filled address and subject
Clicking the "Hire me" anchor SHALL open the visitor's email client pre-addressed to the site owner's email with subject `Hire me`. No page navigation SHALL occur.

#### Scenario: Click opens email client
- **WHEN** the visitor clicks the "Hire me" anchor
- **THEN** the browser SHALL open the visitor's default email client
- **THEN** the To field SHALL be pre-filled with the email from `content/contact.json`
- **THEN** the Subject field SHALL be pre-filled with `Hire me`

---

### Requirement: CTA email is read from content/contact.json at build time
The "Hire me" anchor href SHALL be constructed from the `email` field in `content/contact.json` via `getContact()` in `lib/content.ts`. No email address SHALL be hardcoded in any component.

#### Scenario: Email sourced from content file
- **WHEN** the nav component renders at build time
- **THEN** the mailto href SHALL use the value of `email` from `content/contact.json`
- **THEN** changing the email in `content/contact.json` and rebuilding SHALL update the href without any component code changes

---

### Requirement: CTA hover applies accent-dim background fill
Hovering over the "Hire me" anchor SHALL apply the `button-secondary-hover` design token: `accent-dim` background fill with `tertiary` text colour, transitioning over 0.2s.

#### Scenario: Hover fill visible
- **WHEN** the visitor hovers the "Hire me" anchor
- **THEN** the background SHALL fill with `accent-dim` colour
- **THEN** the text colour SHALL remain `tertiary`
- **THEN** the transition SHALL complete in 0.2s

#### Scenario: No fill at rest
- **WHEN** the visitor is not hovering the "Hire me" anchor
- **THEN** the background SHALL be transparent
