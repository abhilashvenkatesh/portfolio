# Capability: api-fallback

## Purpose

When a visitor arrives at `/chat` via the homepage launcher (`?q=` handoff) the system SHALL route the pre-filled question to Claude Haiku via the Vercel AI Gateway while the local WebLLM model continues loading in parallel. The instant API response eliminates the perceived wait for the first message. Subsequent messages are answered by the local model once ready, keeping all ongoing inference on-device.

## ADDED Requirements

### Requirement: Instant API response for homepage handoff query

When the chat page receives a pre-filled question via `?q=` the system SHALL answer it immediately using Claude Haiku through the Vercel AI Gateway instead of waiting for the local model to load.

#### Scenario: Pre-filled question answered via API before model is ready

GIVEN a visitor arrives at `/chat?q=<encoded question>` from the homepage launcher
AND the local model has not yet reached `ready`
WHEN the page mounts and the question is read from the URL
THEN the question is sent to the Vercel AI Gateway (`/api/chat` edge route) immediately
AND a streamed response begins appearing in the thread without waiting for the local model
AND the local model continues loading in parallel

#### Scenario: Subsequent messages use local model

GIVEN the first question has been answered via the API
AND the local model has since reached `ready`
WHEN the visitor sends a follow-up question
THEN the follow-up is answered by the local model
AND no further API calls are made

#### Scenario: API message is visually indistinguishable from local model messages

GIVEN the API is answering the first question
WHEN the response streams into the thread
THEN the assistant bubble styling is identical to a local model response
AND no badge or label indicates whether API or local model generated the reply

#### Scenario: Local model ready before API response completes

GIVEN the API is streaming a response
AND the local model unexpectedly reaches `ready` before the stream ends
WHEN the stream finishes
THEN the completed API response remains in the thread
AND subsequent messages route to the local model as normal

#### Scenario: API fallback only activates for homepage handoff

GIVEN a visitor navigates directly to `/chat` without a `?q=` parameter
WHEN the page loads
THEN no API call is made
AND the visitor types and the local model (or queued message) handles the response

### Requirement: Vercel AI Gateway edge route

A Next.js Edge API route at `/api/chat` SHALL proxy requests to Claude Haiku via the Vercel AI Gateway, with streaming response and CV-grounded system prompt identical to the local model's context.

#### Scenario: Edge route streams response

GIVEN a POST to `/api/chat` with a JSON body `{ "question": "<text>" }`
WHEN the Vercel AI Gateway forwards the request to Claude Haiku
THEN the route responds with a streaming text/event-stream response
AND the response token stream matches the Vercel AI SDK streaming format

#### Scenario: System prompt grounds API response in CV data

GIVEN the edge route receives a question
WHEN it constructs the Claude Haiku request
THEN the system prompt includes the same build-time CV context as the local model
AND Claude Haiku answers in the same scope and persona as the local model

#### Scenario: Route returns error on gateway failure

GIVEN the Vercel AI Gateway is unreachable or returns an error
WHEN the edge route handles the request
THEN it responds with HTTP 502 and a JSON body `{ "error": "API fallback unavailable" }`
AND the client silently falls back to waiting for the local model without surfacing an error to the visitor

### Requirement: API fallback silent failure handling

If the API call fails the visitor SHALL NOT see an error; the experience degrades to the standard local model loading flow.

#### Scenario: API error — visitor sees normal loading experience

GIVEN the pre-filled question was sent to the API
AND the API call failed (network error, 5xx, or timeout)
WHEN the client receives the error
THEN no error message is shown in the thread
AND the visitor sees the standard loading progress indicator
AND the pre-filled question is queued and sent to the local model once it becomes ready
