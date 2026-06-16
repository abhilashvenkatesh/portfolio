# Retrospective: blog-listing-page

> Written: 2026-06-17 (after verify passed)
> Commit range: `b21e82d..da20f2e`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-173` (`https://linear.app/abhilash-projects/issue/POR-173/blog-listing-page-post-cards-hover-scroll-animation`)
- **Lead time**: ~15 minutes (`2026-06-16T23:50:00Z` → `2026-06-17T00:05:00Z`)
- **Diff size**: +369 / -0 across 8 files, 2 commits
- **Tasks done**: 22/22
- **Requirements / Scenarios**: 5 / 6

### Tokens / Cost (from metrics.json)

- **Attribution**: exact (1 session)
- **Tokens**: in 11,599 / out 56,450 / cache-read 11,805,704 / cache-write 392,471
- **Total tokens**: 12,266,224
- **Cost**: $33.89

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=0
- **Unit tests**: 84/84 pass
- **Build**: pass

### Manual signals

- **Bugs post-merge**: none
- **New external dependencies**: none (`gray-matter` and `next-mdx-remote` already installed)
- **Correction cycles during apply**: 0

Commit chain:

```
b21e82d chore(POR-173): propose blog-listing-page
da20f2e feat(POR-173): blog listing page — post cards, hover, scroll animation
```

---

## 1. Wins

- **`group`/`hover:` split correctly designed** — prior project card (`app/projects/page.tsx:30`) has a latent bug: `group-hover:border-accent-border group-hover:bg-surface-alt` on the `article[group]` element never fires. Blog card identified and corrected this in `design.md` (D3) before touching code — card-level changes use `hover:`, child changes use `group-hover:`. Zero rework.
- **Zero-rework apply pass** — `lib/blog.ts` and `app/blog/page.tsx` written once, 6 tests green immediately, all quality gates passed first try. Thorough preflight in `design.md` (D1–D5 all grounded against actual file checks) meant no surprises at implementation time.
- **No new packages** — `gray-matter` and `next-mdx-remote` were already present. Data loader was a 30-line file.
- **TDD discipline held** — tests written first, watched fail ("Cannot find module"), then implemented. Tests use real `getBlogPosts()` against actual content file, matching the Projects test pattern exactly.

---

## 2. Misses

None surfaced.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| 4.x DOM verification | Used `curl` + text extraction instead of browser | No browser tool available; HTML response confirmed all content fields present |
| Tasks 3.1–3.4 | Used real `getBlogPosts()` instead of mock | Matches existing Projects test pattern; content seed file present |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `gherkin-authoring` (specs) | ✓ |
| `vercel-react-best-practices` (design/apply) | ✓ |
| `test-driven-development` (apply) | ✓ |
| `openspec-linearized` (proposal, apply, archive) | ✓ |
| `subagent-driven-development` (apply) | ✗ |
| `requesting-code-review` (apply) | ✗ |
| `finishing-a-development-branch` (finish) | ✗ |
| `systematic-debugging` (apply, if bugs) | N/A |

### Deliberately Skipped Skills

- **`subagent-driven-development`**: single-file data loader + single-page route. No independent parallelisable workstreams.
- **`requesting-code-review`**: user directed "commit and verify/retrospective/archive" — same standing flow as POR-170.
- **`finishing-a-development-branch`**: all work committed to `main` directly per project flow.

---

## 5. Surprises

- `lib/blog.ts` explicitly named in `documentation/ARCHITECTURE.md` but didn't exist yet — straightforward to create once confirmed.
- `app/blog/page.tsx` has no `"use client"` directive even though `FadeIn` is a client component — Next.js App Router handles the RSC/Client boundary automatically at the `FadeIn` import, so the page stays a Server Component. Worth noting for future page authors.

---

## 6. Promote candidates → long-term learning

- [x] 🔴 **Project card `group-hover:` on `article[group]` is a latent bug** → **Promote to** project memory
  > `app/projects/page.tsx:30` uses `group-hover:border-accent-border group-hover:bg-surface-alt` on the `article` that carries `group`. These never fire — `group-hover:` requires a *parent* with `group`. Blog card corrects this. Projects card should be fixed in a future cleanup pass.
