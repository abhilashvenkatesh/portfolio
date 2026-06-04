---
linear_story_id: "POR-164"
linear_story_url: "https://linear.app/abhilash-projects/issue/POR-164/site-shell-persistent-nav-theme-toggle-footer"
method: "sdd"
started_at: "2026-06-04T01:53:20Z"
finished_at: null
session_ids: ["0fa55b14-550e-4f93-9dc5-9d2a2e061aee"]
---

## Why

The portfolio repository is a clean scaffold with no runnable application yet. Before any visitor-facing feature can ship, the Next.js project must be bootstrapped, CI and Vercel deployment wired up, and the shared layout shell (Nav, Footer, ThemeProvider, page-header background) built — because every subsequent POR card renders inside that shell.

## What Changes

- **Repo bootstrap:** Initialise Next.js 15 App Router project with TypeScript, Tailwind CSS v4, all key dependencies (`gray-matter`, `next-mdx-remote`, `@mlc-ai/web-llm`, `zod`, `tsx`), and project-level config (`tsconfig.json`, `.eslintrc`, `next.config.ts`).
- **CI pipeline:** Add GitHub Actions workflow (`.github/workflows/ci.yml`) that gates on `typecheck → lint → design-lint → validate-content → build`.
- **Vercel deployment:** Connect repo to Vercel; push to `main` auto-deploys to production; PRs get preview URLs.
- **Design tokens:** Populate `styles/globals.css` with Tailwind v4 `@theme` block (light Sand palette + dark overrides on `[data-theme="dark"]`), DM Sans / DM Mono font imports.
- **ThemeProvider:** Client component exposing `theme` / `toggleTheme` context; writes to `localStorage`.
- **Anti-flash script:** Inline `<script>` in `app/layout.tsx` `<head>` reads `localStorage` and sets `data-theme` before hydration.
- **Nav component (`components/layout/Nav.tsx`):** Fixed top bar — wordmark home link, page links with active state, "Hire me" mailto button, sun/moon theme toggle, frosted-glass blur on scroll >40px.
- **Footer component (`components/layout/Footer.tsx`):** GitHub, LinkedIn, Email icon links with hover colour; "© 2025 Abhilash" copyright line.
- **PageHeader component (`components/ui/PageHeader.tsx`):** Shared inner-page header with SVG grid-line background and radial-gradient fade (XC-3).
- **Root layout (`app/layout.tsx`):** Wraps all pages in `ThemeProvider`, renders `Nav` and `Footer`, includes anti-flash script and Google Fonts.
- **Validation scripts:** `scripts/validate-content.ts` and `scripts/validate-design.ts` stubs so CI does not fail before content pages exist.
- **Placeholder content files:** Minimal `content/contact.json` (for "Hire me" mailto href), `content/identity.json` to unblock build.

## Capabilities

### New Capabilities

- `repo-scaffold`: Next.js 15 App Router project wired with TypeScript, Tailwind v4, CI, and Vercel deploy — the runnable foundation every other card builds on.
- `site-shell`: Persistent Nav, Footer, ThemeProvider, anti-flash theme script, and PageHeader background shared across all pages (NAV-1 through NAV-5, NAV-7, XC-3).

### Modified Capabilities

_None — first change in the repo._

## Impact

- Creates `app/`, `components/layout/`, `components/ui/`, `lib/`, `content/`, `styles/`, `scripts/`, `.github/workflows/` directory trees.
- Adds `package.json` with all dependencies; requires `npm install`.
- Vercel project created and linked; `main` branch becomes production target.
- Blocks POR-165 (mobile nav), POR-166 (home hero), and all subsequent page cards — they all need the shell to exist first.
