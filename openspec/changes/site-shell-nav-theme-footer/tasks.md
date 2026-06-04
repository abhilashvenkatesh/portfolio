## 1. Project Bootstrap

- [x] 1.1 Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"` in the repo root to generate `package.json`, `tsconfig.json`, `next.config.ts`, `app/`, `styles/`, `public/`, `.eslintrc.json`
- [x] 1.2 Install additional dependencies: `npm install gray-matter next-mdx-remote @mlc-ai/web-llm zod tsx lucide-react`
- [x] 1.3 Add `.nvmrc` pinning Node 20 and add `"engines": { "node": ">=20" }` to `package.json`
- [x] 1.4 Add `npm run design-lint` and `npm run validate-content` scripts to `package.json`: `"design-lint": "tsx scripts/validate-design.ts"` and `"validate-content": "tsx scripts/validate-content.ts"`
- [x] 1.5 Verify `npm run dev` starts without errors and `localhost:3000` responds

## 2. Design Tokens & Global Styles

- [x] 2.1 Replace the generated `styles/globals.css` with the full Tailwind v4 `@theme` block from ARCHITECTURE.md: declare `--color-primary`, `--color-secondary`, `--color-accent`, `--color-neutral`, `--color-surface`, `--color-surface-alt`, `--color-accent-dim`, `--font-sans`, `--font-mono`, and all `--radius-*` variables
- [x] 2.2 Add `[data-theme="dark"]` block with dark-palette overrides (`--color-primary: #f0f0f2`, etc.) as specified in ARCHITECTURE.md
- [x] 2.3 Add Google Fonts `<link>` tags for DM Sans (weights 300, 400, 500, 600 + 300 italic) and DM Mono (weights 400, 500) to `app/layout.tsx` `<head>`

## 3. TypeScript Types & Content Loaders

- [x] 3.1 Create `lib/types.ts` with all interfaces from ARCHITECTURE.md: `Identity`, `Project`, `SkillCategory`, `ExperienceEntry`, `BlogPostMeta`, `BlogPost`, `ContactInfo`, `HomeContent`
- [x] 3.2 Create `lib/content.ts` with typed `fs.readFileSync` loaders: `getIdentity`, `getProjects`, `getSkills`, `getExperience`, `getContactInfo`, `getHomeContent`, `getAboutBio`, `getChatChips`

## 4. Placeholder Content Files

