---
linear_story_id: "POR-172"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-172/experience-page-timeline-role-entries-resume-cta"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-16T09:33:37Z
finished_at: 2026-06-16T09:50:00Z      # ISO8601, set at archive
session_ids: ["4ad8c3d3-88c9-4d7d-95ee-48c36f435e87"]
---

## Why

The Nav already links `/experience`, but the route does not exist — it is a dead link / 404. Phase-3 content pages need the Experience page so visitors and recruiters can read Abhilash's career history as a vertical timeline and grab the résumé. It reuses the page-layout + scroll-reveal conventions established by `/about` (PageHeader, FadeIn) and is the first page driven by `content/experience.json`, which is currently empty.

## What Changes

- New route `/experience` (SSG Server Component) rendering a page header, a vertical timeline of roles, and a bottom "Download résumé" CTA card.
- Page header reuses `PageHeader` with label "Experience" and subtitle "Where I've worked" — the component already renders the fading grid-line background.
- Vertical timeline with a continuous 1px line on the left; each role is a marker + entry. The most-recent role's marker is accent-coloured with an `accent-dim` glow/ring; past roles use a neutral fill.
- Each entry shows job title (bold), company name (accent, DM Mono), date range as a pill badge, and a dash-prefixed bullet list of responsibilities/achievements.
- Entries are ordered most-recent-first and fade in on scroll, staggered top-to-bottom via `FadeIn` delay.
- Bottom CTA card "Want the full picture?" with a "Download résumé" button linking to `/resume.pdf` (download attribute); button dims on hover.
- Populate `content/experience.json` (currently empty) with the role entries via the existing `getExperience()` loader — no content hardcoded in the component.

Out of scope: a real résumé PDF (`public/resume.pdf` is a blank placeholder — content swap tracked separately); the `/blog`, `/projects`, `/contact` pages.

## Capabilities

### New Capabilities

- `experience-page`: The `/experience` route — page header, vertical role timeline with distinguished current-role marker, scroll-staggered reveal, and a bottom résumé-download CTA.

### Modified Capabilities

<!-- none — no existing spec behaviour changes -->

## Impact

- New files: `app/experience/page.tsx`, supporting timeline components under `components/experience/` as needed.
- Modified: `content/experience.json` (populate role entries, most-recent-first).
- Reuses: `components/ui/PageHeader.tsx`, `components/ui/FadeIn.tsx`, `lib/content.ts#getExperience`, `lib/types.ts#ExperienceEntry`, `public/resume.pdf`.
- Nav `/experience` link becomes a live destination (was a dead link).
- Business details: see Linear POR-172.
