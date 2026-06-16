## 1. Data layer & schema

- [x] 1.1 Add optional `role?: string` and `timeline?: string` to the `Project` interface in `lib/types.ts`
- [x] 1.2 Add `role: z.string().optional()` and `timeline: z.string().optional()` to `ProjectSchema` in `scripts/validate-content.ts`
- [x] 1.3 Add `projectSlug(id: string): string` helper (lowercase, non-alphanumeric → `-`, collapse repeats) and `getProjectBySlug(slug): Project | undefined` to `lib/content.ts`
- [x] 1.4 Add `getProjectBody(slug): string | null` to `lib/content.ts` — read `content/projects/<slug>.mdx` at build time, return `null` when the file is absent
- [x] 1.5 Seed `content/projects.json` with 2 sample projects (one with `demo`, one without; include `role` and `timeline`)
- [x] 1.6 Add `content/projects/<slug>.mdx` body files for both seeded projects (body only, no frontmatter)

## 2. Shared UI

- [x] 2.1 Add `components/ui/icons.tsx` exporting a `GithubIcon` inline SVG (lucide v1.x has no `Github` export); reuse the existing Footer mark markup

## 3. Bridge listing page

- [x] 3.1 Create `app/projects/page.tsx` (Server Component): `PageHeader` (label "Projects", subtitle "Things I've built") + a grid of project cards from `getProjects()`
- [x] 3.2 Each card: `next/link` to `/projects/<slug>`, showing name, tagline, year; GitHub link (`GithubIcon`) and demo link (`ExternalLink` from `lucide-react`) when `demo` is set; wrap cards in `FadeIn` with staggered `delay`

## 4. Detail page

- [x] 4.1 Create `app/projects/[slug]/page.tsx` (Server Component) with `generateStaticParams()` over project slugs
- [x] 4.2 Add `generateMetadata({ params })` → title = project name, description = tagline; call `getProjectBySlug`, return `notFound()` when missing
- [x] 4.3 Render structured sections: name, tagline, year, problem, impact, tech-stack pills, and `role`/`timeline` only when present; include a back-to-projects link (`ArrowLeft` from `lucide-react`) and GitHub/demo links
- [x] 4.4 When `getProjectBody(slug)` returns content, render it via `MDXRemote` (`next-mdx-remote/rsc`) with an `mdxComponents` map styled with existing tokens, in a `max-w-[720px]` column; render nothing extra when the body is `null`

## 5. Tests

- [x] 5.1 Add `__tests__/Projects.test.tsx` — render the listing; assert header and a card per seeded project, each linking to `/projects/<slug>`
- [x] 5.2 Add `__tests__/ProjectDetail.test.tsx` — render the detail page for a seeded slug; assert structured sections, optional `role`/`timeline` shown, demo link present only when `demo` set, and the back link
- [x] 5.3 Add a unit test for `projectSlug` / `getProjectBySlug` (slug derivation + lookup, including unknown-slug → `undefined`)
- [x] 5.4 Run `npm test` and confirm all tests pass

## 6. DOM / Visual Verification

- [x] 6.1 Extend `scripts/verify-dom.ts` with checks for `/projects` (header + cards link to detail) and `/projects/<slug>` (structured sections + rendered body); run against the dev server and capture evidence
- [x] 6.2 Verify detail and listing at mobile and wide viewports — no text overlap, clipping, or layout shift; confirm a project without an MDX body still renders its structured sections

## 7. Quality Gates

- [x] 7.1 Run `npm run typecheck` and confirm zero errors
- [x] 7.2 Run `npm run lint` and confirm zero errors
- [x] 7.3 Run `npm run validate-content` and confirm projects validate
- [x] 7.4 Run `npm run build` and confirm both routes are statically generated
- [x] 7.5 Run `openspec validate project-detail-page --type change --strict` and confirm the change is valid
