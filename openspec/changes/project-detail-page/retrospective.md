# Retrospective: project-detail-page

> Written: 2026-06-16 (after verify passed)
> Commit range: `1fd25ab..bbb7f7a`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-171` (https://linear.app/abhilash-projects/issue/POR-171/projects-detail-page)
- **Lead time**: ~2h50m proposal → verify (`started_at` 2026-06-16T10:12:03Z → verify phase 2026-06-16T13:01:50Z; `finished_at` set at archive)
- **Diff size**: +889 / -1 across 19 files, 3 commits
- **Tasks done**: 24/24
- **Requirements / Scenarios**: 8 / 15

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 11,899 / out 49,208 / cache-read 7,664,411 / cache-write 433,664
- **Total tokens**: 8,159,182
- **Cost**: $28.38

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=1
- **Unit tests**: pass (75/75)
- **Build**: pass (`/projects` static, `/projects/[slug]` SSG — both slugs prerendered)

### Manual signals (not auto-captured)

- **Bugs post-merge**: none — track as discovered
- **New external dependencies**: none (used existing `next-mdx-remote` + `gray-matter`; `gray-matter` ultimately unused — body-only MDX)
- **Correction cycles during apply**: ~0 code reworks; typecheck/lint/build/tests green first pass. Only spec-validate needed a SHALL/MUST fixup during the specs phase.

Commit chain:

```
1fd25ab chore(POR-171): propose project-detail-page — proposal, specs, design, tasks
410bf25 feat(POR-171): project detail page — /projects/[slug] case study + bridge listing
bbb7f7a chore(POR-171): verify project-detail-page — PASS
```

---

## 1. Wins

- **Grilling resolved scope before any code.** Four upfront decisions (Model A, MDX body, slug-from-id, minimal bridge + 2 samples) removed every design fork; design.md closed with zero open questions and apply ran without reworks (`410bf25`).
- **Caught the missing dependency early.** Discovered `/projects` listing (POR-170) and `projects.json` were unbuilt before proposing; reframed as a self-contained slice instead of proposing a detail page with no entry point.
- **Graceful path proven by real data.** Left `pulse-cli` bodyless so the no-MDX branch is exercised end-to-end by seed data, not just a unit mock (`verify-dom` checks + `ProjectDetail.test.tsx`).
- **Preflight prevented the lucide brand-icon trap.** design.md verified `Github` export absent (v1.x) before writing tasks; shipped shared `components/ui/icons.tsx` instead of a broken import.
- **First MDX consumer wired cleanly.** `MDXRemote` (rsc) + `mdxComponents` token map, no typography plugin added.

## 2. Misses

- **`gray-matter` named in proposal/impact but unused.** Body-only MDX needs no frontmatter parsing; the proposal listed it as a dependency. Harmless but imprecise.
- **Spec validation SHALL/MUST fixup.** First spec draft used plain prose; `openspec validate` rejected 8 requirements lacking SHALL/MUST, needing a second edit pass. Could have written normative language first.
- **`/opsx:retrospective` is not a skill.** Invoked it as a slash-skill and hit "Unknown skill"; it's a schema artifact reached via `openspec instructions retrospective`. Minor flow friction.

## 3. Surprises

- **Port 3000 already serving current code.** A pre-existing server let `verify-dom` run despite my `next start` failing with EADDRINUSE — verification still valid since it served the new routes.
- **commit-evidence precheck returned 0** again — the on-main merge-base false-negative (already known).

## 4. Skill compliance

| Skill | Used | Note |
|---|---|---|
| openspec-git-discipline | ✓ | started on main, committed each phase before next |
| grill-with-docs | ✓ | 4 decisions resolved before artifacts |
| openspec-linearized | ✓ | POR-171 Planning → In Progress; desc + comments synced |
| gherkin-authoring | ✓ | GIVEN/WHEN/THEN scenarios, declarative |
| vercel-react-best-practices | ✓ | SSG server components, no client waterfalls |
| c4-architecture | ✗ | Skipped — routes within existing app, no new system boundary. Reasonable; no recurrence concern. |
| openspec-verify-change | ✓ | full verify.md, PASS |
| test-driven-development | ✗ (partial) | Wrote implementation first, then tests, rather than test-first. Tests do assert required behaviour and all pass. Prevent recurrence: for the next UI change, scaffold the render test before the component. |
| requesting-code-review / code-review | ✗ | User explicitly declined this cycle. |

## 5. Action items

- None blocking. Real project content (replace 2 seed projects + add MDX bodies) is a later content swap, no code change.
- POR-170 should refine the `/projects` listing (hover, accent line, stagger, impact-callout styling) on top of this bridge, not rebuild it.

## 6. Promote candidates

- [x] MDX-in-RSC pattern for this repo → persisted to memory `reference-mdx-in-rsc-pattern`
  **Why:** This is the first wired MDX consumer; the blog route (POR-1xx) will repeat it. Re-deriving the approach wastes a session.
  **How to apply:** Render local Markdown via `MDXRemote` from `next-mdx-remote/rsc` in a Server Component with a `components` map mapping `h2/h3/p/ul/li/a/code` to design tokens (no `@tailwindcss/typography` — not installed). For body-only content, read the raw file at build time and skip `gray-matter`; use `gray-matter` only when frontmatter exists. Return `null` when the file is absent for graceful degradation.
