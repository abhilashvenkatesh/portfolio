## Context

9 sites across `components/` and `app/` hardcode the owner's name or a fixed year. All other personal data already flows from `content/*.json`. This design wires the remaining strings through the existing `getIdentity()` loader so deploying for a new person requires only editing `content/*.json`.

Current state:
- `lib/types.ts` `Identity` has `{ name, title, employer, location }` — no `firstName`
- `content/identity.json` has no `firstName` field
- Nav/MobileDrawer wordmark is JSX text `abhilash` (literal)
- Footer copyright is JSX text `© 2025 Abhilash` (literal)
- `ChatProvider.tsx` module-level `const WELCOME` is a hardcoded string; `WELCOME` is exported and consumed in `ChatClient.tsx` `useMemo` to construct `initialMessages`
- `ChatMessage.tsx` hardcodes `"Abhilash"` as the assistant label
- `UnsupportedFallback.tsx` hardcodes `"reach Abhilash directly"`
- `ChatLauncher.tsx` (`components/home/`) hardcodes placeholder and `aria-label`
- `app/contact/page.tsx` hardcodes the `description` metadata string

## Goals / Non-Goals

**Goals**
- Zero hardcoded name/year strings in `app/` and `components/`
- All strings derive from `content/identity.json` at build time
- No change to user-visible UI layout or visual design

**Non-Goals**
- Generalising pronouns ("his", "my") in spec copy — out of scope
- i18n or multi-language support
- Any new UI features or routing changes

## Project Facts Preflight

- Dependencies checked: `package.json` — no new deps needed
- Design tokens/classes checked: no new tokens; all components use existing patterns
- Existing components/helpers checked:
  - `lib/content.ts:17` — `getIdentity(): Identity` already exports a typed loader
  - `components/layout/Nav.tsx` — server component, already imports from `lib/content.ts` (for contact links)
  - `components/layout/MobileDrawer.tsx` — server component
  - `components/layout/Footer.tsx` — server component
  - `app/chat/page.tsx` — server component; currently calls `getContactInfo()`, `getExperience()`, `getProjects()`, `getSkills()`, `getChatChips()`; passes props to `ChatClient`
  - `ChatClient.tsx` — client component; currently accepts `{ systemPrompt, chips, email, linkedin, loadingContent }`; imports `WELCOME` from `ChatProvider` for `initialMessages` useMemo
  - `ChatProvider.tsx` — client component; `WELCOME` is a module-level `const` AND is exported; `ChatProvider` accepts `{ systemPrompt, errorEmail, initialMessages, children }`
  - `ChatMessage.tsx` — leaf client component; hardcodes label; currently receives only `{ msg }`
  - `ChatThread.tsx` — renders `ChatMessage` per message; currently accepts `{ messages }`
  - `UnsupportedFallback.tsx` — accepts `{ email, linkedin }`
  - `components/home/ChatLauncher.tsx` — client component; accepts `{ suggestions }`; `Hero.tsx` (server) renders it
- Scripts checked: `npm run typecheck` (tsc --noEmit), `npm run lint` (eslint .)

## Decisions

### D1: Add `firstName` to `Identity` — use it for components that need first name alone

`identity.name` = `"Abhilash Venkatesh"`. The wordmark, footer, and assistant label need first name only. Rather than splitting `name` at runtime, add explicit `firstName: string` to the type and JSON. Value: `"Abhilash"`.

**Alternative considered**: `identity.name.split(" ")[0]` — rejected because it's fragile (names with prefixes, single-word names, etc.).

### D2: Server components read `getIdentity()` directly — no prop threading

`Nav.tsx`, `MobileDrawer.tsx`, and `Footer.tsx` are server components. They can call `getIdentity()` without prop threading, same pattern already used for contact links. This keeps the change minimal.

### D3: `app/chat/page.tsx` passes `ownerName`/`ownerFirstName` to `ChatClient`

The chat tree is a client island. The entry point `app/chat/page.tsx` is the only server boundary. Add `ownerName: string` and `ownerFirstName: string` to `ChatClient` props, sourced from `getIdentity()` in the server page.

### D4: Change `WELCOME` from exported `const` to exported `function getWelcome(ownerName)`

`WELCOME` is both a module-level constant and an export consumed in `ChatClient.tsx`. The cleanest migration:
- Rename to `getWelcome(ownerName: string): string`
- Export the function (not the string)
- `ChatClient.tsx` calls `getWelcome(ownerName)` inside its `initialMessages` useMemo

**Alternative considered**: Pass welcome string from server page — rejected because it adds a prop to an already large `ChatClient` interface and the greeting is a UI concern, not content.

### D5: Thread `ownerFirstName` to `ChatMessage` via `ChatThread`

`ChatMessage` needs `ownerFirstName` for the assistant label. The path is:
`ChatClient` → `ChatThread` (add prop) → `ChatMessage` (add prop).

**Alternative considered**: Put `ownerFirstName` in `ChatContext` — feasible but ChatContext is for chat state, not identity. Prop threading is cleaner for a one-level addition.

### D6: Thread `ownerName` to `UnsupportedFallback` via `ChatClient`

`UnsupportedFallback` already receives `email` and `linkedin` from `ChatClient`. Adding `ownerName` follows the same pattern.

### D7: `Hero.tsx` passes `ownerName` to `ChatLauncher`

`Hero.tsx` is a server component that already computes content for the launcher. Call `getIdentity()` and pass `ownerName: string` to `ChatLauncher` alongside `suggestions`.

### D8: `content/home.json` suggestions — edit content values, no code change

Suggestions are already content-driven. Edit the four strings to remove the owner's name (e.g. `"What are Abhilash's top skills?"` → `"What are the top skills?"`).

## Risks / Trade-offs

- [WELCOME rename breaks the existing import in ChatClient] → Fix import in same PR; TypeScript typecheck will catch it
- [Prop threading ChatThread/ChatMessage increases component signatures] → Acceptable; both are small leaf components

## Migration Plan

1. Commit all changes on the `abhilash-venkatesh/por-179-...` branch
2. Run `npm run typecheck && npm run lint && npm run build` to verify
3. Acceptance check: `grep -r "Abhilash\|abhilash" app/ components/` returns zero matches
4. Merge to main → Vercel auto-deploys
5. Rollback: revert merge commit (no DB/infra changes)

## Open Questions

None — all decisions resolved above.
