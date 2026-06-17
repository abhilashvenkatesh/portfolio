# Capability: contact-page

## ADDED Requirements

### Requirement: page-header

The contact page must render a PageHeader with label "Get in touch" and subtitle "Let's work together", consistent with the site-wide PageHeader component pattern.

#### Scenario: header renders with correct label and subtitle

GIVEN a visitor navigates to `/contact`
WHEN the page loads
THEN a page header is visible with the label "Get in touch"
AND the subtitle reads "Let's work together"

---

### Requirement: opening-statement

A short paragraph below the header communicates Abhilash's current availability, setting expectations before a visitor chooses a contact channel.

#### Scenario: opening statement is visible

GIVEN a visitor is on the `/contact` page
WHEN the page content loads
THEN the paragraph "I'm currently open to full-time roles and select consulting engagements. If you're building something interesting, I'd love to hear about it." is visible below the header

---

### Requirement: contact-method-cards

Three contact cards (Email, LinkedIn, Phone) give visitors distinct, labelled options for reaching Abhilash, each activating the appropriate native action on click.

#### Scenario: all three contact cards render

GIVEN a visitor is on the `/contact` page
WHEN the contact cards section loads
THEN three cards are visible: Email, LinkedIn, and Phone
AND each card shows a channel icon, the channel label (e.g. "EMAIL") in monospace uppercase, the contact value, and a short description of when to use that channel
AND each card shows an external-link arrow on the right

#### Scenario: email card triggers email client

GIVEN a visitor is on the `/contact` page
WHEN the visitor clicks the Email card
THEN the visitor's email client opens pre-addressed to Abhilash's email address

#### Scenario: linkedin card opens LinkedIn profile

GIVEN a visitor is on the `/contact` page
WHEN the visitor clicks the LinkedIn card
THEN the LinkedIn profile URL opens in a new tab

#### Scenario: phone card triggers phone dialler

GIVEN a visitor is on the `/contact` page
WHEN the visitor clicks the Phone card
THEN the visitor's phone dialler opens with Abhilash's phone number pre-filled

---

### Requirement: contact-card-hover-state

Hovering a contact card provides clear interactive feedback — an accent border, a tinted background, and a subtle upward lift — so visitors know the card is actionable.

#### Scenario: card shows hover state on mouse enter

GIVEN a visitor is on the `/contact` page
WHEN the visitor hovers over a contact card
THEN the card's border changes to the accent border colour
AND the card's background changes to the accent-tinted background colour
AND the card translates upward by 2px

#### Scenario: card returns to default state on mouse leave

GIVEN a visitor is hovering over a contact card
WHEN the visitor moves the cursor away from the card
THEN the card's border, background, and vertical position return to their default values

---

### Requirement: availability-status-banner

A configurable availability banner below the contact cards communicates Abhilash's work availability at a glance, driven by `content/contact.json` so it can be updated without touching code.

#### Scenario: banner renders when availability is enabled

GIVEN `content/contact.json` has `availability.show` set to `true`
AND `availability.message` contains a non-empty string
WHEN a visitor loads the `/contact` page
THEN an availability banner is visible below the contact cards
AND the banner shows a pulsing green dot on the left
AND the banner displays the text from `availability.message`

#### Scenario: banner is hidden when availability is disabled

GIVEN `content/contact.json` has `availability.show` set to `false`
WHEN a visitor loads the `/contact` page
THEN no availability banner is rendered on the page

#### Scenario: banner text updates without code change

GIVEN `content/contact.json` has `availability.message` set to a custom string
WHEN the site is rebuilt and a visitor loads the `/contact` page
THEN the banner displays the updated custom message text
