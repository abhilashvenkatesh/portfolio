## Purpose

Persistent footer rendered on every page, containing a copyright line and icon links to GitHub, LinkedIn, and Email. Icon links provide hover colour feedback using the site's tertiary accent colour.

## Requirements

### Requirement: footer-rendered-on-every-page

The site SHALL render a persistent footer at the bottom of every page.

#### Scenario: visitor loads any page

GIVEN a visitor navigates to any page on the portfolio site
WHEN the page finishes loading
THEN a footer is visible at the bottom of the page
AND the footer contains a copyright line "© 2025 Abhilash" on the left side
AND the footer contains icon links for GitHub, LinkedIn, and Email

### Requirement: social-links-navigate-correctly

Each social link in the footer MUST navigate to the correct external destination.

#### Scenario: visitor clicks GitHub link

GIVEN the footer is visible
WHEN the visitor clicks the GitHub icon link
THEN a new tab opens to Abhilash's GitHub profile

#### Scenario: visitor clicks LinkedIn link

GIVEN the footer is visible
WHEN the visitor clicks the LinkedIn icon link
THEN a new tab opens to Abhilash's LinkedIn profile

#### Scenario: visitor clicks Email link

GIVEN the footer is visible
WHEN the visitor clicks the Email icon link
THEN the visitor's mail client opens with Abhilash's email address pre-filled

### Requirement: social-links-hover-colour

Each icon link in the footer SHALL change colour when hovered to provide visual feedback.

#### Scenario: visitor hovers over a social icon

GIVEN the footer is visible and a social icon link is in its default state
WHEN the visitor hovers the pointer over the icon
THEN the icon colour changes to the site's tertiary accent colour

#### Scenario: visitor moves pointer away from social icon

GIVEN a social icon link is in its hovered state
WHEN the visitor moves the pointer away from the icon
THEN the icon returns to its default colour
