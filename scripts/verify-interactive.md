# Interactive Browser Verification Checklist

Run `npm run dev`, open http://localhost:3000 in Chrome/Edge, and work through each check.

## 14.1 — Nav layout

- [ ] Nav bar sticks to top of viewport while scrolling
- [ ] "abhilash" wordmark visible, links to /
- [ ] 6 page links visible: Projects, About, Experience, Blog, Chat, Contact
- [ ] "Hire me" button visible (accent colour, right side)
- [ ] Theme toggle icon (moon) visible (right side, next to Hire me)

## 14.2 — Theme toggle & persistence

- [ ] Click moon icon → all colours switch to dark (background, text, accent)
- [ ] Refresh page → dark mode persists without flash
- [ ] Click sun icon → returns to light
- [ ] Refresh → light persists without flash

## 14.3 — Nav scroll blur

- [ ] Scroll past 40px → nav background becomes frosted glass (backdrop-blur)
- [ ] Scroll back to top → blur removed, nav returns to plain surface colour

## 14.4 — Mobile layout (< 640px)

- [ ] Resize browser below 640px wide
- [ ] Desktop nav links disappear (hidden sm:flex)
- [ ] No horizontal scrollbar, no layout overflow
- [ ] "Hire me" + theme toggle still visible

## 14.5 — Footer

- [ ] Footer visible at bottom of home page
- [ ] GitHub icon link present
- [ ] LinkedIn icon link present
- [ ] Email icon link present
- [ ] "© 2025 Abhilash" copyright text visible

## 14.6 — Hire me CTA

- [ ] Click "Hire me" button → email client opens pre-addressed to abhilashfeb30@gmail.com
