## 1. Setup & Packages

- [ ] 1.1 Install Vercel AI SDK: `npm install ai` (no `@ai-sdk/anthropic` needed — gateway routes via model string prefix)
- [ ] 1.2 Add `AI_GATEWAY_API_KEY` to `.env.local` (for local dev) and document in `.env.example`; create key at vercel.com/[team]/~/ai-gateway/api-keys and add to Vercel project env vars
- [ ] 1.3 Verify `@mlc-ai/web-llm@0.2.84` type definitions export `progressCallback.text` field; note actual field name for use in ModelProvider

## 2. ModelProvider (layout-level engine lifecycle)

- [ ] 2.1 Create `components/providers/ModelProvider.tsx` (`"use client"`): exports `ModelContext` with `{ modelState: ModelState, progress: number, progressText: string }` and an internal `useEngineRef()` hook for ChatProvider consumption
- [ ] 2.2 Implement 1B engine boot in `ModelProvider`: `CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1-MLC")` with `initProgressCallback` capturing both `progress * 100` and `text`; set `modelState` to `"loading"` then `"ready-1b"` (internal) once done
- [ ] 2.3 After 1B is ready, immediately start loading 3B (`CreateMLCEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC")`) in background; swap `activeEngineRef` when 3B resolves; expose external `modelState` as `"ready"` for both ready states
- [ ] 2.4 WebGPU gate in `ModelProvider`: detect `(navigator as Navigator & { gpu?: unknown }).gpu`; if absent, set `modelState` to `"unsupported"` and skip engine init
- [ ] 2.5 Export `ModelState` type: `"unsupported" | "idle" | "loading" | "ready" | "error"` from `ModelProvider.tsx`; export `useModelContext()` hook

## 3. Providers Wrapper & Layout Update

- [ ] 3.1 Create `components/providers/Providers.tsx` (`"use client"`): wraps `ThemeProvider` and `ModelProvider` and `SWRegistrar` together; accepts children
- [ ] 3.2 Update `app/layout.tsx`: replace `<ThemeProvider>` with `<Providers>`; no other layout changes

## 4. ChatProvider (messages, send, queue)

- [ ] 4.1 Create `components/chat/ChatProvider.tsx` (`"use client"`): consumes `ModelContext` for engine access; owns `messages: ChatMessageData[]`, `pendingQueue: string | null`, `chatState: ChatState` (adds `"thinking"` on top of `modelState`)
- [ ] 4.2 Implement `send(text)` in `ChatProvider`: if engine ready → run completion; if engine loading and no queued message → store in `pendingQueue`; if engine loading and already queued → no-op
- [ ] 4.3 Implement queue flush: when `ModelProvider` transitions to `"ready"`, `ChatProvider` reads `pendingQueue`, clears it, and calls `runCompletion` automatically
- [ ] 4.4 Implement `runCompletion` in `ChatProvider`: streams from `activeEngineRef.current.chat.completions.create(…)` using the same system prompt pattern as the old `WebLLMProvider`; sets `chatState` through `"thinking"` → `"ready"` cycle
- [ ] 4.5 Implement home→chat handoff in `ChatProvider`: if initial messages contain a trailing user message (`?q=` path) AND the API fallback has NOT already answered it, auto-send once engine is ready
- [ ] 4.6 Export `useChatContext()` hook from `ChatProvider.tsx`
- [ ] 4.7 Remove `components/chat/WebLLMProvider.tsx` after `ChatProvider` and `ModelProvider` fully replace it

## 5. ChatClient Update

- [ ] 5.1 Update `components/chat/ChatClient.tsx`: mount `ChatProvider` as root wrapper; remove `WebLLMProvider` usage; consume `useChatContext()` for messages/send/chatState and `useModelContext()` for modelState/progress/progressText
- [ ] 5.2 Pass new props to `ChatClient` from `app/chat/page.tsx`: `loadingContent: { currentRole: string; latestProject: string; topSkills: string }` populated from `experience.json`, `projects.json`, `skills.json` at build time

