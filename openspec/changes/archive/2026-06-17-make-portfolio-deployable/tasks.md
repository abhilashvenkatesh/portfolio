## 1. Schema — Add `firstName` to Identity

- [x] 1.1 Add `"firstName": "Abhilash"` to `content/identity.json`
- [x] 1.2 Add `firstName: string` to the `Identity` interface in `lib/types.ts`
- [x] 1.3 Run `npm run typecheck` — confirm no errors from the type change alone

## 2. Site Shell — Nav, MobileDrawer, Footer

- [x] 2.1 In `components/layout/Nav.tsx`: call `getIdentity()`, replace JSX text `abhilash` with `{identity.firstName.toLowerCase()}`
- [x] 2.2 In `components/layout/MobileDrawer.tsx`: call `getIdentity()`, replace JSX text `abhilash` with `{identity.firstName.toLowerCase()}`
- [x] 2.3 In `components/layout/Footer.tsx`: call `getIdentity()`, replace `© 2025 Abhilash` with `© {new Date().getFullYear()} {identity.firstName}`

## 3. Chat Components — Prop Threading

- [x] 3.1 In `components/chat/ChatProvider.tsx`: rename exported `WELCOME` const to exported function `getWelcome(ownerName: string): string`; use `ownerName` in the greeting and error message; add `ownerName: string` to `ChatProvider` props
- [x] 3.2 In `components/chat/ChatMessage.tsx`: add `ownerFirstName: string` prop; replace hardcoded `"Abhilash"` label with `ownerFirstName`
- [x] 3.3 In `components/chat/ChatThread.tsx`: add `ownerFirstName: string` prop; pass it through to each `ChatMessage`
- [x] 3.4 In `components/chat/UnsupportedFallback.tsx`: add `ownerName: string` prop; replace hardcoded `"reach Abhilash directly"` with `"reach {ownerName} directly"`
- [x] 3.5 In `components/chat/ChatClient.tsx`: add `ownerName: string` and `ownerFirstName: string` props; update `initialMessages` useMemo to call `getWelcome(ownerName)`; pass `ownerName` to `ChatProvider` and `UnsupportedFallback`; pass `ownerFirstName` to `ChatThread`
- [x] 3.6 In `app/chat/page.tsx`: call `getIdentity()`; pass `ownerName={identity.name}` and `ownerFirstName={identity.firstName}` to `ChatClient`

## 4. Home Chat Launcher — Placeholder

- [x] 4.1 In `components/home/ChatLauncher.tsx`: add `ownerName: string` prop; replace hardcoded placeholder `"Ask me anything about Abhilash…"` and aria-label with `"Ask me anything about ${ownerName}…"`
- [x] 4.2 In `components/home/Hero.tsx`: call `getIdentity()`; pass `ownerName={identity.name}` to `ChatLauncher`

## 5. Contact Page — Meta Description

- [x] 5.1 In `app/contact/page.tsx`: call `getIdentity()`; replace hardcoded description string with `` `Get in touch with ${identity.name} — open to full-time roles and select consulting engagements.` ``

## 6. Content — Generic Home Suggestions

- [x] 6.1 In `content/home.json`: update `suggestions` to remove name references:
  - `"What are Abhilash's top skills?"` → `"What are the top skills?"`
  - `"Tell me about his role at Fabric Group"` → `"Tell me about the current role"`
  - `"Which projects has he led?"` → `"Which projects stand out?"`
  - `"How can I get in touch?"` → `"How can I get in touch?"`

## 7. Tests

- [x] 7.1 Add or update unit test for `Nav.tsx`: assert the wordmark renders `identity.firstName.toLowerCase()` (mock `getIdentity`)
- [x] 7.2 Add or update unit test for `Footer.tsx`: assert the copyright line contains `identity.firstName` and the current year
- [x] 7.3 Add or update unit test for `ChatMessage.tsx`: assert assistant message label renders the provided `ownerFirstName`
- [x] 7.4 Add or update unit test for `UnsupportedFallback.tsx`: assert the copy contains the provided `ownerName`
- [x] 7.5 Add or update unit test for `ChatLauncher.tsx`: assert placeholder text contains the provided `ownerName`
- [x] 7.6 Run `npm test` and confirm all tests pass

## 8. DOM / Visual Verification

- [x] 8.1 Run `npm run dev`; open the home page and confirm the Nav wordmark shows `abhilash` (not broken)
- [x] 8.2 Confirm the footer copyright reads `© {current year} Abhilash`
- [x] 8.3 Open the mobile drawer and confirm the wordmark is correct
- [x] 8.4 Navigate to `/chat`; confirm the welcome message reads `"Hey! I'm a chat layer over Abhilash Venkatesh's resume…"`
- [x] 8.5 Send a message; confirm the assistant label shows `"Abhilash"` (not raw firstName variable or undefined)
- [x] 8.6 Open the home page on an unsupported-GPU browser (or set `navigator.gpu = undefined` in devtools); confirm the fallback reads `"reach Abhilash Venkatesh directly"`
- [x] 8.7 Run `grep -r "Abhilash\|abhilash" app/ components/` and confirm zero matches

## 9. Quality Gates

- [x] 9.1 Run `npm run typecheck` and confirm zero errors
- [x] 9.2 Run `npm run lint` and confirm zero errors
- [x] 9.3 Run `openspec validate make-portfolio-deployable --type change --strict` and confirm the change is valid
