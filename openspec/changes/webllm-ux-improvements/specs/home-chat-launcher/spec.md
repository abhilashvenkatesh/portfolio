# Capability: home-chat-launcher

## ADDED Requirements

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
