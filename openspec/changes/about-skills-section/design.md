## Context

POR-168 shipped `/about` (header, bio, photo, résumé CTA, blog link) and explicitly scoped skills out. `content/skills.json` already exists but is empty (`[]`); the `SkillCategory` type (`{ name: string; skills: string[] }`) and the `getSkills()` loader already exist in `lib/types.ts` / `lib/content.ts` but are unused. The `about.html` design prototype (source of truth) already defines the exact skills section markup and the `SKILLS` dataset in `documentation/design/shared.js`. This change wires the existing infra into a rendered section.

## Goals / Non-Goals

**Goals**
- Render a data-driven "What I work with" section below the bio on `/about`.
- Four category cards (label + tags), staggered scroll reveal, matching the prototype.
- Keep all content in `content/skills.json` (no hardcoding).

**Non-Goals**
- No skill levels, ratings, icons, or links per skill.
- No reuse on other pages in this change (though `SectionLabel` is built reusable).
- No change to existing about-page requirements.

## Project Facts Preflight

- Dependencies checked: `package.json` — no new deps needed. Section is plain JSX + existing `FadeIn`.
- Icon/export availability checked: N/A — no icons in this section.
- Design tokens/classes checked: `styles/globals.css` defines `--color-surface`, `--color-surface-alt`, `--color-accent`, `--color-secondary`, `--font-mono`. No dedicated `--color-border` token — existing components (`app/about/page.tsx`) use `border-surface-alt` for borders. Mapping prototype tokens → page=`surface`, card=`bg-surface-alt`, tag=`bg-surface` (inset/lighter against the card), borders=`border-surface-alt`, category label=`text-accent font-mono uppercase`.
- Existing components/helpers checked: `components/ui/FadeIn.tsx` exists with `delay?: number` (ms) prop. `components/ui/PageHeader.tsx` exists. `components/ui/SectionLabel.tsx` does NOT exist — must be created (prototype `shared.js:410` defines it). `lib/content.ts` `getSkills()` and `lib/types.ts` `SkillCategory` both exist already.
- Scripts checked: `package.json` — `typecheck`, `lint`, `design-lint`, `validate-content`, `build` (CI order per CLAUDE.md). `validate-content` runs `scripts/validate-content.ts` — must confirm it tolerates / validates the now-populated `skills.json`.

## Decisions

**1. New capability vs modify about-page** — `about-skills` as a new capability. The `about-page` canonical spec states "Skills section is a separate capability." Keeps spec boundaries clean and avoids a MODIFIED-requirement rewrite.

**2. Reusable `SectionLabel` component** over inlining the heading markup. The prototype treats `SectionLabel` as a shared primitive used across content pages (experience, projects will reuse it). Building it now as `components/ui/SectionLabel.tsx` (centered mono/uppercase/accent text flanked by `flex-1 h-px` divider rules) avoids duplication later. Alternative — inline markup — rejected because the next content-page issues need the same heading.

**3. Server-rendered section, no new client component.** The section is static SSG content read at build time via `getSkills()` inside the existing Server Component `app/about/page.tsx`. Only `FadeIn` (already a client component) is interactive. No data fetching, no waterfalls, no extra bundle. Per vercel-react-best-practices this is the cheapest path (`server-*` — build-time read, minimal client JS).

**4. Stagger via `FadeIn delay={i * 60}`** matching the prototype's `gi * 60` ms. Reuses the existing `IntersectionObserver` wrapper — no new animation primitive.

**5. Skill dataset sourced verbatim from the prototype** `shared.js` `SKILLS`:
- Languages: Java, Node.js, TypeScript, JavaScript, Ruby, Python
- Frameworks: Spring Boot, Vert.x, React, Vue.js, Express, Dropwizard, RxJava
- Data & Messaging: MySQL, MongoDB, Elasticsearch, Redis, Kafka, DynamoDB, Cloud Spanner
- Cloud & DevOps: AWS, GCP, Docker, Jenkins, Ansible, CI/CD, Microservices

**6. Grid layout** `grid-cols-[repeat(auto-fill,minmax(200px,1fr))]` with `gap-4` (Tailwind v4 arbitrary value), matching the prototype's responsive auto-fill. Cards reflow naturally on narrow viewports — no separate mobile breakpoint logic needed.

## Risks / Trade-offs

- [Skill list is opinionated/static content] -> Sourced from the design prototype the user authored; trivially editable in `content/skills.json` post-merge. No code change to update.
- [`validate-content` may not yet assert skills.json shape] -> Verify the script during apply; extend only if it already validates other content files by schema. Don't over-engineer.
- [`SectionLabel` divider rules use `border` color] -> Use `bg-surface-alt` for the `h-px` rules to match existing border usage; verify contrast holds in dark theme (design-lint gate covers WCAG).

## Migration Plan

Pure additive. Deploy = normal Vercel build (SSG). Rollback = revert the commit; `skills.json` returns to `[]` and the section renders nothing (empty map) without error.

## Open Questions

None — data, layout, and tokens are all resolved by the prototype and existing repo infra.
