# About Page

## Purpose

Defines the content, layout, and interactive behaviour of the `/about` page on Abhilash Venkatesh's portfolio site. The page presents a profile photo, biographical text, résumé download CTA, and a categorised skills grid — all rendered as a static Astro page with a responsive layout and scroll-reveal animation.

---

## Requirements

### Requirement: Profile photo displayed

The About page SHALL display a profile photo of Abhilash Venkatesh. When the photo asset is absent, a styled placeholder SHALL be shown in its place with no broken image indicator.

#### Scenario: Profile photo renders

- **WHEN** `public/avatar.jpg` exists
- **THEN** an `<img>` element SHALL render with `src="/avatar.jpg"` and descriptive `alt` text

#### Scenario: Placeholder shown when photo absent

- **WHEN** `public/avatar.jpg` does not exist
- **THEN** a styled placeholder element (SVG silhouette or equivalent) SHALL occupy the same space with no broken image icon

---

### Requirement: Bio paragraphs displayed

The About page SHALL display exactly three paragraphs of biographical text describing Abhilash's career journey, values, and working style.

#### Scenario: Three paragraphs render

- **WHEN** the About page loads
- **THEN** exactly three `<p>` elements SHALL be visible containing the bio content

---

### Requirement: Résumé download button

The About page SHALL provide a prominently styled button or link that initiates download of or navigation to the résumé PDF.

#### Scenario: Download button links to PDF

- **WHEN** a visitor clicks the "Download résumé" button
- **THEN** the browser SHALL navigate to or download `/resume.pdf`

#### Scenario: Button is visually distinct

- **WHEN** the About page renders
- **THEN** the résumé CTA SHALL be styled with the accent colour (not a plain text link)

---

### Requirement: Skills grouped by category

The About page SHALL display Abhilash's technical skills organised into four named groups: Languages, Frameworks, Data & Messaging, Cloud & DevOps. Each group SHALL show its name as a heading and its skills as individual tag badges.

#### Scenario: Four skill groups render

- **WHEN** the About page loads
- **THEN** four skill group headings SHALL be visible: "Languages", "Frameworks", "Data & Messaging", "Cloud & DevOps"

#### Scenario: Skills appear as tag badges

- **WHEN** a skill group is rendered
- **THEN** each skill item SHALL appear as a visually distinct badge/tag (not a plain list item)

#### Scenario: Skills data sourced from data module

- **WHEN** `src/data/index.ts` exports a `skills` array
- **THEN** the About page SHALL import and render from that array (not inline hardcoded data)

---

### Requirement: Responsive two-column layout

The bio and avatar SHALL render side-by-side on tablet and wider viewports, and stack vertically on mobile.

#### Scenario: Two-column on desktop

- **WHEN** viewport width is ≥768px
- **THEN** bio text SHALL appear on the left and the avatar SHALL appear on the right

#### Scenario: Single column on mobile

- **WHEN** viewport width is <768px
- **THEN** bio text and avatar SHALL stack vertically with no horizontal overflow

---

### Requirement: Skills section animated via ScrollReveal

The skills grid section SHALL be wrapped in `<ScrollReveal client:visible>` so it fades in on scroll per the scroll-reveal spec.

#### Scenario: Skills section uses ScrollReveal

- **WHEN** the About page is rendered
- **THEN** the skills grid container SHALL be wrapped in a `ScrollReveal` island with `client:visible` directive
