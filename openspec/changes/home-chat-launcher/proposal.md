---
linear_story_id: "POR-167"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-167/home-chat-launcher-input-chips-browse-hints-scroll-indicator"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: 2026-06-16T03:04:00Z
finished_at: 2026-06-16T03:31:44Z
session_ids: ["cd2e8387-b52c-40bf-b534-f992fd675a89"]
---

## Why

POR-166 shipped the home hero shell and deliberately left two seams: a chat-launcher slot below the bio and a scroll-indicator slot at the bottom edge. Today those seams are empty comments — the hero looks finished but offers no way to act. The launcher is the home page's primary call-to-action: it lets a visitor ask a question (handed off to the chat experience) or jump straight to a section, and the scroll indicator signals there is more page below the fold.

## What Changes

- Add an interactive chat launcher below the hero bio: a text input ("Ask me anything about Abhilash…") with a send button; submitting via Enter or the button navigates to `/chat?q=<encoded>` with the question pre-filled and auto-sent.
- Add four suggestion chips below the input; clicking a chip navigates to `/chat?q=<encoded>` for that question.
- Add a "or browse" line with accent-coloured links to `/projects`, `/experience`, and `/contact`.
- Add a continuously-animating scroll indicator (mouse icon with a looping dot + "scroll" label) anchored to the bottom edge of the hero section.
- Drive chip copy from `content/home.json` `suggestions` (per XC-5, no hardcoded copy); update those four values to align with current content (e.g. "Tell me about his role at Fabric Group", not Rapido).

Out of scope: the `/chat` page itself and its WebLLM behaviour (separate CHAT capability), and the `/projects` `/experience` `/contact` destination pages (separate Phase 2/3 capabilities). The launcher links forward to those routes; they resolve as those pages land.

## Capabilities

### New Capabilities

- `home-chat-launcher`: The home page chat launcher and browse navigation — question input with send, four suggestion chips, accent browse links, and an animated scroll indicator — layered into the `home-hero` section. Chip copy sourced from `content/home.json`.

### Modified Capabilities

<!-- None — home-hero behaviour is unchanged; this fills the seams it reserved. -->

## Impact

- `components/home/Hero.tsx` — mount `ChatLauncher` at the reserved bio→stats seam and `ScrollIndicator` at the reserved bottom edge; pass `suggestions` down.
- `components/home/` — new `ChatLauncher.tsx` (client component: input, send, chips, browse links) and `ScrollIndicator.tsx` (decorative animated indicator).
- `content/home.json` — `suggestions` updated to the four launcher chips aligned to current content.
- Depends on POR-166 `home-hero` (the shell + seams). Forward-links to the future `/chat`, `/projects`, `/experience`, `/contact` routes.
