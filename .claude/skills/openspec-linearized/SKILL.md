---
name: openspec-linearized
description: "Use whenever operating on an OpenSpec change lifecycle or artifact, including propose/new change, apply/implement tasks, archive/finalize, sync specs, continue/update artifacts, validate/status checks, or work under openspec/changes/*. This is the Linear lifecycle overlay for OpenSpec work: bind Linear issues, maintain openspec/linear.yaml, update Linear issue business context/status, keep technical design/tasks in the repo, and mirror canonical specs into Linear Project Documents after archive."
license: MIT
compatibility: Requires openspec CLI and Linear MCP (mcp__linear-server__*).
metadata:
  author: intent-driven-dev (adapted for Claude Code)
  version: "1.0"
---

# OpenSpec Linearized

Use this skill to run an OpenSpec change lifecycle while preserving a clear ownership boundary:

- **Linear issue** owns the business "what": business goal, use cases, personas/workflows, scope, acceptance criteria, and stakeholder-facing status. Keep its description synchronized from the business-facing content in `proposal.md`.
- **The repo** owns the technical "how": OpenSpec design decisions, tasks, implementation details, migrations, tests, and code.
- **Canonical specs** live under `openspec/specs/`. After archive succeeds, mirror those specs into Linear Project Documents for stakeholder visibility.

Linear updates are best effort once project setup exists.

## Invocation Contract

- If the user asks to operate on an OpenSpec change, use this skill as the Linear lifecycle overlay.
- Also use the base OpenSpec skill that matches the request: `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, or `openspec-sync-specs` (or their `opsx:*` equivalents).
- If `openspec/linear.yaml` exists, run the relevant Linear hook for the current phase when possible.
- If `openspec/linear.yaml` is missing during proposal/setup, create it before issue hunting, story selection, or other Linear lifecycle work.
- If `openspec/linear.yaml` is missing outside proposal/setup, no-op the Linear hook and continue normal OpenSpec work.
- For status, validate, sync, continue, and artifact-editing work, preserve Linear binding awareness but do not move a Linear story to Done.

## Start

- Read `references/lifecycle.md` (co-located with this skill) before doing lifecycle work.
- Run `openspec list --json` to understand active changes.
- Determine the phase from the request:
  - **Proposal**: create or continue an OpenSpec change and bind a Linear story.
  - **Apply**: implement `tasks.md` while updating the bound Linear story.
  - **Archive**: archive the OpenSpec change, then mirror canonical specs and close the story.
  - **Sync/status/validate/continue/artifact work**: keep the Linear binding in view, preserve the ownership boundary, and avoid Done transitions.
- Use this skill as the Linear lifecycle overlay and follow the base OpenSpec skill for normal artifact generation, task execution, or archive mechanics.

## Linear Rules

- Use Linear MCP tools: `mcp__linear-server__list_teams`, `mcp__linear-server__list_projects`, `mcp__linear-server__list_issue_labels`, `mcp__linear-server__list_issues`, `mcp__linear-server__list_comments`, `mcp__linear-server__list_documents`, `mcp__linear-server__save_issue`, `mcp__linear-server__save_comment`, `mcp__linear-server__save_document`.
- If `openspec/linear.yaml` is missing during proposal/setup, perform setup before proposal discovery: list only Linear setup data, choose team/project/optional issue label filter, then write the config.
- During missing-config setup, call only `mcp__linear-server__list_teams`, `mcp__linear-server__list_projects`, and `mcp__linear-server__list_issue_labels`. Do not call `mcp__linear-server__list_issues` until after `openspec/linear.yaml` exists.
- Ask setup choices one question at a time: first Linear team, then Linear project, then issue label filter. The label question must include an explicit "no label filter" option.
- Never infer or auto-select team, project, or label from names, ordering, previous results, or seemingly obvious matches.
- After `openspec/linear.yaml` exists, Linear unavailability is non-blocking. Continue local OpenSpec work and skip Linear updates silently.
- Keep Linear comments short — at most two sentences.
- Do not make Linear the specification source of truth. Canonical specs live under `openspec/specs/`.
- Do not transition the bound Linear story to Done before OpenSpec archive succeeds.
- Keep detailed technical design out of Linear issue descriptions and comments; keep business context out of repo design/tasks except where needed to make technical decisions traceable.
- When `proposal.md` is created or materially updated, update the bound Linear issue description with the current business-facing proposal details when possible. Exclude frontmatter, Linear metadata, detailed technical design, task lists, and implementation notes.

## Phase Hooks

### Proposal
- Load `openspec/linear.yaml`; if missing, create it first using the missing-config setup rules above.
- After config exists, select a configured-project Backlog issue, applying the optional label filter only to candidate selection.
- Read the selected issue title, description, labels, comments, links, and related context when available.
- Treat the Linear issue as the business brief. If proposal discovery produces new or corrected business details, update the Linear issue when possible instead of making `proposal.md` the long-form business record.
- Ask clarifying questions before writing artifacts.
- Keep `proposal.md` lean: record Linear metadata in frontmatter, include capability impact and a concise repo-facing summary, and link back to the Linear issue for business details.
- After writing or updating `proposal.md`, refresh the bound Linear issue description from the proposal's business-facing sections when possible.
- Transition the issue to Planning when possible and add a short comment that proposal discovery started.

### Apply
- Read `linear_story_id` from `openspec/changes/<change>/proposal.md` before implementation.
- Before implementation, sync useful business/context changes from `proposal.md` to the Linear issue description when possible, but do not copy technical design details from `design.md` into Linear.
- Transition Planning → In Progress when possible and add a short comment that implementation began from the OpenSpec change.
- Work through `tasks.md`, marking checkboxes complete as tasks finish.
- Leave Done transition for archive.

### Archive
- Complete the normal OpenSpec archive flow first, including delta spec sync when applicable.
- Only after archive succeeds, mirror canonical `openspec/specs/<capability>/spec.md` content into Linear Project Documents.
- Use deterministic titles: `OpenSpec: <capability-name>`.
- Persist created or discovered document IDs in `openspec/linear.yaml` when possible.
- Transition the bound Linear issue to Done when possible and add a short archive-complete comment.

## Guardrails

- Keep post-archive Linear Project Document sync guidance out of `tasks.md`; it belongs to archive behavior.
- Only Linear Project Documents are in scope for spec mirrors. Do not create generic project resources for specs.
- Linear Project Documents are archive-time mirrors of finalized specs, not a place for draft design notes or implementation tasks.
- If the active schema already enforces linearized behavior, honor those instructions and avoid duplicating conflicting guidance.
