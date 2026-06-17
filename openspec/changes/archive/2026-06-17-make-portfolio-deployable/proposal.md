---
linear_story_id: "POR-179"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-179/make-portfolio-deployable-for-any-person-zero-hardcoded-personal-data"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: "2026-06-17T19:15:00Z"
finished_at: null      # ISO8601, set at archive
session_ids: ["827f452e-b84c-4ede-b78b-b7afd7b127d0"]
---

## Why

9 sites across components still hardcode `"Abhilash"` or `"2025"` — meaning a second person can't fork and deploy by editing `content/*.json` alone. This cleanup closes the last gap so deploying for any person requires zero code changes.

## What Changes

- Add `firstName: string` to `content/identity.json` and `Identity` interface in `lib/types.ts`
- `Nav.tsx` and `MobileDrawer.tsx` wordmarks read `identity.firstName.toLowerCase()` instead of literal `"abhilash"`
- `Footer.tsx` copyright reads dynamic year + `identity.firstName` instead of `"© 2025 Abhilash"`
- Chat components (`ChatProvider`, `ChatMessage`, `ChatLauncher`, `UnsupportedFallback`) receive `name`/`firstName` props from server page via `getIdentity()`
- `app/contact/page.tsx` description composed from `getIdentity()` instead of hardcoded string
- `content/home.json` suggestions made generic — no first-person name references

## Capabilities

### New Capabilities

_None — this change is a configuration refactor, not a new user-facing feature._

### Modified Capabilities

- `site-shell`: Wordmark text and footer copyright now derive from `identity.firstName` / dynamic year rather than literal strings
- `chat-page`: Assistant greeting, label, error messages derive from `identity.name` / `identity.firstName` (prop-threaded from server page)
- `home-hero`: Chat suggestion prompts are generic with no owner-name references
- `contact-page`: Page meta description composed from `getIdentity()` — no hardcoded name
- `home-chat-launcher`: Input placeholder and aria-label use `identity.name` (prop from parent)

## Impact

- **Files changed**: `content/identity.json`, `lib/types.ts`, `components/layout/Nav.tsx`, `components/layout/MobileDrawer.tsx`, `components/layout/Footer.tsx`, `components/chat/ChatProvider.tsx`, `components/chat/ChatMessage.tsx`, `components/chat/ChatLauncher.tsx`, `components/chat/UnsupportedFallback.tsx`, `app/chat/page.tsx`, `app/contact/page.tsx`, `content/home.json`
- **No API/routing changes** — purely internal data wiring
- **No new dependencies**
- **Content contract**: After this change, deploying for a new person = edit `content/*.json` only
