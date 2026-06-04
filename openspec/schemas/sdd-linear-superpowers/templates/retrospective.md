# Retrospective: <change-name>

> Written: <YYYY-MM-DD> (after verify passed)
> Commit range: `<base-sha>..<head-sha>`

## 0. Evidence

### Delivery

- **Method**: SDD / human / vibe
- **Backfilled**: yes / no
- **Linear story**: `<id or none>` (`<url or none>`)
- **Commit range**: `<base-sha>..<head-sha>` (<n> commits)
- **Diff size**: <+X / -Y lines across N files>
- **Files changed**: <n>
- **Tasks done**: <x>/<y> (<percent>%)
- **Requirements**: <n>
- **Scenarios**: <n>
- **New external dependencies**: <list or "none">
- **Bugs post-merge**: <count or "none">

### Quality Gates

- **OpenSpec validate at archive**: <pass / fail / not-run>
- **Unit tests**: <pass / fail / not-run>
- **Build**: <pass / fail / not-run>
- **Verify decision**: pass / warnings / fail

### Rework Signals

- **OpenSpec validation failures before pass**: <n or unknown>
- **Test/build failures before pass**: <n or unknown>
- **Verify reruns**: <n or unknown>
- **Correction cycles**: <n or unknown>

### Score

- **Spec/task completion score**: <0-100>
- **Quality gate score**: <0-100>
- **Rework score**: <0-100>
- **Overall SDD score**: <0-100>
- **Confidence notes**: <what is exact vs inferred>

Commit chain:

```
<base-sha> <summary>
...
<head-sha> <archive commit>
```

---

## 1. Wins

- <what worked well, with evidence>

---

## 2. Misses

- 🔴 [blocking] <description>
- 🟡 [painful] <description>
- 📌 [nit] <description>

---

## 3. Plan deviations

| Task | What changed | Why |
|---|---|---|
| — | — | — |

---

## 4. Skill / workflow compliance

| Skill | Used |
|---|---|
| `grill-with-docs` (proposal) | ✓ / ✗ |
| `gherkin-authoring` (specs) | ✓ / ✗ |
| `c4-architecture` (design, if arch) | ✓ / ✗ / N/A |
| `vercel-react-best-practices` (design/apply, if React/Next.js) | ✓ / ✗ / N/A |
| `subagent-driven-development` (apply) | ✓ / ✗ |
| `test-driven-development` (apply) | ✓ / ✗ |
| `systematic-debugging` (apply, if bugs/failures) | ✓ / ✗ / N/A |
| `requesting-code-review` (apply) | ✓ / ✗ |
| `openspec-verify-change` (verify) | ✓ / ✗ |
| `verification-before-completion` (verify) | ✓ / ✗ |
| `finishing-a-development-branch` (finish) | ✓ / ✗ |
| `openspec-linearized` (proposal, apply, archive) | ✓ / ✗ / N/A |

### Deliberately Skipped Skills

> For each ✗ above, answer: what was skipped, why this cycle (specific trigger), how to prevent recurrence.

---

## 5. Surprises

- <assumption that turned out wrong>

---

## 6. Promote candidates → long-term learning

- [ ] 🔴 **<short rule>** → **Promote to** memory / CLAUDE.md / schema / skill / one-off
  > **Why**: <past incident or strong preference>
  > **How to apply**: <when/where this kicks in>
