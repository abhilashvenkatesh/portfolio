## Context

No `/blog` route exists. `BlogPostMeta` type is defined in `lib/types.ts`. `content/blog/placeholder.mdx` establishes the frontmatter schema. `gray-matter` and `next-mdx-remote` are installed. `FadeIn` handles scroll animation. `PageHeader` handles the hero area. Design source-of-truth: `documentation/design/blog.html`.

## Goals / Non-Goals

**Goals:** Create `/blog` SSG route with post cards, hover treatment matching project cards, and staggered scroll-in animation.

**Non-Goals:** Blog post detail page (`/blog/[slug]`) — out of scope for this change. Tag filter pills (design exploration feature, not in POR-173). Search.

## Project Facts Preflight

- Dependencies checked: `package.json` confirms `gray-matter ^4.0.3`, `next-mdx-remote ^6.0.0`
- Icon/export availability checked: N/A — no new icons; `ExternalLink` from `lucide-react` not needed
- Design tokens checked: `styles/globals.css` confirms `--color-accent-border` exists (light: `oklch(0.58 0.18 38 / 0.30)`, dark: `oklch(0.65 0.18 38 / 0.38)`) — no new tokens needed; `surface`, `surface-alt`, `accent`, `secondary`, `primary` all confirmed
- Existing components checked: `components/ui/FadeIn.tsx` ✓, `components/ui/PageHeader.tsx` exists (used in projects page) ✓, `lib/blog.ts` does NOT exist — must create; `lib/content.ts` has no blog loaders
- Scripts checked: `npm run typecheck`, `npm run lint`, `npm run validate-content`, `npm run build` — all referenced in CI

## Decisions

### D1: New `lib/blog.ts` rather than extending `lib/content.ts`

**Chosen:** Create `lib/blog.ts` with `getBlogPosts()` and `getBlogPostBySlug()`.

**Why:** ARCHITECTURE.md names `lib/blog.ts` explicitly as the blog loader module (gray-matter, slug list, full MDX loader). Keeping blog logic separate from `content.ts` maintains the pattern of one file per concern and avoids re-loading `lib/blog.ts` only for the listing when the full MDX content isn't needed.

**Alternative:** Extend `lib/content.ts`. Rejected — ARCHITECTURE.md anticipates a dedicated file.

`getBlogPosts()` returns `BlogPostMeta[]` sorted newest-first by `date`. It reads all `*.mdx` files from `content/blog/` using `fs.readdirSync` + `gray-matter` (frontmatter-only parse; no MDX compilation). Slug derived from filename without extension.

### D2: Single-column list layout

**Chosen:** Single column, `max-w-5xl` container (matching global default).

**Why:** Blog posts are read sequentially, not browsed as a gallery. Single column maximises title/summary legibility. The prototype's grid mode is a design exploration variant, not the production layout.

**Alternative:** 2-column grid (like projects). Rejected — not appropriate for reading-oriented content.

### D3: Blog card uses `group` + `hover:` combination for hover effects

**Chosen:** `article` carries both `group` and `hover:` classes. Children use `group-hover:` for title colour and top-edge line.

**Why:** `group-hover:` on the element that has `group` does not fire in Tailwind — it requires a parent with `group`. Card-level changes (border, bg, lift) go on `hover:` of the article; child-element changes (title colour, top-edge line) go on `group-hover:`.

Concretely:
- `article`: `group hover:-translate-y-0.5 hover:border-[var(--color-accent-border)] hover:bg-surface-alt transition-all`
- Title `h2`: `group-hover:text-accent transition-colors`
- Top-edge line div: `group-hover:w-[60%]` (same as project card)

Note: The existing project card (`app/projects/page.tsx:30`) applies `group-hover:border-accent-border group-hover:bg-surface-alt` directly on the `article[group]` — those styles do not fire. Blog card corrects this by using `hover:` for card-level changes.

### D4: `app/blog/page.tsx` is a Server Component (SSG)

**Chosen:** No `"use client"` directive. Reads `getBlogPosts()` at build time. `FadeIn` is a client component but Next.js handles the boundary automatically.

**Why:** Consistent with all other listing/detail pages. Blog posts change at build time via MDX content files. No runtime data needs.

### D5: Click-anywhere via `<Link>` wrapping `<article>`

**Chosen:** Wrap the entire card `article` in a `<Link href="/blog/[slug]">`. "Read article →" remains as a visible affordance but is redundant for navigation.

**Why:** POR-173 spec says "clicking anywhere on a card navigates". Next.js `<Link>` wrapping a block element is the standard pattern for this.

**Alternative:** `onClick` + `router.push`. Rejected — requires `"use client"` and breaks right-click/open-in-tab.

## Risks / Trade-offs

- [Only one seed MDX file] → listing will show one card in dev. Not a blocker; content is a separate concern.
- [Blog detail page not in scope] → clicking a card navigates to `/blog/[slug]` which returns 404 until the next change ships the detail route. Acceptable — POR-173 scopes to listing only.

## Migration Plan

No data migrations. New route added; no existing routes change. Deploy is additive.

## Open Questions

None.
