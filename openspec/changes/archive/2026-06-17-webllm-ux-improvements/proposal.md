# Proposal: webllm-ux-improvements

## Linear Issue

[POR-178 — WebLLM UX improvements — faster load & better experience](https://linear.app/abhilash-projects/issue/POR-178/webllm-ux-improvements-faster-load-and-better-experience)

## Problem

Current WebLLM chat experience is front-loaded with friction. The model (~2.1 GB) begins loading only when the user navigates to `/chat`, taking 30–60 seconds on first visit. During that entire window the input is disabled and the user sees a bare progress bar with no meaningful signal. Users who don't want to wait have no alternative. Browsers that don't support WebGPU hit a dead end only after navigating away from the home page.

## Proposed Solution

Eight targeted improvements across three effort tiers, all implemented in this change:

### Tier 1 — Low effort, immediate wins

1. **Type-during-load queue**: Allow the visitor to type (and submit) a question while the model is still loading. Queue the message and auto-send when engine reaches `ready`. Eliminates the "dead input" frustration.
2. **Richer progress signal**: Surface the `text` field from `initProgressCallback` (e.g. `"Loading weights 45/112"`) instead of a bare percentage. Progress feels real, not frozen.
3. **WebGPU detection on homepage**: Detect `navigator.gpu` on homepage mount and show a capability badge on `ChatLauncher`: "Works in your browser" vs "Requires Chrome/Edge". Prevents dead-end navigation for unsupported browsers.

### Tier 2 — Medium effort, high impact

4. **Layout-level model preload**: Lift `ModelProvider` (engine init, state, progress) to `app/layout.tsx` so it starts on any page visit. Split current `WebLLMProvider` into `ModelProvider` (layout) + `ChatProvider` (chat-only). Engine warms up on homepage; by the time user clicks Chat, it's already loading or done.
5. **Service Worker cache warming**: Install a SW on homepage that fetches model weights at browser idle time and stores in Cache API. Second-visit chat page skips the 2.1 GB download entirely — only GPU init remains (~5–10 s vs 60 s).
6. **Content while loading**: Surface resume highlights (projects, key roles) inside the chat thread while the model loads, with a "While the model loads, here's a quick look at my work…" header. Real chat takes over seamlessly when ready.

### Tier 3 — High effort, highest impact

7. **Two-stage model (1B → 3B)**: Load `Llama-3.2-1B-Instruct-q4f16_1-MLC` (~1 GB) first → answer immediately → load `Llama-3.2-3B` in background → swap engine silently. First response arrives in ~half the current wait.
8. **API fallback via Vercel AI Gateway**: Route the first message to Claude Haiku via the Vercel AI Gateway while the local model loads → instant response → switch to on-device model for subsequent messages. Eliminates all perceived wait. Costs money per first message; capped at the homepage-handoff query only (the `?q=` path) by default.

## Why Now

All eight improvements are self-contained and can ship together. Items 1–3 are pure UX polish with near-zero risk. Items 4–6 are architectural but well-contained within the WebLLM subsystem. Items 7–8 are the highest leverage changes and both require backend API surface (Vercel AI Gateway for item 8) which we want to introduce in one coherent PR rather than incrementally.

## Capabilities Affected

| Capability | Change |
|---|---|
| `chat-page` | Major — split provider, add queue, richer progress, loading content, two-stage model, API fallback |
| `home-chat-launcher` | Minor — WebGPU badge |
| `model-preloader` (new) | New — layout-level ModelProvider, SW cache warmer |
| `api-fallback` (new) | New — Vercel AI Gateway integration |

## Out of Scope

- Server-side rendering of chat responses
- Persistent message history across sessions
- Multi-model user selection UI
