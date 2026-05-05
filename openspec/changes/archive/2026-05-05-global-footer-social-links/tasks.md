## 1. Footer Component

- [x] 1.1 Create `src/components/layout/Footer.astro`
- [x] 1.2 Add copyright text: `© {new Date().getFullYear()} Abhilash Venkatesh`
- [x] 1.3 Add GitHub icon link (inline SVG, `target="_blank" rel="noopener noreferrer"`)
- [x] 1.4 Add LinkedIn icon link (inline SVG, `target="_blank" rel="noopener noreferrer"`)
- [x] 1.5 Add email icon link (`href="mailto:abhilashfeb30@gmail.com"`, envelope SVG)
- [x] 1.6 Apply Tailwind dark mode styles (`dark:` variants for bg, text, hover)

## 2. Layout Integration

- [x] 2.1 Import `Footer` in `Base.astro` and mount below `</main>`
- [x] 2.2 Add `flex flex-col` to `<body>` and `flex-1` to `<main>` for sticky footer behaviour

## 3. Verification

- [x] 3.1 Confirm footer visible on all six pages (Home, About, Projects, Experience, Blog, Contact)
- [x] 3.2 Confirm footer sticks to bottom on short pages (check home placeholder page)
- [x] 3.3 Confirm GitHub and LinkedIn links open in new tab
- [x] 3.4 Confirm email link opens mail client with correct address
- [x] 3.5 Confirm dark mode renders correctly (toggle theme, check footer)
- [x] 3.6 Run `npx astro check` — zero type errors
