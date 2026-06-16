# Capability: projects-listing-bridge

## Purpose

The `/projects` route presents a minimal listing — a header and a grid of project cards sourced from `content/projects.json` — so visitors can browse projects and reach individual detail pages. This is a deliberate bridge: richer listing behaviour (hover states, accent line, staggered scroll animation, impact-callout styling) is owned by a separate listing story and is out of scope here.

## Requirements

### Requirement: Projects listing page

A `/projects` page SHALL present a header and a grid of project cards sourced from the projects data, so visitors can browse projects and reach individual detail pages. This is a minimal bridge; richer listing behaviour (hover states, accent line, staggered scroll animation, impact-callout styling) is owned by a separate listing story and is out of scope here.

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
