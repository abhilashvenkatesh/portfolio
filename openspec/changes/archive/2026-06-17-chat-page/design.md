## Context

The home chat launcher routes to `/chat?q=…`, the Nav already links `/chat`, and
`documentation/ARCHITECTURE.md` §6 specifies a WebLLM chat architecture — but the route
does not exist. This change implements that route. All inference runs in-browser via
WebGPU (`@mlc-ai/web-llm`); there is no backend. The page is the only non-SSG route in
the app — a client-only shell. Visual ground truth: `documentation/design/chat.html`
(note: the prototype calls a harness `window.claude.complete`; production uses WebLLM).

## Goals / Non-Goals

**Goals**
- Implement `/chat` satisfying CHAT-1 … CHAT-10 and the `chat-page` spec.
- On-device, grounded answers from a build-time CV system prompt.
- Graceful WebGPU-absent fallback; determinate model-load progress.
- Seamless home→chat handoff (auto-send `?q=`).

**Non-Goals**
- Multi-turn memory beyond the visible thread / server persistence.
- Streaming markdown rendering (replies are plain text, `whitespace-pre-wrap`).
- Model choice UI, retries, or rate limiting.
- Changing the home launcher contract (already routes `?q=`).

## Project Facts Preflight

- **Dependencies checked**: `package.json` confirms `@mlc-ai/web-llm@^0.2.84` (installed). No new deps required.
- **Icon/export availability checked**: N/A — send/dot icons are inline SVG (per `ChatLauncher.tsx` pattern); no `lucide-react` brand icons involved.
- **Design tokens/classes checked**: `styles/globals.css` confirms `--color-accent`, `--color-surface`, `--color-surface-alt`, `--color-accent-dim`, `--color-accent-border` (light + `[data-theme="dark"]`). Tailwind v4 classes `bg-accent`, `bg-surface-alt`, `text-accent`, `text-secondary`, `text-primary`, `border-surface-alt` all in use in `ChatLauncher.tsx`/`PageHeader.tsx`.
- **Existing components/helpers checked**:
  - `app/chat/` does **not** exist → create.
  - `components/chat/` does **not** exist → create (`WebLLMProvider`, `ChatThread`, `ChatMessage`, `ChatInput`, `SuggestionChips`, `UnsupportedFallback`).
  - `lib/chat-context.ts` does **not** exist → create. `lib/content.ts` already exposes `getIdentity`, `getExperience`, `getProjects`, `getSkills`, `getContactInfo`, `getChatChips`.
  - `content/chat-chips.json` exists but is **empty `[]`** → populate with the six chips.
  - `PageHeader` exists but is the large grid header (4xl); chat uses its own compact header (20px heading + pulsing dot) per prototype — do **not** reuse `PageHeader`.
  - `Nav.tsx` already lists `/chat` and computes active state from `usePathname`.
  - `app/layout.tsx` wraps pages in `<main className="flex-1 pt-15">` (60px nav offset) → chat fills `calc(100vh - 60px)`... actually `100dvh` minus nav; size the page to the main area.
- **Scripts checked**: `package.json` confirms `test` = `vitest run`, `typecheck`, `lint` = `eslint .`, `design-lint` = `tsx scripts/validate-design.ts`, `validate-content`, `verify-dom`, `build`. Tests use `vitest@^4` + `@testing-library/react@^16`.

## Decisions

### Client-only route, no SSG
`app/chat/page.tsx` is `"use client"`. WebGPU/WebLLM are browser-only; there is nothing
to prerender. Static export of the shell still happens, but all logic runs after hydration.
*Alternative*: server shell + client island — unnecessary indirection for a page that is
entirely interactive.

### Dynamic import of `@mlc-ai/web-llm`
The engine is ~MBs of JS plus a multi-GB model. Import it with `await import(...)` inside the
provider's init effect (bundle-dynamic-imports / bundle-conditional), so the library is not in
the initial route bundle and is only fetched when a supported visitor reaches the page.
*Alternative*: top-level static import — bloats the first load for all visitors including
unsupported browsers that will never use it.

