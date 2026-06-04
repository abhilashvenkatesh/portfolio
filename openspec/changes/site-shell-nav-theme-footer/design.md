## Context

The repository is a clean scaffold with only documentation, OpenSpec config, and scripts — no `app/`, `components/`, `lib/`, `content/`, or `styles/` directories exist yet. This change bootstraps the entire runnable Next.js project and delivers the persistent site shell (Nav, Footer, ThemeProvider, PageHeader) that every subsequent page card renders inside.

POR-164 blocks all other page cards (POR-165 through POR-177). Nothing else ships until this change lands.

## Goals / Non-Goals

**Goals:**
- Initialise Next.js 15 App Router project with all portfolio dependencies
- Wire GitHub Actions CI (`typecheck → lint → design-lint → validate-content → build`)
- Connect to Vercel (production deploy on `main` push, preview URLs on PRs)
- Implement `ThemeProvider`, anti-flash script, `Nav`, `Footer`, `PageHeader` components
- Provide minimal placeholder content files (`identity.json`, `contact.json`) so the build succeeds
- Scaffold `lib/types.ts`, `lib/content.ts` with full type definitions for all future content

**Non-Goals:**
- Mobile hamburger/drawer nav — deferred to POR-165
- Any page-specific content beyond what's needed to render the shell
- Blog, chat, experience, projects, contact, about page implementations
- Resume PDF — placeholder only (`public/resume.pdf` empty file to unblock links)
- Real profile photo — placeholder avatar

## Project Facts Preflight

- Dependencies checked: `package.json` does not exist yet — will create fresh with `npx create-next-app@latest` + manual additions. Required packages confirmed from ARCHITECTURE.md: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `gray-matter`, `next-mdx-remote`, `@mlc-ai/web-llm`, `zod`, `tsx`.
- Icon/export availability checked: Will use `lucide-react` for sun/moon/hamburger/social icons — standard choice for Next.js projects; `Github`, `Linkedin`, `Mail`, `Sun`, `Moon` exports confirmed in lucide-react docs. Adding to dependencies.
- Design tokens/classes checked: `styles/globals.css` does not exist yet — will create with Tailwind v4 `@theme` block from ARCHITECTURE.md + DESIGN.md tokens exactly. CSS variables: `--color-primary`, `--color-secondary`, `--color-accent`, `--color-neutral`, `--color-surface`, `--color-surface-alt`, `--color-accent-dim`. Dark palette on `[data-theme="dark"]`.
- Existing components/helpers checked: `components/`, `lib/`, `content/` directories do not exist — all created fresh. No conflicts.
- Scripts checked: `package.json` scripts will be: `dev` (next dev), `build` (next build), `typecheck` (tsc --noEmit), `lint` (next lint), `design-lint` (tsx scripts/validate-design.ts), `validate-content` (tsx scripts/validate-content.ts).

## Decisions

### D1: Bootstrap via `create-next-app` then add packages manually

`npx create-next-app@latest portfolio --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"` generates the correct tsconfig, eslint, next.config, and Tailwind wiring. Packages not included in the template (`gray-matter`, `next-mdx-remote`, `@mlc-ai/web-llm`, `zod`, `tsx`, `lucide-react`) are added with `npm install` afterwards.

Alternative: write `package.json` by hand. Rejected — error-prone; template ensures correct Next.js 15 + Tailwind v4 config integration.

### D2: Tailwind CSS v4 `@theme` block — single source of design tokens

