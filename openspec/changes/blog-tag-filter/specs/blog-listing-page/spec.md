# Capability: blog-listing-page

## ADDED Requirements

### Requirement: Tag filter bar

A row of tag filter buttons SHALL appear above the post list, derived from unique `tag` values across all posts plus an "All" option, so visitors can narrow the listing to a topic of interest.

#### Scenario: Filter bar shows all unique tags

GIVEN the blog listing page is open
WHEN the page loads
THEN a filter bar is visible above the post list
AND an "All" button is present as the first option
AND one button exists for each unique tag value found in the post data
AND no tag appears more than once in the bar

#### Scenario: All posts shown on initial load

GIVEN the blog listing page is open
WHEN the page loads
THEN the "All" filter is active
AND all post cards are visible

### Requirement: Active tag filters the listing

Clicking a tag filter button SHALL instantly show only posts whose `tag` matches the selected value and hide all others, so the visitor sees a focused subset without a page reload.

#### Scenario: Visitor clicks a tag button

GIVEN the blog listing is showing all posts
WHEN a visitor clicks a specific tag button (e.g. "Go")
THEN only post cards with that tag are visible
AND post cards with other tags are hidden
AND the clicked button becomes the active filter

#### Scenario: Visitor clicks "All"

GIVEN a tag filter is active
WHEN the visitor clicks "All"
THEN all post cards become visible again
AND "All" becomes the active filter

### Requirement: Tag filter button visual states

The active filter button SHALL be visually distinguished from inactive buttons using an accent colour background and border; inactive buttons SHALL show an accent border on hover, so the current filter selection is always clear at a glance.

#### Scenario: Active button style

GIVEN a tag filter is active
WHEN the visitor looks at the filter bar
THEN the active button has an accent colour background and an accent border
AND all other buttons do not share those styles

#### Scenario: Inactive button hover

GIVEN no tag filter is active for a given button
WHEN the visitor hovers over that button
THEN an accent border appears on the hovered button