### `WebLLMProvider` owns the engine; init once
A client context provider exposes `{ state, progress, messages, send }`. The `MLCEngine`
is created once (guarded by a ref, advanced-init-once) via
`CreateMLCEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC", { initProgressCallback })`. The
callback drives `progress` (0–1 → 0–100%). State machine mirrors ARCHITECTURE §6:
`unsupported | idle | loading | ready | thinking | error`.
*Alternative*: engine in page component — re-init risk on re-render; provider keeps it stable.

### WebGPU detection gates the whole experience
On mount, if `typeof navigator !== "undefined" && !navigator.gpu` → state `unsupported`,
render `UnsupportedFallback` (email + LinkedIn from `getContactInfo()`), and never import
web-llm. Detection runs in an effect (client) to avoid SSR/hydration mismatch — server
render shows a neutral loading shell, effect resolves true state.

### Build-time system prompt as a bundled `const`
`lib/chat-context.ts` reads identity/experience/projects/skills/contact via `lib/content.ts`
loaders and serialises one markdown string (third-person, "answer in 2–4 sentences, only from
this data"). The page imports it; since the page is a Client Component the string is bundled
at build — no runtime `fs`. Each `send` calls
`engine.chat.completions.create({ stream: true, messages: [{role:"system",content:CONTEXT}, ...history] })`
and appends streamed deltas to the pending assistant message.
*Alternative*: per-message prompt concat (prototype style) — system role is cleaner and
keeps history coherent.

### Chips sourced from `content/chat-chips.json`
Populate the empty file with the six prompts (DATA-7). `SuggestionChips` renders only when
`messages.length === 1 && messages[0].role === "assistant"` (welcome alone). Click → `send(chip)`.

### Handoff via `useSearchParams` inside a Suspense boundary
Next 15 requires `useSearchParams()` consumers to be wrapped in `<Suspense>`. The page reads
`q`; if present, the initial thread is `[{role:"user",text:q}]` (welcome skipped, per decision),
and an effect auto-calls `send(q)` once `state === "ready"`, guarded by a `sentRef` so it fires
once.

### Layout
Page root: flex column, height = main viewport area (nav is `pt-15` = 60px). Header (compact,
pulsing dot) on top, `ChatThread` is `flex-1 overflow-y-auto`, `ChatInput` form pinned at the
bottom. Auto-scroll: effect on `messages` sets `scrollRef.scrollTop = scrollHeight`
(passive, cheap). Visitor bubble `bg-accent-dim`/`text-accent`/`border-accent-border` right-
aligned; assistant `bg-surface-alt`/`text-primary` left-aligned.

## Risks / Trade-offs

- **~2.1GB first-visit model download** -> determinate progress bar + status text; cached in
  Cache API so subsequent loads are instant. Documented constraint, accepted.
- **WebGPU-only (Chrome/Edge 113+, no Firefox/Safari/iOS)** -> `UnsupportedFallback` with direct
  contact links; never import web-llm on unsupported browsers.
- **SSR/hydration mismatch on `navigator.gpu`** -> resolve capability in an effect, render a
  stable neutral shell on the server (rendering-hydration-no-flicker).
- **`useSearchParams` without Suspense breaks `next build`** -> wrap the searchParams consumer in
  `<Suspense>`.
- **Stale `.next` poisons `next dev` after a build** -> known gotcha; `rm -rf .next` if the dev
  server 500s with a manifest error.
- **Model output may drift off-CV** -> strict system prompt (third person, only-from-data,
  2–4 sentences); accepted for a portfolio toy.
- **Tests can't run WebGPU/WebLLM in jsdom** -> mock the provider/engine boundary in unit tests
  (assert UI states from a faked `send`/`state`), not real inference.

## Migration Plan

Purely additive: new route + components + `lib/chat-context.ts` + populated `chat-chips.json`.
No schema or existing-component changes. Deploy via normal Vercel build (CI:
typecheck → lint → design-lint → validate-content → build). Rollback = remove `app/chat/` and
`components/chat/`; the Nav link would then 404 (revert that too if rolling back).

## Open Questions

None — model (Llama-3.2-3B), loading UX (determinate progress bar), and handoff behaviour
(skip welcome) were resolved during grilling. No in-force ADRs to revisit.
