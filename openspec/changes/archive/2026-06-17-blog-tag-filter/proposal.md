---
linear_story_id: "POR-174"
linear_story_identifier: "POR-174"
linear_story_title: "Blog tag filter"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-174/blog-tag-filter"
linear_story_state: "Planning"
linear_team: "Portfolio"
linear_project: "Portfolio Website"
method: "sdd"
started_at: "2026-06-17T00:00:00Z"
finished_at: "2026-06-17T00:45:00Z"
session_ids: ["3d57eb5f-4954-4dbc-85e0-a65cd8b7f65c"]
---

## Why

The blog listing page shows all posts in a flat list with no way to filter by topic. As the number of posts grows, visitors who want to read specifically about Go, PostgreSQL, or Systems Design have to scan every card — tag filter buttons make the listing self-serve without any additional pages or routes.

## What Changes

- A row of tag filter buttons ("All" + one per unique `tag` value in post data) appears above the post list
- Clicking a tag instantly shows only matching posts; non-matching cards are hidden
- The active tag button is visually highlighted (accent background + border); inactive tags show accent border on hover
- All filter logic is client-side — no network request on filter change
- The post list area is extracted into a `BlogTagFilter` Client Component; the page itself remains a Server Component

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `blog-listing-page`: adds an interactive tag filter bar above the post list; the listing now supports filtered views by topic

## Impact

- `app/blog/page.tsx` — passes posts + derived tag list as props to new client component
- `components/blog/BlogTagFilter.tsx` — new client component (useState for active tag, renders filter bar + filtered post cards)
- `lib/blog.ts` — no changes needed; `tag` field already on `BlogPostMeta`
- No new dependencies
