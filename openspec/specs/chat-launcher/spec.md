# Capability: chat-launcher

## Purpose

Provides a chat input on the home-page hero section allowing visitors to submit questions that navigate to the `/chat` page with the query pre-filled via URL parameter.

## Requirements

### Requirement: chat-input-renders-with-placeholder

The home-page hero SHALL include a chat input field with a descriptive placeholder so visitors immediately understand they can ask a question.

#### Scenario: Input visible with correct placeholder

GIVEN a visitor navigates to the home page
WHEN the hero section renders
THEN a text input field SHALL be visible below the stats bar
AND the input SHALL display placeholder text "Ask me anything about Abhilash…"
AND a chat bubble icon SHALL appear to the left of the input field
AND an arrow submit button SHALL appear to the right of the input field

---

### Requirement: submit-navigates-to-chat

Submitting a non-empty question from the home-page chat launcher SHALL navigate to the chat page with the question pre-filled via URL parameter.

#### Scenario: Enter key submits question

GIVEN a visitor has typed a non-empty question in the chat input
WHEN the visitor presses the Enter key
THEN the visitor SHALL be navigated to `/chat?q=<URL-encoded question>`

#### Scenario: Send button click submits question

GIVEN a visitor has typed a non-empty question in the chat input
WHEN the visitor clicks the send button
THEN the visitor SHALL be navigated to `/chat?q=<URL-encoded question>`

#### Scenario: Empty input does not submit

GIVEN the chat input is empty or contains only whitespace
WHEN the visitor presses Enter or clicks the send button
THEN no navigation SHALL occur

---

### Requirement: send-button-dims-on-hover

The send button SHALL provide subtle hover feedback to confirm it is interactive.

#### Scenario: Button dims on hover

GIVEN a visitor views the home-page chat launcher
WHEN the visitor hovers the send button
THEN the button SHALL reduce to 85% opacity
AND the button SHALL return to full opacity when the pointer leaves

---

### Requirement: suggestion-chips-appear-in-hero

The home-page hero section SHALL include suggestion chips below the chat launcher input, forming a complete chat entry point for visitors.

#### Scenario: Chips visible below launcher input

GIVEN a visitor navigates to the home page
WHEN the hero section renders
THEN the suggestion chips SHALL appear directly below the chat launcher input field
AND the chips SHALL be visible without any user interaction
