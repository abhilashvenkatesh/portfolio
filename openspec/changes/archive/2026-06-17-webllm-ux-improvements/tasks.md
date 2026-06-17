## 1. Setup & Packages

- [x] 1.1 Install Vercel AI SDK: `npm install ai` (no `@ai-sdk/anthropic` needed — gateway routes via model string prefix)
- [x] 1.2 Add `AI_GATEWAY_API_KEY` to `.env.local` (for local dev) and document in `.env.example`; create key at vercel.com/[team]/~/ai-gateway/api-keys and add to Vercel project env vars
- [x] 1.3 Verify `@mlc-ai/web-llm@0.2.84` type definitions export `progressCallback.text` field; note actual field name for use in ModelProvider

## 2. ModelProvider (layout-level engine lifecycle)

- [x] 2.1 Create `components/providers/ModelProvider.tsx` (`"use client"`): exports `ModelContext` with `{ modelState: ModelState, progress: number, progressText: string }` and an internal `useEngineRef()` hook for ChatProvider consumption
- [x] 2.2 Implement 1B engine boot in `ModelProvider`: `CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC")` with `initProgressCallback` capturing both `progress * 100` and `text`; set `modelState` to `"loading"` then `"ready-1b"` (internal) once done
- [x] 2.3 After 1B is ready, immediately start loading 3B (`CreateMLCEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC")`) in background; swap `activeEngineRef` when 3B resolves; expose external `modelState` as `"ready"` for both ready states
- [x] 2.4 WebGPU gate in `ModelProvider`: detect `(navigator as Navigator & { gpu?: unknown }).gpu`; if absent, set `modelState` to `"unsupported"` and skip engine init
- [x] 2.5 Export `ModelState` type: `"unsupported" | "idle" | "loading" | "ready" | "error"` from `ModelProvider.tsx`; export `useModelContext()` hook

## 3. Providers Wrapper & Layout Update

- [x] 3.1 Create `components/providers/Providers.tsx` (`"use client"`): wraps `ThemeProvider` and `ModelProvider` and `SWRegistrar` together; accepts children
- [x] 3.2 Update `app/layout.tsx`: replace `<ThemeProvider>` with `<Providers>`; no other layout changes

## 4. ChatProvider (messages, send, queue)

- [x] 4.1 Create `components/chat/ChatProvider.tsx` (`"use client"`): consumes `ModelContext` for engine access; owns `messages: ChatMessageData[]`, `pendingQueue: string | null`, `chatState: ChatState` (adds `"thinking"` on top of `modelState`)
- [x] 4.2 Implement `send(text)` in `ChatProvider`: if engine ready → run completion; if engine loading and no queued message → store in `pendingQueue`; if engine loading and already queued → no-op
- [x] 4.3 Implement queue flush: when `ModelProvider` transitions to `"ready"`, `ChatProvider` reads `pendingQueue`, clears it, and calls `runCompletion` automatically
- [x] 4.4 Implement `runCompletion` in `ChatProvider`: streams from `activeEngineRef.current.chat.completions.create(…)` using the same system prompt pattern as the old `WebLLMProvider`; sets `chatState` through `"thinking"` → `"ready"` cycle
- [x] 4.5 Implement home→chat handoff in `ChatProvider`: if initial messages contain a trailing user message (`?q=` path) AND the API fallback has NOT already answered it, auto-send once engine is ready
- [x] 4.6 Export `useChatContext()` hook from `ChatProvider.tsx`
- [x] 4.7 Remove `components/chat/WebLLMProvider.tsx` after `ChatProvider` and `ModelProvider` fully replace it

## 5. ChatClient Update

- [x] 5.1 Update `components/chat/ChatClient.tsx`: mount `ChatProvider` as root wrapper; remove `WebLLMProvider` usage; consume `useChatContext()` for messages/send/chatState and `useModelContext()` for modelState/progress/progressText
- [x] 5.2 Pass new props to `ChatClient` from `app/chat/page.tsx`: `loadingContent: { currentRole: string; latestProject: string; topSkills: string }` populated from `experience.json`, `projects.json`, `skills.json` at build time