- [x] 4.1 Create `content/identity.json` with real values: `{ "name": "Abhilash Venkatesh", "title": "Lead Application Developer", "employer": "Fabric Group", "location": "Melbourne" }`
- [x] 4.2 Create `content/contact.json` with real values: `{ "email": "abhilashfeb30@gmail.com", "linkedin": "https://linkedin.com/in/abhilash-venkatesh", "phone": "", "availability": { "show": true, "message": "Currently available — open to full-time and contract roles starting immediately." } }`
- [x] 4.3 Create stub files for remaining content: `content/home.json` (minimal valid `HomeContent`), `content/about.json` (`[]`), `content/skills.json` (`[]`), `content/experience.json` (`[]`), `content/projects.json` (`[]`), `content/chat-chips.json` (`[]`)
- [x] 4.4 Create `content/blog/` directory with a single stub MDX file (`placeholder.mdx`) with valid frontmatter so `lib/blog.ts` doesn't fail
- [x] 4.5 Add a minimal placeholder `public/resume.pdf` (a valid single-page PDF so download links don't serve 0 bytes)

## 5. Validation Scripts

- [x] 5.1 Create `scripts/validate-content.ts` — reads all JSON content files, validates against `zod` schemas matching `lib/types.ts`, exits non-zero on violation; stubs for blog MDX frontmatter validation
- [x] 5.2 Create `scripts/validate-design.ts` — checks `documentation/DESIGN.md` for lint rules: no hardcoded hex colours outside allowed palette, no font weights above 600, no arbitrary border-radius values outside the defined scale; exits non-zero on violation
- [x] 5.3 Run `npm run validate-content` and confirm exit code 0 with the stub content files
- [x] 5.4 Run `npm run design-lint` and confirm exit code 0

## 6. ThemeProvider & Anti-Flash Script

- [x] 6.1 Create `components/providers/ThemeProvider.tsx` (`'use client'`) — React context exposing `{ theme: 'light' | 'dark', toggleTheme: () => void }`; on mount reads `localStorage.getItem('theme')` to sync state; `toggleTheme` updates `document.documentElement.setAttribute('data-theme', …)` and writes to `localStorage`
- [x] 6.2 Add the anti-flash inline `<script>` to `app/layout.tsx` `<head>` via `dangerouslySetInnerHTML`: reads `localStorage.getItem('theme')`, falls back to `window.matchMedia('(prefers-color-scheme: dark)').matches`, sets `data-theme` on `document.documentElement` before hydration
- [x] 6.3 Wrap `{children}` in `app/layout.tsx` with `<ThemeProvider>` so all pages have access to theme context

## 7. Nav Component

- [x] 7.1 Create `components/layout/Nav.tsx` (`'use client'`) — fixed top bar, height 60px, `z-50`; renders the "abhilash" wordmark as a `<Link href="/">` using DM Mono font class
- [x] 7.2 Add page links (Projects, About, Experience, Blog, Chat, Contact) — each a `<Link>` using `usePathname()` to apply active state: `bg-(--color-surface-alt) text-(--color-primary) font-medium` on active link, `text-(--color-secondary)` on inactive; `rounded-sm` (`--radius-sm`) padding `6px 12px` per DESIGN.md `nav-link` spec
- [x] 7.3 Add scroll blur effect — `useEffect` scroll listener: when `window.scrollY > 40` apply `backdrop-blur-md bg-neutral/90` and visible `border-b`; remove when scrolled back within 40px; use `useState` for `scrolled` boolean
- [x] 7.4 Add "Hire me" button — `<a href={\`mailto:${contactInfo.email}\`}>` rendered as a button using primary-text style from DESIGN.md (`bg-(--color-accent) text-black rounded-md px-5 py-2.5`); shows subtle background fill on hover; accepts `email` prop from layout
- [x] 7.5 Add theme toggle button — sun/moon icon from `lucide-react` (`Sun`, `Moon`); calls `toggleTheme()` from `ThemeContext`; renders `Sun` when theme is `dark`, `Moon` when `light`; icon size 18px; no background, `text-(--color-secondary)` default
- [x] 7.6 Add mobile placeholder — hide desktop link list at `< 640px` (`hidden sm:flex`); no hamburger yet (deferred to POR-165); `Menu` icon import from lucide-react may be left as a `{/* TODO POR-165 */}` comment

## 8. Footer Component

- [x] 8.1 Create `components/layout/Footer.tsx` (server component) — accepts `{ email, linkedin }` props; renders GitHub, LinkedIn, Email icon links (`Github`, `Linkedin`, `Mail` from lucide-react, size 18px) that change to `text-(--color-accent)` on hover; renders "© 2025 Abhilash" copyright left-aligned
- [x] 8.2 Wire Footer into `app/layout.tsx` — call `getContactInfo()` in the layout (Server Component context), pass `email` and `linkedin` to `<Footer>`

## 9. PageHeader Component

- [x] 9.1 Create `components/ui/PageHeader.tsx` (server component) — accepts `{ label, subtitle, intro? }` props; renders `<label>` in DM Mono with accent colour, `<h1>` in heading scale, optional `<p>` intro
- [x] 9.2 Add SVG grid-line background — inline `style` with `backgroundImage: "url(\"data:image/svg+xml,...\")"` for 60×60px grid; `maskImage` radial-gradient `80% × 60%` ellipse so edges dissolve toward content; grid line colour `--color-surface-alt`

## 10. Root Layout

- [x] 10.1 Update `app/layout.tsx` — export `metadata` with title template `"%s — Abhilash Venkatesh"` and default title using `identity.json`; include DM Sans + DM Mono Google Font links; include anti-flash script; wrap body in `<ThemeProvider>`; render `<Nav>` and `<Footer>` around `{children}`
- [x] 10.2 Create minimal `app/page.tsx` (placeholder home page SSG) — renders an `<h1>` "Abhilash Venkatesh" so the build has a root route; will be replaced by POR-166
- [x] 10.3 Run `npm run build` and confirm zero errors — shell must build successfully before any other card

## 11. CI Pipeline

- [x] 11.1 Create `.github/workflows/ci.yml` — trigger on `push` and `pull_request`; single job `check` on `ubuntu-latest` with Node 20 and `npm` cache; steps: checkout, setup-node, `npm ci`, `npm run typecheck`, `npm run lint`, `npm run design-lint`, `npm run validate-content`, `npm run build`

## 12. Vercel Deployment

- [ ] 12.1 Create Vercel project via `vercel link` (or Vercel dashboard) linked to the GitHub repo; project name `abhilash-portfolio`; framework preset: Next.js; root directory: `.`
- [ ] 12.2 Confirm push to `main` triggers a production build in Vercel dashboard and production URL resolves with the placeholder home page
- [ ] 12.3 Open a test PR branch; confirm Vercel posts a preview URL comment on the PR

## 13. Tests

- [x] 13.1 Set up test runner — install `@testing-library/react`, `@testing-library/jest-dom`, `jest`, `jest-environment-jsdom`, `ts-jest` (or Vitest with `@vitejs/plugin-react`) and configure for Next.js App Router
- [x] 13.2 Write `__tests__/Nav.test.tsx` — renders `<Nav email="abhilashfeb30@gmail.com" />` wrapped in a `MemoryRouter`-equivalent; asserts: wordmark link href is `/`; "Hire me" href contains `mailto:`; all 6 nav links are present in the DOM; theme toggle button is present
- [x] 13.3 Write `__tests__/Footer.test.tsx` — renders `<Footer email="abhilashfeb30@gmail.com" linkedin="https://..." />`; asserts: GitHub link is present; LinkedIn link is present; Email link href contains `mailto:`; copyright text "© 2025 Abhilash" is in the DOM
- [x] 13.4 Write `__tests__/ThemeProvider.test.tsx` — renders provider with a child button that calls `toggleTheme`; asserts `data-theme` toggles between `light` and `dark` on `document.documentElement`
- [x] 13.5 Write `__tests__/PageHeader.test.tsx` — renders `<PageHeader label="About me" subtitle="11+ years" />`; asserts label text, subtitle text are present in DOM
- [x] 13.6 Run `npm test` and confirm all tests pass

## 14. DOM / Visual Verification

- [x] 14.1 Run `npm run dev`; open `localhost:3000` in Chrome; confirm nav bar is fixed (sticky at top while scrolling), wordmark is present, all 6 page links visible, "Hire me" button and theme toggle icon visible
- [ ] 14.2 Click theme toggle; confirm all colours switch immediately (background, text, accent); refresh page; confirm dark preference persists (no flash)
- [ ] 14.3 Scroll down on a tall page; confirm nav background shows frosted-glass blur; scroll back to top; confirm blur removed
- [ ] 14.4 Resize browser to < 640px; confirm desktop nav links are hidden; no layout overflow or horizontal scrollbar
- [x] 14.5 Verify Footer is visible on the placeholder home page with GitHub, LinkedIn, Email icons and copyright text
- [ ] 14.6 Confirm "Hire me" button click opens email client pre-addressed to `abhilashfeb30@gmail.com`

## 15. Quality Gates

- [x] 15.1 Run `npm run typecheck` and confirm zero errors
- [x] 15.2 Run `npm run lint` and confirm zero errors
- [x] 15.3 Run `npm run validate-content` and confirm exit code 0
- [x] 15.4 Run `npm run build` and confirm zero errors
- [ ] 15.5 Run `openspec validate site-shell-nav-theme-footer --type change --strict` and confirm the change is valid
