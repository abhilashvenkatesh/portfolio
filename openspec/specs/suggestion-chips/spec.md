# Capability: suggestion-chips

## Purpose

TBD — Provides suggestion chips on the home-page hero so visitors who don't know what to ask are given concrete starting prompts that navigate to the chat page.

## Requirements

### Requirement: chips-render-below-launcher

The home-page hero SHALL display four suggestion chips below the chat input so visitors who don't know what to ask are given concrete starting prompts.

#### Scenario: Four chips visible below input

GIVEN a visitor navigates to the home page
WHEN the hero section renders
THEN four suggestion chips SHALL appear below the chat launcher input
AND each chip SHALL display its configured question text
AND the chip text SHALL read exactly: "What are Abhilash's top skills?", "Tell me about his role at Rapido", "Which projects has he led?", "How can I get in touch?"

---

### Requirement: chip-click-navigates-to-chat

Clicking a suggestion chip SHALL navigate to the chat page with that chip's question pre-filled, triggering the same auto-send behaviour as a chat launcher submission.

#### Scenario: Click chip navigates with query

GIVEN a visitor views the home-page hero
WHEN the visitor clicks any suggestion chip
THEN the visitor SHALL be navigated to `/chat?q=<URL-encoded chip question>`

---

### Requirement: chip-hover-accent

Each suggestion chip SHALL provide an accent-colour highlight on hover to confirm it is interactive.

#### Scenario: Chip highlights on hover

GIVEN a visitor views the home-page hero
WHEN the visitor hovers over a suggestion chip
THEN the chip border SHALL change to accent-border colour
AND the chip background SHALL change to accent-dim fill
AND the chip text SHALL change to accent colour
AND the chip SHALL return to its resting state when the pointer leaves

---

### Requirement: chips-sourced-from-content

The suggestion chips on the home page SHALL be driven by a data file so the copy can be updated without touching component code.

#### Scenario: Content file controls chip text

GIVEN the `home` array in `content/suggestion-chips.json` contains four question strings
WHEN the home page is built
THEN the four chips SHALL display exactly those strings in order
AND updating the file SHALL be sufficient to change what chips appear with no other code change