## 6. Richer Progress Text

- [ ] 6.1 Update `ModelProvider` `initProgressCallback`: capture `report.text` (or equivalent field confirmed in task 1.3) and set `progressText` state; keep `progress` (pct 0–100) separate
- [ ] 6.2 Update progress display in `ChatClient` / loading UI: render `progressText` below the progress bar using `text-secondary text-sm font-mono`; fall back to `"Initialising…"` if text is empty

## 7. Type-During-Load Queue (ChatInput update)

- [ ] 7.1 Update `ChatInput` props: replace `disabled: boolean` with `modelLoading: boolean` and `thinking: boolean`; component is enabled when not `thinking` (regardless of `modelLoading`) unless a message is already queued
- [ ] 7.2 Update `ChatInput` placeholder: show `"Thinking…"` when thinking, `"Message queued — waiting for model…"` when a message is queued and model loading, `"Ask another question…"` otherwise
- [ ] 7.3 Update all `ChatInput` usage sites to pass the new props

## 8. Loading Content (Resume Highlights)

- [ ] 8.1 Create `components/chat/ChatLoadingContent.tsx`: renders three cards (current role summary, latest project name + tagline, top skill categories) inside the thread; styled as assistant message bubbles with `rounded-card` (12px) and `bg-surface`
- [ ] 8.2 Show `ChatLoadingContent` in `ChatClient` when `modelState === "loading"` and no API fallback response is in flight; remove cards when state transitions to `"ready"` or the first real assistant message arrives
- [ ] 8.3 Build the `loadingContent` object in `app/chat/page.tsx` at build time: `experience.json` first entry bullets[0] → `currentRole`; `projects.json` first entry name + tagline → `latestProject`; `skills.json` first category skills.slice(0, 4).join(", ") → `topSkills`

## 9. Two-Stage Model (1B → 3B Swap)

- [ ] 9.1 In `ModelProvider`, hold two engine refs: `engine1BRef` and `engine3BRef`; `activeEngineRef` starts as `engine1BRef` once 1B is ready, swapped to `engine3BRef` once 3B is ready
- [ ] 9.2 Implement atomic swap: when 3B engine resolves, if `chatState !== "thinking"` (no reply in flight), swap `activeEngineRef` immediately; if a reply is in flight, swap after `chatState` returns to `"ready"`
- [ ] 9.3 Surface `activeEngineRef` to `ChatProvider` via a stable callback `getActiveEngine(): StreamingEngine | null` exposed on `ModelContext`

## 10. API Fallback (Vercel AI Gateway Edge Route)

- [ ] 10.1 Create `app/api/chat/route.ts` as a Next.js Edge API route (`export const runtime = "edge"`); import `streamText` from `ai`
- [ ] 10.2 Gate the route: if `process.env.AI_GATEWAY_API_KEY` is absent return `Response.json({ error: "API fallback unavailable" }, { status: 503 })`
- [ ] 10.3 Implement route handler: accept `POST { question: string }`, call `streamText({ model: "anthropic/claude-haiku-4-5-20251001", system: CHAT_SYSTEM_PROMPT, messages: [{ role: "user", content: question }] })`, return `result.toDataStreamResponse()` — Vercel AI SDK routes to gateway via `AI_GATEWAY_API_KEY` automatically
- [ ] 10.4 In `ChatClient` / `ChatProvider`: on mount, if `searchParams.q` is present AND `modelState === "loading"`, POST to `/api/chat` and stream the response into the thread as the first assistant message; set `apiAnswered = true` ref
- [ ] 10.5 On API stream completion, mark `apiAnswered` true; subsequent messages route to local engine once ready; ensure home→chat handoff in `ChatProvider` (task 4.5) is skipped if `apiAnswered` is true
- [ ] 10.6 On API error (network failure, 5xx, 503): silently ignore; allow normal queue-and-wait flow to proceed

## 11. Service Worker Cache Warming

