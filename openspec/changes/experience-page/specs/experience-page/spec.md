# Capability: experience-page

## ADDED Requirements

### Requirement: Page header

The `/experience` route SHALL present a page header identifying the page, with the accent label "Experience" and the subtitle "Where I've worked", over a subtle grid-line background that fades toward the content.

#### Scenario: Header is shown on the Experience page

GIVEN a visitor opens `/experience`
WHEN the page loads
THEN the accent label "Experience" is displayed
AND the subtitle "Where I've worked" is displayed
AND a subtle grid-line background pattern appears in the header area, fading out toward the content

### Requirement: Vertical timeline layout

The Experience page SHALL display work history as a vertical timeline with a continuous line on the left, and each role entry SHALL have a circular marker on that line. The marker for the most-recent role SHALL be visually distinguished with the accent colour and a glow/ring effect; markers for past roles SHALL use a neutral fill.

#### Scenario: Timeline with continuous line and markers

GIVEN a visitor is on the Experience page
WHEN the page loads
THEN a continuous vertical line appears on the left of the entries
AND each role entry has a circular marker positioned on the line

#### Scenario: Most-recent role marker is distinguished

GIVEN the timeline lists roles most-recent-first
WHEN the page loads
THEN the first (most-recent) role's marker is rendered in the accent colour with a glow/ring effect
AND the remaining roles' markers use a neutral fill

### Requirement: Role entry details

Each timeline entry SHALL display the job title (bold), the company name (accent colour), the date range as a pill badge, and a bullet-point list of key responsibilities/achievements. Entries SHALL appear most-recent-first in the order defined by the content source, and entry content SHALL be data-driven, not hardcoded in the component.

#### Scenario: Entry shows role details

GIVEN a visitor reads a timeline entry
WHEN the entry is displayed
THEN the job title is shown in bold
AND the company name is shown in the accent colour
AND the date range is shown as a pill badge
AND a bullet-point list of responsibilities/achievements is shown

#### Scenario: Entries are data-driven and ordered most-recent-first

GIVEN the role entries are defined in `content/experience.json`
WHEN the Experience page is built
THEN the rendered entries match the content file in the order defined there (most-recent-first)
AND no role content is hardcoded in the page component

### Requirement: Scroll-triggered timeline animation

Each timeline entry SHALL fade in as it enters the viewport, staggered from top to bottom. Where the visitor prefers reduced motion, the staggered transform SHALL be disabled.

#### Scenario: Entries fade in while scrolling

GIVEN a visitor scrolls down the Experience page
WHEN an entry enters the viewport
THEN the entry fades into view
AND entries reveal in a staggered sequence from top to bottom

### Requirement: Download résumé CTA

The Experience page SHALL present a card at the bottom of the timeline reading "Want the full picture?" with a "Download résumé" button. Clicking the button SHALL download the PDF résumé to the visitor's device, and the button SHALL dim slightly on hover.

#### Scenario: CTA card is shown at the bottom

GIVEN a visitor scrolls to the end of the timeline
WHEN the bottom of the page is reached
THEN a card reading "Want the full picture?" is displayed
AND it contains a "Download résumé" button

#### Scenario: Visitor downloads the résumé

GIVEN a visitor is on the Experience page
WHEN the visitor clicks the "Download résumé" button
THEN the PDF résumé file is downloaded to the visitor's device

#### Scenario: Résumé button dims on hover

GIVEN a visitor is on the Experience page
WHEN the visitor hovers over the "Download résumé" button
THEN the button dims slightly
