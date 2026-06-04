# Capability: browse-navigation-hints

## Purpose

The hero section provides "or browse" navigation hints below the suggestion chips, offering accent-coloured links to main content pages so visitors can quickly navigate to projects, experience, or contact without using the main nav.

## Requirements

### Requirement: browse-hints-rendered

The hero section SHALL render a "or browse" navigation hint line below the suggestion chips, containing accent-coloured links to the main content pages.

#### Scenario: browse hints visible below suggestion chips

GIVEN the home page is loaded
WHEN the hero section renders
THEN a line reading "or browse" followed by links "projects", "experience", and "contact" SHALL be visible below the suggestion chips
AND the links SHALL be styled in the accent colour (`text-tertiary`)
AND the "or browse" label SHALL be styled in secondary text colour
AND middle-dot separators SHALL appear between each link

### Requirement: browse-hints-navigation

Each browse hint link SHALL navigate to its corresponding page.

#### Scenario: projects link navigates to /projects

GIVEN the browse hints are visible
WHEN the visitor clicks "projects"
THEN the browser SHALL navigate to `/projects`

#### Scenario: experience link navigates to /experience

GIVEN the browse hints are visible
WHEN the visitor clicks "experience"
THEN the browser SHALL navigate to `/experience`

#### Scenario: contact link navigates to /contact

GIVEN the browse hints are visible
WHEN the visitor clicks "contact"
THEN the browser SHALL navigate to `/contact`
