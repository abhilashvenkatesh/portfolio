# Retrospective: about-page

> Written: 2026-06-16 (after verify passed)
> Commit range: `72fc364..684cc8d`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-168` (https://linear.app/abhilash-projects/issue/POR-168/about-page-header-bio-photo-resume-cta-blog-link)
- **Lead time**: ~2h03m (`2026-06-16T03:49:17Z` → `2026-06-16T05:52:40Z`)
- **Diff size**: +623 / -1 across 13 files, 4 commits
- **Tasks done**: 20/20
- **Requirements / Scenarios**: 5 / 9

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 13,973 / out 54,929 / cache-read 9,055,081 / cache-write 326,522
- **Total tokens**: 9,450,505
- **Cost**: $27.71

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=1
- **Unit tests**: pass (52/52)
- **Build**: pass (`/about` ○ Static)

### Manual signals (not auto-captured — fill honestly)

- **Bugs post-merge**: none — track as discovered
- **New external dependencies**: none
- **Correction cycles during apply**: ~2 (Write-before-Read retry on `about.json`/`vitest.setup.ts`/`verify-dom.ts`; harness required a Read first)

Commit chain:

```
72fc364 docs(POR-168): propose about-page change
ed4e00c docs(POR-168): about-page specs + design + tasks
d9cfbec feat(POR-168): about page — header, bio, photo, résumé CTA, blog link
684cc8d docs(POR-168): verify about-page — PASS WITH WARNINGS
```

---

## 1. Wins

- **Tight scope discipline.** The prototype (`documentation/design/about.html`) bundled a skills section, but POR-168's brief and the blocks-relation to POR-169 made skills out-of-scope. Caught at proposal time → no scope creep (proposal.md "Out of scope" note).
- **Reused existing rails.** `getAboutBio()` loader and `content/about.json` already existed; `PageHeader` and `public/resume.pdf` already existed. Implementation was mostly composition, not new infra — only `FadeIn` was genuinely new (`d9cfbec`).
- **Project Facts Preflight paid off.** Verifying DESIGN.md L343 ("black text… Used for Download résumé on About") before writing tasks meant the CTA classes were right first try; design-lint passed with zero rework.
- **All gates green first pass** after the file-Read retries: typecheck, lint, design-lint, validate-content, build, tests 52/52, verify-dom 44/44 (10 new `/about` checks).

## 2. Misses

- 🟡 [painful] Three `Write`-before-`Read` failures (`content/about.json`, `vitest.setup.ts`, `scripts/verify-dom.ts`) — edited files surfaced via `cat`/`grep` in Bash rather than the Read tool, so the harness rejected the first write/edit. Cost ~2 retries.
- 📌 [nit] Photo placeholder uses `border-surface-alt` on `bg-surface-alt` — border invisible (same colour). Cosmetic; flagged in code-review, left as-is since the box reads against page `surface`.
- 📌 [nit] `FadeIn` renders content `opacity-0` until client JS reveals it. SSG HTML still contains the text (verify-dom + SEO fine), but JS-disabled users see blank. Accepted as documented FadeIn behaviour.

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| 2.1 FadeIn | Added an IntersectionObserver **stub to `vitest.setup.ts`** (not in original tasks) | jsdom lacks `IntersectionObserver`; FadeIn tests/About render would throw without it. Reusable for all future reveal-based tests. |
| 5.1 verify-dom | Extended `scripts/verify-dom.ts` with a `verifyAbout()` (10 checks) | Reused the existing static-HTML verifier harness rather than a new tool, matching the home-page pattern. |

---

## 4. Skill compliance

| Skill (schema precheck) | Used? | Note |
|---|---|---|
| openspec-linearized | ✓ | Bound POR-168, synced description, Planning→In Progress, comments posted |
| openspec-git-discipline | ✓ | Per-phase commits on `main` (repo's established on-main OpenSpec workflow) |
| grill-with-docs | ⚠️ partial | Did not invoke the standalone skill; resolved ambiguities inline from REQUIREMENTS + prototype (scope, bio source, resume path, blog target). Trigger was low-risk (single content page, all facts in-repo). Prevent recurrence: invoke explicitly when a change touches >1 capability or has unverified external facts. |
| gherkin-authoring | ✓ | Spec scenarios in Given/When/Then, declarative |
| vercel-react-best-practices | ✓ | SSG Server Component; FadeIn is the only client component (`'use client'`, minimal) |
| c4-architecture | ✗ (skipped) | No new system boundaries — single additive page. Correct skip per its own trigger ("architectural components or system boundaries"). |
| verification-before-completion | ✓ | verify.md §1-§7 evidence; honesty note on un-eyeballed hover/visual states |
| code-review (standing feedback) | ✓ | Ran before committing verify.md per [[feedback_code_review_before_apply_close]]; reviewed inline (small self-authored diff) — no bugs, 2 low nits |

## 5. Surprises

- `git merge-base HEAD main` returns HEAD because the repo commits changes **on** `main`, so the verify "commit evidence > 0" precheck is a structural false-negative here. Same as the home-chat-launcher cycle — this is a known property of the on-main workflow, not a missing-implementation signal.
- `collect-metrics.sh` counts 9 scenarios vs the 10 `#### Scenario:` blocks I authored — the script's parser is the source of truth; recorded 9.

## 6. Promote candidates

- [x] **Edit/Write tracked-file requirement: don't inspect via `cat`/`grep`** → memory `feedback_read_before_edit_not_cat`
  **Why:** Three first-attempt write/edit failures this cycle because files were viewed through Bash (`cat`, `grep`) which the harness doesn't count as a Read, so Edit/Write demanded a Read first.
  **How to apply:** When you intend to Edit or Write a file, open it with the Read tool (not `cat`/`grep` in Bash) so the harness tracks it; reserve Bash inspection for files you won't modify.

- [x] **On-main OpenSpec workflow breaks the verify commit-evidence precheck** → memory `onmain_verify_commit_evidence_false_negative`
  **Why:** `git merge-base HEAD main == HEAD` ⇒ the "commits in range > 0" precheck returns 0 even though the change is fully committed (3-4 commits on main). Seen in both home-chat-launcher and about-page cycles.
  **How to apply:** When that precheck returns 0, don't treat it as "apply produced nothing" — verify real evidence instead: change commits exist (`git log --oneline <propose-sha>~1..HEAD`), tree clean, tasks 20/20. Links [[next_build_breaks_next_dev]] as another on-main gotcha.
