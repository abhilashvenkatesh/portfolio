## Context

The blog listing page (`/blog`) is live and post cards link to `/blog/<slug>`, but no `app/blog/[slug]/` route exists yet — those links 404. This change adds the individual post reading experience: a SSG dynamic route rendering MDX body with full typography, a post header, navigation, an author card, and a "More posts" section. The project-detail page (`app/projects/[slug]/page.tsx`) provides a near-identical architectural precedent to follow.

## Goals / Non-Goals

**Goals:**
- New SSG route `app/blog/[slug]/page.tsx` with `generateStaticParams` and `generateMetadata`
- MDX body rendering via `next-mdx-remote/rsc` with manually-mapped design token styles (no typography plugin)
- Post header: tag, date, readTime, title, summary + horizontal rule
- "← All posts" nav link with accent hover
- Author card: initials placeholder, name (`identity.json`), bio (`home.json`)
- "More posts" section: up to 2 other posts with accent hover
- Not-found fallback via `notFound()`

**Non-Goals:**
- Adding a real author photo (no image exists; placeholder suffices)
- Comments, social sharing, or reading-progress indicator
- Changing the blog listing page or its spec

## Project Facts Preflight

- **Dependencies checked:** `package.json` confirms `next-mdx-remote@^6.0.0`, `gray-matter@^4.0.3`, `next@15`, `tailwindcss@^4`
- **Icon/export availability checked:** `lucide-react` — `ArrowLeft` confirmed used in `app/projects/[slug]/page.tsx:4`; no brand icons needed for this change
- **Design tokens/classes checked:** `styles/globals.css` confirms `--color-primary`, `--color-secondary`, `--color-accent`, `--color-surface-alt`, `--color-accent-dim`, `--font-mono`; Tailwind v4 `@theme` maps these to `text-primary`, `text-secondary`, `text-accent`, `bg-surface-alt`, `bg-accent-dim`, `font-mono`, `text-accent`, `border-accent-border`
- **Existing components/helpers checked:**
  - `components/ui/FadeIn.tsx` — scroll-animation wrapper, available for post cards in "More posts"
  - `components/ui/PageHeader.tsx` — used on listing; NOT used here (post page has its own header layout)
  - `components/blog/BlogTagFilter.tsx` — listing-only; not used
  - `lib/blog.ts` — has `getBlogPosts()` and `getBlogPostBySlug(slug)` (returns `BlogPostMeta`); **no full-body loader** — must add `getBlogBody(slug)`
  - `lib/types.ts` — `BlogPost extends BlogPostMeta { content: string }` already defined
  - `content/identity.json` — `{ name, title, employer, location }` — use `name` for author card
  - `content/home.json` — `{ bio }` — use `bio` for author card short bio line
  - `app/projects/[slug]/page.tsx` — reference implementation for MDX+SSG pattern; uses `MDXRemote` from `next-mdx-remote/rsc`, `notFound()`, `generateStaticParams`, `generateMetadata`, inline `mdxComponents` map
- **Scripts checked:** `package.json` confirms `npm run typecheck`, `npm run lint`, `npm run build`

## Decisions

### D1: Follow project-detail pattern for MDX rendering

`app/projects/[slug]/page.tsx` already does SSG + MDXRemote + design-token mdxComponents. Copy and extend that pattern rather than introducing a new approach. No typography plugin; manually map each MDX element to Tailwind classes.

**Blog-specific additions over project-detail mdxComponents:**
- `h1` — large heading (post body may start with h1/h2/h3)
- `h2`, `h3` — already in project-detail; reuse
- `ul`, `li` — already in project-detail; reuse
- `strong` — `font-semibold text-primary`
- `em` — `italic`
- `pre` — contrasting background (`bg-surface-alt`), monospace, horizontal scroll (`overflow-x-auto`)
- `code` inside `pre` — inherit pre styles; `code` outside pre → accent highlight (`bg-accent-dim text-accent font-mono text-sm`)
- `blockquote` — accent left border (`border-l-4 border-accent`) + tinted background (`bg-accent-dim px-4 py-2`)

**Alternative considered:** `@tailwindcss/typography` plugin — rejected because the project explicitly avoids it (referenced in `memory/reference_mdx_in_rsc_pattern.md`) and the project-detail page confirms this approach is already working.

### D2: Add `getBlogBody(slug)` to `lib/blog.ts`

Same pattern as `getProjectBody(slug)` in `lib/content.ts` — read the raw `.mdx` file, strip frontmatter via gray-matter, return the `content` string. Return `null` if file not found (triggers `notFound()`).

**Alternative:** Load full post including meta + body in one call. Rejected because `getBlogPostBySlug()` already loads meta and the body may be large; separating them avoids re-parsing frontmatter at render time when we only need meta for the header.

### D3: Author card uses initials placeholder, reads from content JSON

No author photo exists in `public/`. Use a styled circular div with initials "AV" and `bg-accent text-surface` for now. Name from `content/identity.json`, bio from `content/home.json`. Author card is a simple component; no need for a separate data loader (inline `readFileSync` in the page Server Component, or pass values as props).

**Alternative:** `next/image` with a placeholder blur. Rejected — no real image, and `next/image` requires a `src` URL or local file. Can swap initials for a real photo later with no spec change.

### D4: More posts section — pick up to 2 posts server-side

Call `getBlogPosts()` (already sorts by date desc), filter out the current slug, take up to 2. All done in the Server Component at build time — no client fetch.

### D5: Not-found state via `notFound()`

Call Next.js `notFound()` when `getBlogPostBySlug(slug)` returns `undefined`. This renders the closest `not-found.tsx`; if none exists at `app/blog/not-found.tsx`, fall back to app-level. Per the spec, the not-found page must show "Post not found." and a "← Back to blog" link — create `app/blog/[slug]/not-found.tsx` to own that message rather than relying on a generic app-level handler.

**Alternative:** Return a special page rather than `notFound()`. Rejected — `notFound()` is the Next.js convention and correctly sets the 404 status code.

### D6: Component split

Keep the page thin (`app/blog/[slug]/page.tsx`) and extract:
- `components/blog/BlogPost.tsx` — wraps `<MDXRemote>` with the `mdxComponents` map and article prose container
- `components/blog/AuthorCard.tsx` — author photo/placeholder + name + bio
- `components/blog/MorePosts.tsx` — "More posts" heading + up to 2 post entries

This mirrors how `blog-listing-page` split `BlogPostCard` into its own component.

## Risks / Trade-offs

- [Single MDX placeholder post] The only post is `placeholder.mdx`. All scenarios exercise against it — tests must work with this minimal content set. `MorePosts` section will be empty/hidden since there is only one post.
- [No author photo] Initials placeholder is functional but basic. If a real photo is added later, only `AuthorCard.tsx` changes.
- [Dark mode on `code` inside `pre`] The `code` element inside `pre` must not get the inline-code accent style. Differentiate via CSS selector or by checking context — use `pre > code` to reset to transparent background.

## Migration Plan

1. Add `getBlogBody(slug)` to `lib/blog.ts`
2. Create `app/blog/[slug]/page.tsx` with `generateStaticParams`, `generateMetadata`, MDX render
3. Create `app/blog/[slug]/not-found.tsx`
4. Create `components/blog/BlogPost.tsx` with `mdxComponents` map
5. Create `components/blog/AuthorCard.tsx`
6. Create `components/blog/MorePosts.tsx`
7. Run `npm run typecheck && npm run lint && npm run build`

No rollback needed — new files only; no existing files changed except `lib/blog.ts` (additive).

## Open Questions

- None. All design decisions are resolved from existing repo patterns.
