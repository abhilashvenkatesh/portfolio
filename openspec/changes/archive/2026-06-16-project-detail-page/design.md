## Context

The site has no projects route, `content/projects.json` is an empty array, and the design prototype only shows a listing (never built). POR-171 adds the per-project case-study page; POR-170 owns the polished listing. Per proposal decisions: structured card fields stay in `projects.json` (the listing/DATA-1 contract POR-170 reads), the long-form narrative lives in an optional `content/projects/<slug>.mdx`, slugs derive from `Project.id`, and this change ships a minimal bridge listing so the detail page is reachable and verifiable now.

All content reads happen at build time in Server Components (SSG). This is the first MDX consumer wired in the repo (`lib/blog.ts` is empty; the blog route does not exist yet).

## Goals / Non-Goals

**Goals**
- `/projects/[slug]` SSG detail page per project: structured sections + optional MDX body + not-found handling + per-project metadata.
- Optional `content/projects/<slug>.mdx` long-form body, rendered server-side.
- Minimal `/projects` bridge listing linking each card to its detail page.
- Seed `projects.json` + two MDX bodies so both pages are verifiable.

**Non-Goals**
- Full listing fidelity (hover, accent line, staggered scroll, impact-callout styling) — POR-170.
- Blog route / `lib/blog.ts` — out of scope.
- A markdown typography plugin (`@tailwindcss/typography` is not installed; MDX is styled via a components map).

## Project Facts Preflight

- **Dependencies checked:** `package.json` confirms `next@16.2.7`, `next-mdx-remote@^6.0.0`, `gray-matter@^4.0.3`, `lucide-react@^1.17.0`. No `@tailwindcss/typography`.
- **MDX API checked:** `next-mdx-remote/rsc` exports `MDXRemote` and `compileMDX` (verified via node). Render with `MDXRemote` in a Server Component.
- **Icon/export availability checked:** lucide exports `ArrowLeft` (true), `ExternalLink` (true), `ArrowRight` (true); `Github` (false — brand icons removed in v1.x). GitHub link must use an inline SVG (the mark already exists inline in `components/layout/Footer.tsx`, currently not exported).
- **Design tokens/classes checked:** `app/experience/page.tsx` and `PageHeader` confirm tokens in use: `text-primary`, `text-secondary`, `text-accent`, `bg-surface`, `bg-surface-alt`, `border-surface-alt`, `ring-accent-dim`, `font-mono`, pill pattern `rounded-full border border-surface-alt bg-surface-alt px-2.5 py-0.5`.
- **Existing components/helpers checked:** `components/ui/PageHeader.tsx` (`label`, `subtitle`, optional `intro`) and `components/ui/FadeIn.tsx` (`delay` stagger, reduced-motion aware) are reusable. `lib/content.ts` has `getProjects()` reading `projects.json`; no slug lookup or MDX loader exists yet. `Project` type in `lib/types.ts` has `id, name, tagline, year, problem, impact, stack, github, demo?` — no `role`/`timeline`.
- **Scripts checked:** `package.json` confirms `typecheck` (`tsc --noEmit`), `lint` (`eslint .`), `design-lint` (`tsx scripts/validate-design.ts`), `validate-content` (`tsx scripts/validate-content.ts`), `build`, `test` (`vitest run`), `verify-dom`. `scripts/validate-content.ts` has a `ProjectSchema` (zod) that must gain optional `role`/`timeline`.

## Decisions

**1. Data split: structured JSON + optional MDX body (Model A).**
`projects.json` remains the structured array (card + detail fields). The narrative lives in `content/projects/<slug>.mdx` as a **body-only** file (no frontmatter) — keeping a single source of truth for structured data and avoiding a JSON/frontmatter split-brain. *Alt rejected:* one MDX-per-project with frontmatter (Model B) rewrites the listing's data contract and collides with POR-170/DATA-1.

**2. Slug = `Project.id`, treated as kebab-safe with a guard.**
A small `projectSlug(id)` helper slugifies defensively (lowercase, non-alphanumeric → `-`); sample ids are authored kebab-case so it is identity in practice. `generateStaticParams` maps projects → `{ slug }`. *Alt rejected:* a separate required `slug` field — extra edit to every record for no gain since ids are already unique (DATA-1).

**3. New loaders in `lib/content.ts`.**
- `getProjectBySlug(slug): Project | undefined` — finds by `projectSlug(p.id) === slug`.
- `getProjectBody(slug): string | null` — `fs.readFileSync('content/projects/<slug>.mdx')` at build time; returns `null` if the file is absent (graceful). No `gray-matter` needed (body-only).

**4. Routes (both SSG Server Components).**
- `app/projects/page.tsx` — bridge listing: `PageHeader` + grid of `<Link href={/projects/${slug}}>` cards (name, tagline, year, GitHub/demo icons), wrapped in `FadeIn`.
- `app/projects/[slug]/page.tsx` — `generateStaticParams` over project slugs; `generateMetadata({params})` → title = name, description = tagline; component calls `getProjectBySlug`, `notFound()` when missing, renders structured sections then `<MDXRemote source={body} components={mdxComponents} />` when a body exists.

**5. MDX styling via a components map (no typography plugin).**
A `mdxComponents` map styles `h2/h3/p/ul/li/a/code/pre` with existing tokens, wrapped in a `max-w-[720px]` column matching the experience page. *Alt rejected:* installing `@tailwindcss/typography` — heavier dependency for two seed files.

**6. GitHub icon via shared inline SVG.**
Extract the GitHub mark into a small `components/ui/icons.tsx` (`GithubIcon`) and reuse it in the cards/detail page (and optionally refactor Footer later). Demo link uses lucide `ExternalLink`; back link uses lucide `ArrowLeft`. Avoids the lucide brand-icon gotcha.

**7. Schema extension.**
`lib/types.ts`: `Project` gains `role?: string` and `timeline?: string`. `scripts/validate-content.ts` `ProjectSchema` gains `role: z.string().optional()`, `timeline: z.string().optional()`. Seed `projects.json` with 2 entries (one with `demo`, one without) and matching MDX bodies.

## Risks / Trade-offs

- **Two ids slugify to the same value** -> `generateStaticParams` would emit duplicate routes. Mitigation: ids are unique per DATA-1; the slug helper is near-identity, and a duplicate would surface as a build error.
- **MDX executes arbitrary content** -> only build-time, owner-authored local files; no untrusted input, so no runtime sanitization needed.
- **lucide `Github` import** -> compile/runtime failure (export removed). Mitigation: inline SVG, never import `Github`.
- **Bridge listing overlaps POR-170** -> double work / merge conflict. Mitigation: keep listing deliberately minimal and note in the issue that POR-170 refines, not rebuilds.
- **Stale `.next` after a prod build breaks `next dev`** -> Turbopack RSC-manifest 500. Mitigation: `rm -rf .next` before dev if a build ran (documented gotcha).

## Migration Plan

Additive only — no existing route or data contract changes. `projects.json` goes from `[]` to 2 entries; the `Project` type gains optional fields (backward compatible). Deploy is a standard Vercel SSG build. Rollback = revert the change; no data migration.

## Open Questions

None — the four proposal decisions (Model A, MDX body, slug-from-id, minimal bridge + 2 samples) resolved the design forks. No ADR warranted (additive, reversible).
