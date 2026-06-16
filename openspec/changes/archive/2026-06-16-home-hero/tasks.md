## 1. Content data

- [x] 1.1 Update `content/home.json`: set `roleBadge` to "Lead Application Developer · Melbourne", `headline` to "Hi, I'm Abhilash.", `subheading` to "I architect systems that scale to millions.", `bio` to the POR-166 bio paragraph, and `stats` to the three pairs ("11+"/"years experience", "30+"/"microservices shipped", "3"/"countries worked in"). Leave `suggestions` untouched (POR-167).
- [x] 1.2 Run `npm run validate-content` and confirm `home.json` passes the zod schema (stats length 3).

## 2. Hero background texture

- [x] 2.1 Create `components/home/HeroBackground.tsx` (Server Component, `aria-hidden`, `pointer-events-none`): an inline SVG grid `<pattern>` stroked with `currentColor` at low opacity (~0.06) masked by a radial gradient so it fades toward the centre — following the `components/ui/PageHeader.tsx` idiom.
- [x] 2.2 Add the radial accent glow as an absolutely-positioned blurred `div` using the accent token at low opacity (e.g. `bg-accent/[0.08] blur-[80px]`), behind the content at `z-0`.

## 3. Hero content components

- [x] 3.1 Create `components/home/HeroStats.tsx`: render the three `stats` as value (`text-primary`, emphasised) over label (`text-secondary`, `font-mono`), laid out as a centred row that wraps on small screens.
- [x] 3.2 Create `components/home/Hero.tsx` (Server Component) composing: `HeroBackground`, role badge (`text-accent` `font-mono` pill using `bg-accent-dim`), headline (`text-primary` dominant heading), subheading (`text-secondary` light weight with the trailing clause "scale to millions." wrapped in a `text-accent` span — hardcoded per design decision 4), bio paragraph (`text-secondary`), then `HeroStats`. Leave a clearly commented seam between bio and stats for the POR-167 chat launcher, and reserve the bottom edge for the POR-167 scroll indicator. Read content via `getHomeContent()` from `lib/content.ts`.
- [x] 3.3 Full-viewport section: centred column, `min-h` near viewport, responsive padding, `relative overflow-hidden` so the texture is clipped to the hero.
- [x] 3.4 Replace the `app/page.tsx` placeholder with `<Hero />`.

## 4. Tests

- [x] 4.1 Add `__tests__/Hero.test.tsx` (React Testing Library, matching existing `__tests__/*.test.tsx` style): assert the role badge text, headline, subheading (incl. the accented clause), bio, and all three stat values+labels render; assert the decorative layers are `aria-hidden`.
- [x] 4.2 Run `npm test` and confirm all tests pass.

## 5. DOM / Visual Verification

- [x] 5.1 Run `npm run dev` and verify the hero at desktop and mobile widths in both light and dark themes: text legible over the texture, glow/grid subtle, no overlap or clipping. Add hero checks to `scripts/verify-dom.ts` (badge, headline, bio, stat strings present in `/` HTML) and run `tsx scripts/verify-dom.ts` against the dev server; capture evidence.
- [x] 5.2 Confirm the decorative layers do not intercept pointer events and there is no layout shift when toggling theme.

## 6. Quality Gates

- [x] 6.1 Run `npm run typecheck` and confirm zero errors.
- [x] 6.2 Run `npm run lint` and confirm zero errors.
- [x] 6.3 Run `npm run design-lint` and confirm it passes.
- [x] 6.4 Run `npm run build` and confirm the home page builds as SSG.
- [x] 6.5 Run `openspec validate home-hero --type change --strict` and confirm the change is valid.