- [ ] 11.1 Create `public/sw.js`: on `install` event, extract model weight shard URLs from the MLC `prebuiltAppConfig` for `Llama-3.2-3B-Instruct-q4f16_1-MLC` and fetch them in batches of 2 into `caches.open("mlc-weights-v1")`; on `activate` event delete old cache versions
- [ ] 11.2 Create `components/providers/SWRegistrar.tsx` (`"use client"`): calls `navigator.serviceWorker?.register("/sw.js")` inside `requestIdleCallback` (or `setTimeout` fallback) on mount; no-op if SW is not supported
- [ ] 11.3 Add `SWRegistrar` to `Providers` wrapper (task 3.1)
- [ ] 11.4 Confirm SW does not intercept page navigation or API requests — fetch handler should be absent or scoped to CDN weight URLs only

## 12. WebGPU Badge on ChatLauncher

- [ ] 12.1 Update `components/home/ChatLauncher.tsx`: add `useState<boolean | null>(null)` for `gpuSupported`; set via `useEffect` after mount using `(navigator as Navigator & { gpu?: unknown }).gpu` detection
- [ ] 12.2 Render badge below the chat input: if `null` render nothing; if `true` render accent-coloured `"Works in your browser"` badge; if `false` render muted/warning `"Requires Chrome or Edge 113+"` badge
- [ ] 12.3 Badge uses `rounded-full` pill, `text-xs font-mono`, appropriate `bg-accent-dim text-accent` (supported) or `bg-surface-alt text-secondary` (unsupported) tokens

## 13. Tests

- [ ] 13.1 Add unit tests for `ModelProvider`: mock `CreateMLCEngine`; assert `modelState` progresses `idle → loading → ready`; assert `progressText` is populated from callback
- [ ] 13.2 Add unit tests for `ChatProvider` type-during-load: simulate `modelState === "loading"`, call `send("hello")`, assert message queued; transition to `"ready"`, assert queued message auto-sent and clears queue
- [ ] 13.3 Add unit tests for `ChatLoadingContent`: render with sample `loadingContent` props; assert all three cards are present in the DOM
- [ ] 13.4 Add unit tests for `ChatLauncher` WebGPU badge: mock `navigator.gpu = undefined` → assert warning badge text visible; mock `navigator.gpu = {}` → assert supported badge text visible; no badge on initial render (SSR sim)
- [ ] 13.5 Add unit tests for `/api/chat` edge route: mock Vercel AI SDK `streamText`; assert 503 when `ANTHROPIC_API_KEY` absent; assert streaming response when key present
- [ ] 13.6 Add unit tests for `ChatInput` queue mode: assert input enabled when `modelLoading && !queued`; assert input disabled when `modelLoading && queued`; assert placeholder text matches spec in each state
- [ ] 13.7 Run `npm test` and confirm all tests pass with zero failures

## 14. DOM / Visual Verification

- [ ] 14.1 Start dev server (`npm run dev`); navigate to home page; confirm ChatLauncher WebGPU badge renders correctly in Chrome (supported) and absent on initial paint
- [ ] 14.2 Navigate to `/chat`; confirm progress bar shows descriptive text (e.g. "Loading weights…") not just percentage
- [ ] 14.3 Confirm loading content cards appear in thread during model load; confirm they disappear once model is ready
- [ ] 14.4 While model is loading, type a question and send; confirm message appears in thread with "waiting for model…" placeholder; confirm it auto-sends once model is ready
- [ ] 14.5 Navigate from home via `?q=` handoff; confirm instant API response appears in thread before model finishes loading
- [ ] 14.6 Confirm no layout shift, text overlap, or missing content across mobile (375px) and desktop (1280px) viewports for all changed UI surfaces

## 15. Quality Gates

- [ ] 15.1 Run `npm run typecheck` and confirm zero errors
- [ ] 15.2 Run `npm run lint` and confirm zero errors
- [ ] 15.3 Run `npm run build` and confirm successful production build
- [ ] 15.4 Run `openspec validate webllm-ux-improvements --type change --strict` and confirm change is valid
