---
linear_story_id: "POR-175"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-175/blog-post-page-reading-experience-author-card-more-posts"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: "2026-06-16T23:14:52Z"
finished_at: "2026-06-16T23:53:13Z"
session_ids: ["9d42fb08-c46a-4fd7-b950-225f6b982035"]
---

## Why

The blog listing page is live and post cards link to `/blog/<slug>`, but no individual post page exists — those links 404. This change delivers the reading experience: a full-page MDX renderer with navigation, a typeset article body, an author card, and a "More posts" section.

## What Changes

- New `/blog/[slug]` dynamic route (SSG via `generateStaticParams`)
- MDX rendering of post body using `next-mdx-remote/rsc` with visually distinct typography (headings, paragraphs, lists, bold, italic, code, blockquotes)
- Post header: topic tag, date, read time, title, summary — separated from body by a horizontal rule
- Navigation: "← All posts" link (accent on hover)
- Author card below the article: name, short bio line, photo or placeholder
- "More posts" section: up to 2 other posts (title, date, read time); accent hover; navigates to that post
- Not-found fallback: "Post not found." + "← Back to blog" link for unknown slugs
- Extend `lib/blog.ts` with a full-content loader that returns the MDX body alongside meta

## Capabilities

### New Capabilities

- `blog-post-page`: Individual blog post reading page at `/blog/[slug]` — header, MDX body, author card, and more-posts section

### Modified Capabilities

- `blog-listing-page`: Post card "Read article →" links (and full-card click) already spec'd to navigate to `/blog/<slug>`. No spec-level behaviour change — the route now exists to back that navigation. No delta spec needed.

## Impact

- New file: `app/blog/[slug]/page.tsx` (SSG dynamic route)
- New file: `components/blog/BlogPost.tsx` (MDX body renderer with typography styles)
- New file: `components/blog/AuthorCard.tsx`
- New file: `components/blog/MorePosts.tsx`
- Modified: `lib/blog.ts` — add `getFullBlogPost(slug)` returning MDX source + meta
- Possibly `lib/types.ts` if `BlogPost.content` type needs adjustment for MDX source
- No API or schema changes; all content from existing `content/blog/*.mdx` files
