# Retrospective: projects-listing-page

> Written: 2026-06-16 (after verify passed)
> Commit range: `0824b9c..342f72d`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-170` (`https://linear.app/abhilash-projects/issue/POR-170/projects-listing-page-cards-hover-links-scroll-animation`)
- **Lead time**: ~27 minutes (`2026-06-16T13:18:38Z` → `2026-06-16T13:45:43Z`)
- **Diff size**: +320 / -16 across 9 files, 2 commits
- **Tasks done**: 18/18
- **Requirements / Scenarios**: 8 / 11

### Tokens / Cost (from metrics.json)

- **Attribution**: exact (1 session)
- **Tokens**: in 14,527 / out 63,112 / cache-read 12,970,551 / cache-write 776,453
- **Total tokens**: 13,824,643
- **Cost**: $47.70

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=0
- **Unit tests**: 78/78 pass
- **Build**: pass

### Manual signals

- **Bugs post-merge**: none
- **New external dependencies**: none (no new packages)
- **Correction cycles during apply**: 1 (stale verify-dom check for old label)

Commit chain:

```
0824b9c chore(POR-170): propose projects-listing-page
342f72d feat(POR-170): projects listing page — showcase cards with hover, impact callout, stack tags
```

---

## 1. Wins

- **CSS-only hover via `group`/`group-hover`** kept `app/projects/page.tsx` a pure Server Component — no `"use client"`, no hydration cost. Identified at design time via `vercel-react-best-practices`, carried through cleanly.
- **Data layer was already complete** (`problem`, `impact`, `stack`, `demo` on `Project`). Proposal scoping correctly identified this as a presentation-only change — no schema or content migration needed.
- **All 18 tasks done in one pass** with zero verify rewrites. Tight design-preflight (facts checked in `design.md` before tasks were written) paid off — no surprises at implementation time.
- **`grill-with-docs`** surfaced two real forks before authoring: card→detail link (prototype vs POR-171 impl) and hover border token (new `accent-border` vs opaque accent). Both resolved with one-word answers — fast, but grounding was correct.

---

## 2. Misses

- 🟡 [painful] **verify-dom had a stale label check** (`">Projects<"` → `"Featured Projects"`). A verify-dom check tied to the *old* bridge label wasn't updated when the label changed. Required a fix during verify. Low blast radius but could silently pass with wrong content if not caught.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| `5.3` build gate | `rm -rf .next` added before `npm run build` | Stale `.next` from previous session; known gotcha from CLAUDE.md |
| verify-dom step | Updated 1 existing check + added 3 new DOM checks | Stale label from POR-171 bridge; new content not covered yet |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✓ |
| `gherkin-authoring` (specs) | ✓ |
| `c4-architecture` (design, if arch) | N/A — no architectural component boundaries |
| `vercel-react-best-practices` (design/apply, if React/Next.js) | ✓ |
| `subagent-driven-development` (apply) | ✗ |
| `test-driven-development` (apply) | ✓ |
| `systematic-debugging` (apply, if bugs/failures) | N/A — no bugs/failures |
| `requesting-code-review` (apply) | ✗ |
| `openspec-verify-change` (verify) | ✓ (inline in archive flow) |
| `verification-before-completion` (verify) | ✓ |
| `finishing-a-development-branch` (finish) | ✗ |
| `openspec-linearized` (proposal, apply, archive) | ✓ |

### Deliberately Skipped Skills

- **`subagent-driven-development`**: change was small and self-contained (one file + one token). No parallelizable independent workstreams. Skipping justified; add back for multi-file feature work.
- **`requesting-code-review`**: skipped by user direction ("commit and /opsx:archive"). Known trade-off — same as POR-171.
- **`finishing-a-development-branch`**: all work committed directly to `main` per standing flow for this project (no PRs).

---

## 5. Surprises

- Port 3000 was a Chrome process (not Next.js) — `lsof` showed it but `curl` returned zero bytes. Needed a fresh server on port 3002 for verify-dom.
- `next build` compiles `oklch()` to hex (`#ce47144d`) — confirmed both light and dark tokens correct in CSS output. Good evidence that Tailwind v4 handles oklch correctly in prod.

---

## 6. Promote candidates → long-term learning

- [x] 🟡 **Update verify-dom checks when page header label changes** → **Promote to** memory (feedback)
  > **Why**: verify-dom had `">Projects<"` after label changed to "Featured Projects". Stale check wouldn't catch wrong content in future.
  > **How to apply**: When changing a `PageHeader label=` prop, grep `scripts/verify-dom.ts` for the old label string and update it in the same commit.
