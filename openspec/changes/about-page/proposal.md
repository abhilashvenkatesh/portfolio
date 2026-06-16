---
linear_story_id: "POR-168"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-168/about-page-header-bio-photo-resume-cta-blog-link"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-16T03:49:17Z
finished_at: null      # ISO8601, set at archive
session_ids: ["4201103d-431b-432c-9330-3a6449b28963"]
---

## Why

The site has a home page but no About page, so visitors and recruiters cannot learn who Abhilash is, read his background, or grab his résumé. Phase 3 content pages start here; this is the first non-home page and establishes the page-layout conventions (PageHeader + content shell + reveal animation) that sibling pages will reuse.

## What Changes

- New route `/about` (SSG Server Component) rendering page header, bio, photo placeholder, and CTAs.
- Page header reuses `PageHeader` with label "About me" and subtitle "11+ years building systems across 3 countries and 4 industries."
- Three-paragraph bio sourced from `content/about.json` (currently empty) via the existing `getAboutBio()` loader — no hardcoded copy in the component.
- Square rounded photo placeholder (silhouette) beside the bio; stacks below the bio on mobile.
- "Download résumé" primary button linking to `/resume.pdf` with the `download` attribute; dims on hover.
- "Blog →" secondary link to `/blog`; adopts accent colour and border on hover.
- New reusable `FadeIn` scroll-reveal wrapper (`components/ui/FadeIn.tsx`, IntersectionObserver) used for bio and photo stagger — the standard reveal wrapper documented in CLAUDE.md, introduced here for first use.

Out of scope: the skills section (ABOUT-6) is tracked separately by POR-169, which this change blocks.

## Capabilities

### New Capabilities

- `about-page`: The `/about` route — page header, bio, photo placeholder, résumé download CTA, and blog cross-link.

### Modified Capabilities

<!-- none — no existing spec behaviour changes -->

## Impact

- New files: `app/about/page.tsx`, `components/about/AboutBio.tsx` (+ supporting components as needed), `components/ui/FadeIn.tsx`.
- Modified: `content/about.json` (populate three bio paragraphs).
- Reuses: `components/ui/PageHeader.tsx`, `lib/content.ts#getAboutBio`, `public/resume.pdf`.
- Nav `/about` link becomes a live destination.
- Business details: see Linear POR-168.
