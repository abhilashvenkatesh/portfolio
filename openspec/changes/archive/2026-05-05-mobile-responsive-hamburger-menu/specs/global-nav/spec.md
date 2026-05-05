## MODIFIED Requirements

### Requirement: Mobile-responsive navigation
The nav bar SHALL adapt to narrow viewports. On small screens (< `md` breakpoint, 768px), page links SHALL be hidden behind a hamburger menu button. Tapping the hamburger button SHALL toggle a full-width dropdown showing all nav links. Tapping any nav link in the mobile menu SHALL close the menu. On medium and larger screens (`md:` breakpoint), links SHALL always be visible and the hamburger button SHALL be hidden.

#### Scenario: Hamburger visible on mobile
- **WHEN** a visitor views the site on a viewport narrower than 768px
- **THEN** a hamburger menu button is visible and page links are hidden

#### Scenario: Menu opens on tap
- **WHEN** a visitor taps the hamburger button on mobile
- **THEN** the page links expand into a full-width dropdown and become visible

#### Scenario: Menu closes on second tap
- **WHEN** a visitor taps the hamburger button while the menu is open
- **THEN** the dropdown collapses and page links are hidden again

#### Scenario: Nav link tap closes mobile menu
- **WHEN** a visitor taps a nav link while the mobile menu is open
- **THEN** the mobile menu closes and the visitor is navigated to the link destination

#### Scenario: Links always visible on desktop
- **WHEN** a visitor views the site on a viewport 768px or wider
- **THEN** all nav links are visible inline and the hamburger button is not visible
