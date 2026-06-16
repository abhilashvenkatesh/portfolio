---
linear_story_id: "POR-173"
linear_story_identifier: "POR-173"
linear_story_title: "Blog listing page — post cards, hover, scroll animation"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-173/blog-listing-page-post-cards-hover-scroll-animation"
linear_story_state: "Backlog"
linear_team: "Portfolio"
linear_project: "Portfolio Website"
method: "sdd"
started_at: 2026-06-16T23:50:00Z
session_ids: ["1d31d54f-224c-4d15-8353-f8865e23a70d"]
---

## Why

No `/blog` route exists. POR-173 delivers the blog discovery experience — a listing page with post cards sourced from `content/blog/*.mdx` frontmatter, the same hover and scroll-animation polish the rest of the site has, and click-anywhere navigation to individual posts.

## What Changes

- New `/blog` route: page header ("Writing" label, "Thoughts on engineering" subtitle) and an intro paragraph.
- Blog data loader added to `lib/content.ts` (or a new `lib/blog.ts`): reads `content/blog/*.mdx` via `gray-matter`, derives slug, returns sorted `BlogPostMeta[]`.
- Post card displays: topic tag, publication date, estimated read time, post title, one-sentence summary, and "Read article →" link.
- Hover: title colour switches to accent, an accent-coloured line animates in along the top edge, card lifts `-2px` Y (matches project card treatment, spec: `--color-accent-border`, `surface-alt` bg).
- Click anywhere on a card navigates to `/blog/[slug]` (Next.js `<Link>` wrapping the card; `<a>` tag affordance via `cursor-pointer`).
- Scroll animation: `FadeIn` with staggered `delay` per card index (matches existing `FadeIn` component).

## Capabilities

### New Capabilities

- `blog-listing-page`: the `/blog` route and its post card behaviour.

### Modified Capabilities

<!-- none -->

### Impact

- `app/blog/page.tsx` — new SSG route (Server Component, `generateStaticParams` not needed for listing).
- `lib/content.ts` (or `lib/blog.ts`) — `getBlogPosts(): BlogPostMeta[]` loader using `gray-matter`.
- `content/blog/placeholder.mdx` — existing seed file; loaders read all `.mdx` files in `content/blog/`.
- No new design tokens needed — `--color-accent-border` already added by POR-170 (projects-listing-page).
- Source-of-truth design: `documentation/design/blog.html`.
