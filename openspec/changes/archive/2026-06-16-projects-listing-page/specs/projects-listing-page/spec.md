# Capability: projects-listing-page

## ADDED Requirements

### Requirement: Projects listing page

A `/projects` page SHALL present a header and a grid of project cards sourced from the projects data, so visitors can browse projects and reach individual detail pages.

#### Scenario: Visitor browses the projects listing

GIVEN one or more projects exist in the projects data
WHEN a visitor opens the projects page
THEN a page header is shown
AND each project appears as a card

#### Scenario: Listing reflects the data source

GIVEN a project is added to the projects data
WHEN the site is rebuilt
THEN that project appears on the listing with no other change

### Requirement: Card links to detail page

Each project card SHALL link to that project's detail page and SHALL show the project's name, tagline, and year.

#### Scenario: Visitor opens a project from the listing

GIVEN a visitor on the projects listing
WHEN they activate a project card
THEN they arrive at that project's detail page

#### Scenario: Card summarises the project

GIVEN a project with a name, tagline, and year
WHEN it appears on the listing
THEN the card shows the name, tagline, and year

### Requirement: Card conveys problem, impact, and stack

Each project card SHALL present the project's problem and a visually distinct impact callout, and SHALL list the project's technology stack, so a visitor understands what was built and why it mattered without opening the detail page.

#### Scenario: Card shows the problem and impact

GIVEN a project with a problem statement and an impact statement
WHEN its card appears on the listing
THEN the card shows the problem text
AND the card shows the impact text in a callout that is labelled and visually set apart from the rest of the card

#### Scenario: Card lists the technology stack

GIVEN a project with one or more technologies in its stack
WHEN its card appears on the listing
THEN each technology is shown as a tag

### Requirement: Card source links

Each project card SHALL offer a link to the project's source repository, and SHALL offer a link to a live demo only when the project provides one.

#### Scenario: Card always links to source

GIVEN a project with a source repository
WHEN its card appears on the listing
THEN a source-repository link is shown

#### Scenario: Demo link appears only when a demo exists

GIVEN a project that provides a live demo
WHEN its card appears on the listing
THEN a live-demo link is shown alongside the source link

#### Scenario: Demo link is hidden when no demo exists

GIVEN a project that provides no live demo
WHEN its card appears on the listing
THEN no live-demo link is shown

### Requirement: Card hover treatment

When a visitor hovers a project card, the card SHALL visually respond by lifting its background, switching its border to the accent colour, and revealing an accent-coloured line along its top edge, so the hovered card is clearly distinguished.

#### Scenario: Card responds to hover

GIVEN a visitor on the projects listing using a pointer
WHEN they hover a project card
THEN the card background changes to an elevated shade
AND the card border changes to the accent colour
AND an accent-coloured line is revealed along the top edge of the card

### Requirement: Staggered scroll-in animation

Project cards SHALL fade in and slide up as they enter the viewport, with a staggered delay between successive cards.

#### Scenario: Cards animate in on scroll

GIVEN a visitor scrolling the projects listing
WHEN a card enters the viewport
THEN the card fades in and slides up into place
AND successive cards begin their animation with an increasing delay
