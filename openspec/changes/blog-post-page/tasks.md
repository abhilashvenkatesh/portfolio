## 1. Data Layer

- [x] 1.1 Add `getBlogBody(slug: string): string | null` to `lib/blog.ts` — read `content/blog/<slug>.mdx`, strip frontmatter via `gray-matter`, return `content`; return `null` if file not found

## 2. Not-Found Page

- [x] 2.1 Create `app/blog/[slug]/not-found.tsx` — render "Post not found." text and a "← Back to blog" link pointing to `/blog`

## 3. MDX Body Component

- [x] 3.1 Create `components/blog/BlogPost.tsx` — a Server Component that accepts `source: string` and renders `<MDXRemote source={source} components={mdxComponents} />`
- [x] 3.2 Define `mdxComponents` in `BlogPost.tsx` mapping: `h1`, `h2`, `h3`, `p`, `ul`, `li`, `strong`, `em`, `a`, `pre`, `code`, `blockquote` — use design tokens confirmed in design.md (`text-primary`, `text-secondary`, `text-accent`, `bg-surface-alt`, `bg-accent-dim`, `font-mono`)
- [x] 3.3 Ensure `code` inside `pre` does NOT receive inline-code accent styles — differentiate via `pre > code` pattern or separate prop check

## 4. Author Card Component

- [x] 4.1 Create `components/blog/AuthorCard.tsx` — accept `name: string` and `bio: string` props
- [x] 4.2 Render an initials placeholder (circular `bg-accent text-surface` div with "AV") in place of a photo
- [x] 4.3 Render the author name and bio line with correct typographic hierarchy

## 5. More Posts Component

- [x] 5.1 Create `components/blog/MorePosts.tsx` — accept `posts: BlogPostMeta[]` (pre-filtered to max 2 entries)
- [x] 5.2 Render each post as a clickable entry (Next.js `<Link>`) showing title, formatted date, and read time
- [x] 5.3 Apply accent hover background on each post entry
- [x] 5.4 Return `null` (render nothing) when `posts` is empty

## 6. Post Page Route

- [x] 6.1 Create `app/blog/[slug]/page.tsx` as an async Server Component
- [x] 6.2 Implement `generateStaticParams` — return `getBlogPosts().map(p => ({ slug: p.slug }))`
- [x] 6.3 Implement `generateMetadata` — await `params`, call `getBlogPostBySlug(slug)`, return `{ title, description: post.summary }` or `{}` if not found
- [x] 6.4 In the page component: await `params`, call `getBlogPostBySlug(slug)` — if `undefined`, call `notFound()`
- [x] 6.5 Call `getBlogBody(slug)` — if `null`, call `notFound()`
- [x] 6.6 Render "← All posts" link at the top with `hover:text-accent` transition
- [x] 6.7 Render post header: topic tag, formatted date, read time, `<h1>` title, summary paragraph, then `<hr />`
- [x] 6.8 Render `<BlogPost source={body} />` for the article body
- [x] 6.9 Read author name from `content/identity.json` and bio from `content/home.json` at build time (inline `readFileSync` or via existing content loaders if they expose these fields)
- [x] 6.10 Render `<AuthorCard name={...} bio={...} />` below the article
- [x] 6.11 Build `morePosts` by calling `getBlogPosts()`, filtering out current slug, taking first 2
- [x] 6.12 Render `<MorePosts posts={morePosts} />` below the author card

## 7. Tests

- [x] 7.1 Create `__tests__/BlogPostPage.test.tsx` — render the page component with the placeholder slug and assert: "← All posts" link renders, post title is visible, "Post not found." renders for an unknown slug
- [x] 7.2 Add a render test for `AuthorCard` — assert author name and bio appear in the DOM
- [x] 7.3 Add a render test for `MorePosts` — assert post titles and dates appear when posts prop is non-empty; assert nothing renders when posts is empty
- [x] 7.4 Add a render test for the not-found page — assert "Post not found." and "← Back to blog" appear
- [x] 7.5 Run `npm test` and confirm all tests pass

## 8. DOM / Visual Verification

- [x] 8.1 Run `npm run dev`, open `/blog/placeholder` — confirm: "← All posts" link visible, header metadata (tag, date, readTime) shown, `<hr>` separator visible, placeholder body text rendered, author card visible with "AV" initials and name, "More posts" hidden (only one post exists)
- [x] 8.2 Confirm hover on "← All posts" shows accent colour
- [x] 8.3 Open `/blog/nonexistent-slug` — confirm "Post not found." message and "← Back to blog" link
- [x] 8.4 Check desktop and mobile viewport; confirm no text overflow or layout breakage

## 9. Quality Gates

- [x] 9.1 Run `npm run typecheck` and confirm zero errors
- [x] 9.2 Run `npm run lint` and confirm zero errors
- [x] 9.3 Run `openspec validate blog-post-page --type change --strict` and confirm the change is valid
