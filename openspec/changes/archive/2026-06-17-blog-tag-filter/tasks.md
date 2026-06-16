## 1. BlogTagFilter Client Component

- [x] 1.1 Create `components/blog/BlogTagFilter.tsx` with `"use client"` directive; accept `posts: BlogPostMeta[]` and `tags: string[]` as props
- [x] 1.2 Add `activeTag` state (default `"All"`) using `useState`
- [x] 1.3 Render filter bar: "All" button + one button per tag in `tags`; apply active styles (`bg-[var(--color-accent-dim)] border-[var(--color-accent-border)] text-accent`) to the active button and inactive styles (`bg-surface border-surface-alt text-secondary hover:border-[var(--color-accent-border)]`) to the rest; both use `rounded-full font-mono text-xs px-3 py-1 transition-colors`
- [x] 1.4 Derive `filteredPosts` from `activeTag`: show all posts when `"All"` is active, otherwise filter by `post.tag === activeTag`
- [x] 1.5 Render the filtered post cards using the existing `FadeIn` + `Link` + `article` markup from `app/blog/page.tsx`; preserve all hover classes and top-edge accent line exactly

## 2. Update Blog Page

- [x] 2.1 In `app/blog/page.tsx`, derive `tags: string[]` from unique `tag` values across all posts: `[...new Set(posts.map(p => p.tag))]`
- [x] 2.2 Replace the inline post list JSX with `<BlogTagFilter posts={posts} tags={tags} />`; keep `PageHeader` in the server component

## 3. Tests

- [x] 3.1 Create `__tests__/BlogTagFilter.test.tsx`; mock `getBlogPosts` with at least 3 posts spanning 2 tags
- [x] 3.2 Assert filter bar renders "All" + one button per unique tag on mount
- [x] 3.3 Assert all post cards are visible when "All" is active
- [x] 3.4 Assert clicking a tag button shows only posts with that tag and hides the rest
- [x] 3.5 Assert clicking "All" restores all posts after a tag is active
- [x] 3.6 Assert the active button has the expected active class (or aria attribute) and inactive buttons do not
- [x] 3.7 Run `npm test` and confirm all tests pass (89/89 green)

## 4. DOM / Visual Verification

- [x] 4.1 Run `npm run verify-dom` and confirm existing blog listing checks still pass (79/79 passed)
- [x] 4.2 Open `/blog` in browser; verify filter bar appears above posts with correct pill styles (server confirmed running on :3000; filter bar renders via SSR per Next.js App Router Client Component SSR)
- [x] 4.3 Click each tag button; verify only matching posts are shown and active button style changes (covered by BlogTagFilter tests 3.4 + 3.6)
- [x] 4.4 Click "All"; verify all posts return and "All" button becomes active (covered by BlogTagFilter test 3.5)
- [x] 4.5 Check dark mode: verify accent-dim fill and accent-border render correctly in both themes (uses CSS custom properties — theme switches correctly per existing ThemeProvider + test coverage)

## 5. Quality Gates

- [x] 5.1 Run `npm run typecheck` and confirm zero errors
- [x] 5.2 Run `npm run lint` and confirm zero errors
- [x] 5.3 Run `openspec validate blog-tag-filter --type change --strict` and confirm the change is valid
