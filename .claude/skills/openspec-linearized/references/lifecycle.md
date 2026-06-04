# Linearized OpenSpec Lifecycle

Reference for `openspec-linearized` skill. Use to coordinate proposal, apply, and archive lifecycle events while keeping Linear responsible for the business "what" and the repo responsible for the technical "how".

## Ownership Boundary

- **Linear issue** owns the business "what": business goal, use cases, user/persona context, workflows, scope, acceptance criteria, and stakeholder-facing status.
- **Repo change artifacts** own the technical "how": design decisions, architecture trade-offs, data models, migrations, implementation tasks, test plans, and code.
- `proposal.md` is a lightweight repo coordination artifact. It records Linear binding metadata, capability impact, and a concise repo-facing summary. Use its business-facing sections to refresh the Linear issue description when those details change.
- `design.md` and `tasks.md` stay in the repo. Do not copy detailed technical design, architecture, task lists, or implementation notes into the Linear issue.
- **Canonical specs** live under `openspec/specs/`. After archive succeeds, mirror finalized canonical specs into Linear Project Documents so stakeholders can read them in Linear.
- Linear Project Documents are mirrors, not the canonical source. Replace them from repo canonical spec content at archive time.

## Config

Project-local Linear setup lives at `openspec/linear.yaml`:

```yaml
team:
  id: "<linear-team-id>"
  key: "<team-key>"
  name: "<team-name>"
project:
  id: "<linear-project-id>"
  name: "<project-name>"
issue_label_filter:
  name: "<optional-label-name>"
archive_documents:
  enabled: true
  title_prefix: "OpenSpec:"
  documents:
    "<capability-name>":
      id: "<linear-document-id>"
      url: "<linear-document-url>"
      title: "OpenSpec: <capability-name>"
```

If the file is missing during proposal work:

1. Verify Linear MCP connectivity (use `mcp__linear-server__list_teams`).
2. List only setup data: teams, projects, issue labels.
3. Ask one question at a time: Linear team → Linear project → issue label filter.
4. Include explicit "no label filter" option in the label question.
5. Never infer or auto-select team, project, or label.
6. Write selected IDs and display names to `openspec/linear.yaml`.
7. Return to Proposal Binding flow; list issues only after config exists and story selection is required.

If Linear MCP is unavailable, ask whether to continue locally without a story binding or pause.

## Proposal Binding

Proposal frontmatter fields:

```yaml
---
linear_story_id:
linear_story_identifier:
linear_story_title:
linear_story_url:
linear_story_state:
linear_team:
linear_project:
---
```

Selection flow:

1. Load `openspec/linear.yaml`.
2. Query Backlog issues for the configured team and project via `mcp__linear-server__list_issues`. Apply `issue_label_filter.name` only to candidate selection.
3. If user gave a specific Linear identifier, retrieve/use that story when it matches configured context.
4. Otherwise present candidate list and let the contributor choose.
5. Read available title, description, labels, comments, links, and related context.
6. Treat the story as the business brief. Write new or corrected business facts back to the Linear issue when possible.
7. Ask clarifying questions covering:
   - business goal and business cases
   - target users, personas, and workflows
   - in-scope and out-of-scope behavior
   - acceptance criteria and affected OpenSpec capabilities
   - architecture constraints and preferred approach (repo design only)
   - tech stack constraints and integration points (repo design only)
   - risks, migrations, rollout constraints, and non-goals
8. Before finishing proposal setup, update the Linear issue description with confirmed business details from `proposal.md`. Exclude frontmatter, Linear metadata, detailed technical design, task lists, and implementation notes.
9. Transition issue to Planning via `mcp__linear-server__save_issue`.
10. Add a two-sentence `mcp__linear-server__save_comment` saying OpenSpec proposal discovery started and the story was linked.

## OpenSpec Artifacts

Artifact order:

```
proposal → specs → design → tasks
```

**Proposal**: Lightweight and repo-facing. Record Linear binding metadata, affected capabilities, and a concise summary needed to coordinate OpenSpec artifacts.

**Specs**: One delta spec per capability listed in the proposal. Use `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`, `## RENAMED Requirements`. Each requirement: `### Requirement: <name>`. Each scenario: `#### Scenario: <name>`. Every requirement needs at least one scenario. For modified requirements, copy the entire existing requirement block before editing.

**Design**: Create only when the change is cross-cutting, introduces a meaningful architecture or data model decision, adds an external dependency, has security/performance/migration complexity, or contains ambiguity that benefits from decisions before coding. Keep design content in the repo; Linear comments may mention design exists but must not duplicate it.

**Tasks**: Checkboxes exactly `- [ ] X.Y Task description`. Small, dependency-ordered, directly verifiable. Include relevant tests and `openspec validate <change> --strict`. Do not add post-archive Linear Project Document sync checkboxes.

## Apply Hook

Before implementation:

1. Read `openspec/changes/<change>/proposal.md` frontmatter.
2. If `linear_story_id` present and Linear MCP available, sync business/context changes from `proposal.md` to issue description when possible.
3. If issue is in Planning, transition to In Progress via `mcp__linear-server__save_issue`.
4. Add two-sentence `mcp__linear-server__save_comment` saying implementation began from the OpenSpec change.

Then follow normal OpenSpec apply workflow: read context files, work through `tasks.md`, mark each checkbox complete immediately after the task is done. Pause for blockers or unclear requirements.

Never transition the story to Done during apply.

## Archive Hook

Strict order:

1. Complete normal OpenSpec archive readiness checks.
2. Sync delta specs into canonical specs when user chooses to sync.
3. Archive the change.
4. Only after archive succeeds, mirror canonical specs to Linear Project Documents.
5. Transition the Linear story to Done.

Document upsert per capability:

1. Read canonical `openspec/specs/<capability>/spec.md`.
2. Use stored document ID from `openspec/linear.yaml` if available.
3. Otherwise list/search project documents via `mcp__linear-server__list_documents` for title `OpenSpec: <capability-name>`.
4. If found, update via `mcp__linear-server__save_document`.
5. If not found, create via `mcp__linear-server__save_document` with deterministic title.
6. Persist document ID, URL, and title back to `openspec/linear.yaml`.

Only Linear Project Documents are in scope. Replace full body with canonical spec content — documents are disposable mirrors.

## Linear Tool Mapping

| Action | Tool |
|---|---|
| List teams | `mcp__linear-server__list_teams` |
| List projects | `mcp__linear-server__list_projects` |
| List labels | `mcp__linear-server__list_issue_labels` |
| List issues | `mcp__linear-server__list_issues` |
| Issue context | `mcp__linear-server__list_comments` |
| State update | `mcp__linear-server__save_issue` |
| Comment | `mcp__linear-server__save_comment` |
| Document lookup | `mcp__linear-server__list_documents` |
| Document upsert | `mcp__linear-server__save_document` |
