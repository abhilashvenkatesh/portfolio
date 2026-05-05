## ADDED Requirements

### Requirement: Page content reflows to single column on mobile
All page content SHALL reflow to a single column on viewports narrower than the `md` breakpoint (768px). No content SHALL require horizontal scrolling at 375px viewport width.

#### Scenario: Home page no horizontal scroll at 375px
- **WHEN** a visitor views the home page on a 375px wide viewport
- **THEN** the page scrolls only vertically and no content overflows the viewport horizontally

#### Scenario: All pages no horizontal scroll at 375px
- **WHEN** a visitor views any page (About, Projects, Experience, Blog, Contact) on a 375px wide viewport
- **THEN** the page scrolls only vertically and all content is fully visible without horizontal scrolling

### Requirement: Text remains legible on mobile without zooming
Body text, headings, and card content SHALL remain legible at 375px width without the visitor needing to zoom in.

#### Scenario: Text legible without zoom
- **WHEN** a visitor views any page on a 375px wide viewport with default zoom
- **THEN** all text content is readable without pinch-to-zoom

### Requirement: Touch targets meet minimum size
All interactive elements (links, buttons) SHALL have a minimum tap target of 44×44px to meet accessibility touch target guidelines.

#### Scenario: Nav links meet touch target size
- **WHEN** a visitor inspects nav links on mobile
- **THEN** each link's clickable area is at least 44px in height and width

#### Scenario: Buttons meet touch target size
- **WHEN** a visitor inspects any button on mobile
- **THEN** each button's clickable area is at least 44px in height and width
