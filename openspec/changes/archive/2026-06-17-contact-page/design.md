## Context

New `/contact` route for the portfolio. No contact page or `components/contact/` directory exists. `content/contact.json` and `lib/content.ts → getContactInfo()` are already in place. The page is pure SSG — no user input, no server action, no form.

Phase 5 milestone (Contact & Chat). This is the conversion endpoint: every CTA ("Get in touch", "Hire me") routes here.

## Goals / Non-Goals

**Goals:**
- Render `/contact` as a fully static SSG page
- Display page header, opening statement, three contact cards (Email, LinkedIn, Phone), and availability banner
- Drive availability banner visibility and text from `content/contact.json` — no hardcoded strings
- Hover interactions via pure CSS Tailwind classes (no `"use client"` in contact components)

**Non-Goals:**
- Contact form / server action / email delivery
- Phone number — `contact.json` has `phone: ""`. Card will render but `href` will be `tel:` with empty value until the field is populated in JSON.
- Green-specific dot colour — design system uses accent (burnt orange) for the pulsing dot, not green

## Project Facts Preflight

- **Dependencies checked:** `package.json` — no new packages needed; `next-mdx-remote`, `gray-matter` already in use (irrelevant here)
- **Icon/export availability:** Lucide brand icons removed in `lucide-react` v1.x (see CLAUDE.md gotcha). Contact card icons are inline SVG — same approach as `Footer.tsx`. No lucide import needed.
- **Design tokens/classes checked:** `styles/globals.css` confirms `--color-accent`, `--color-accent-dim`, `--color-accent-border`. `documentation/DESIGN.md` specifies Contact Card and Availability Indicator component specs precisely (see Decisions).
- **Existing components/helpers checked:**
  - `components/ui/PageHeader.tsx` — exists, props: `label`, `subtitle`, `intro?`. Grid-line bg already included.
  - `components/ui/FadeIn.tsx` — exists, `"use client"`, stagger via `delay` prop.
  - `lib/content.ts` → `getContactInfo()` — exists, returns `ContactInfo`.
  - `lib/types.ts` → `ContactInfo` — exists with `email`, `linkedin`, `github`, `phone`, `availability.show`, `availability.message`.
  - `components/contact/` — does NOT exist; create it.
  - `app/contact/page.tsx` — does NOT exist; create it.
- **Scripts checked:** `npm run typecheck`, `npm run lint`, `npm run build` (unchanged).

## Decisions

### 1. Pure Server Components for contact components (no `"use client"`)

Hover state implemented with Tailwind `hover:` CSS classes + `group`/`group-hover:` pattern. No `onMouseEnter`/`onMouseLeave` handlers needed. This keeps `ContactCard` and `AvailabilityBanner` as RSC — no hydration cost.

**Alternative:** Client component with JS hover handlers (as in the HTML prototype). Rejected — pure CSS achieves the same visual result with zero bundle cost.

### 2. Inline SVG icons, not lucide-react

`lucide-react` v1.x dropped brand icons (`Github`, `Linkedin`). Mail and Phone icons exist in lucide but using inline SVG is consistent with `Footer.tsx` and avoids a package-version dependency that could silently break.

### 3. ContactCard as a generic component accepting a `ContactChannel` object

```ts
interface ContactChannel {
  label: string;         // "Email" | "LinkedIn" | "Phone"
  value: string;         // display value
  href: string;          // "mailto:...", "https://...", "tel:..."
  description: string;   // when to use this channel
  icon: React.ReactNode; // inline SVG
}
```

The page constructs the `channels` array from `getContactInfo()` and passes each to `ContactCard`. Descriptions are hardcoded in the page (not in `contact.json`) since they are copy, not data.

**Alternative:** Add `description` fields to `contact.json`. Rejected — descriptions are static presentation copy, not configurable content.

### 4. Availability banner conditionally rendered

`AvailabilityBanner` receives `show: boolean` and `message: string`. If `show` is false, the component returns `null`. This keeps the page component clean — no ternary at call site.

### 5. FadeIn stagger for cards and banner

Cards stagger: `delay={0}`, `delay={60}`, `delay={120}`. Banner: `delay={240}`. Consistent with blog listing and project cards.

### 6. Pulsing dot via Tailwind `animate-pulse`

Tailwind ships `animate-pulse` (opacity ping). The dot: `w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse`. Design spec ring (`0 0 0 3px accent-dim`) via Tailwind `ring-[3px] ring-accent-dim` (Tailwind v4 arbitrary ring).

## Risks / Trade-offs

- [Phone field empty in `contact.json`] → Card renders with `href="tel:"` — functionally harmless (no dialler opens). Populate `phone` in JSON when ready. The card will still render visually correct.
- [LinkedIn URL mismatch] → `contact.json` has `linkedin.com/in/abhilash-venkatesh`; prototype used `abhilash93`. Using `contact.json` value as canonical.

## Migration Plan

1. Add `app/contact/page.tsx` — SSG, no runtime changes.
2. Add `components/contact/ContactCard.tsx` and `AvailabilityBanner.tsx`.
3. Deploy — Vercel picks up new static route automatically.
4. No rollback complexity — page is additive.

## Open Questions

- Should phone be displayed at all if `phone` is empty in `contact.json`? Options: (a) always show three cards, phone shows placeholder; (b) filter out cards with empty `href`. Currently leaning to (a) — always show three cards as per spec CONTACT-3, and populate the JSON value.
