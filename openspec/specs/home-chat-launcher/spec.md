# Capability: home-chat-launcher

## Purpose

Defines the home page chat launcher and browse navigation layered into the `home-hero` section, below the bio: a question input with a send button, four suggestion chips, accent-coloured browse links, and an animated scroll indicator. Submitting the input or a chip hands the question off to the chat experience at `/chat?q=<encoded>`; the browse links jump to the projects, experience, and contact pages. Chip copy is sourced from `content/home.json` (`suggestions`) at build time. The launcher is a client island (`components/home/ChatLauncher.tsx`) mounted in the static Server `Hero`; the scroll indicator (`components/home/ScrollIndicator.tsx`) is decorative.

## Requirements

### Requirement: Chat launcher input

The home page hero SHALL present a text input below the bio that lets a visitor ask a question. Submitting the question — via the Enter key or the send button — SHALL navigate to the chat page with the question pre-filled and already sent.

#### Scenario: Visitor sees the input with its placeholder

GIVEN a visitor opens the home page
WHEN the hero renders
THEN a text input appears below the bio with placeholder text "Ask me anything about Abhilash…"
AND a send button appears alongside it

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

### Requirement: Suggestion chips

The hero SHALL display four suggestion chips below the input. Clicking a chip SHALL navigate to the chat page with that chip's question pre-filled and already sent. Chip copy is sourced from `content/home.json` (`suggestions`), not hardcoded.

#### Scenario: Visitor sees the four chips

GIVEN a visitor opens the home page
WHEN the hero renders
THEN four suggestion chips appear below the input
AND each chip's label is one of the `suggestions` values from `content/home.json`

#### Scenario: Visitor clicks a chip

GIVEN a visitor sees the suggestion chips
WHEN the visitor clicks a chip
THEN the browser navigates to `/chat?q=<that chip's question, URL-encoded>`

#### Scenario: Chip highlights on hover

GIVEN a visitor hovers over a suggestion chip
WHEN the pointer is over the chip
THEN the chip highlights in the accent colour

#### Scenario: Editing content updates the chips

GIVEN a site owner edits the `suggestions` values in `content/home.json`
WHEN the site is rebuilt
THEN the chips reflect the edited labels and questions with no component code change

### Requirement: Browse links

Below the chips the hero SHALL present a "or browse" line with accent-coloured links to the projects, experience, and contact pages.

#### Scenario: Visitor sees the browse links

GIVEN a visitor opens the home page
WHEN the hero renders
THEN a line reading "or browse · projects · experience · contact" appears below the chips
AND the "projects", "experience", and "contact" words are accent-coloured links

#### Scenario: Visitor follows a browse link

GIVEN a visitor sees the browse links
WHEN the visitor clicks "projects", "experience", or "contact"
THEN the browser navigates to `/projects`, `/experience`, or `/contact` respectively

### Requirement: WebGPU capability badge

The `ChatLauncher` component SHALL detect WebGPU support on mount and display a badge that communicates browser compatibility to the visitor before they navigate to `/chat`.

#### Scenario: Supported browser shows positive badge

GIVEN a visitor opens the home page in a browser where WebGPU is available (`navigator.gpu` is defined)
WHEN the `ChatLauncher` mounts
THEN a badge reading "Works in your browser" is shown alongside the chat input
AND the badge uses the accent colour to signal readiness

#### Scenario: Unsupported browser shows warning badge

GIVEN a visitor opens the home page in a browser where WebGPU is not available (`navigator.gpu` is undefined)
WHEN the `ChatLauncher` mounts
THEN a badge reading "Requires Chrome or Edge 113+" is shown alongside the chat input
AND the badge uses a muted/warning colour to signal incompatibility

#### Scenario: Badge is not shown during detection

GIVEN the `ChatLauncher` has not yet completed its mount-time detection
WHEN the component first renders on the server or before hydration
THEN no badge is rendered (avoids hydration mismatch)

#### Scenario: Unsupported visitor still sees chips and can navigate

GIVEN a visitor is on an unsupported browser
WHEN they click a suggestion chip or submit the launcher input
THEN the browser navigates to `/chat?q=<question>` as normal
AND the unsupported-browser fallback on the chat page handles the experience from there

### Requirement: Scroll indicator

The hero SHALL render a scroll indicator anchored to the bottom edge of the section: a "scroll" label and an animated mouse icon whose dot moves downward in a continuous loop. The indicator is decorative and SHALL NOT be exposed to assistive technology.

#### Scenario: Visitor sees the animated scroll indicator

GIVEN a visitor opens the home page
WHEN the hero renders
THEN a "scroll" label and a mouse-shaped icon appear at the bottom edge of the hero section
AND the dot inside the icon animates downward continuously in a loop

#### Scenario: Indicator is decorative

GIVEN the scroll indicator renders
WHEN assistive technology traverses the page
THEN the indicator is marked `aria-hidden` and does not intercept pointer interaction