## 6. Richer Progress Text

- [x] 6.1 Update `ModelProvider` `initProgressCallback`: capture `report.text` (or equivalent field confirmed in task 1.3) and set `progressText` state; keep `progress` (pct 0–100) separate
- [x] 6.2 Update progress display in `ChatClient` / loading UI: render `progressText` below the progress bar using `text-secondary text-sm font-mono`; fall back to `"Initialising…"` if text is empty

## 7. Type-During-Load Queue (ChatInput update)

- [x] 7.1 Update `ChatInput` props: replace `disabled: boolean` with `modelLoading: boolean` and `thinking: boolean`; component is enabled when not `thinking` (regardless of `modelLoading`) unless a message is already queued
- [x] 7.2 Update `ChatInput` placeholder: show `"Thinking…"` when thinking, `"Message queued — waiting for model…"` when a message is queued and model loading, `"Ask another question…"` otherwise
- [x] 7.3 Update all `ChatInput` usage sites to pass the new props

## 8. Loading Content (Resume Highlights)

- [x] 8.1 Create `components/chat/ChatLoadingContent.tsx`: renders three cards (current role summary, latest project name + tagline, top skill categories) inside the thread; styled as assistant message bubbles with `rounded-card` (12px) and `bg-surface`
- [x] 8.2 Show `ChatLoadingContent` in `ChatClient` when `modelState === "loading"` and no API fallback response is in flight; remove cards when state transitions to `"ready"` or the first real assistant message arrives
- [x] 8.3 Build the `loadingContent` object in `app/chat/page.tsx` at build time: `experience.json` first entry bullets[0] → `currentRole`; `projects.json` first entry name + tagline → `latestProject`; `skills.json` first category skills.slice(0, 4).join(", ") → `topSkills`

## 9. Two-Stage Model (1B → 3B Swap)

- [x] 9.1 In `ModelProvider`, hold two engine refs: `engine1BRef` and `engine3BRef`; `activeEngineRef` starts as `engine1BRef` once 1B is ready, swapped to `engine3BRef` once 3B is ready
- [x] 9.2 Implement atomic swap: when 3B engine resolves, if `chatState !== "thinking"` (no reply in flight), swap `activeEngineRef` immediately; if a reply is in flight, swap after `chatState` returns to `"ready"`
- [x] 9.3 Surface `activeEngineRef` to `ChatProvider` via a stable callback `getActiveEngine(): StreamingEngine | null` exposed on `ModelContext`

## 10. API Fallback (Vercel AI Gateway Edge Route)

- [x] 10.1 Create `app/api/chat/route.ts` as a Next.js Edge API route (`export const runtime = "edge"`); import `streamText` from `ai`
- [x] 10.2 Gate the route: if `process.env.AI_GATEWAY_API_KEY` is absent return `Response.json({ error: "API fallback unavailable" }, { status: 503 })`
- [x] 10.3 Implement route handler: accept `POST { question: string }`, call `streamText({ model: "anthropic/claude-haiku-4-5-20251001", system: CHAT_SYSTEM_PROMPT, messages: [{ role: "user", content: question }] })`, return `result.toTextStreamResponse()`
- [x] 10.4 In `ChatClient` / `ChatProvider`: on mount, if `searchParams.q` is present AND `modelState === "loading"`, POST to `/api/chat` and stream the response into the thread as the first assistant message; set `apiAnswered = true` ref
- [x] 10.5 On API stream completion, mark `apiAnswered` true; subsequent messages route to local engine once ready; ensure home→chat handoff in `ChatProvider` (task 4.5) is skipped if `apiAnswered` is true
- [x] 10.6 On API error (network failure, 5xx, 503): silently ignore; allow normal queue-and-wait flow to proceed

