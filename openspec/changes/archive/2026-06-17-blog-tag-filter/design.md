## Context

`app/blog/page.tsx` is a Server Component (SSG) that fetches all posts via `getBlogPosts()` and renders them in a flat list. POR-174 adds a tag filter bar above the list so visitors can narrow posts by topic instantly. The filter must be client-side (instant, no network call on selection). The page's SSG nature must be preserved — only the interactive filter slice becomes a Client Component.

## Goals / Non-Goals

**Goals:**
- Tag filter bar derived from unique `tag` values across all posts, plus "All"
- Instant client-side filtering on button click
- Active button: accent-dim fill + accent-border border + accent text
- Inactive button hover: accent-border border
- `app/blog/page.tsx` stays a Server Component; only filter+list area is a Client Component

**Non-Goals:**
- URL-based filter state (no `?tag=` query param — additive enhancement only)
- Multi-tag selection
- Animation on card entry/exit when filter changes (existing FadeIn stays; filtering toggles visibility)

## Project Facts Preflight

- Dependencies checked: `package.json` — no new dependencies needed; React `useState` is sufficient for filter state
- Icon/export availability checked: N/A — no icons needed for filter bar
- Design tokens/classes checked: `styles/globals.css` confirms `--color-accent`, `--color-accent-dim`, `--color-accent-border`, `--color-surface-alt`; `documentation/DESIGN.md` confirms filter pills use `100px` radius; active fill uses `accent-dim`; hover border uses `accent-border`
- Existing components/helpers checked: `components/blog/` does not exist — must create; `lib/blog.ts` already exposes `getBlogPosts()` returning `BlogPostMeta[]` with `tag: string`; `BlogPostMeta` in `lib/types.ts` already has `tag`
- Scripts checked: `npm run typecheck`, `npm run lint`, `npm run test` — all relevant gates

## Decisions

**1. Client Component boundary: new `BlogTagFilter` component**

`app/blog/page.tsx` cannot use `useState` (Server Component). Extract the filter bar + post list into `components/blog/BlogTagFilter.tsx` (marked `"use client"`). The page server component calls `getBlogPosts()`, derives unique tags, and passes `posts` + `tags` as props. No data fetching moves to the client.

Alternative considered: convert `page.tsx` to a Client Component. Rejected — would break SSG and force all data loading to happen at runtime.

**2. Tag derivation in the server component**

Unique tags are derived via `[...new Set(posts.map(p => p.tag))]` in `page.tsx` before passing to `BlogTagFilter`. Keeps `BlogTagFilter` pure (no filesystem access, no `gray-matter` dependency on the client side).

**3. Filter logic: array filter + conditional rendering**

`BlogTagFilter` holds `activeTag: string` state (default `"All"`). Filtered posts = `activeTag === "All" ? posts : posts.filter(p => p.tag === activeTag)`. Cards render from the filtered array — existing `FadeIn` + card markup stays unchanged.

Alternative considered: CSS visibility toggling on all cards. Rejected — unnecessary DOM nodes; filtering the array is simpler and avoids layout side effects.

**4. Button styling pattern**

Active: `bg-[var(--color-accent-dim)] border border-[var(--color-accent-border)] text-accent`  
Inactive: `bg-surface border border-surface-alt text-secondary hover:border-[var(--color-accent-border)]`  
Both: `rounded-full font-mono text-xs px-3 py-1 transition-colors`

This matches the design system's filter pill spec (100px radius = `rounded-full`, DM Mono, accent-dim fill for selected, accent-border on hover).

## Risks / Trade-offs

- [FadeIn on filtered cards] When `activeTag` changes, already-visible cards that remain in the filtered set don't re-animate — they stay visible. New-to-view cards (previously hidden) will not trigger `IntersectionObserver` again since they were already observed. This is acceptable — the filter is instant selection, not a scroll-based reveal. Mitigation: accepted; no change needed.
- [Single tag per post] The current `BlogPostMeta.tag` is a single `string`. If future posts need multiple tags, the data model and filter logic would need updating. Out of scope for this change.

## Migration Plan

1. Add `BlogTagFilter` client component
2. Update `app/blog/page.tsx` to derive `tags` and pass props to `BlogTagFilter`
3. Run `npm run typecheck && npm run lint && npm run test`
4. No rollback needed — purely additive, the page degrades gracefully to showing all posts if JS is disabled (SSG HTML includes all cards)

## Open Questions

None.
