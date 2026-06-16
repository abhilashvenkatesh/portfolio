# Retrospective: experience-page

> Written: 2026-06-16 (after verify passed)
> Commit range: `4a0c58f^..HEAD`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-172` (https://linear.app/abhilash-projects/issue/POR-172/experience-page-timeline-role-entries-resume-cta)
- **Lead time**: ~14m (`started_at` 2026-06-16T09:33:37Z → `finished_at` set at archive)
- **Diff size**: +585 / -1 across 10 files, 2 commits
- **Tasks done**: 23/23
- **Requirements / Scenarios**: 5 / 9

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 12,376 / out 34,482 / cache-read 6,208,971 / cache-write 364,004
- **Total tokens**: 6,619,833
- **Cost**: $23.005367

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=1
- **Unit tests**: pass (62/62)
- **Build**: pass (`/experience` ○ Static)

### Manual signals (not auto-captured — fill honestly)

- **Bugs post-merge**: none — track as discovered
- **New external dependencies**: none
- **Correction cycles during apply**: 1 — reworked a fragile `getByRole("presentation")` marker assertion in `Experience.test.tsx` before tests passed

Commit chain:

```
4a0c58f feat(POR-172): experience page — timeline, roles, résumé CTA
09d4311 chore(POR-172): verify experience-page — PASS with warnings
(archive commit appended at archive)
```

---

## 1. Wins

- **Zero new components / zero new deps** — reused `PageHeader`, `FadeIn`, `getExperience()`, `ExperienceEntry`, and the About résumé-CTA markup. The page is one Server Component file (`app/experience/page.tsx`).
- **Type + loader already matched the prototype shape** — `ExperienceEntry { title, company, period, bullets }` needed no change; only `content/experience.json` was populated (DATA-4 satisfied for free).
- **DESIGN.md L364 (Timeline) was an exact build spec** — marker geometry, ring, pill, dash bullets transcribed directly; design-lint passed first try.
- **All gates green in one pass** — typecheck, lint, design-lint, validate-content, build, 62/62 tests, 59/59 verify-dom, openspec `--strict`.

---

## 2. Misses

- 🟡 [painful] First `Experience.test.tsx` marker assertion used `getByRole("presentation", { hidden: true })` on an `aria-hidden` dot — accessibility tree excludes it. Switched to `querySelector("div[aria-hidden='true']")` + className check.
- 📌 [nit] Dev server bound to `:3001` (3000 occupied); verify-dom needed an explicit `BASE_URL` arg. Not a defect, but a repeatable friction point.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| 1.x data source | Drafted entries from `about.json`, not the résumé | `public/resume.pdf` is a blank 316-byte placeholder — no extractable text |
| 4.x verify-dom | Added a `verifyExperience()` block to `scripts/verify-dom.ts` | Script is hand-maintained per-route (mirrors `verifyAbout`); not a pre-listed file |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✓ |
| `gherkin-authoring` (specs) | ✗ |
| `c4-architecture` (design, if arch) | N/A |
| `vercel-react-best-practices` (design/apply, if React/Next.js) | ✗ |
| `subagent-driven-development` (apply) | ✗ |
| `test-driven-development` (apply) | ✗ |
| `systematic-debugging` (apply, if bugs/failures) | N/A |
| `requesting-code-review` (apply) | ✗ |
| `openspec-verify-change` (verify) | ✓ |
| `verification-before-completion` (verify) | ✓ |
| `finishing-a-development-branch` (finish) | N/A |
| `openspec-linearized` (proposal, apply, archive) | ✓ |

### Deliberately Skipped Skills

- **`gherkin-authoring`** — skipped because the spec delta reused the established GIVEN/WHEN/THEN format from the archived `about-page` spec verbatim. Scenarios are well-formed; no recurrence prevention needed beyond continuing to mirror the canonical format.
- **`vercel-react-best-practices`** — skipped: the page is a static SSG Server Component with one reused client boundary (`FadeIn`); no data fetching, caching, or RSC-boundary decisions to optimize. Trigger absent this cycle.
- **`subagent-driven-development`** — skipped: single-file, ~100-line page mirroring an existing page. Parallel subagents would add coordination cost with no benefit.
- **`test-driven-development`** — ✗ honest: implementation was written before tests, not red-green. Page is declarative JSX over a typed content array; tests assert rendered output. To prevent recurrence on logic-bearing changes, write the failing test first when behaviour (not markup) is the unit.
- **`requesting-code-review`** — skipped: user explicitly declined code-review this cycle.

---

## 5. Surprises

- **The résumé is a stub.** "Look at the resume" returned a blank 1-page PDF (316 bytes) — the real career data had to come from `about.json` instead. CTA wiring is correct; the data is provisional and flagged for user confirmation.
- **`getExperience()` + type predated any UI** — the data layer was scaffolded ahead of the page, so the only content work was filling an empty `[]`.

---

## 6. Promote candidates → long-term learning

No new durable learnings this cycle. The on-main `git merge-base ..HEAD` commit-evidence false-negative recurred and is already captured in memory (`onmain_verify_commit_evidence_false_negative`); the placeholder-résumé and drafted-data items are change-specific, not generalizable rules.
