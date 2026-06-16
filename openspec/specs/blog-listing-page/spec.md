# Capability: blog-listing-page

## Purpose

A `/blog` route that presents a curated listing of blog posts sourced from `content/blog/*.mdx` frontmatter, enabling visitors to discover and navigate to individual articles.

## Requirements

### Requirement: Blog listing page

A `/blog` route SHALL present a page header and a list of post cards sourced from `content/blog/*.mdx` frontmatter, so visitors can discover posts and navigate to individual articles.

#### Scenario: Visitor opens the blog listing

GIVEN one or more posts exist in the blog content directory
WHEN a visitor opens `/blog`
THEN a page header is shown with the label "Writing" and subtitle "Thoughts on engineering"
AND an intro paragraph is displayed below the header
AND each post appears as a card in the listing

#### Scenario: Listing reflects the data source

GIVEN a post is added to `content/blog/`
WHEN the site is rebuilt
THEN that post appears on the listing with no other code change

### Requirement: Post card content

Each post card SHALL display the topic tag, publication date, estimated read time, post title, one-sentence summary, and a "Read article →" link, so a visitor can evaluate a post before clicking through.

#### Scenario: Card shows all post metadata

GIVEN a post with a tag, date, readTime, title, and summary
WHEN it appears on the listing
THEN the card shows the topic tag
AND the card shows the publication date
AND the card shows the estimated read time
AND the card shows the post title
AND the card shows the one-sentence summary
AND a "Read article →" link is present below the summary

### Requirement: Post card navigates to article

Each post card SHALL be fully clickable, navigating the visitor to the individual blog post page, so discovery requires minimal friction.

#### Scenario: Visitor opens a post from the listing

GIVEN a visitor on the blog listing
WHEN they activate a post card
THEN they arrive at that post's individual page at `/blog/<slug>`

### Requirement: Post card hover state

Hovering a post card SHALL change the title colour to the accent colour, animate an accent-coloured line along the top edge, and lift the card slightly upward, so interactive affordance matches the site's established card hover treatment.

#### Scenario: Card responds to hover

GIVEN a visitor on the blog listing
WHEN they hover over a post card
THEN the post title colour changes to the accent colour
AND an accent-coloured line appears along the top edge of the card
AND the card lifts slightly upward

### Requirement: Post card scroll animation

Each post card SHALL fade in and slide up as it enters the viewport, staggered by card index, so the listing feels alive without distracting from content.

#### Scenario: Cards animate on scroll

GIVEN a visitor scrolling the blog listing
WHEN a post card enters the viewport
THEN it fades in and slides up from a slightly lower starting position
AND cards with higher index begin their animation after cards with lower index

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
