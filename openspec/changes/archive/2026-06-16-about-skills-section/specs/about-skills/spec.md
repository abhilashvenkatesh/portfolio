# Capability: about-skills

## ADDED Requirements

### Requirement: Skills section heading

The About page SHALL present a "What I work with" section below the bio, introduced by an accent section label distinct from the page header.

#### Scenario: Section heading is shown below the bio

GIVEN a visitor is on the About page
WHEN the page loads
THEN a "What I work with" section label is displayed below the bio content

### Requirement: Skill category cards

The skills section SHALL display one card per skill category, covering Languages, Frameworks, Data & Messaging, and Cloud & DevOps. Each card SHALL show its category name as a highlighted label and list that category's individual skills as tags. The category and skill data SHALL be sourced from content, not hardcoded in the component.

#### Scenario: Four category cards are shown

GIVEN a visitor is on the About page
WHEN the skills section loads
THEN a card is displayed for each of Languages, Frameworks, Data & Messaging, and Cloud & DevOps
AND each card shows its category name as a highlighted label
AND each card lists the skills belonging to that category as individual tags

#### Scenario: Skills content is data-driven

GIVEN the skill categories are defined in `content/skills.json`
WHEN the About page is built
THEN the rendered cards and tags match the content file
AND no category or skill copy is hardcoded in the page component

### Requirement: Staggered scroll reveal

The skill category cards SHALL be hidden initially and fade into view as the visitor scrolls them into the viewport, with each card revealing after a short incremental delay relative to the previous one.

#### Scenario: Cards fade in with stagger on scroll

GIVEN a visitor scrolls the skills section into view
WHEN the cards enter the viewport
THEN each card fades into view
AND successive cards reveal with an incremental delay producing a staggered effect
