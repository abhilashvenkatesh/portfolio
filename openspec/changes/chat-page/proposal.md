---
linear_story_id: "POR-177"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-177/ai-chat-page-full-webllm-experience"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-17T10:30:00Z
finished_at: null      # ISO8601, set at archive
session_ids: ["63ec8105-fc44-43bf-a6a1-88207752fa57"]
---

## Why

The home page chat launcher already routes visitors to `/chat?q=…`, but `/chat` does not exist — the handoff dead-ends. Visitors who want to ask about Abhilash's background in natural language have nowhere to land. This change builds the full-page WebLLM chat experience that the launcher, navigation, and architecture already assume.

## What Changes

- Add the `/chat` route as a client-only shell that runs an in-browser WebLLM engine (`Llama-3.2-3B-Instruct-q4f16_1-MLC`) — no backend, all inference on-device via WebGPU.
- Full-viewport chat layout: scrollable thread above, input pinned to the bottom.
- Page header "Chat with my résumé" with a pulsing accent dot and CV-grounding subtitle.
- Welcome message + six suggestion chips (sourced from `content/chat-chips.json`) shown only while the welcome message is alone; clicking a chip sends immediately.
- Message thread with right-aligned visitor bubbles (accent-tinted) and left-aligned assistant bubbles (neutral), each with avatar + label.
- Streaming "thinking" indicator (blinking `▍` cursor) and `Thinking…` input placeholder while a reply generates; send button disabled/muted when input is empty or a response is loading.
- Auto-scroll to the newest message.
- Home→chat handoff: arriving with `?q=` seeds the thread with the visitor's question and auto-sends once the engine is ready (welcome skipped on handoff).
- First-visit model download shows a determinate 0–100% progress bar via `initProgressCallback`.
- Build-time system prompt: `lib/chat-context.ts` serialises identity/experience/projects/skills/contact into a grounding `const` bundled into the page.
- Graceful degradation: when `navigator.gpu` is absent, render a fallback with direct contact links — no chat UI.
- Error fallback (CHAT-9) when a reply cannot be generated.
- Populate `content/chat-chips.json` with the six prompt chips (currently empty).

## Capabilities

### New Capabilities

- `chat-page`: The full-page in-browser AI chat experience at `/chat` — layout, header, welcome + chips, messaging, streaming/pending indicator, auto-scroll, home handoff, model-load progress, error fallback, and unsupported-browser fallback.

### Modified Capabilities

<!-- No spec-level behaviour changes to existing capabilities. The home-chat-launcher
     already routes to /chat?q=; this change satisfies that contract without altering it. -->

## Impact

- **New code**: `app/chat/page.tsx` (client shell), `components/chat/*` (`WebLLMProvider`, `ChatThread`, `ChatMessage`, `ChatInput`, `SuggestionChips`, unsupported/error fallbacks), `lib/chat-context.ts` (build-time system prompt).
- **Content**: `content/chat-chips.json` populated with six chips.
- **Dependencies**: `@mlc-ai/web-llm` (already in `package.json`).
- **Nav**: `/chat` becomes a live destination (active-state highlighting).
- **Requirements**: satisfies CHAT-1 … CHAT-10 in `documentation/REQUIREMENTS.md`.
- **Constraints**: WebGPU-only (Chrome/Edge 113+); ~2.1GB first-visit model download cached in the browser Cache API.
