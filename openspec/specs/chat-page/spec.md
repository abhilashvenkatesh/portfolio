# Capability: chat-page

## Purpose

The full-page, in-browser AI chat experience at `/chat`. A visitor converses with an
on-device WebLLM assistant (`Llama-3.2-3B-Instruct-q4f16_1-MLC`) whose answers are
grounded in Abhilash's CV data via a build-time system prompt (`lib/chat-context.ts`).
The route is a static Server shell (`app/chat/page.tsx`) that feeds build-time CV
content into a client island (`components/chat/ChatClient.tsx`); all inference runs in
the browser via WebGPU with no backend. Browsers without WebGPU get a contact-link
fallback instead of the chat UI.

## Requirements

### Requirement: Chat page header

The chat page SHALL identify itself and set expectations about what it answers.

#### Scenario: Header and grounding subtitle are shown

GIVEN a visitor opens the chat page
WHEN the page renders
THEN the heading "Chat with my résumé" is shown with a pulsing accent dot
AND the subtitle reads "Ask anything about my work, skills, or experience · responses grounded in real CV data"

### Requirement: Welcome message

On first open the assistant SHALL greet the visitor and explain what it is. The owner's name in the greeting MUST derive from `identity.name` sourced from `content/identity.json` — it MUST NOT be hardcoded.

#### Scenario: Welcome message appears on a fresh visit

GIVEN a visitor opens the chat page without a pre-filled question
WHEN the thread first renders
THEN the assistant's only message reads "Hey! I'm a chat layer over {identity.name}'s resume. Ask me about his experience, projects, skills, or how to get in touch."

#### Scenario: Welcome message updates when identity changes

GIVEN a site owner changes `name` in `content/identity.json`
WHEN the site is rebuilt
THEN the welcome message uses the new name with no component code change

### Requirement: Suggestion chips

While the visitor has not yet asked anything, the chat SHALL offer guided prompts.

#### Scenario: Chips are shown while only the welcome message is visible

GIVEN the thread contains only the welcome message
WHEN the visitor views the chat
THEN six suggestion chips are shown: "What are his top skills?", "Tell me about his role at Rapido", "Which projects has he led?", "How can I get in touch?", "What's his current role?", "What cloud platforms does he know?"

#### Scenario: Clicking a chip sends it immediately

GIVEN the suggestion chips are visible
WHEN the visitor clicks a chip
THEN that chip's text is sent as the visitor's message
AND a reply begins generating

#### Scenario: Chips disappear after the first visitor message

GIVEN the suggestion chips are visible
WHEN the visitor sends any message
THEN the suggestion chips are no longer shown

### Requirement: Sending a message

The visitor SHALL be able to type and submit free-form questions. During model loading the send action queues the message (see "Type during model load"). The send button is disabled only when the input is empty or the assistant is actively generating a reply.

#### Scenario: Submitting via Enter or the send button

GIVEN the input contains non-empty text and the assistant is ready
WHEN the visitor presses Enter or clicks the send button
THEN the text is added to the thread as a visitor message
AND the input is cleared

#### Scenario: Send is disabled when there is nothing to send

GIVEN the input is empty OR the assistant is currently generating a response
WHEN the visitor views the send button
THEN the send button is disabled and visually muted
AND submitting has no effect

#### Scenario: Send is enabled during model loading

GIVEN the model is still loading
AND the input contains non-empty text
AND no message is already queued
WHEN the visitor views the send button
THEN the send button is enabled
AND pressing Enter or clicking send queues the message per the "Type during model load" requirement

### Requirement: Message thread display

Visitor and assistant turns SHALL be visually distinguishable. The assistant label MUST derive from `identity.firstName` sourced from `content/identity.json` — it MUST NOT be hardcoded.

#### Scenario: Visitor message styling

GIVEN the visitor has sent a message
WHEN it appears in the thread
THEN it is right-aligned with an accent-tinted background
AND it shows the label "you" with an avatar indicator

#### Scenario: Assistant message styling

GIVEN the assistant has replied
WHEN the reply appears in the thread
THEN it is left-aligned with a neutral background
AND it shows the label matching `identity.firstName` with an avatar indicator

#### Scenario: Assistant label updates when identity changes

GIVEN a site owner changes `firstName` in `content/identity.json`
WHEN the site is rebuilt
THEN the assistant message label shows the new first name with no component code change

### Requirement: Pending indicator

While generating a reply the chat SHALL signal that the assistant is thinking.

#### Scenario: Blinking cursor and Thinking placeholder while generating

GIVEN the visitor has sent a message and the reply is generating
WHEN the visitor views the chat
THEN a blinking cursor character "▍" appears at the end of the assistant's placeholder message
AND the input placeholder reads "Thinking…"

### Requirement: Auto-scroll

The newest message SHALL always be brought into view.

#### Scenario: Thread scrolls to the latest message

GIVEN the visitor is viewing the thread
WHEN a new message (visitor or assistant) is appended
THEN the thread scrolls to its bottom so the newest message is visible

