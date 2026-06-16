## 1. Content data

- [ ] 1.1 Update `content/home.json` `suggestions` to the four launcher chips: "What are Abhilash's top skills?", "Tell me about his role at Fabric Group", "Which projects has he led?", "How can I get in touch?".
- [ ] 1.2 Run `npm run validate-content` and confirm `home.json` still passes the zod schema.

## 2. Scroll indicator

- [ ] 2.1 Add a `@keyframes scroll-dot` to `styles/globals.css` (dot translates down then back) and expose it as `--animate-scroll-dot` in the Tailwind v4 `@theme` block.
- [ ] 2.2 Create `components/home/ScrollIndicator.tsx` (Server Component, `aria-hidden`, `pointer-events-none`): a "scroll" label (`font-mono`, small, `text-secondary`/low opacity) above an inline mouse-shaped SVG whose inner dot uses `animate-scroll-dot` looping continuously, with `motion-reduce:animate-none`. Absolutely positioned at the section bottom edge (`absolute bottom-8 left-1/2 -translate-x-1/2`).

## 3. Chat launcher

- [ ] 3.1 Create `components/home/ChatLauncher.tsx` (`"use client"`), props `{ suggestions: string[] }`. Use `useRouter` from `next/navigation`; implement a `go(q)` helper that no-ops on empty/whitespace and otherwise calls `router.push('/chat?q=' + encodeURIComponent(q.trim()))`.
- [ ] 3.2 Input row: a `<form onSubmit>` (Enter submits) containing a leading chat-bubble SVG, a transparent text input with placeholder "Ask me anything about Abhilash…", and an accent-filled square send button (`type="submit"`, `hover:opacity-85`, `aria-label`). Container uses a surface bg + border that shifts to the accent border on `focus-within`.
- [ ] 3.3 Chips: render one pill `<button>` per `suggestions` entry, `onClick={() => go(s)}`; `font-mono`, pill radius, neutral border/text that flip to accent border + `text-accent` + `bg-accent-dim` on hover; wrap and centre on small screens.
- [ ] 3.4 Browse line: a `font-mono` `text-secondary` line "or browse · projects · experience · contact" where projects/experience/contact are `text-accent` `next/link`s to `/projects`, `/experience`, `/contact`.

## 4. Wire into Hero

- [ ] 4.1 In `components/home/Hero.tsx`, add `suggestions` to the `getHomeContent()` destructure; replace the `{/* POR-167: chat launcher … */}` seam with `<ChatLauncher suggestions={suggestions} />` and the `{/* POR-167: scroll indicator … */}` seam with `<ScrollIndicator />`.

## 5. Tests

- [ ] 5.1 Add `__tests__/ChatLauncher.test.tsx` (React Testing Library, mocking `next/navigation` `useRouter`): assert the input placeholder renders; typing + pressing Enter and clicking the send button each call `router.push` with the encoded `/chat?q=` URL; empty/whitespace input does not navigate; all four chips render and clicking one pushes its encoded URL; browse links point to `/projects`, `/experience`, `/contact`.
- [ ] 5.2 Add a test (or extend `Hero.test.tsx`) asserting the scroll indicator renders, is `aria-hidden`, and the chips reflect `home.json` `suggestions`.
- [ ] 5.3 Run `npm test` and confirm all tests pass.

## 6. DOM / Visual Verification

- [ ] 6.1 Add launcher checks to `scripts/verify-dom.ts` (input placeholder, the four chip labels, and the browse-link text present in `/` HTML) and run `tsx scripts/verify-dom.ts` against the dev server; capture evidence.
- [ ] 6.2 Run `npm run dev` and verify at desktop and mobile widths in both themes: input/send/chips/browse render and are legible; send dims on hover, chips highlight in accent on hover; scroll indicator sits at the bottom edge and the dot loops; confirm no layout shift versus the POR-166 hero. Verify a chip click and an Enter submit navigate to `/chat?q=…` (the `/chat` route 404 is expected until that capability ships).

## 7. Quality Gates

- [ ] 7.1 Run `npm run typecheck` and confirm zero errors.
- [ ] 7.2 Run `npm run lint` and confirm zero errors.
- [ ] 7.3 Run `npm run design-lint` and confirm it passes.
- [ ] 7.4 Run `npm run build` and confirm the home page still builds as SSG.
- [ ] 7.5 Run `openspec validate home-chat-launcher --type change --strict` and confirm the change is valid.
