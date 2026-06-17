# Capability: home-chat-launcher

## MODIFIED Requirements

### Requirement: Chat launcher input

The home page hero SHALL present a text input below the bio that lets a visitor ask a question. Submitting the question — via the Enter key or the send button — SHALL navigate to the chat page with the question pre-filled and already sent. The input placeholder and aria-label MUST derive from `identity.name` sourced from `content/identity.json` — they MUST NOT be hardcoded.

#### Scenario: Visitor sees the input with its placeholder

GIVEN `content/identity.json` contains `name: "Abhilash Venkatesh"`
AND a visitor opens the home page
WHEN the hero renders
THEN a text input appears below the bio with placeholder text "Ask me anything about Abhilash Venkatesh…"
AND a send button appears alongside it

#### Scenario: Placeholder updates when identity changes

GIVEN a site owner changes `name` in `content/identity.json`
WHEN the site is rebuilt
THEN the input placeholder uses the new name with no component code change

#### Scenario: Visitor submits a question with the Enter key

GIVEN a visitor has typed a question into the launcher input
WHEN the visitor presses Enter
THEN the browser navigates to `/chat?q=<the question, URL-encoded>`

#### Scenario: Visitor submits a question with the send button

GIVEN a visitor has typed a question into the launcher input
WHEN the visitor clicks the send button
THEN the browser navigates to `/chat?q=<the question, URL-encoded>`

#### Scenario: Empty input does not navigate

GIVEN the launcher input is empty or contains only whitespace
WHEN the visitor presses Enter or clicks the send button
THEN no navigation occurs

#### Scenario: Send button dims on hover

GIVEN a visitor hovers over the send button
WHEN the pointer is over the button
THEN the button dims slightly to signal interactivity
