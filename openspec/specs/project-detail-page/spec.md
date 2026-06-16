# Capability: project-detail-page

## Purpose

The `/projects/[slug]` route presents a per-project case study so visitors who want depth on a specific project get its scope, role, and outcomes beyond what a listing card carries. Each page is build-time SSG, sourced from `content/projects.json` for structured fields plus an optional long-form Markdown body at `content/projects/<slug>.mdx`, with the slug derived from the project id.

## Requirements

### Requirement: Per-project detail route

The system SHALL generate one statically rendered detail page per project at `/projects/<slug>`, where the slug is derived from the project id, and SHALL respond with a not-found page for any slug that maps to no project.

#### Scenario: Visitor opens a project's detail page

GIVEN a project exists in the projects data
WHEN a visitor navigates to that project's detail URL
THEN the page renders that project's case study
AND the page is served as a pre-rendered static page

#### Scenario: Every project is reachable by a unique URL

GIVEN the projects data contains multiple projects
WHEN the site is built
THEN each project produces its own detail page at a distinct URL derived from its id

#### Scenario: Unknown project slug

GIVEN no project exists for a requested slug
WHEN a visitor navigates to that URL
THEN the site responds with a not-found page

### Requirement: Structured case-study sections

The detail page SHALL present the project's structured fields — name, tagline, year, problem, impact, tech stack, and (when present) role and timeline — as readable sections, independent of any long-form body. Optional fields that are absent SHALL be omitted.

#### Scenario: Structured fields are displayed

GIVEN a project with problem, impact, tech stack, year, role, and timeline
WHEN a visitor opens its detail page
THEN the name, tagline, year, problem, impact, tech stack, role, and timeline are shown

#### Scenario: Optional structured fields are omitted when absent

GIVEN a project with no role and no timeline
WHEN a visitor opens its detail page
THEN the role and timeline sections are not shown
AND the remaining sections still render

### Requirement: Optional long-form case-study body

A project MAY have an optional long-form body authored in Markdown/MDX. When a body is present the system SHALL render it below the structured sections; when absent the system SHALL still render the structured sections with no empty body area.

#### Scenario: Project with a case-study body

GIVEN a project that has a long-form Markdown body
WHEN a visitor opens its detail page
THEN the rendered body appears below the structured sections

#### Scenario: Project without a case-study body

GIVEN a project that has no long-form body
WHEN a visitor opens its detail page
THEN the structured sections render
AND no empty body area is shown

### Requirement: Source code and demo links

The detail page SHALL link to the project's GitHub repository, and SHALL link to a live demo only when the project defines a demo URL.

#### Scenario: Project with a demo

GIVEN a project that defines both a GitHub URL and a demo URL
WHEN a visitor opens its detail page
THEN a GitHub link and a live-demo link are shown

#### Scenario: Project without a demo

GIVEN a project that defines a GitHub URL but no demo URL
WHEN a visitor opens its detail page
THEN a GitHub link is shown
AND no live-demo link is shown

### Requirement: Back navigation to the listing

The detail page SHALL provide a control that navigates back to the projects listing.

#### Scenario: Visitor returns to the listing

GIVEN a visitor on a project detail page
WHEN they activate the back-to-projects control
THEN they arrive at the projects listing page

### Requirement: Per-project page metadata

Each detail page SHALL expose its own page metadata for browser tabs and link previews, with the title derived from the project name and the description from the project tagline.

#### Scenario: Detail page metadata reflects the project

GIVEN a project with a name and tagline
WHEN its detail page is generated
THEN the page title reflects the project name
AND the page description reflects the project tagline
