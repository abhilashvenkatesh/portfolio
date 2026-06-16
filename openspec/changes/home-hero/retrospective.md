# Retrospective: home-hero

> Written: 2026-06-16 (after verify passed)
> Commit range: `e53038c..e050e78`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-166` (https://linear.app/abhilash-projects/issue/POR-166/home-hero-headline-stats-bar-background-texture)
- **Lead time**: ~24m so far (`started_at` 2026-06-16T02:08:17Z → verify 02:28Z). `finished_at` still empty — set at archive; final lead time recomputed then.
- **Diff size**: +522 / −14 across 13 files, 3 commits
- **Tasks done**: 17/17
- **Requirements / Scenarios**: 4 / 7

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 10330 / out 39622 / cache-read 7146906 / cache-write 164167
- **Total tokens**: 7361025
- **Cost**: $18.77

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=1
- **Unit tests**: pass (33/33, 6 new)
- **Build**: pass (`/` prerendered static)

### Manual signals (not auto-captured)

- **Bugs post-merge**: none — track as discovered
- **New external dependencies**: none
- **Correction cycles during apply**: 1 (verify-dom HTTP 500 from stale `.next` cache → cleared and re-ran; no code change)

Commit chain:

```
e53038c docs(POR-166): propose home-hero change (proposal, specs, design, tasks)
9826740 feat(POR-166): home hero — badge, headline, stats, background texture
e050e78 chore(POR-166): verify home-hero — all gates pass, ready for retrospective
```

---

## 1. Wins

- **Reused an existing repo idiom instead of the prototype's raw CSS.** `components/ui/PageHeader.tsx` already had the grid+radial-mask SVG; `HeroBackground.tsx` followed it (`currentColor`, `strokeOpacity 0.06`) → theme-awareness for free, no new `--border` token needed. Caught during design preflight, not apply.
- **Zero schema/type churn.** Preflight confirmed `HomeContent` (`lib/types.ts:56`) + `getHomeContent()` already covered every field; the change was data + presentation only.
- **TDD caught the wiring contract.** `__tests__/Hero.test.tsx` written first, failed on missing module (RED), then 6/6 green — including the hardcoded accent-clause split, the one fragile spot.
- **Scope discipline.** Held the line on POR-166 = HOME-1/2/7; chat launcher + scroll indicator left as commented seams for POR-167 (`Hero.tsx`), avoiding rework when that issue lands.

---

## 2. Misses

- 🟡 [painful] `requesting-code-review` skill (apply PRECHECK) was **not** invoked — see §4.
- 🟡 [painful] verify-dom first run returned HTTP 500 (`global-error.js` not in RSC manifest) after a prod `npm run build` left a stale `.next`. Cost one diagnose+restart cycle. Tooling glitch, not Hero code (app-code ran 8ms).
- 📌 [nit] Headline accent clause is hardcoded (`ACCENT_CLAUSE` in `Hero.tsx`) per the chosen flat-string model — brittle if the subheading wording in `home.json` changes. Documented in code + design.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| 5.1 DOM verify | Required a `.next` clear + dev restart mid-task | Stale Turbopack RSC manifest after prod build caused a transient 500 |
| (none else) | Plan executed as written | Design preflight removed unknowns up front |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✓ |
| `gherkin-authoring` (specs) | ✓ |
| `c4-architecture` (design, if arch) | N/A — no system boundaries, 3 presentational components |
| `vercel-react-best-practices` (design/apply) | ✓ |
| `subagent-driven-development` (apply) | ✗ — see below |
| `test-driven-development` (apply) | ✓ |
| `systematic-debugging` (apply, if bugs/failures) | N/A — the 500 was a tooling cache glitch, root-caused (app-code 8ms, prod build clean) and resolved by cache clear; no code defect to debug |
| `requesting-code-review` (apply) | ✗ — see below |
| `openspec-verify-change` (verify) | ✓ |
| `verification-before-completion` (verify) | ✓ |
| `finishing-a-development-branch` (finish) | ✗ — not reached yet; runs at finish/archive step |
| `openspec-linearized` (proposal, apply, archive) | ✓ (Planning → In Progress; Done pending archive) |

### Deliberately Skipped Skills

- **`subagent-driven-development`** — *Skipped*: dispatching parallel subagents. *Why this cycle*: single cohesive ~3-component UI change with tight data coupling (shared `home.json`, one section); parallelization overhead > benefit. *Prevent recurrence*: acceptable — use subagents when ≥2 genuinely independent task groups exist; this change had one.
- **`requesting-code-review`** — *Skipped*: invoking code review before declaring apply complete. *Why this cycle*: momentum through apply→verify; missed the PRECHECK. *Prevent recurrence*: run `/code-review` (or the skill) on the diff **before** committing the verify artifact, or wire it into the finish step. Promote candidate (§6).

---

## 5. Surprises

- **A prod `npm run build` poisons the next `next dev` run.** The build wrote a `.next` state Turbopack dev then choked on (`global-error.js` missing from client manifest → 500 on `/`). Not obvious; cost a cycle. Worth a known-gotcha note.
- **`scripts/collect-metrics.sh` attributed tokens "exact" for a single session** — clean signal, no estimation needed. Cost $18.77 / 7.36M total tokens (cache-read dominated at 7.1M).

---

## 6. Promote candidates → long-term learning

- [x] 🟡 **Run code review before closing apply** → **Promoted to** memory `feedback_code_review_before_apply_close.md`
  > **Why**: `requesting-code-review` PRECHECK was skipped this cycle (§4); the SDD schema mandates it before verify.
  > **How to apply**: after the last impl commit and before writing/committing verify.md, run `/code-review` on the branch diff; fold findings in.

- [x] 🟡 **Known gotcha: `next build` breaks the next `next dev` (stale `.next` / Turbopack RSC manifest 500)** → **Promoted to** CLAUDE.md "Known gotchas" + memory `next_build_breaks_next_dev.md`
  > **Why**: verify-dom 500 (`global-error.js` not in client manifest) cost a diagnose+restart cycle this session; not Hero-related.
  > **How to apply**: when a dev-server 500 mentioning a builtin module's manifest appears right after a prod build, `rm -rf .next` and restart `next dev` before debugging app code.
