## 1. Content & Types

- [x] 1.1 Populate `content/contact.json` `phone` field with Abhilash's phone number (currently empty string; card renders but dialler won't work until set)
- [x] 1.2 Verify `lib/types.ts` `ContactInfo` interface covers all fields used by new components — no changes expected

## 2. Components

- [x] 2.1 Create `components/contact/ContactCard.tsx` — Server Component; props: `{ label, value, href, description, icon }` (see design.md); accent icon container `44×44px`, DM Mono uppercase label, value + description, external-link SVG arrow; hover via Tailwind `group`/`group-hover:` classes (accent border, accent-dim bg, `-translate-y-0.5`)
- [x] 2.2 Create `components/contact/AvailabilityBanner.tsx` — Server Component; props: `{ show, message }`; returns `null` when `show` is `false`; accent-dim fill, accent-border border, `10px` radius; pulsing dot via `animate-pulse`; message text in DM Mono accent

## 3. Page Route

- [x] 3.1 Create `app/contact/page.tsx` — SSG Server Component; call `getContactInfo()` at build time; construct `channels` array (Email, LinkedIn, Phone) with inline SVG icons and hardcoded descriptions; render `PageHeader label="Get in touch" subtitle="Let's work together"`
- [x] 3.2 Add opening statement paragraph centred below header: exact text from CONTACT-2
- [x] 3.3 Map `channels` to `<FadeIn delay={i * 60}><ContactCard /></FadeIn>` in a flex-col gap-3.5 container (max-width 640px centred)
- [x] 3.4 Render `<FadeIn delay={240}><AvailabilityBanner show={...} message={...} /></FadeIn>` below cards, driven by `contact.json` values
- [x] 3.5 Add `export const metadata` with `title: "Contact"` and `description` for SSG SEO

## 4. Navigation

- [x] 4.1 Verify Nav active-link detection highlights "Contact" when on `/contact` — check `components/layout/Nav.tsx` `active` prop or `usePathname` logic; no change expected but confirm

## 5. Tests

- [x] 5.1 Create `__tests__/ContactPage.test.tsx` — render `ContactCard` with mock props; assert label, value, description, and `href` attributes render correctly
- [x] 5.2 Add `AvailabilityBanner` tests — (a) renders message when `show=true`, (b) renders nothing when `show=false`
- [x] 5.3 Add page-level smoke test — mock `getContactInfo()`, render `app/contact/page.tsx`; assert "Get in touch" heading, opening statement text, and all three card labels present
- [x] 5.4 Run `npm test` and confirm 100% pass — 113/113

## 6. DOM / Visual Verification

- [x] 6.1 Start dev server (`npm run dev`), open `http://localhost:3000/contact`, confirm page header, opening statement, three cards, and availability banner render correctly in light mode
- [ ] 6.2 Toggle dark mode; confirm accent colours, card hover state, and banner all look correct
- [ ] 6.3 Resize to mobile viewport (~390px); confirm cards stack correctly with no overflow or clipping
- [ ] 6.4 Hover each card; confirm accent border, tinted background, and upward lift appear and reverse on mouse-leave
- [ ] 6.5 Click Email card; confirm email client opens. Click LinkedIn card; confirm opens in new tab. Note: Phone card tested with correct `tel:` href in DOM inspection.
- [x] 6.6 Check `scripts/verify-dom.ts` — nav link `/contact` already asserted; contact page label assertion not needed (no existing pattern for page label)

## 7. Quality Gates

- [x] 7.1 Run `npm run typecheck` — zero errors
- [x] 7.2 Run `npm run lint` — zero errors
- [x] 7.3 Run `openspec validate contact-page --type change --strict` — change is valid
