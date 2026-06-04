# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

`documentation/AGENTS.md` is the entry point for all project docs. Key files:

| File | Use when |
|------|----------|
| `documentation/ARCHITECTURE.md` | Implementing any feature; file structure; data schemas; CI pipeline |
| `documentation/REQUIREMENTS.md` | Checking acceptance criteria for a story ID (NAV-*, CHAT-*, etc.) |
| `documentation/DESIGN.md` | Writing any Tailwind classes; implementing any component |
| `documentation/design/*.html` | Resolving visual ambiguity — these are the source-of-truth prototypes |

## Commands

```bash
npm run dev              # Next.js dev server
npm run typecheck        # tsc --noEmit (primary correctness gate)
npm run lint             # next lint (ESLint)
npm run design-lint      # @google/design.md lint on documentation/DESIGN.md
npm run validate-content # scripts/validate-content.ts
npm run build            # next build
```

CI runs in this order: `typecheck → lint → design-lint → validate-content → build`. All must pass before deploy.

## Stack

Next.js 15 App Router · TypeScript · Tailwind CSS v4 · WebLLM (in-browser WebGPU) · MDX · Vercel

## Architecture

### Data layer

All content lives in `content/` as human-editable JSON/MDX. **No content is hardcoded in components.** Reads happen exclusively at build time inside Server Components — no runtime `fs` calls.

- `lib/types.ts` — all TypeScript interfaces
- `lib/content.ts` — typed `fs.readFileSync` loaders for each JSON file
- `lib/blog.ts` — `gray-matter` frontmatter parsing, slug list, full MDX post loader via `next-mdx-remote/rsc`
- `lib/chat-context.ts` — reads all content files at build time, serialises a system prompt string bundled into the chat page

### Rendering

Every page is SSG except `/chat` (client-only shell — WebLLM loads entirely in-browser). Blog post routes use `generateStaticParams` over `lib/blog.ts`.

### Theme system

Tailwind v4 `@theme` block in `styles/globals.css` declares CSS custom properties for light (Sand, default). Dark overrides live on `[data-theme="dark"]`. An inline `<script>` in `app/layout.tsx` `<head>` reads `localStorage` and sets `data-theme` before hydration to prevent flash. `ThemeProvider` (client component) exposes `toggleTheme` via context; `Nav.tsx` consumes it.

### Chat (WebLLM)

Model: `Llama-3.2-3B-Instruct-q4f16_1-MLC` (~2.1 GB, cached in browser Cache API). Requires WebGPU (Chrome/Edge 113+). If `navigator.gpu` is undefined, show fallback with direct contact links — no chat UI.

State machine: `unsupported | idle | loading | ready | thinking | error`

Home → Chat handoff: `ChatLauncher` navigates to `/chat?q=<encoded>`. On mount the chat page reads `searchParams.get('q')`, queues it as the first user message, and auto-sends once state is `ready`.

### Scroll animations

`components/ui/FadeIn.tsx` — `IntersectionObserver` wrapper. Transitions from `opacity-0 translate-y-[14px]` to visible over 500ms. Accepts `delay` (ms) for stagger. Used on every page for cards and timeline entries.

## Design constraints

Enforced by `@google/design.md lint` on `documentation/DESIGN.md`. See `documentation/DESIGN.md` and `documentation/design/*.html` for the source-of-truth design system — tokens, WCAG contrast, component specs.
