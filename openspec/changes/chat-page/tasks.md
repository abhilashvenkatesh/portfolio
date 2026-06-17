## 1. Content & build-time context

- [ ] 1.1 Populate `content/chat-chips.json` with the six chips: "What are his top skills?", "Tell me about his role at Rapido", "Which projects has he led?", "How can I get in touch?", "What's his current role?", "What cloud platforms does he know?"
- [ ] 1.2 Create `lib/chat-context.ts` — serialise identity/experience/projects/skills/contact (via `lib/content.ts` loaders) into one third-person, CV-only system-prompt string exported as a `const`. Confirm it appears in the bundle (no runtime `fs`).
- [ ] 1.3 Run `npm run validate-content` to confirm the populated chips pass content validation.

## 2. WebLLM engine provider

- [ ] 2.1 Create `components/chat/WebLLMProvider.tsx` (`"use client"`) — context exposing `{ state, progress, messages, send }` with state machine `unsupported | idle | loading | ready | thinking | error`.
- [ ] 2.2 Detect WebGPU in a mount effect (`!navigator.gpu` → `unsupported`); only then dynamically `await import("@mlc-ai/web-llm")` and `CreateMLCEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC", { initProgressCallback })`, guarded by a ref so init runs once.
- [ ] 2.3 Drive `progress` (0–1 → 0–100%) from `initProgressCallback`; set `ready` when init resolves.
- [ ] 2.4 Implement `send(text)` — append user message + pending assistant placeholder, stream `engine.chat.completions.create({ stream: true, messages: [system, ...history] })` deltas into the placeholder, set `thinking` → `ready`; on failure write the CHAT-9 error text with the real contact email and return to `ready`.

## 3. Chat UI components

- [ ] 3.1 Create `components/chat/ChatMessage.tsx` — visitor right-aligned (`bg-accent-dim`/`text-accent`/`border-accent-border`, label "you"), assistant left-aligned (`bg-surface-alt`/`text-primary`, label "Abhilash"), avatar indicator each; render blinking `▍` on a pending assistant message.
- [ ] 3.2 Create `components/chat/ChatThread.tsx` — `flex-1 overflow-y-auto`; auto-scroll effect on `messages` setting `scrollTop = scrollHeight`.
- [ ] 3.3 Create `components/chat/SuggestionChips.tsx` — render the six chips only when `messages.length === 1 && messages[0].role === "assistant"`; click → `send(chip)`.
- [ ] 3.4 Create `components/chat/ChatInput.tsx` — pinned input form; Enter/button submit; placeholder "Thinking…" while `thinking`; send button disabled + muted when input empty or `state !== "ready"`.
- [ ] 3.5 Create `components/chat/UnsupportedFallback.tsx` — no chat UI; direct contact links (email + LinkedIn from `getContactInfo()`).
- [ ] 3.6 Add the compact header (pulsing accent dot + "Chat with my résumé" + grounding subtitle) — inline in the page, not `PageHeader`.

## 4. Page assembly & handoff

- [ ] 4.1 Create `app/chat/page.tsx` (`"use client"`) — full-height flex column (header, thread, input) sized to the main area below the 60px nav; wrap with `WebLLMProvider`.
- [ ] 4.2 Seed welcome message on fresh visit; render the model-load progress bar while `loading`.
- [ ] 4.3 Read `?q=` via `useSearchParams` inside a `<Suspense>` boundary; on present `q`, seed thread with the visitor question (skip welcome) and auto-`send(q)` once `state === "ready"`, guarded by a `sentRef`.

## 5. Tests

- [ ] 5.1 Unit test `lib/chat-context.ts` — asserts identity/experience/projects/skills/contact content is present and instructions are third-person/CV-only.
- [ ] 5.2 DOM test the chat page with a mocked `WebLLMProvider` boundary (no real WebLLM): welcome message + six chips visible initially; chips hidden after first message; visitor/assistant bubble alignment & labels; "Thinking…" placeholder + `▍` while pending; send disabled when empty; CHAT-9 error text on failure; handoff (`?q=`) seeds question and skips welcome.
- [ ] 5.3 DOM test `UnsupportedFallback` renders contact links when WebGPU is absent.
- [ ] 5.4 Run `npm test` and confirm all tests pass.

## 6. DOM / Visual Verification

- [ ] 6.1 Run `npm run verify-dom` and confirm the chat page header/labels are detected; update its assertions if a checked label changed.
- [ ] 6.2 Manually verify in a WebGPU browser across desktop + mobile widths: full-viewport thread, pinned input, progress bar during first load, auto-scroll, light/dark themes — capture evidence. Confirm no overlap, clipping, or layout shift.

## 7. Quality Gates

- [ ] 7.1 Run `npm run typecheck` and confirm zero errors.
- [ ] 7.2 Run `npm run lint` and confirm zero errors.
- [ ] 7.3 Run `npm run design-lint` and confirm it passes.
- [ ] 7.4 Run `openspec validate chat-page --type change --strict` and confirm the change is valid.
