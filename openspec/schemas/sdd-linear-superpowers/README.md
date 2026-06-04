# sdd-linear-superpowers Schema

SDD + Linear + Superpowers OpenSpec schema for product/platform changes with meaningful behaviour and long-lived design decisions.

## Workflow

```
proposal → specs → design → tasks → apply → verify → retrospective → archive
```

Each stage gates the next:

| Stage | Captures | Output |
|-------|----------|--------|
| **proposal** | WHY — problem, capabilities, impact | `proposal.md` |
| **specs** | WHAT — observable behaviour in Gherkin | `specs/<capability>/spec.md` |
| **design** | HOW — architecture, decisions, trade-offs | `design.md` |
| **tasks** | WORK — checkbox-trackable implementation steps | `tasks.md` |
| **apply** | Implementation — code written, tasks checked off | code commits |
| **verify** | Post-impl check — tasks done, specs synced, CI clean | `verify.md` |
| **retrospective** | Evidence-first retro — wins, misses, promotes | `retrospective.md` |
| **archive** | Merge delta specs → canonical; move change to archive | `openspec/changes/archive/` |

## When to Use

Appropriate for:
- Product or platform changes with meaningful behaviour and long-lived design decisions
- Cross-module work
- Architecture choices future changes should honor

**Not** appropriate for:
- Small tactical fixes
- Docs-only changes
- Dependency bumps
- Behaviour-only work where a simpler schema suffices

## Activation

Set in `openspec/config.yaml`:

```yaml
schema: sdd-linear-superpowers
```

## Specs Format

Specs use OpenSpec Markdown delta headers for archive merging:

```markdown
## ADDED Requirements

### Requirement: <name>

GIVEN ...
WHEN ...
THEN ...
```

Requirements use `### Requirement:`, scenarios use `#### Scenario:` — both required for OpenSpec validation.

## Git Discipline

`openspec-git-discipline` is invoked at four gates:

| Gate | When | Rule |
| --- | --- | --- |
| Before propose | `proposal` PRECHECK | Must be on `main` |
| Before specs | `specs` PRECHECK | Proposal artifacts committed before continuing |
| Before apply | `apply` PRECHECK | Proposal change committed to `main` |
| Before archive | after `verify` + `retrospective` | Implementation merged to `main`; retrospective complete; archive runs from `main` |

## Retrospective Evidence

Retrospectives capture concrete delivery evidence such as commit range, diff size,
files changed, tasks completed, quality gates, rework signals, and promote candidates.
They do not require phase timing or token usage calculations.

## Validation

```bash
openspec schema validate sdd-linear-superpowers
```
