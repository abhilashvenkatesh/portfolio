# about-page Specification

## Purpose
TBD - created by archiving change about-page. Update Purpose after archive.
## Requirements
### Requirement: Page header

The `/about` route SHALL present a page header identifying the page, with the accent label "About me" and the subtitle "11+ years building systems across 3 countries and 4 industries.", over a subtle grid-line background that fades toward the content.

#### Scenario: Header is shown on the About page

GIVEN a visitor opens `/about`
WHEN the page loads
THEN the accent label "About me" is displayed
AND the subtitle "11+ years building systems across 3 countries and 4 industries." is displayed
AND a subtle grid-line background pattern appears in the header area, fading out toward the content

### Requirement: Personal bio

The About page SHALL display three paragraphs of biographical text covering Abhilash's location and career arc, notable employers (ThoughtWorks, Rapido, Australia Post, Fabric Group), and engineering philosophy. The bio text SHALL be sourced from content, not hardcoded in the component.

#### Scenario: Bio paragraphs are shown

GIVEN a visitor is on the About page
WHEN the page loads
THEN three biographical paragraphs are displayed
AND the paragraphs reference Abhilash's location and career arc, the employers ThoughtWorks, Rapido, Australia Post, and Fabric Group, and his engineering philosophy

#### Scenario: Bio content is data-driven

GIVEN the bio paragraphs are defined in `content/about.json`
WHEN the About page is built
THEN the rendered paragraphs match the content file
AND no biographical copy is hardcoded in the page component

### Requirement: Profile photo placeholder

The About page SHALL display a square photo area with rounded corners beside the bio text. Until a real photo is supplied it SHALL show a placeholder silhouette. On narrow viewports the bio and photo SHALL stack vertically.

#### Scenario: Photo placeholder beside bio on wide screens

GIVEN a visitor views the About page on a wide viewport
WHEN the page loads
THEN a square, rounded-corner photo area appears beside the bio text
AND it shows a placeholder silhouette

#### Scenario: Bio and photo stack on mobile

GIVEN a visitor views the About page on a narrow (mobile) viewport
WHEN the page loads
THEN the bio and photo are stacked vertically

### Requirement: Download résumé button

The About page SHALL present a prominent "Download résumé" button below the bio that downloads the PDF résumé to the visitor's device when clicked, and dims slightly on hover.

#### Scenario: Visitor downloads the résumé

GIVEN a visitor is on the About page
WHEN the visitor clicks the "Download résumé" button
THEN the PDF résumé file is downloaded to the visitor's device

#### Scenario: Résumé button dims on hover

GIVEN a visitor is on the About page
WHEN the visitor hovers over the "Download résumé" button
THEN the button dims slightly

### Requirement: Blog cross-link

The About page SHALL present a secondary "Blog →" link alongside the résumé button that navigates to the Blog page, and adopts the accent colour and border on hover.

#### Scenario: Visitor navigates to the blog

GIVEN a visitor is on the About page
WHEN the visitor clicks the "Blog →" link
THEN the visitor is taken to the Blog page

#### Scenario: Blog link highlights on hover

GIVEN a visitor is on the About page
WHEN the visitor hovers over the "Blog →" link
THEN the link adopts the accent colour and an accent border

