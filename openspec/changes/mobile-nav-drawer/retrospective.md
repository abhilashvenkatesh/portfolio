# Retrospective: mobile-nav-drawer

> Written: 2026-06-04 (after verify passed)
> Commit range: `2b0e7e5..HEAD`

## 0. Evidence

### Delivery (from metrics.json)

- **Method**: sdd
- **Linear story**: `POR-165` (https://linear.app/abhilash-projects/issue/POR-165/mobile-navigation-hamburgerdrawer)
- **Lead time**: ~15m (`2026-06-04T05:27:05Z` → `2026-06-04T05:42:02Z`)
- **Diff size**: +587 / -6 across 11 files, 3 commits (size fields hand-corrected — see §2)
- **Tasks done**: 17/17
- **Requirements / Scenarios**: 2 / 9

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: exact (1 session)
- **Tokens**: in 574 / out 114713 / cache-read 22856597 / cache-write 538030
- **Total tokens**: 23509914
- **Cost**: $59.04

### Quality Gates

- **OpenSpec validate**: pass
- **Verify**: present=true, fail=false, rewrites=1
- **Unit tests**: pass (27)
- **Build**: pass

### Manual signals

- **Bugs post-merge**: none — track as discovered
- **New external dependencies**: none (reused `lucide-react`)
- **Correction cycles during apply**: 1 (lint `react-hooks/set-state-in-effect` forced dropping the `usePathname` close effect)

Commit chain:

```
816a441 chore: openspec proposal for POR-165 mobile-nav-drawer
6ab142e feat(POR-165): mobile navigation hamburger + drawer
aa4340a chore(verify): produce verify.md for mobile-nav-drawer
```

---

## 1. Wins

- TDD ran clean: tests written first failed for the right reason (missing module + missing hamburger), then went green after implementation — `6ab142e`.
- Zero new dependencies — `lucide-react@1.17.0` already exported `Menu`/`X`; verified in design Project Facts Preflight before writing, so no icon-name surprise (cf. known `lucide` brand-icon gotcha).
- Single `NAV_LINKS` source rendered in both bar and drawer → no link drift, parity guaranteed by construction (design D2).
- Fast lead time (~15m) with all five CI gates green.

## 2. Misses

- 🟡 [painful] `scripts/collect-metrics.sh` produced wrong `size` (base = HEAD → 0 files/commits) and slurped the inline YAML comment into `method` ("sdd\"  # ..."). Same defect surfaced in the POR-164 retro and was never fixed; hand-corrected again here.
- 🟡 [painful] Design D3 specified a `usePathname` close effect that the repo's own lint rule forbids — caught only at the lint gate, costing one correction cycle. Project Facts Preflight checked tokens/exports but not lint rules that constrain effect patterns.
- 📌 [nit] Three scenarios (resize auto-close, focus-return, scroll-lock/focus-trap) are implemented but lack automated tests — jsdom `matchMedia` mock doesn't dispatch `change`.

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| 3.3 / design D3 | Dropped `usePathname` close effect; rely on link `onClick`→`onClose` | `react-hooks/set-state-in-effect` lint rule forbids sync setState in effect body |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✗ |
| `gherkin-authoring` (specs) | ✗ |
| `c4-architecture` (design, if arch) | N/A — single component, no system boundary |
| `vercel-react-best-practices` (design/apply, if React/Next.js) | ✗ |
| `subagent-driven-development` (apply) | N/A — single linear task chain |
| `test-driven-development` (apply) | ✓ |
| `systematic-debugging` (apply, if bugs/failures) | N/A — no debugging needed |
| `requesting-code-review` (apply) | ✗ |
| `openspec-verify-change` (verify) | ✓ |
| `verification-before-completion` (verify) | ✓ |
| `finishing-a-development-branch` (finish) | ✗ — committed to main per project pattern |
| `openspec-linearized` (proposal, apply, archive) | ✓ |

### Deliberately Skipped Skills

- `grill-with-docs`, `gherkin-authoring`, `vercel-react-best-practices`: scope was small and well-bounded (one component extending an existing pattern); skipped to keep momentum. Trigger to use next time: any change touching data flow, multiple components, or new rendering/hydration paths.
- `requesting-code-review`: solo flow, committed to main per established POR-164 pattern. Trigger: before any PR to a shared branch.

---

## 5. What to change next cycle

- Fix `collect-metrics.sh` base detection and `method` parsing once, in-repo, so retros stop hand-patching metrics.json (see §6).
- During design Project Facts Preflight, when a decision involves React effects, check the repo's enabled lint rules (`react-hooks/*`) so design doesn't propose patterns the linter rejects.

---

## 6. Promote candidates

- [x] Fix `scripts/collect-metrics.sh`: base = parent of the commit that first added the change's proposal (not `merge-base HEAD main`, which collapses to HEAD when committing on main); parse `method` by stripping inline `#` comments and quotes. **Done this change** — script now auto-emits `method: sdd` and `size: 3 commits / +587 / -6 / 11 files`.
      **Why:** recurring defect — wrong `size` (0 files) and polluted `method` in both POR-164 and POR-165 retros; forced manual correction every cycle.
      **How to apply:** done — see `scripts/collect-metrics.sh` scalar() comment-stripping + proposal-parent base resolution.
- [x] Memory (feedback): repo lint rule `react-hooks/set-state-in-effect` forbids synchronous `setState` in effect bodies — close-on-route-change must use link `onClick`, not a `usePathname` effect. **Done** — `memory/feedback_setstate_in_effect.md`.
      **Why:** cost a correction cycle this change; likely to recur on any drawer/menu/dialog with route-aware close.
      **How to apply:** done — memory file written + indexed in MEMORY.md.
