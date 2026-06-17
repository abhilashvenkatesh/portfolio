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

On first open the assistant SHALL greet the visitor and explain what it is.

#### Scenario: Welcome message appears on a fresh visit

GIVEN a visitor opens the chat page without a pre-filled question
WHEN the thread first renders
THEN the assistant's only message reads "Hey! I'm a chat layer over Abhilash's resume. Ask me about his experience, projects, skills, or how to get in touch."

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

The visitor SHALL be able to type and submit free-form questions.

#### Scenario: Submitting via Enter or the send button

GIVEN the input contains non-empty text and the assistant is ready
WHEN the visitor presses Enter or clicks the send button
THEN the text is added to the thread as a visitor message
AND the input is cleared

#### Scenario: Send is disabled when there is nothing to send

GIVEN the input is empty OR a response is currently loading
WHEN the visitor views the send button
THEN the send button is disabled and visually muted
AND submitting has no effect

### Requirement: Message thread display

Visitor and assistant turns SHALL be visually distinguishable.

#### Scenario: Visitor message styling

GIVEN the visitor has sent a message
WHEN it appears in the thread
THEN it is right-aligned with an accent-tinted background
AND it shows the label "you" with an avatar indicator

#### Scenario: Assistant message styling

GIVEN the assistant has replied
WHEN the reply appears in the thread
THEN it is left-aligned with a neutral background
AND it shows the label "Abhilash" with an avatar indicator

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

A failed generation SHALL degrade to a helpful contact prompt.

#### Scenario: Assistant cannot process a question

GIVEN the visitor has sent a message
WHEN the assistant fails to generate a reply
THEN the assistant message reads "Sorry, I couldn't process that. Try rephrasing, or reach Abhilash directly at [email]." with the real contact email substituted

### Requirement: Full-page layout

The chat SHALL feel like a dedicated app, not an embedded widget.

#### Scenario: Full-viewport thread with pinned input

GIVEN a visitor opens the chat page
WHEN the page renders
THEN the message thread occupies the full viewport height
AND the input is pinned to the bottom
AND the thread above the input is independently scrollable

### Requirement: Model loading progress

The first-visit model download SHALL communicate its progress.

#### Scenario: Determinate progress during model download

GIVEN a visitor opens the chat on a supported browser for the first time
WHEN the WebLLM engine downloads and initialises the model
THEN a determinate progress indicator advances from 0% to 100%
AND the chat becomes interactive once the model is ready

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
