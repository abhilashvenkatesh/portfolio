# Retrospective: home-chat-launcher

> Written: 2026-06-16 (after verify passed)
> Commit range: `34e767b..063ddcf`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-167` (https://linear.app/abhilash-projects/issue/POR-167/home-chat-launcher-input-chips-browse-hints-scroll-indicator)
- **Lead time**: ~28m (`started_at` 2026-06-16T03:04:00Z → `finished_at` 03:31:44Z)
- **Diff size**: +684 / −7 across 15 files, 3 commits
- **Tasks done**: 19/19
- **Requirements / Scenarios**: 4 / 13

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 11844 / out 61815 / cache-read 13417351 / cache-write 359260
- **Total tokens**: 13850270
- **Cost**: $35.72

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=1
- **Unit tests**: pass (44/44, 11 new across 3 files)
- **Build**: pass (`/` prerendered static)

### Manual signals (not auto-captured)

- **Bugs post-merge**: none — track as discovered
- **New external dependencies**: none
- **Correction cycles during apply**: 0 — no rework; `.next` cleared proactively before dev (last cycle's learning applied), so no stale-manifest 500 this time

Commit chain:

```
34e767b docs(POR-167): propose home-chat-launcher change
9852456 feat(POR-167): home chat launcher + scroll indicator
063ddcf docs(POR-167): verify home-chat-launcher — PASS
```

---

## 1. Wins

- **Seams paid off — zero Hero reshuffle.** POR-166 left two commented mount points; this change replaced them in place (`<ChatLauncher suggestions={…} />`, `<ScrollIndicator />`) with no layout churn. The scope discipline from the previous cycle directly cut work here.
- **Last cycle's gotcha learning prevented a repeat.** `next_build_breaks_next_dev` memory + CLAUDE.md note → cleared `.next` before starting dev for verify-dom. No HTTP 500, no diagnose cycle (the exact failure that cost time on POR-166).
- **TDD across three new surfaces.** `ChatLauncher` (6), `ScrollIndicator` (3), `Hero` (+2) — each watched fail (module-missing / not-mounted) before implementing. The empty-input no-op and encoded-URL contract were locked by tests, not eyeballing.
- **Content + Linear stayed coherent.** Chip copy sourced from `content/home.json` (XC-5), and the corrected business fact (Rapido → Fabric Group) was written back to the Linear issue description, not just the repo.
- **First animation token added cleanly.** `--animate-scroll-dot` + `@keyframes scroll-dot` in the Tailwind v4 `@theme`, with `motion-reduce:animate-none` — accessible by construction, kept in the design system rather than ad-hoc SMIL.

---

## 2. Misses

- 🟡 [painful] `requesting-code-review` skill (apply PRECHECK) again **not** invoked — offered to the user, who chose to proceed straight to verify+retrospective. Compliant with the explicit instruction, but the recurring gap from POR-166 persists. See §4.
- 📌 [nit] `started_at` was first written as a placeholder (`2026-06-16T00:00:00Z`) and corrected to the real proposal time only at metrics collection. Set it accurately at proposal time.
- 📌 [nit] Forward links (`/chat`, `/projects`, `/experience`, `/contact`) 404 until sibling pages ship — intentional and documented, but the home page has dead links in the interim.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| (none) | Plan executed as written, 19/19 | Design preflight + reused POR-166 seams removed unknowns up front |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✓ |
| `gherkin-authoring` (specs) | ✓ (implicit — spec authored in GIVEN/WHEN/THEN) |
| `c4-architecture` (design, if arch) | N/A — one client island + one decorative component, no system boundaries |
| `vercel-react-best-practices` (design/apply) | ✓ (client island minimal; `next/link` for static nav, `useRouter` for dynamic) |
| `subagent-driven-development` (apply) | ✗ — single cohesive UI change, one task group |
| `test-driven-development` (apply) | ✓ |
| `systematic-debugging` (apply, if bugs/failures) | N/A — no failures to debug |
| `requesting-code-review` (apply) | ✗ — offered; user elected to skip |
| `openspec-verify-change` (verify) | ✓ |
| `verification-before-completion` (verify) | ✓ |
| `finishing-a-development-branch` (finish) | ✗ — runs at archive step |
| `openspec-linearized` (proposal, apply, archive) | ✓ (Planning → In Progress; Done pending archive) |

### Deliberately Skipped Skills

- **`subagent-driven-development`** — *Skipped*: parallel subagent dispatch. *Why this cycle*: one section, tightly coupled to `home.json` + the existing Hero; no independent task groups. *Prevent recurrence*: acceptable — same rationale as POR-166.
- **`requesting-code-review`** — *Skipped*: code review before closing apply. *Why this cycle*: user explicitly chose "commit verify.md → retrospective" when offered the review. *Prevent recurrence*: already a memory (`feedback_code_review_before_apply_close`); the durable fix is to run it **before** offering the verify-commit choice, so the diff is reviewed regardless of how the user routes the close. Not a new promote — reinforces the existing one.

---

## 5. Surprises

- **The previous retrospective's promoted learning measurably worked.** Proactively clearing `.next` eliminated the exact 500 that cost a cycle on POR-166 — first concrete payoff of the memory loop.
- **Cost jumped vs POR-166** ($35.72 vs $18.77) on a comparably-sized change. Driver: cache-read tokens nearly doubled (13.4M vs 7.1M) — larger warm context carried across the propose→apply→verify→retrospective chain in one session.

---

## 6. Promote candidates → long-term learning

- [x] 🟡 **Run code review before closing apply** → already covered by memory `feedback_code_review_before_apply_close.md` (from POR-166). No new memory; this cycle reinforces it — recommend running `/code-review` *before* presenting the verify-commit choice next time.
  > **Why**: same PRECHECK gap recurred (§4), though user-directed this cycle.
  > **How to apply**: in the apply→verify handoff, run the diff review unprompted, then offer the commit choice.

- [x] 📌 **No other promotes.** The Tailwind v4 animation-token pattern (`--animate-*` + `@keyframes` + `motion-reduce`) is now self-documenting in `styles/globals.css`; the `.next`/dev gotcha is already promoted and proved effective. Nothing new meets the "non-obvious + not already in repo/memory" bar.
