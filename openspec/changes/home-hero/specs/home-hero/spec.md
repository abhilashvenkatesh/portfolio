# Capability: home-hero

## ADDED Requirements

### Requirement: Hero headline and identity

The home page hero SHALL present the visitor's identity above the fold: a role badge, a headline with subheading, and a short bio paragraph. All text content is sourced from `content/home.json`, not hardcoded.

#### Scenario: Visitor sees the role badge above the headline

GIVEN a visitor opens the home page
WHEN the hero renders
THEN a role badge reading "Lead Application Developer · Melbourne" appears above the headline

#### Scenario: Visitor sees the headline and subheading

GIVEN a visitor opens the home page
WHEN the hero renders
THEN the headline "Hi, I'm Abhilash." is shown as the dominant heading
AND the subheading "I architect systems that scale to millions." appears beneath it
AND the trailing clause "scale to millions." is visually emphasised in the accent colour

#### Scenario: Visitor reads the bio paragraph

GIVEN a visitor opens the home page
WHEN the hero renders
THEN a bio paragraph appears below the headline reading "Lead Application Developer with 11+ years building distributed systems, cloud infrastructure, and engineering teams across Australia and India. Currently at Fabric Group, Melbourne."

### Requirement: Hero statistics bar

The hero SHALL display a bar of three headline statistics below the bio, each as a value paired with a label, sourced from `content/home.json`.

#### Scenario: Visitor sees the three statistics

GIVEN a visitor opens the home page
WHEN the hero renders
THEN three statistics appear below the bio: "11+ years experience", "30+ microservices shipped", and "3 countries worked in"
AND each statistic shows its value emphasised above its label

### Requirement: Hero background texture

The hero SHALL render decorative background elements — a subtle grid-line pattern that fades toward the centre and a soft radial accent glow — that sit behind the content without obscuring or competing with the text.

#### Scenario: Decorative texture renders behind the content

GIVEN a visitor opens the home page
WHEN the hero renders
THEN a subtle grid-line pattern and a soft radial glow appear behind the hero content
AND the text remains fully legible against them
AND the decorative elements do not intercept pointer interaction

#### Scenario: Texture adapts to the active theme

GIVEN a visitor has selected light or dark theme
WHEN the hero renders
THEN the grid pattern and glow use theme-aware tokens so they stay subtle in both themes

### Requirement: Hero content is configurable

All hero copy — role badge, headline, subheading, bio, and the three statistics — SHALL be read from `content/home.json` at build time so a site owner can edit it without touching component code.

#### Scenario: Editing content updates the hero

GIVEN a site owner edits the role badge, headline, subheading, bio, or stats in `content/home.json`
WHEN the site is rebuilt
THEN the hero reflects the edited values with no component code change
