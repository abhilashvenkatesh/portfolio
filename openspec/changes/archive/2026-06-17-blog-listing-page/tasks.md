## 1. Blog data loader

- [x] 1.1 Create `lib/blog.ts` — export `getBlogPosts(): BlogPostMeta[]` using `gray-matter` to read all `*.mdx` files from `content/blog/`, derive slug from filename, sort newest-first by `date`
- [x] 1.2 Export `getBlogPostBySlug(slug: string): BlogPostMeta | undefined` for use by future detail page

## 2. Blog listing page

- [x] 2.1 Create `app/blog/page.tsx` as a Server Component — call `getBlogPosts()`, export `metadata` (`title: "Writing"`)
- [x] 2.2 Render `<PageHeader label="Writing" subtitle="Thoughts on engineering" intro="I write about distributed systems, backend engineering, and the things I've learned by breaking things in production." />`
- [x] 2.3 Render post list: wrap each card in `<FadeIn delay={i * 80}>` for staggered scroll animation
- [x] 2.4 Each card: `<Link href={"/blog/" + slug}>` wraps `<article>` with `group hover:-translate-y-0.5 hover:border-[var(--color-accent-border)] hover:bg-surface-alt transition-all rounded-xl border border-surface-alt bg-surface px-7 py-6`
- [x] 2.5 Inside card: top-edge accent line div `absolute left-0 top-0 h-px w-0 bg-[linear-gradient(90deg,var(--color-accent),transparent)] transition-[width] duration-300 group-hover:w-[60%]`
- [x] 2.6 Inside card: topic tag chip, date, and read-time meta row; post title `h2` with `group-hover:text-accent transition-colors`; summary paragraph; "Read article →" affordance text

## 3. Tests

- [x] 3.1 Add `__tests__/Blog.test.tsx` — render `<BlogPage />` with mocked `getBlogPosts` returning at least one `BlogPostMeta`; assert page header text "Writing" and "Thoughts on engineering" are present
- [x] 3.2 Assert card renders: topic tag, date, read time, title, and summary for the mocked post
- [x] 3.3 Assert card wraps in a link pointing to `/blog/<slug>`
- [x] 3.4 Assert `FadeIn` wraps each card (class or component presence)
- [x] 3.5 Run `npm test` and confirm all tests pass

## 4. DOM / Visual Verification

- [x] 4.1 Start dev server (`npm run dev`), open `/blog` — confirm page header, intro, and card(s) render without layout issues
- [x] 4.2 Hover a card — confirm title turns accent colour, top-edge line animates in, card lifts (`-translate-y-0.5`)
- [x] 4.3 Check mobile viewport (375px) — confirm card is full width, no overflow or text clipping
- [x] 4.4 Check dark mode — confirm tokens resolve correctly (`surface`, `surface-alt`, `accent-border`)

## 5. Quality Gates

- [x] 5.1 Run `npm run typecheck` and confirm zero errors
- [x] 5.2 Run `npm run lint` and confirm zero errors
- [x] 5.3 Run `npm run validate-content` and confirm passes
- [x] 5.4 Run `npm run build` and confirm clean build with `/blog` in static output
- [x] 5.5 Run `openspec validate blog-listing-page --type change --strict` and confirm valid
