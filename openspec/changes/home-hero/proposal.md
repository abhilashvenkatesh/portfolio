---
linear_story_id: "POR-166"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-166/home-hero-headline-stats-bar-background-texture"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-16T02:08:17Z
finished_at: 2026-06-16T02:35:49Z
session_ids: ["cd2e8387-b52c-40bf-b534-f992fd675a89"]
---

## Why

The home page is the first thing every visitor sees, and today `app/page.tsx` renders a "coming soon" placeholder. The hero must establish identity, credibility, and visual polish in one screen so visitors immediately understand who Abhilash is and why he is worth their attention.

## What Changes

- Replace the `app/page.tsx` placeholder with a real hero section: role badge, headline, bio, and a three-stat bar.
- Render decorative background texture behind the hero — a subtle grid-line pattern (radially masked) and a soft accent radial glow — that must not obscure or compete with the text.
- Drive all hero copy from `content/home.json` (role badge, headline, subheading, bio, three stats) per XC-5; no hardcoded copy in the component.
- Update `content/home.json` copy to the POR-166 source-of-truth values (role badge gains "· Melbourne", bio and stats updated to the issue wording).
- Headline renders as flat `headline` + muted `subheading` strings, with the trailing clause "scale to millions." accent-colored in the component.

Out of scope (owned by POR-167): chat launcher input/chips/browse hints and the scroll indicator. This change builds the hero shell that POR-167 will populate.

## Capabilities

### New Capabilities

- `home-hero`: The home page hero region — role badge, headline + subheading, bio paragraph, three-statistic bar, and decorative grid + glow background. Content sourced from `content/home.json`.

### Modified Capabilities

<!-- None — no existing spec behaviour changes. -->

## Impact

- `app/page.tsx` — placeholder replaced with hero Server Component composition.
- `components/` — new hero presentation components (badge, stats, background texture).
- `content/home.json` — copy updated to POR-166 values; existing `suggestions` field untouched (used later by POR-167).
- `lib/content.ts` / `lib/types.ts` — `HomeContent` loader/type confirmed to cover roleBadge, headline, subheading, bio, stats.
- Blocks POR-167 (chat launcher + scroll indicator), which mounts inside this hero.
