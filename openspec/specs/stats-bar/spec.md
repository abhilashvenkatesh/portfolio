# Capability: stats-bar

## Purpose

Defines the headline statistics bar displayed in the home page hero section — three key career metrics rendered below the bio description paragraph, sourced entirely from `content/home.json` at build time.

## Requirements

### Requirement: stats-bar-renders-three-stats

The home page hero MUST display exactly three headline statistics below the bio description paragraph.

#### Scenario: Three stat items render on page load

GIVEN a visitor navigates to the home page
WHEN the hero section renders
THEN three statistics SHALL be visible below the bio paragraph
AND the first stat SHALL read "11+" with label "years experience"
AND the second stat SHALL read "30+" with label "microservices shipped"
AND the third stat SHALL read "3" with label "countries worked in"

---

### Requirement: stats-bar-layout

The stats bar MUST render as a centred flex row with consistent spacing and correct typographic tokens.

#### Scenario: Stats bar layout and typography

GIVEN a visitor views the home page hero
WHEN the stats bar renders
THEN the three stats SHALL be arranged in a horizontal flex row with 40px gap
AND the row SHALL be centred horizontally within the hero container
AND the row SHALL wrap on narrow viewports
AND each stat value SHALL use the stat-number token: 28px, weight 600, DM Sans, tracking −0.02em, heading colour
AND each stat label SHALL use the stat-label token: 13px, DM Mono, muted colour

---

### Requirement: stats-content-json-source

All stats content MUST be loaded from `content/home.json` at build time. No stat value or label SHALL be hardcoded in any component.

#### Scenario: Stats sourced from content JSON

GIVEN the site is built with `next build`
WHEN `app/page.tsx` renders as a Server Component
THEN the stats array SHALL be read from `content/home.json` via `lib/content.ts`
AND the typed `HomeContent` interface SHALL include a `stats` field of type `Array<{ value: string; label: string }>`
AND no stat string SHALL appear as a literal in any component file
