## Context

POR-166 shipped `components/home/Hero.tsx` as a static Server Component and left two explicitly-commented seams:

- `{/* POR-167: chat launcher (input, chips, browse hints) mounts here. */}` between the bio and `HeroStats`.
- `{/* POR-167: scroll indicator anchors to the bottom edge of this section. */}` just before `</section>`.

This change fills both seams. The source-of-truth prototype is `documentation/design/index.html` (`ChatLauncher` component + the scroll-indicator block at the bottom of `Hero`).

## Goals / Non-Goals

**Goals**
- Interactive launcher: input + send button, four suggestion chips, browse links — all navigating as the prototype does.
- Continuously-looping, accessible scroll indicator at the hero's bottom edge.
- Chip copy sourced from `content/home.json` `suggestions` (no hardcoded copy), aligned to current content.
- Keep the home page otherwise SSG; only the launcher island is client-side.

**Non-Goals**
- The `/chat` page and its WebLLM behaviour (separate CHAT capability). The launcher only navigates to `/chat?q=…`.
- The `/projects`, `/experience`, `/contact` destination pages (separate capabilities). Browse links forward-link to those routes.
- Changing the hero shell, background, stats, or headline (POR-166, unchanged).

## Project Facts Preflight

- **Dependencies checked**: `package.json` — no new deps. React 19 / Next 15 App Router, Tailwind v4, vitest + React Testing Library.
- **Navigation primitives checked**: `next/link` is already used in `components/layout/Nav.tsx` and `MobileDrawer.tsx`. `useRouter` from `next/navigation` is the App Router client-side programmatic-navigation hook (needed for the dynamic `?q=` encoding).
- **Design tokens/classes checked**: `styles/globals.css` `@theme` exposes `--color-primary`, `--color-secondary`, `--color-accent`, `--color-accent-dim`, `--color-surface(-alt)`, `--color-neutral`, `--font-sans`, `--font-mono`, `--radius-*`. Map prototype names: heading→`text-primary`, muted→`text-secondary`/`text-neutral`, accent→`text-accent`, `--bg2`→`bg-surface(-alt)`, `--border`→a neutral border token. There are **no** `--border`/`--muted` raw tokens — use the existing surface/neutral/secondary classes.
- **Animation checked**: `styles/globals.css` defines **no** `@keyframes` and no `--animate-*` tokens today. The scroll dot needs one new keyframe.
- **Existing components/helpers checked**: `lib/content.ts` `getHomeContent()` returns `HomeContent` including `suggestions: string[]`. `Hero.tsx` already destructures `getHomeContent()` and can add `suggestions`. New components land in the existing `components/home/` folder.
- **Scripts checked**: `typecheck`, `lint` (`eslint .`), `design-lint`, `validate-content` (zod), `test` (vitest), `build`. `scripts/verify-dom.ts` checks rendered `/` HTML against regexes — note the launcher's interactive bits render client-side, but the input placeholder, chip labels, and browse-link text are in the initial server HTML and can be asserted there.

## Decisions

**1. `ChatLauncher` is a `"use client"` component; `Hero` stays a Server Component.**
The input, send handler, and chip clicks need event handlers and `useRouter`, so the launcher must be a client island. `Hero` keeps reading content at build time and passes `suggestions` down as a prop — the launcher takes no `fs`/content dependency of its own. This preserves the home page as SSG with one small hydrated island. Alternative (make all of `Hero` client) rejected: would drop SSG for the whole hero.

**2. Navigation: `useRouter().push` for input/chips, `next/link` for browse links.**
Input and chips build a dynamic URL (`/chat?q=${encodeURIComponent(q.trim())}`), so they call `router.push` from a submit/click handler — guarding against empty/whitespace queries (no navigation). The three browse destinations are static, so they use `<Link href="/projects|/experience|/contact">` for prefetch and accessibility. The prototype's `.html` hrefs map to the app routes (`/chat`, `/projects`, `/experience`, `/contact`).

**3. Chip copy sourced from `content/home.json` `suggestions` (user decision).**
Per XC-5 no hardcoded copy. `Hero` reads `suggestions` via `getHomeContent()` and passes the array to `ChatLauncher`, which renders one chip per entry. The current `suggestions` values are updated to the four launcher questions, with chip 2 aligned to actual content: "Tell me about his role at Fabric Group" (the issue said "Rapido", which appears nowhere in `content/`). `chat-chips.json` / `getChatChips()` is left untouched and reserved for the future `/chat` page.

**4. Scroll indicator is a separate decorative component, animated via a CSS keyframe (not SVG SMIL).**
`components/home/ScrollIndicator.tsx` renders the "scroll" label + mouse SVG, absolutely positioned at the section's bottom edge (`absolute bottom-8 left-1/2 -translate-x-1/2`), low opacity, `aria-hidden`, `pointer-events-none`. The dot loops via a new `@keyframes scroll-dot` in `styles/globals.css` exposed as `--animate-scroll-dot` (Tailwind v4 `@theme`), so it can be disabled under `prefers-reduced-motion` with `motion-reduce:animate-none`. Chosen over the prototype's SMIL `<animate>` because SMIL can't respond to reduced-motion and CSS keeps the loop in the design system.

**5. Launcher styling maps prototype inline styles to Tailwind tokens.**
Input row: rounded surface container with a border that shifts to the accent border on focus-within; send button is an accent-filled square that dims on hover (`hover:opacity-85`). Chips: `font-mono`, pill radius, neutral border/text that flip to accent border + `text-accent` + `bg-accent-dim` on hover. Browse line: `font-mono`, small, `text-secondary`, with the three words as `text-accent` links. Exact values follow `documentation/design/index.html` and DESIGN.md tokens.

**6. Mount points reuse the existing seams.**
`<ChatLauncher suggestions={suggestions} />` replaces the bio→stats comment; `<ScrollIndicator />` replaces the bottom-edge comment. No reshuffle of the hero — POR-166 reserved these exact spots.

## Risks / Trade-offs

- **Forward-links 404 until their pages ship** → `/chat`, `/projects`, `/experience`, `/contact` don't exist yet. Acceptable: they're tracked by sibling Phase 2/3 issues and resolve as those land; links are correct now. Not gating this change on them.
- **Hydration of the launcher island** → small JS cost on an otherwise-static page. Mitigation: keep the island minimal (input + chips only); browse links are `next/link` and the indicator is pure CSS, neither needs the client.
- **New global keyframe** → first animation token in `globals.css`. Mitigation: scope it to a single named keyframe + `--animate-` token, honour `motion-reduce`.
- **Chip copy drift from `verify-dom`** → if chip text changes, the DOM check regexes must follow. Mitigation: assert chip labels from the same `home.json` values the component renders.

## Migration Plan

Pure additive front-end change. Deploy via the normal CI pipeline (`typecheck → lint → design-lint → validate-content → build`). Rollback = revert the commit; the `home.json` `suggestions` edit is independent and safe to revert alone. No data migration, no env changes.

## Open Questions

None blocking. Chip source (`home.json`) and copy (Fabric Group) were resolved with the user.
