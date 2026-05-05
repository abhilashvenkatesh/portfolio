# Spec: Global Footer

## Purpose

TBD — global footer present on every page of the portfolio, including copyright notice, and social/contact links (GitHub, LinkedIn, email). Sticks to the bottom of the viewport on short pages.

## Requirements

### Requirement: Footer appears on every page
The footer SHALL be rendered at the bottom of every page. It SHALL be included in `Base.astro` so all pages inherit it without per-page configuration.

#### Scenario: Footer visible on home page
- **WHEN** a visitor loads the home page (`/`)
- **THEN** the footer is visible at the bottom of the page

#### Scenario: Footer visible on all section pages
- **WHEN** a visitor loads any page (About, Projects, Experience, Blog, Contact)
- **THEN** the footer is visible at the bottom of that page

### Requirement: Footer displays copyright with current year
The footer SHALL display copyright text in the format `© <year> Abhilash Venkatesh` where `<year>` is the year the site was built.

#### Scenario: Copyright text present
- **WHEN** a visitor views the footer
- **THEN** copyright text including the current year and "Abhilash Venkatesh" is visible

### Requirement: Footer contains GitHub link
The footer SHALL include a clickable link to Abhilash's GitHub profile. The link SHALL open in a new tab.

#### Scenario: GitHub link opens in new tab
- **WHEN** a visitor clicks the GitHub icon in the footer
- **THEN** the GitHub profile opens in a new browser tab

### Requirement: Footer contains LinkedIn link
The footer SHALL include a clickable link to Abhilash's LinkedIn profile. The link SHALL open in a new tab.

#### Scenario: LinkedIn link opens in new tab
- **WHEN** a visitor clicks the LinkedIn icon in the footer
- **THEN** the LinkedIn profile opens in a new browser tab

### Requirement: Footer contains email link
The footer SHALL include a clickable email link using a `mailto:` href pointing to `abhilashfeb30@gmail.com`. The link SHALL open the visitor's default mail client.

#### Scenario: Email link opens mail client
- **WHEN** a visitor clicks the email icon in the footer
- **THEN** the visitor's default mail client opens with `abhilashfeb30@gmail.com` as the recipient

### Requirement: Footer sticks to bottom on short pages
On pages where content does not fill the viewport height, the footer SHALL appear at the bottom of the viewport, not immediately below sparse content.

#### Scenario: Footer at viewport bottom on short page
- **WHEN** a visitor views a page whose content is shorter than the viewport height
- **THEN** the footer is pinned to the bottom of the viewport
