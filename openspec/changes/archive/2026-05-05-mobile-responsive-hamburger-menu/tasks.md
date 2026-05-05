## 1. Hamburger Menu — Nav.tsx

- [x] 1.1 Add `isMenuOpen` state (`useState(false)`) to `Nav.tsx`
- [x] 1.2 Add hamburger button element (3-bar icon) visible only on `< md` (`md:hidden`)
- [x] 1.3 Wire button `onClick` to toggle `isMenuOpen`
- [x] 1.4 Hide desktop nav links on mobile (`hidden md:flex`) and conditionally show mobile menu when `isMenuOpen` is true
- [x] 1.5 Render mobile menu as full-width block below nav bar with all nav links
- [x] 1.6 Add `onClick={() => setIsMenuOpen(false)}` to each nav link in the mobile menu
- [x] 1.7 Ensure hamburger button is hidden on `md+` screens (`md:hidden`)

## 2. Touch Targets

- [x] 2.1 Verify hamburger button has ≥ 44px height and width (add padding if needed)
- [x] 2.2 Verify each mobile menu nav link has ≥ 44px height (use `py-3` or equivalent)
- [x] 2.3 Verify desktop nav links meet 44px height

## 3. Mobile Overflow Audit

- [x] 3.1 Open each page at 375px viewport width in browser DevTools
- [x] 3.2 Fix any elements with fixed widths wider than viewport (replace `w-<fixed>` with `w-full` or `max-w-full`)
- [x] 3.3 Fix any negative margins or padding causing overflow
- [x] 3.4 Add `overflow-x-hidden` to `<body>` in `Base.astro` as safety net after fixing root causes

## 4. Verification

- [x] 4.1 Test hamburger open/close on 375px viewport
- [x] 4.2 Test that tapping a nav link closes the mobile menu
- [x] 4.3 Verify all six pages scroll vertically only at 375px (no horizontal scroll)
- [x] 4.4 Verify nav links are always visible on 768px+ without hamburger
- [x] 4.5 Run `npx astro check` — zero type errors