### Requirement: Home page handoff

A question asked on the home page SHALL be answered automatically on arrival.

#### Scenario: Pre-filled question auto-sends

GIVEN a visitor arrives at the chat page from the home launcher with a question in the URL
WHEN the page loads and the assistant becomes ready
THEN the visitor's question already appears in the thread
AND its reply generates automatically without further interaction
AND the welcome message is not shown

### Requirement: Error fallback

A failed generation SHALL degrade to a helpful contact prompt. The owner's name in the error message MUST derive from `identity.name` — it MUST NOT be hardcoded.

#### Scenario: Assistant cannot process a question

GIVEN the visitor has sent a message
WHEN the assistant fails to generate a reply
THEN the assistant message reads "Sorry, I couldn't process that. Try rephrasing, or reach {identity.name} directly at [email]." with the real contact email substituted

### Requirement: Full-page layout

The chat SHALL feel like a dedicated app, not an embedded widget.

#### Scenario: Full-viewport thread with pinned input

GIVEN a visitor opens the chat page
WHEN the page renders
THEN the message thread occupies the full viewport height
AND the input is pinned to the bottom
AND the thread above the input is independently scrollable

### Requirement: Model loading progress

The first-visit model download SHALL communicate progress with both a percentage indicator and descriptive text sourced from the engine's progress callback.

#### Scenario: Determinate progress with descriptive text during model download

GIVEN a visitor opens the chat on a supported browser for the first time
WHEN the WebLLM engine downloads and initialises the model
THEN a determinate progress indicator advances from 0% to 100%
AND the progress label shows descriptive text sourced from the engine's `initProgressCallback` (e.g. "Loading weights 45/112")
AND the input field is enabled so the visitor may type while loading
AND any queued message is sent automatically once the model is ready

### Requirement: Unsupported browser fallback

Visitors on browsers without WebGPU SHALL still get a way to make contact.

#### Scenario: WebGPU is unavailable

GIVEN a visitor opens the chat page in a browser where WebGPU is not available
WHEN the page renders
THEN no chat UI is shown
AND a fallback with direct contact links (email, LinkedIn) is shown instead

### Requirement: CV-grounded responses

Assistant answers SHALL be scoped to Abhilash's real background.

#### Scenario: Assistant answers from CV data in third person

GIVEN the assistant is ready
WHEN the visitor asks about Abhilash's skills, experience, projects, or contact details
THEN the reply draws only on the build-time CV context
AND refers to Abhilash in the third person

### Requirement: Type during model load

While the local model is still initialising the visitor SHALL be able to type and submit a question. The submitted question is queued and auto-sent the moment the engine reaches `ready`.

#### Scenario: Visitor types and sends a question while model loads

GIVEN the visitor is on the chat page
AND the local model is still loading
WHEN the visitor types a non-empty question and presses Enter or clicks send
THEN the message appears in the thread immediately as a visitor message
AND a "waiting for model…" indicator replaces the normal blinking cursor
AND the question is sent to the model automatically once loading completes

#### Scenario: At-most-one queued message

GIVEN a message is already queued while the model is loading
WHEN the visitor tries to submit another message
THEN the send button is disabled until the queued message has been sent
AND only one message can be pending in the queue at a time

### Requirement: Loading content

While the local model loads the chat thread SHALL surface resume highlights so the visitor is not staring at an empty screen.

#### Scenario: Resume highlights shown during model load

GIVEN the visitor opens the chat page on a supported browser for the first time
WHEN the model is loading (state is `loading`)
THEN the thread shows a header "While the model loads, here's a quick look at my work…"
AND below it up to three cards are shown: current role summary, most recent project, top skill categories
AND each card is styled consistently with the assistant message bubble

#### Scenario: Loading content removed when model is ready

GIVEN loading content cards are visible in the thread
WHEN the engine transitions to `ready`
THEN the loading content cards are replaced by the standard welcome message (or first assistant response if a queued message was sent)
AND no loading content cards remain in the thread after the model is ready

### Requirement: Fast initial response via lightweight model

On the first question of a session the engine SHALL answer using the 1B model so the visitor gets a response sooner, then transparently upgrade to the 3B model for subsequent turns.

#### Scenario: First response arrives faster via 1B model

GIVEN the visitor has sent or queued their first question
WHEN the 1B model finishes loading before the 3B model
THEN the 1B model generates the answer to the first question
AND the reply appears in the thread without the visitor waiting for the 3B model

#### Scenario: Subsequent responses use 3B model

GIVEN the first reply has been generated by the 1B model
AND the 3B model has finished loading in the background
WHEN the visitor sends a follow-up question
THEN the 3B model generates the reply
AND the swap is completely transparent — no UI indicator of model change

#### Scenario: 3B loads before visitor sends first question

GIVEN the visitor has not yet sent a message
WHEN the 3B model finishes loading (either directly or after 1B)
THEN the engine uses the 3B model for the first question
AND no extra delay is introduced for the swap
