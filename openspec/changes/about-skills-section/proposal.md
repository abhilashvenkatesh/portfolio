---
linear_story_id: "POR-169"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-169/about-skills-section"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-16T08:09:21Z
finished_at: null
session_ids: ["a372c6fd-23bb-4edb-9d50-13cc5eb88b4a"]
---

## Why

The `/about` page (POR-168) ships bio, photo, résumé CTA, and blog link, but stops short of telling visitors what Abhilash actually works with. Recruiters scanning the page have no quick read on his technical stack. POR-168 deliberately scoped skills out as a separate capability; this change fills that gap with a scannable "What I work with" section below the bio.

## What Changes

- Populate `content/skills.json` (currently `[]`) with four `SkillCategory` entries — Languages, Frameworks, Data & Messaging, Cloud & DevOps — sourced from the `about.html` design prototype.
- Add a "What I work with" section below the bio on `/about`, rendering one card per category with a highlighted category label and skill tags inside.
- Cards reveal on scroll via `FadeIn` with a staggered per-card delay.
- Add a reusable `SectionLabel` component (centered mono/uppercase/accent label flanked by divider rules) matching the prototype, since the about page needs a section heading distinct from the top-of-page `PageHeader`.
- Wire the existing-but-unused `getSkills()` loader into the about page.

No breaking changes.

## Capabilities

### New Capabilities

- `about-skills`: The "What I work with" skills section on `/about` — section heading, four data-driven category cards (label + tags), and staggered scroll-reveal.

### Modified Capabilities

None. The `about-page` spec explicitly excludes skills ("Skills section is a separate capability.").

## Impact

- Content: `content/skills.json` (populated).
- Components: `app/about/page.tsx` (new section), `components/ui/SectionLabel.tsx` (new).
- Loaders: `lib/content.ts` `getSkills()` (already present, now consumed); `lib/types.ts` `SkillCategory` (already present).
- Design source of truth: `documentation/design/about.html` + `shared.js` `SKILLS`.
- No new dependencies. SSG only — no runtime impact.
