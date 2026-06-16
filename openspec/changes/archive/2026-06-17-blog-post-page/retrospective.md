# Retrospective: blog-post-page

> Written: 2026-06-17 (after verify passed)
> Commit range: `ee375ec..0acc5bf`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-175` (`https://linear.app/abhilash-projects/issue/POR-175/blog-post-page-reading-experience-author-card-more-posts`)
- **Lead time**: 38m21s (`2026-06-16T23:14:52Z` → `2026-06-16T23:53:13Z`)
- **Diff size**: +732/-0 across 12 files, 2 commits
- **Tasks done**: 36/36
- **Requirements / Scenarios**: 7 / 17

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 121 / out 32228 / cache-read 6539799 / cache-write 423874
- **Total tokens**: 6996022
- **Cost**: $24.944834

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=0
- **Unit tests**: pass (102/102)
- **Build**: not run (SSG; dev server curl verified)

### Manual signals

- **Bugs post-merge**: none — track as discovered
- **New external dependencies**: none (reused `next-mdx-remote`, `gray-matter`)
- **Correction cycles during apply**: 1 (unused ReactNode import removed from test file)

Commit chain:

```
0b45a49 chore(POR-175): propose blog-post-page — reading experience, author card, more posts
0acc5bf feat(POR-175): blog post page — MDX reading experience, author card, more posts
```

---

## 1. Wins

- **Project-detail precedent made design trivial**: `app/projects/[slug]/page.tsx` pattern (MDXRemote + notFound + generateStaticParams + inline mdxComponents) transferred cleanly — no architectural discovery needed.
- **Existing content loaders reused**: `getIdentity()` and `getHomeContent()` already in `lib/content.ts`; `getBlogBody` was a one-liner copy of `getProjectBody` pattern.
- **TDD caught real issue during RED**: the RSC/MDXRemote async component cannot be rendered directly in jsdom tests — discovered before any implementation, resolved cleanly by mocking `BlogPost` in page tests.
- **Verify surfaced code-inside-pre bug**: `code` component applied inline-code accent styles inside `pre` blocks. Fixed before archive.

---

## 2. Misses

- 🟡 [painful] **`grill-with-docs` skipped**: Proposal phase required it but was omitted. Low risk for this change (well-scoped from Linear issue), but the skip was not intentional.
- 🟡 [painful] **`requesting-code-review` skipped**: No code review before committing implementation. The verify step caught one issue, but code review would have caught it earlier.
- 📌 [nit] **`finishing-a-development-branch` skipped**: Not critical here (work stays on main), but the pattern of not surfacing it means we don't get the structured merge/PR decision prompt.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| 3.3 code-inside-pre | Marked done in tasks but implementation was incomplete | `className` prop check not wired; caught in verify and fixed before archive |
| Test file had unused `ReactNode` import | Added extra import, caught by lint | Removed in same session |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✗ |
| `gherkin-authoring` (specs) | ✓ |
| `c4-architecture` (design, if arch) | N/A — no system boundary changes |
| `vercel-react-best-practices` (design/apply, if React/Next.js) | ✓ |
| `subagent-driven-development` (apply) | ✗ |
| `test-driven-development` (apply) | ✓ |
| `systematic-debugging` (apply, if bugs/failures) | N/A — no bugs during apply |
| `requesting-code-review` (apply) | ✗ |
| `openspec-verify-change` (verify) | ✓ |
| `verification-before-completion` (verify) | ✓ |
| `finishing-a-development-branch` (finish) | ✗ |
| `openspec-linearized` (proposal, apply, archive) | ✓ |

### Deliberately Skipped Skills

- **`grill-with-docs`**: Skipped because the Linear issue was fully scoped (7 explicit bullet groups) and directly transferred to proposal sections. Trigger: avoid when spec is comprehensive and primarily transcription from an authoritative brief. Still — the skill exists to catch domain mismatches; worth a quick run even on well-scoped changes.
- **`subagent-driven-development`**: Tasks were sequential (data layer → components → route) with shared context; parallelism would not have helped. Single-session apply appropriate.
- **`requesting-code-review`**: Session moved straight from implementation to verify. Verify caught one real issue. However code review would catch it earlier and might surface additional style concerns. Should not be skipped when cost is low.
- **`finishing-a-development-branch`**: Work stayed on main, no PR needed. Acceptable skip for solo main-branch flow, but the skill provides a useful checklist. Worth running even on main-branch work.

---

## 5. Surprises

- `npm run test` uses Vitest not Jest — `vi.mock` instead of `jest.mock`. No gotcha this session; already established from prior changes.
- `next-mdx-remote/rsc` is a true async RSC — cannot be rendered in jsdom. Workaround: mock `BlogPost` in page tests; test `BlogPost` separately with mocked `MDXRemote`. This is the established pattern for this project.
- `BlogPost.tsx` code component applied accent styling to code-inside-pre — an easy miss because the placeholder post has no fenced blocks. Only the verify step caught it.

---

## 6. Promote candidates → long-term learning

- [x] 🟡 **Mock `BlogPost` (not `MDXRemote`) in page tests** → **Promote to** memory
  > **Why**: async RSC wrapping MDXRemote cannot render in jsdom; mocking the component boundary is cleaner than mocking the MDX library
  > **How to apply**: whenever writing page tests for any Next.js page that renders a `BlogPost` or similar async RSC wrapper

- [x] 🟡 **`code` component in mdxComponents needs className guard for pre>code** → **Promote to** memory
  > **Why**: MDX renders fenced blocks as `<pre><code className="language-X">`, which triggers the inline-code `code` override and conflicts with `pre` styling; the guard was missed in tasks and caught only in verify
  > **How to apply**: any future change adding or modifying mdxComponents — always add `className?.startsWith('language-')` guard on the `code` element
