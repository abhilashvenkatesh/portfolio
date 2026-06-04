# Capability: hero-headline

## Purpose

Defines the hero section identity copy on the home page — the role badge, headline, subheading, and description paragraph — and the requirement that all content is loaded from `content/home.json` at build time.

## Requirements

### Requirement: role-badge-above-headline

A role badge displaying the visitor's professional context SHALL appear above the hero headline on the home page.

#### Scenario: Badge visible on initial page load

GIVEN a visitor navigates to the home page
WHEN the page renders
THEN a badge reading "Lead Application Developer · Melbourne" SHALL appear above the headline
AND the badge SHALL use the accent-tag design token (burnt-orange accent background, accent text)

---

### Requirement: hero-headline-and-subheading

The home page hero SHALL display a two-part headline: a primary greeting and a value-proposition subheading.

#### Scenario: Headline and subheading render correctly

GIVEN a visitor lands on the home page
WHEN the hero section renders
THEN the primary headline "Hi, I'm Abhilash." SHALL be visible at hero-display size (clamp 48px→88px)
AND the subheading "I architect systems that scale to millions." SHALL appear below the headline
AND "I architect systems" SHALL render in muted colour at hero-display-light weight
AND "scale to millions." SHALL render in the tertiary accent colour
AND "that" SHALL connect the two subheading phrases on the same visual line

#### Scenario: Headline text sourced from content JSON

GIVEN the home page is built
WHEN `content/home.json` is read at build time
THEN the headline and subheading text SHALL come from JSON fields, not hardcoded strings in the component

---

### Requirement: hero-description

A short description paragraph SHALL appear below the subheading summarising Abhilash's background and current role.

#### Scenario: Description text renders with correct content

GIVEN a visitor views the home page hero
WHEN the description renders
THEN it SHALL read "Lead Application Developer with 11+ years building distributed systems, cloud infrastructure, and engineering teams across Australia and India. Currently at Fabric Group, Melbourne."
AND it SHALL render in muted colour at body-lg weight (19px, 300 weight, 1.7 line-height)
AND it SHALL be centred with a max-width of 520px

#### Scenario: Description sourced from content JSON

GIVEN the home page is built
WHEN `content/home.json` is read at build time
THEN the description text SHALL come from a JSON field, not a hardcoded string

---

### Requirement: hero-content-json-source

All hero identity copy (role badge, headline, subheading, description, and stats) SHALL be loaded from `content/home.json` at build time via a typed loader in `lib/content.ts`. No content SHALL be hardcoded in any component.

#### Scenario: Content loads without runtime file access

GIVEN the site is built with `next build`
WHEN `app/page.tsx` renders as a Server Component
THEN `lib/content.ts` SHALL read `content/home.json` using `fs.readFileSync` at build time
AND the resulting typed object SHALL be passed as props to the hero component
AND no `fs` call SHALL occur at request time

---

### Requirement: chat-launcher-in-hero

The home-page hero section SHALL include the chat launcher component positioned below the stats bar.

#### Scenario: Chat launcher renders in hero

GIVEN a visitor navigates to the home page
WHEN the hero section renders
THEN the `ChatLauncher` component SHALL appear below the `StatsBar` component
AND the hero section layout (badge, headline, subheading, description, stats bar) SHALL remain unchanged