ARCHITECTURE.md specifies Tailwind v4 with `@theme` in `styles/globals.css`. CSS custom properties are declared once and consumed via Tailwind utility classes AND direct `var()` usage in arbitrary values. Dark mode uses `[data-theme="dark"]` selector (not Tailwind's `dark:` variant) because the theme is set by a runtime `data-theme` attribute.

Token name mapping from DESIGN.md to CSS variables:
- `tertiary` → `--color-accent` (ARCHITECTURE.md uses `accent` throughout; DESIGN.md uses `tertiary`)
- All other names match exactly.

### D3: ThemeProvider as minimal client component with React context

`ThemeProvider` wraps `children` with a context that exposes `{ theme, toggleTheme }`. On mount, reads `localStorage.getItem('theme')` to sync state (since the anti-flash script already set `data-theme`). `toggleTheme` updates both `document.documentElement.setAttribute('data-theme', …)` and `localStorage`. No external library needed.

Alternative: `next-themes`. Rejected — adds a dependency for trivial logic; the anti-flash + context pattern is already specified in ARCHITECTURE.md.

### D4: Anti-flash script in `app/layout.tsx` `<head>` as `dangerouslySetInnerHTML`

The inline `<script>` must execute synchronously before any paint to avoid a flash of the wrong theme. Placed in `<head>` via `dangerouslySetInnerHTML`. Script reads `localStorage.getItem('theme')` and falls back to `prefers-color-scheme`. This is the pattern specified in ARCHITECTURE.md.

CSP note: the script is inline — if a CSP is added later, it will require a nonce or `unsafe-inline`. Not a concern for this static Vercel deploy.

### D5: Nav as client component (`'use client'`)

Nav requires:
- `usePathname()` — for active link detection (Next.js App Router hook)
- `useContext(ThemeContext)` — for theme toggle
- `useState` + `useEffect` (scroll listener) — for blur-on-scroll

All three require client-side execution. Nav is explicitly listed as a client component in ARCHITECTURE.md.

### D6: Mobile nav deferred — placeholder hidden links only

POR-165 (mobile nav hamburger/drawer) is a separate card that builds on this one. In this card, nav links are hidden at `< 640px` (Tailwind `hidden sm:flex`) and no hamburger is rendered. POR-165 adds the drawer. This avoids scope creep while keeping the shell shippable.

### D7: Footer as server component

Footer has no interactivity — icon links are static anchors. Email, GitHub URL, LinkedIn URL could be hardcoded since they don't need the full `content/contact.json` type system yet, but to respect "no hardcoded content in components" we pass them as props from `app/layout.tsx` (which calls `getContactInfo()` as a Server Component).

Alternative: fetch from contact.json inside Footer directly. Both work; prop passing is simpler and avoids a second `fs.readFileSync` call.

### D8: PageHeader as server component with inline SVG grid

Grid is a 60×60px SVG tile rendered as a `background-image: url("data:image/svg+xml,…")` CSS value. Radial-gradient mask (`80% × 60%` ellipse) applied via `mask-image`. No external SVG file needed — inline keeps the component self-contained. Specified in ARCHITECTURE.md.

### D9: Minimal content files to unblock build

The build requires `content/identity.json` (used in layout title metadata) and `content/contact.json` (used by Nav's "Hire me" href). All other content files are created as minimal stubs (empty arrays / placeholder strings) so `validate-content.ts` passes and `next build` succeeds. Real content is filled in by subsequent page cards.

### D10: `lib/types.ts` and `lib/content.ts` created in full

Even though most content files are stubs, the full type definitions and loader functions from ARCHITECTURE.md are scaffolded now. This ensures type-safe loading is ready for every future page card without revisiting this file.

## Risks / Trade-offs

- **[Risk] `@mlc-ai/web-llm` is a large package (~handful of MB) that may slow `npm install` in CI** → Mitigation: use `npm ci` with GitHub Actions cache on `node_modules`; web-llm is only imported in the `/chat` page which is client-only and excluded from the SSG build.

- **[Risk] Tailwind v4 API differences from v3 may trip up tooling** → Mitigation: use `@import "tailwindcss"` syntax (v4) not `@tailwind base/components/utilities`. Confirm `next.config.ts` uses `postcss` or Tailwind v4's built-in Vite/Wasm approach. Check `create-next-app` output for correct v4 wiring.

- **[Risk] `lucide-react` icon export names may differ** → Mitigation: verify `Github` (note: no 'b' — it's `Github` not `GitHub`), `Linkedin`, `Mail`, `Sun`, `Moon`, `Menu`, `X` in lucide-react v0.400+. Use `import { Sun, Moon, Github, Linkedin, Mail } from 'lucide-react'`.

- **[Risk] Vercel project setup requires manual browser action (OAuth)** → Mitigation: Vercel CLI `vercel link` or web dashboard; document in tasks.md as a manual step. CI/CD wiring is automated after linking.

- **[Risk] `dangerouslySetInnerHTML` anti-flash script triggers ESLint warning** → Mitigation: inline script is a known safe pattern; add `// eslint-disable-next-line` comment on that line only.

## Close Triggers

Nav has no closeable overlay in this card (mobile drawer is POR-165). No close triggers needed here.

## Migration Plan

1. Run `npx create-next-app@latest` in repo root (will populate `app/`, `styles/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`).
2. Add remaining dependencies: `npm install gray-matter next-mdx-remote @mlc-ai/web-llm zod tsx lucide-react`.
3. Replace generated Tailwind globals with design-token `@theme` block.
4. Create `lib/`, `content/`, `components/layout/`, `components/ui/`, `scripts/` directories and populate.
5. Create `.github/workflows/ci.yml`.
6. Push to GitHub; connect Vercel project via `vercel link` (one-time manual step).
7. Verify CI green on first push; confirm Vercel production URL resolves.

Rollback: the repo has no production traffic yet — any broken state can be corrected with a follow-up commit or by reverting the branch. No database migrations, no backwards-compatibility concerns.

## Open Questions

- **Node version pin**: Should `.nvmrc` / `engines` in `package.json` pin Node 20? CI uses 20 per ARCHITECTURE.md — worth pinning to prevent version drift.
- **Vercel project name**: Use `abhilash-portfolio` or let Vercel auto-generate? Cosmetic only.
- **`resume.pdf` placeholder**: Empty file or a minimal valid PDF? Empty file causes no build error but clicking "Download résumé" yields a 0-byte download. A minimal valid placeholder PDF is better UX for preview. Decision: include a 1-page "placeholder" PDF in `public/`.