## 11. Service Worker Cache Warming

- [x] 11.1 Create `public/sw.js`: cache-on-fetch strategy for HuggingFace/GitHub weight URLs; on `activate` delete old cache versions
- [x] 11.2 Create `components/providers/SWRegistrar.tsx` (`"use client"`): calls `navigator.serviceWorker?.register("/sw.js")` inside `requestIdleCallback` (or `setTimeout` fallback) on mount; no-op if SW is not supported
- [x] 11.3 Add `SWRegistrar` to `Providers` wrapper (task 3.1)
- [x] 11.4 Confirm SW does not intercept page navigation or API requests — fetch handler scoped to CDN weight URLs only

## 12. WebGPU Badge on ChatLauncher

- [x] 12.1 Update `components/home/ChatLauncher.tsx`: detect GPU via `useSyncExternalStore` (null server snapshot, real value on client — avoids setState-in-effect)
- [x] 12.2 Render badge below the chat input: if `null` render nothing; if `true` render accent-coloured `"Works in your browser"` badge; if `false` render muted/warning `"Requires Chrome or Edge 113+"` badge
- [x] 12.3 Badge uses `rounded-full` pill, `text-xs font-mono`, appropriate `bg-accent-dim text-accent` (supported) or `bg-surface-alt text-secondary` (unsupported) tokens

## 13. Tests

- [x] 13.1 Add unit tests for `ModelProvider`: mock `CreateMLCEngine`; assert `modelState` progresses `idle → loading → ready`; assert `progressText` is populated from callback
- [x] 13.2 Add unit tests for `ChatProvider` type-during-load: simulate `modelState === "loading"`, call `send("hello")`, assert message queued; transition to `"ready"`, assert queued message auto-sent and clears queue
- [x] 13.3 Add unit tests for `ChatLoadingContent`: render with sample `loadingContent` props; assert all three cards are present in the DOM
- [x] 13.4 Add unit tests for `ChatLauncher` WebGPU badge: mock `navigator.gpu = undefined` → assert warning badge text visible; mock `navigator.gpu = {}` → assert supported badge text visible
- [x] 13.5 Add unit tests for `/api/chat` edge route: mock Vercel AI SDK `streamText`; assert 503 when key absent; assert streaming response when key present
- [x] 13.6 Add unit tests for `ChatInput` queue mode: assert input enabled when `modelLoading && !queued`; assert input disabled when `modelLoading && queued`; assert placeholder text matches spec in each state
- [x] 13.7 Run `npm test` and confirm all tests pass with zero failures — 141 tests, all pass

## 14. DOM / Visual Verification

- [ ] 14.1 Start dev server (`npm run dev`); navigate to home page; confirm ChatLauncher WebGPU badge renders correctly in Chrome (supported) and absent on initial paint
- [ ] 14.2 Navigate to `/chat`; confirm progress bar shows descriptive text (e.g. "Loading weights…") not just percentage
- [ ] 14.3 Confirm loading content cards appear in thread during model load; confirm they disappear once model is ready
- [ ] 14.4 While model is loading, type a question and send; confirm message appears in thread with "waiting for model…" placeholder; confirm it auto-sends once model is ready
- [ ] 14.5 Navigate from home via `?q=` handoff; confirm instant API response appears in thread before model finishes loading
- [ ] 14.6 Confirm no layout shift, text overlap, or missing content across mobile (375px) and desktop (1280px) viewports for all changed UI surfaces

## 15. Quality Gates

- [x] 15.1 Run `npm run typecheck` and confirm zero errors
- [x] 15.2 Run `npm run lint` and confirm zero errors
- [x] 15.3 Run `npm run build` and confirm successful production build
- [x] 15.4 Run `openspec validate --all --json` — change valid; `contact-page` spec failure is pre-existing (unrelated to POR-178)
