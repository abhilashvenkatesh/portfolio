# Capability: contact-page

## ADDED Requirements

### Requirement: page-meta-description

The contact page `<meta name="description">` SHALL be composed from `content/identity.json` — it MUST NOT hardcode the owner's name. This ensures SEO metadata remains accurate when deployed for a different person.

#### Scenario: Meta description uses identity name

GIVEN `content/identity.json` contains `name: "Abhilash Venkatesh"`
WHEN the contact page is rendered
THEN the page's `<meta name="description">` reads "Get in touch with Abhilash Venkatesh"

#### Scenario: Meta description updates when identity changes

GIVEN a site owner changes `name` in `content/identity.json`
WHEN the site is rebuilt
THEN the contact page meta description uses the new name with no component code change
