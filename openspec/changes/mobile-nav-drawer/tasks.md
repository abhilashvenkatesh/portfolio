## 1. Tests first (RED)

- [ ] 1.1 Add `__tests__/MobileDrawer.test.tsx`: assert that when `open`, the panel (`role="dialog"`) renders all six links (Projects, About, Experience, Blog, Chat, Contact), a Hire me `mailto:` link, and a theme toggle button. Assert nothing renders when `open=false`.
- [ ] 1.2 In the same file, assert dismissal: `onClose` fires on Escape keydown, on backdrop click, and on selecting a link; assert `aria-modal`/`aria-label` present on the panel.
- [ ] 1.3 Extend `__tests__/Nav.test.tsx`: assert a hamburger trigger with `aria-expanded` + `aria-controls` exists, that activating it opens the drawer, and that the inline desktop link container carries the `hidden sm:flex` class (links collapsed on mobile).
- [ ] 1.4 Run `npm test` and confirm the new tests FAIL for the right reason (component/markup not yet present).

## 2. MobileDrawer component (GREEN)

- [ ] 2.1 Create `components/layout/MobileDrawer.tsx` (client component) with props `{ open, onClose, links, email, theme, toggleTheme }`; render backdrop + right slide-in panel using `bg-surface`, `border-l border-surface-alt`, backdrop `bg-neutral/60`, z-index above nav, with `motion-reduce`-gated `transition-transform` (translate-x-full → 0).
- [ ] 2.2 Render the six `links`, the Hire me `mailto:${email}` button (`bg-accent text-black` styling), and the Sun/Moon theme toggle (reuse existing markup) inside the panel; include a close (`X`) button.
- [ ] 2.3 Wire dismissal: Escape keydown listener, backdrop `onClick`, and link `onClick` all call `onClose`; attach/cleanup listeners only while `open`.
- [ ] 2.4 Add accessibility + body management: `role="dialog"`, `aria-modal`, `aria-label`; focus moves into panel on open and returns to trigger on close; Tab focus trap; `document.body` scroll lock with cleanup that always restores `overflow`.

## 3. Nav integration (GREEN)

- [ ] 3.1 In `components/layout/Nav.tsx` replace the `{/* TODO POR-165 */}` placeholder with a hamburger trigger (`Menu` icon) shown only `<640px` (`flex sm:hidden`), carrying `aria-expanded`/`aria-controls`; add `const [menuOpen, setMenuOpen] = useState(false)`.
- [ ] 3.2 Move the theme toggle + Hire me cluster to desktop-only (`hidden sm:flex`) so the mobile bar shows wordmark + hamburger only; render `<MobileDrawer>` driven by `menuOpen`, passing `NAV_LINKS`, `email`, `theme`, `toggleTheme`.
- [ ] 3.3 Add a `usePathname()` effect that closes the drawer on route change, and a `matchMedia('(min-width: 640px)')` change listener that closes it when returning to desktop width.

## 4. Tests (confirm GREEN)

- [ ] 4.1 Run `npm test` and confirm all tests (existing + new) pass.

## 5. DOM / Visual Verification

- [ ] 5.1 Verify via DOM/screenshot at mobile (`<640px`) and desktop (`≥640px`) widths: mobile shows wordmark + hamburger only and opens the drawer with all links + Hire me + toggle; desktop shows the inline bar with no hamburger. Capture evidence (reuse `npm run verify-dom` pattern where applicable).
- [ ] 5.2 Confirm no text overlap, clipping, or layout shift; backdrop dims the page; drawer closes on Esc/backdrop/link/resize; reduced-motion disables the slide animation.

## 6. Quality Gates

- [ ] 6.1 Run `npm run typecheck` and confirm zero errors.
- [ ] 6.2 Run `npm run lint` and confirm zero errors.
- [ ] 6.3 Run `openspec validate mobile-nav-drawer --type change --strict` and confirm the change is valid.
