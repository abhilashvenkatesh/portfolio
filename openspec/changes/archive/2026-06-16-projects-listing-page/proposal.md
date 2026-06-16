---
linear_story_id: "POR-170"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-170/projects-listing-page-cards-hover-links-scroll-animation"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"
started_at: 2026-06-16T13:18:38Z
finished_at: 2026-06-16T13:45:43Z
session_ids: ["30ff0e34-743c-4b9a-9988-e99b635f7565"]
---

## Why

The `/projects` route currently ships a deliberate minimal bridge (POR-171): a header and bare cards that link to detail pages. It was always meant to be superseded by the real listing experience. POR-170 delivers that experience — showcase cards that convey each project's problem, impact, and stack at a glance, with the hover and scroll polish the rest of the site already has.

## What Changes

- Each card gains a **Problem** section and a visually distinct **IMPACT** callout (accent left-border bar, elevated background, mono "IMPACT" label).
- Tech stack rendered as pill-shaped tags along the bottom of each card.
- **Hover state**: card background lifts to the elevated surface, border switches to a translucent accent, and an accent-coloured line animates in along the top-left edge.
- GitHub icon link (always) and live-demo external-link icon (only when `demo` is present) brighten on hover, top-right of each card.
- Cards fade in and slide up on viewport entry with a staggered per-card delay.
- Each card continues to link through to its `/projects/[slug]` case study (detail pages stay reachable).
- New theme token `--color-accent-border` (translucent accent, light + dark) added for the hover border.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `projects-listing-bridge` → **renamed** to `projects-listing-page`: drop the "minimal bridge / out of scope" framing and add requirements for the showcase card (problem, impact callout, stack tags), the hover treatment, the demo-link affordance, and staggered scroll-in animation. The existing listing and card-links-to-detail requirements are retained.

### Impact

- `app/projects/page.tsx` — card markup extended (problem, impact, stack, hover, icons).
- `styles/globals.css` — add `--color-accent-border` token (`@theme` + `[data-theme="dark"]`).
- No data-layer change: `Project` type already carries `problem`, `impact`, `stack`, `demo`.
- Source-of-truth design: `documentation/design/projects.html`.
