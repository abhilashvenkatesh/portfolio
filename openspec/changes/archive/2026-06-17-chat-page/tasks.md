## 1. Content & build-time context

- [x] 1.1 Populate `content/chat-chips.json` with the six chips: "What are his top skills?", "Tell me about his role at Rapido", "Which projects has he led?", "How can I get in touch?", "What's his current role?", "What cloud platforms does he know?"
- [x] 1.2 Create `lib/chat-context.ts` — serialise identity/experience/projects/skills/contact (via `lib/content.ts` loaders) into one third-person, CV-only system-prompt string exported as a `const`. Confirm it appears in the bundle (no runtime `fs`).
- [x] 1.3 Run `npm run validate-content` to confirm the populated chips pass content validation.

## 2. WebLLM engine provider

- [x] 2.1 Create `components/chat/WebLLMProvider.tsx` (`"use client"`) — context exposing `{ state, progress, messages, send }` with state machine `unsupported | idle | loading | ready | thinking | error`.
- [x] 2.2 Detect WebGPU in a mount effect (`!navigator.gpu` → `unsupported`); only then dynamically `await import("@mlc-ai/web-llm")` and `CreateMLCEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC", { initProgressCallback })`, guarded by a ref so init runs once.
- [x] 2.3 Drive `progress` (0–1 → 0–100%) from `initProgressCallback`; set `ready` when init resolves.
- [x] 2.4 Implement `send(text)` — append user message + pending assistant placeholder, stream `engine.chat.completions.create({ stream: true, messages: [system, ...history] })` deltas into the placeholder, set `thinking` → `ready`; on failure write the CHAT-9 error text with the real contact email and return to `ready`. (Shared `runCompletion` covers both `send` and the handoff auto-answer.)

## 3. Chat UI components

- [x] 3.1 Create `components/chat/ChatMessage.tsx` — visitor right-aligned (`bg-accent-dim`/`text-accent`/`border-accent-border`, label "you"), assistant left-aligned (`bg-surface-alt`/`text-primary`, label "Abhilash"), avatar indicator each; render blinking `▍` on a pending assistant message.
- [x] 3.2 Create `components/chat/ChatThread.tsx` — `flex-1 overflow-y-auto`; auto-scroll effect on `messages` setting `scrollTop = scrollHeight`.
- [x] 3.3 Create `components/chat/SuggestionChips.tsx` — render the six chips only when `messages.length === 1 && messages[0].role === "assistant"`; click → `send(chip)`.
- [x] 3.4 Create `components/chat/ChatInput.tsx` — pinned input form; Enter/button submit; placeholder "Thinking…" while `thinking`; send button disabled + muted when input empty or `state !== "ready"`.
- [x] 3.5 Create `components/chat/UnsupportedFallback.tsx` — no chat UI; direct contact links (email + LinkedIn from `getContactInfo()`).
- [x] 3.6 Add the compact header (pulsing accent dot + "Chat with my résumé" + grounding subtitle) — inline in `ChatClient`, not `PageHeader`.

## 4. Page assembly & handoff

- [x] 4.1 Create `app/chat/page.tsx` + `components/chat/ChatClient.tsx` — full-height flex column (header, thread, input) sized to the main area below the 60px nav, wrapped in `WebLLMProvider`. NOTE: the route is a server page (reads build-time CV data) that renders a `"use client"` `ChatClient` island, because `lib/chat-context.ts` imports `fs`-backed loaders that cannot be bundled into a Client Component.
- [x] 4.2 Seed welcome message on fresh visit; render the model-load progress bar (0–100%) while `loading`.
- [x] 4.3 Read `?q=` via `useSearchParams` inside a `<Suspense>` boundary; on present `q`, seed thread with the visitor question (skip welcome) and auto-answer once `state === "ready"`, guarded by `handoffDoneRef`.

## 5. Tests

- [x] 5.1 Unit test `lib/chat-context.ts` — asserts identity/experience/projects/skills/contact content is present and instructions are third-person/CV-only.
- [x] 5.2 DOM test the chat page with a mocked WebLLM engine (no real model): welcome message + six chips visible initially; chips hidden after a chip is sent; visitor/assistant bubble alignment & labels; "Thinking…" placeholder + `▍` while pending; send disabled when empty; CHAT-9 error text on failure; handoff (`?q=`) seeds question and skips welcome.
- [x] 5.3 DOM test `UnsupportedFallback` renders contact links when WebGPU is absent.
- [x] 5.4 Run `npm test` and confirm all tests pass. (126 passed.)

## 6. DOM / Visual Verification

- [x] 6.1 Run `npm run verify-dom` (79 passed). NOTE: `/chat` is a client-only experience (server render is an empty Suspense shell), so there is no static chat header for verify-dom to assert; no existing label assertions were affected.
- [ ] 6.2 Manually verify in a WebGPU browser across desktop + mobile widths: full-viewport thread, pinned input, progress bar during first load, auto-scroll, light/dark themes — capture evidence. Confirm no overlap, clipping, or layout shift. (Deferred — requires a real WebGPU browser; not runnable in this headless environment. Mocked integration tests + a clean `next build` stand in for now.)

## 7. Quality Gates

- [x] 7.1 Run `npm run typecheck` and confirm zero errors.
- [x] 7.2 Run `npm run lint` and confirm zero errors.
- [x] 7.3 Run `npm run design-lint` and confirm it passes.
- [x] 7.4 Run `openspec validate chat-page --type change --strict` and confirm the change is valid.
