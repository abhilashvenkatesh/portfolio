# Retrospective: chat-page

> Written: 2026-06-17 (after verify passed)
> Commit range: `e662adf..f58ebe6`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-177` (https://linear.app/abhilash-projects/issue/POR-177/ai-chat-page-full-webllm-experience)
- **Lead time**: ~1h04m (`started_at` 2026-06-17T10:30Z → verify 2026-06-17T01:34Z; `finished_at` set at archive)
- **Diff size**: +1418 / -1 across 18 files, 4 commits
- **Tasks done**: 25/26
- **Requirements / Scenarios**: 13 / 17

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 398 / out 28116 / cache-read 6253227 / cache-write 543285
- **Total tokens**: 6825026
- **Cost**: $27.793061

### Quality Gates

- **OpenSpec validate**: fail (`--all` — pre-existing `spec/contact-page` only; `chat-page --strict` is valid)
- **Verify**: present=true, fail=false, rewrites=1
- **Unit tests**: pass (126/126)
- **Build**: pass (`/chat` prerenders static)

### Manual signals (not auto-captured — fill honestly)

- **Bugs post-merge**: none yet — one CRITICAL caught + fixed pre-merge in code review (`039f471`)
- **New external dependencies**: none (`@mlc-ai/web-llm` was already in package.json)
- **Correction cycles during apply**: 2 (lint set-state-in-effect; typecheck `navigator.gpu` type)

Commit chain:

```
e662adf chore(POR-177): propose chat-page — full WebLLM /chat experience
6d0ed92 feat(POR-177): chat page — WebLLM full-page /chat experience
039f471 fix(POR-177): read chat history from a synced ref, harden WebGPU check
f58ebe6 chore(POR-177): verify chat-page — PASS WITH WARNINGS
```

---

## 1. Wins

- Docs-first paid off: `ARCHITECTURE.md` §6 + `design/chat.html` pre-specified the state machine, model, and layout, so grilling reduced to 3 real decisions (`design.md` Decisions).
- TDD on the one pure unit (`lib/chat-context.ts`) — RED then GREEN (`chatContext.test.ts`).
- Mocking the `@mlc-ai/web-llm` engine + `useSearchParams` let 11 integration tests cover handoff, error, and unsupported paths with zero real model download (`ChatPage.test.tsx`).
- Code review caught a real history-capture bug before merge (`039f471`).

---

## 2. Misses

- 🟡 [painful] Wrote provider/components before their DOM tests — TDD discipline applied only to `chat-context`. UI tests were written after code (`6d0ed92` then tests same commit).
- 🟡 [painful] `send()` shipped a stale-history capture via a setState-updater side effect; only caught in review (`039f471`).
- 📌 [nit] Two avoidable gate failures: `set-state-in-effect` lint and `navigator.gpu` type error — both predictable from existing project memory/rules.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| 4.1 | `app/chat/page.tsx` became a server page rendering a `"use client"` `ChatClient` island, not a single client page | `lib/chat-context.ts` imports `fs`-backed loaders that cannot bundle into a Client Component |
| 2.4 / 4.3 | Single shared `runCompletion` powers both `send` and the handoff auto-answer; handoff guarded by `handoffDoneRef` rather than a `sentRef` in the page | Avoids duplicating the seeded user message |
| 6.2 | Deferred | Real-WebGPU-browser visual pass not runnable headless |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✓ |
| `gherkin-authoring` (specs) | ✓ |
| `c4-architecture` (design, if arch) | ✗ |
| `vercel-react-best-practices` (design/apply, if React/Next.js) | ✓ |
| `subagent-driven-development` (apply) | ✗ |
| `test-driven-development` (apply) | ✓ (partial — `chat-context` only) |
| `systematic-debugging` (apply, if bugs/failures) | N/A |
| `requesting-code-review` (apply) | ✓ (via `/code-review`) |
| `openspec-verify-change` (verify) | ✓ |
| `verification-before-completion` (verify) | ✗ |
| `finishing-a-development-branch` (finish) | N/A (committed on main, no branch) |
| `openspec-linearized` (proposal, apply, archive) | ✓ |

### Deliberately Skipped Skills

- **`c4-architecture`**: Architecture was already fully documented in `ARCHITECTURE.md` §6; no new system boundary to model. Prevent recurrence: N/A — correct skip.
- **`subagent-driven-development`**: Single-session, tightly-scoped UI change; inline implementation was faster than dispatching subagents. The agent-spawn guidance discourages spawning unless asked.
- **`test-driven-development` (partial)**: UI components were written before their tests. Trigger: presentational components felt "obvious." Prevent recurrence: write at least one failing render test per component before implementing — see §6.
- **`verification-before-completion`**: Did not invoke the named skill; verification was driven by `openspec-verify-change` + `/code-review` + full gates instead. Prevent recurrence: invoke it explicitly at verify for the completion checklist.

---

## 5. Surprises

- `navigator.gpu` is not in the default TypeScript `Navigator` DOM lib — needed a narrow cast (`039f471`).
- The empty `content/chat-chips.json` (`[]`) shipped earlier was the chat page's data source, not the home launcher's (home reads `home.json` `suggestions`) — two separate chip sources.

---

## 6. Promote candidates → long-term learning

- [x] 🔴 **Never capture prior state by assigning to an outer var inside a setState updater; read from a synced ref instead** → **Promote to** memory
  > **Why**: `send()` did `setMessages(prev => { history = prev; ... })` then used `history` on the next line — the updater can run stale or twice (StrictMode/concurrent), feeding wrong conversation history to the model. Caught in review (`039f471`).
  > **How to apply**: When an event handler needs the latest committed state *and* schedules an update, keep a `ref` synced via `useEffect(() => { ref.current = state }, [state])` and read `ref.current`; the updater stays pure.

- [x] 🟡 **A client page that needs build-time content (fs loaders) must be a server page passing data into a client island** → **Promote to** memory
  > **Why**: `/chat` is interactive (WebLLM) but its system prompt comes from `lib/content.ts` (`fs`). Importing that into a `"use client"` page breaks the client bundle. Solved by server `page.tsx` → `ChatClient` island.
  > **How to apply**: Whenever a page is both client-interactive and needs build-time JSON/MDX, default to server-shell + client-island; don't make the route itself `"use client"`.

- [x] 🟡 **`navigator.gpu` needs a cast; gate WebGPU on truthiness not `"gpu" in navigator`** → **Promote to** memory
  > **Why**: `gpu` is absent from the TS `Navigator` lib (typecheck fail), and `"gpu" in navigator` passes for a present-but-undefined value, skipping the unsupported fallback.
  > **How to apply**: `!!(navigator as Navigator & { gpu?: unknown }).gpu` for WebGPU detection in any browser-capability gate.
