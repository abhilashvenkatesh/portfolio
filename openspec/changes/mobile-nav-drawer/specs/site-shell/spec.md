# Capability: site-shell

## ADDED Requirements

### Requirement: Mobile viewports SHALL expose all navigation via a hamburger-triggered drawer

Below the 640px breakpoint the desktop navigation links are not shown. The navigation bar SHALL instead present a hamburger trigger that opens a drawer giving access to every destination available on desktop, so mobile visitors are never stranded without navigation. (Closes NAV-6.)

#### Scenario: Hamburger replaces inline links on small viewports

GIVEN a visitor on a viewport narrower than 640px
WHEN any page loads
THEN the inline desktop nav links are not visible
AND a hamburger trigger is visible in the navigation bar
AND the navigation bar shows only the wordmark and the hamburger trigger

#### Scenario: Desktop layout is unaffected

GIVEN a visitor on a viewport 640px or wider
WHEN any page loads
THEN the inline desktop nav links, theme toggle, and Hire me button are visible in the bar
AND no hamburger trigger is shown

#### Scenario: Opening the drawer reveals every destination

GIVEN a visitor on a viewport narrower than 640px
WHEN they activate the hamburger trigger
THEN a drawer opens containing links to Projects, About, Experience, Blog, Chat, and Contact
AND the drawer contains the Hire me action
AND the drawer contains the light/dark theme toggle
AND a dimmed backdrop covers the page behind the drawer

#### Scenario: Theme toggle works from within the drawer

GIVEN the mobile drawer is open
WHEN the visitor activates the theme toggle inside the drawer
THEN the active theme switches between light and dark
AND the preference persists across page loads

### Requirement: The mobile navigation drawer SHALL be dismissible and accessible

The drawer SHALL be closeable through every conventional gesture and SHALL meet keyboard and assistive-technology expectations while open.

#### Scenario: Dismiss by selecting a link

GIVEN the mobile drawer is open
WHEN the visitor selects any navigation link
THEN the app navigates to that destination
AND the drawer closes

#### Scenario: Dismiss by tapping the backdrop

GIVEN the mobile drawer is open
WHEN the visitor taps the dimmed backdrop outside the drawer panel
THEN the drawer closes
AND no navigation occurs

#### Scenario: Dismiss with the Escape key

GIVEN the mobile drawer is open
WHEN the visitor presses the Escape key
THEN the drawer closes
AND keyboard focus returns to the hamburger trigger

#### Scenario: Auto-close when returning to desktop width

GIVEN the mobile drawer is open
WHEN the viewport is resized to 640px or wider
THEN the drawer closes
AND the desktop navigation bar is shown

#### Scenario: Focus and scroll are managed while open

GIVEN the mobile drawer is open
THEN keyboard focus is trapped within the drawer
AND background page scrolling is locked
AND the hamburger trigger exposes its expanded state to assistive technology
