# Verification Report

**Change**: `<change-name>`
**Verified at**: `YYYY-MM-DD HH:mm`
**Verifier**: `<who / which agent>`

---

## 1. Structural Validation (`openspec validate --all --json`)

- [ ] All items return `"valid": true`

**Result**:

```text
<paste openspec validate --all output>
```

Failures (if any):

| Item | Type | Issues |
|---|---|---|
| — | — | — |

---

## 2. Task Completion (`tasks.md`)

- [ ] All `- [ ]` changed to `- [x]`

**Incomplete tasks** (if any):

| Task | Reason | Blocks archive? |
|---|---|---|
| — | — | — |

---

## 3. Unit Test Evidence

- [ ] Unit tests were added or updated for the changed behaviour
- [ ] `npm test` passes

**Test command**:

```text
npm test
```

**Result**:

```text
<paste test summary>
```

Missing unit tests are a blocking failure.

---

## 4. DOM / Visual Evidence

- [ ] DOM/render assertions cover required user-visible content or state
- [ ] UI changes were visually verified across relevant viewport states
- [ ] No text overlap, clipping, layout shift, or missing visible state was observed

**Evidence**:

| Check | Viewport / State | Evidence | Result |
|---|---|---|---|
| — | — | — | — |

Missing DOM/visual verification for UI changes is a blocking failure.

---

## 5. Delta Spec Sync State

For each directory under `openspec/changes/<name>/specs/`, compare against `openspec/specs/<capability>/spec.md`:

| Capability | Sync state | Notes |
|---|---|---|
| — | ✓ Synced / ✗ Needs sync / N/A | — |

---

## 6. Design / Specs Coherence

Spot-check that `design.md` decisions align with requirements in `specs/`:

| Item | design.md decision | specs requirement | Drift? |
|---|---|---|---|
| — | — | — | — |

**Drift warnings** (non-blocking): none

---

## 7. Implementation Signal

- [ ] No unstaged files (`git status --short` is clean)
- [ ] Implementation was committed before verify
- [ ] All relevant commits exist in the commit range

**Commit range**: `<from-sha>..<to-sha>`

**Blocking rule**: uncommitted implementation is a FAIL, not a warning. Return to apply,
commit the implementation and artifact updates, then re-run verify.

---

## Overall Decision

- [ ] ✅ PASS — ready for retrospective; archive remains blocked until retrospective is complete
- [ ] ⚠️ PASS WITH WARNINGS — can proceed to retrospective, note: `<detail>`
- [ ] ❌ FAIL — return to failing artifact, fix, re-run verify

**Next step**: Run `/opsx:retrospective`. Do not run `/opsx:archive` until retrospective.md exists, §0 Evidence is complete, and promote candidates are handled.
