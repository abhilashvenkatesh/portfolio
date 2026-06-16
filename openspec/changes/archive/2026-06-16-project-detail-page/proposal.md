---
linear_story_id: "POR-171"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-171/projects-detail-page"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-16T10:12:03Z
finished_at: 2026-06-16T13:11:18Z
session_ids: ["dbf82aa4-e9bf-4c74-88d5-65177c61047e"]
---

## Why

Visitors who want depth on a specific project have nowhere to go — there is no
projects route, no project data, and the design prototype only shows the listing.
A dedicated per-project case-study page at its own URL gives prospective employers
the scope, role, and outcomes that a card cannot carry. Business details: see
[POR-171](https://linear.app/abhilash-projects/issue/POR-171/projects-detail-page).

## What Changes

- New `/projects/[slug]` detail route (SSG via `generateStaticParams`), one static page per project. Slug derived from `Project.id`; unknown slug → `notFound()`.
- New **long-form case-study body** per project as optional `content/projects/<slug>.mdx`, rendered below the structured sections via `next-mdx-remote/rsc`. A project without an MDX file still renders its structured sections (graceful degradation).
- Extend `Project` type with two optional fields: `role`, `timeline`. Deeper narrative stays in the MDX body, not the schema.
- **Minimal bridge listing** at `/projects` (PROJ-1 header + basic linked card grid) so the detail page is reachable and verifiable. Full listing polish (hover, accent line, stagger, impact-callout styling) is deferred to POR-170 — this change intentionally does not implement it.
- Seed `projects.json` (currently empty) with 2 sample projects (one with a demo, one without) and matching MDX bodies. Real content is a later swap, same pattern as `experience.json`.
- New MDX/project loaders in `lib/content.ts` (project-by-slug, MDX body loader); `generateMetadata` per project (title = name, description = tagline).

## Capabilities

### New Capabilities

- `project-detail-page`: per-project detail/case-study page at `/projects/[slug]` — structured sections (problem, impact, stack, role, timeline, links) plus an optional long-form MDX body, SSG per project, with not-found handling and per-project metadata.
- `projects-listing-bridge`: minimal `/projects` listing (header + linked card grid) that links each card to its detail page. Scoped as a bridge; full listing fidelity belongs to POR-170.

### Modified Capabilities

<!-- No existing OpenSpec specs change; projects has no prior canonical spec. -->

## Impact

- **Code:** new `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`; `lib/types.ts` (`Project` gains optional `role`, `timeline`); `lib/content.ts` (slug lookup + MDX body loader); `components/ui/FadeIn.tsx` reuse.
- **Content:** `content/projects.json` seeded; new `content/projects/*.mdx`.
- **Dependencies:** uses existing `next-mdx-remote` + `gray-matter` (first MDX consumer in the repo).
- **Adjacent issues:** POR-170 (listing) refines the bridge listing rather than rebuilding it; `Project` schema change must stay compatible with POR-170/DATA-1's `projects.json` contract.
