# Capability: site-shell

## MODIFIED Requirements

### Requirement: Wordmark MUST link to the home page

The wordmark in the top-left of the nav MUST be a link to the home page (`/`). The wordmark text MUST derive from `identity.firstName.toLowerCase()` sourced from `content/identity.json` — it MUST NOT be hardcoded.

#### Scenario: Clicking wordmark navigates home

GIVEN a visitor is on the Experience page
WHEN they click the wordmark in the top-left of the nav
THEN they are navigated to the home page (`/`)

#### Scenario: Wordmark text reflects identity configuration

GIVEN `content/identity.json` contains `firstName: "Abhilash"`
WHEN the nav renders
THEN the wordmark displays "abhilash"

#### Scenario: Wordmark updates when identity changes

GIVEN a site owner changes `firstName` in `content/identity.json` to a different name
WHEN the site is rebuilt
THEN the wordmark displays the new name in lowercase with no component code change

---

### Requirement: Footer SHALL appear on every page with social links and copyright

A footer SHALL appear at the bottom of every page with icon links to GitHub, LinkedIn, and Email, and MUST include a copyright line. The copyright year MUST be dynamic (current calendar year) and the name MUST derive from `identity.firstName` sourced from `content/identity.json` — neither MUST be hardcoded.

#### Scenario: Footer renders on all pages

GIVEN a visitor views any page of the portfolio
WHEN the page renders
THEN a footer is visible at the bottom containing GitHub, LinkedIn, and Email icon links
AND the copyright line reads "© {current year} {identity.firstName}"

#### Scenario: Copyright year is always current

GIVEN the current calendar year is 2027
WHEN the footer renders
THEN the copyright line reads "© 2027 {identity.firstName}"

#### Scenario: Footer icon links change colour on hover

GIVEN a visitor views the footer
WHEN they hover over the GitHub, LinkedIn, or Email icon
THEN the icon changes to the accent colour

#### Scenario: Footer email link opens email client

GIVEN a visitor clicks the Email icon in the footer
WHEN clicked
THEN their email client opens pre-addressed to the owner's email from `content/contact.json`

#### Scenario: Footer name reflects identity configuration

GIVEN a site owner changes `firstName` in `content/identity.json`
WHEN the site is rebuilt
THEN the copyright line shows the new name with no component code change
