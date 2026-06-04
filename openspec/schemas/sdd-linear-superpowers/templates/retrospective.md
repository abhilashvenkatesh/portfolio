# Retrospective: <change-name>

> Written: <YYYY-MM-DD> (after verify passed)
> Commit range: `<base-sha>..<head-sha>`

## 0. Evidence

> Machine-collected fields below come from `metrics.json` — run
> `scripts/collect-metrics.sh <change-name>` and paste the numbers verbatim.
> Do NOT estimate these by hand; the script is the source of truth.

### Delivery (from metrics.json)

- **Method**: <metrics.method>
- **Linear story**: `<metrics.linear.id>` (`<metrics.linear.url>`)
- **Lead time**: <finished_at − started_at, e.g. 3h42m> (`started_at` → `finished_at`)
- **Diff size**: <+metrics.size.added / -metrics.size.deleted across metrics.size.files files, metrics.size.commits commits>
- **Tasks done**: <metrics.scope.tasks_done>/<metrics.scope.tasks_total>
- **Requirements / Scenarios**: <metrics.scope.requirements> / <metrics.scope.scenarios>

### Tokens / Cost (from metrics.json `tokens`)

- **Attribution**: <exact / partial / none> (<sessions> session(s))
- **Tokens**: in <input> / out <output> / cache-read <cache_read> / cache-write <cache_write_5m + cache_write_1h>
- **Total tokens**: <total_tokens>
- **Cost**: $<cost_usd>

### Quality Gates

- **OpenSpec validate**: <metrics.quality.openspec_validate>
- **Verify**: present=<metrics.quality.verify_present>, fail=<metrics.quality.verify_fail>, rewrites=<metrics.quality.verify_rewrites>
- **Unit tests**: <pass / fail / not-run>
- **Build**: <pass / fail / not-run>

### Manual signals (not auto-captured — fill honestly)

- **Bugs post-merge**: <count or "none — track as discovered">
- **New external dependencies**: <list or "none">
- **Correction cycles during apply**: <n or "not tracked">

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
