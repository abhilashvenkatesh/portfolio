# Portfolio Epics

Specs derived from `REQUIREMENTS.md`. Pure intent — no framework names, no file paths, no component names. Suitable for OpenSpec / AI-assisted implementation.

---

## Epic 1: Global Navigation Bar with Theme Toggle

**Labels:** `global`, `navigation`, `phase:plan`

As a portfolio visitor, I want a persistent navigation bar at the top of every page so I can move between sections easily and switch between light and dark themes.

The nav should show the site owner's name on the left and page links on the right. A theme toggle button should switch between light and dark mode. The active page link should be visually distinguished. The chosen theme should persist across page reloads.

Refer to design prototype: `docs/design/index.html` (header section).

**Acceptance Criteria:**
- [ ] Nav bar appears on every page
- [ ] Links to: Home, About, Projects, Experience, Blog, Contact
- [ ] Active page link is visually highlighted
- [ ] Theme toggle button switches between light and dark mode
- [ ] Selected theme persists after page reload
- [ ] Nav bar remains visible when scrolling (sticky/fixed)

---

## Epic 2: Mobile-Responsive Layout with Hamburger Menu

**Labels:** `global`, `responsive`, `phase:plan`

As a mobile visitor, I want the portfolio to work well on small screens so I can browse comfortably on my phone.

On screens narrower than a tablet, the desktop navigation links should collapse into a hamburger menu icon. Tapping the icon opens a full-width dropdown or drawer with all nav links. All page content should reflow into a single column. Text, images, and cards should remain legible without horizontal scrolling.

**Acceptance Criteria:**
- [ ] Desktop nav collapses into hamburger icon on mobile viewports
- [ ] Tapping hamburger opens/closes nav menu
- [ ] All pages readable on 375px wide screen without horizontal scroll
- [ ] Tapping a nav link closes the mobile menu
- [ ] Touch targets are large enough (≥44px)

---

## Epic 3: Global Footer with Social Links

**Labels:** `global`, `footer`, `phase:plan`

As a portfolio visitor, I want a footer at the bottom of every page so I can find social links and copyright information.

The footer should show copyright text with the current year and Abhilash's name. It should include icon links to GitHub, LinkedIn, and email. The footer should appear consistently across all pages.

**Acceptance Criteria:**
- [ ] Footer appears on all pages
- [ ] Displays copyright with current year
- [ ] Contains clickable links to GitHub, LinkedIn, and email
- [ ] Email link opens mail client
- [ ] Social links open in new tab

---

## Epic 4: Scroll-Triggered Entry Animations

**Labels:** `global`, `animation`, `phase:plan`

As a portfolio visitor, I want content to animate into view as I scroll down the page so the experience feels polished and engaging.

Sections and cards below the fold should start invisible and fade/slide in when they enter the viewport. Animations should not replay on scroll-back. The effect should be subtle — enhancing readability, not distracting.

**Acceptance Criteria:**
- [ ] Content below the fold is hidden on initial load
- [ ] Elements animate in when scrolled into view
- [ ] Animation does not re-trigger when scrolling back up
- [ ] Animation works on all pages
- [ ] No layout shift caused by the animation

---

## Epic 5: Home Page – Hero Section with Stats and CTAs

**Labels:** `page:home`, `phase:plan`

As a first-time visitor, I want to immediately understand who Abhilash is and what he does so I can decide whether to explore further.

The page should open with a full-viewport-height hero showing his name, title ("Lead Application Developer"), and a short tagline. Two call-to-action buttons should invite visitors to view his work ("See my projects") and get in touch ("Contact me"). Below the name/tagline, three key stats should be displayed: 11+ years of experience, 30+ microservices built, worked across 3 countries.

Refer to design prototype: `docs/design/index.html`.

**Acceptance Criteria:**
- [ ] Hero occupies full viewport height on load
- [ ] Displays full name, title, and tagline
- [ ] Two CTAs visible: one to Projects page, one to Contact page
- [ ] Three stats displayed: years of experience, microservices built, countries worked in
- [ ] Responsive on mobile (stats stack vertically)

---

## Epic 6: About Page – Bio, Profile Photo, and Skills Grid

**Labels:** `page:about`, `phase:plan`

As a recruiter or collaborator, I want to learn about Abhilash's background, personality, and technical skills so I can assess whether he's a good fit.

The page should show a profile photo alongside a three-paragraph bio describing his career journey, values, and working style. Below the bio, skills should be displayed grouped by category: Languages, Frameworks, Data & Messaging, Cloud & DevOps. Each skill should appear as a labelled tag or badge.

A downloadable résumé button should link to a PDF.

Refer to design prototype: `docs/design/about.html`.

**Acceptance Criteria:**
- [ ] Profile photo displayed
- [ ] Three paragraphs of bio text
- [ ] Skills shown grouped by category with visible category headings
- [ ] Each skill displayed as a tag/badge
- [ ] "Download Résumé" button links to a PDF file
- [ ] PDF opens or downloads correctly

---

## Epic 7: Projects Page – Showcase Grid with Tech Stack Filter

**Labels:** `page:projects`, `phase:plan`

As a portfolio visitor, I want to see a visual grid of Abhilash's featured projects so I can quickly browse his work. I also want to filter by technology so I can find projects relevant to my stack.

Each project card should show: the project name, a brief problem statement, the measurable impact, the tech stack as tags, and links to the live demo and source code (where available). The grid should be filterable by tech stack tag — clicking a tag shows only matching projects.

Four projects to include: MCL Insurance Portal, Australia Post Event Platform, Rapido Platform Core, Enterprise Learning Platform.

Refer to design prototype: `docs/design/projects.html`.

**Acceptance Criteria:**
- [ ] Grid displays all 4 projects
- [ ] Each card shows: name, problem statement, impact, tech tags, links
- [ ] Clicking a tag filters the grid to matching projects
- [ ] "All" filter restores full grid
- [ ] Links to live demo and/or source code present per project
- [ ] Grid is responsive (2-col desktop, 1-col mobile)

---

## Epic 8: Experience Page – Career Timeline

**Labels:** `page:experience`, `phase:plan`

As a recruiter, I want to see Abhilash's career history in chronological order so I can understand his progression and the companies he has worked for.

The page should display a vertical timeline with one entry per role. Each entry should show: company name, job title, employment dates, location, and 2–4 bullet points describing responsibilities and achievements. The four roles are (most recent first): Fabric Group, Braves Technologies, Rapido, ThoughtWorks.

Refer to design prototype: `docs/design/experience.html`.

**Acceptance Criteria:**
- [ ] Timeline shows all 4 roles in reverse-chronological order
- [ ] Each entry shows: company, title, dates, location, bullet points
- [ ] Visual connector (line/dots) links entries
- [ ] Responsive on mobile (timeline adapts to single column)

---

## Epic 9: Blog Index – Post Listing with Tag Filter

**Labels:** `page:blog`, `phase:plan`

As a reader, I want to browse Abhilash's blog posts and filter by topic so I can find articles relevant to my interests.

The blog index should show a list or grid of post cards. Each card should display: title, publication date, 1-sentence excerpt, and tags. Clicking a tag filters the list to posts with that tag. Clicking a card navigates to the full post.

Four initial posts covering: distributed systems, event-driven architecture, microservices, and career/engineering topics.

Refer to design prototype: `docs/design/blog.html`.

**Acceptance Criteria:**
- [ ] All blog posts listed on the index
- [ ] Each card shows: title, date, excerpt, tags
- [ ] Clicking a tag filters to matching posts
- [ ] Clicking a card opens the full post
- [ ] "All" state shows all posts
- [ ] Responsive on mobile

---

## Epic 10: Blog Post Page – Individual Post Viewer with Author Card

**Labels:** `page:blog`, `phase:plan`

As a reader, I want to read a full blog post with proper formatting so I can consume long-form technical content comfortably.

The post page should display: title, publication date, tags, full rendered body (headings, code blocks, lists, inline code), an author card with photo and short bio, and a "related posts" section showing 2–3 other posts with similar tags.

Refer to design prototype: `docs/design/blog-post.html`.

**Acceptance Criteria:**
- [ ] Post title, date, and tags shown at top
- [ ] Body content rendered from Markdown (headings, lists, code blocks)
- [ ] Code blocks visually distinct with monospace font
- [ ] Author card shows photo, name, and short bio
- [ ] Related posts section shows 2–3 cards linking to other posts
- [ ] Readable line width (max ~70 chars) for body text

---

## Epic 11: Contact Page – Contact Information and Availability Status

**Labels:** `page:contact`, `phase:plan`

As someone interested in working with Abhilash, I want to know how to reach him and whether he is currently available so I can decide whether to reach out.

The page should display his contact email as a clickable mailto link, his LinkedIn profile link, and his GitHub profile link. It should also show a brief availability status (e.g., "Open to new opportunities" or "Currently unavailable").

Refer to design prototype: `docs/design/contact.html`.

**Acceptance Criteria:**
- [ ] Email address shown as a clickable mailto link
- [ ] LinkedIn link opens his profile in new tab
- [ ] GitHub link opens his profile in new tab
- [ ] Availability status message displayed
- [ ] Page works correctly on mobile

---

## Epic 12: CI/CD Pipeline with Vercel Deployment

**Labels:** `infra`, `phase:plan`

As a developer, I want automated checks and deployments so every push to the main branch is validated and deployed to production without manual steps.

On every pull request: run type checking and build validation. On merge to main: deploy to production on Vercel. PRs should receive a preview deployment URL as a comment. Custom domain (abhilash.dev) should point to the production deployment.

**Acceptance Criteria:**
- [ ] Push to any branch triggers type check + build
- [ ] Failed type check or build blocks merge
- [ ] Merge to main triggers Vercel production deployment
- [ ] PRs get a preview deployment URL
- [ ] Custom domain resolves to production site

---

## Summary

| # | Epic | Labels |
|---|------|--------|
| 1 | Global Navigation Bar with Theme Toggle | global, navigation |
| 2 | Mobile-Responsive Layout with Hamburger Menu | global, responsive |
| 3 | Global Footer with Social Links | global, footer |
| 4 | Scroll-Triggered Entry Animations | global, animation |
| 5 | Home Page – Hero Section with Stats and CTAs | page:home |
| 6 | About Page – Bio, Profile Photo, and Skills Grid | page:about |
| 7 | Projects Page – Showcase Grid with Tech Stack Filter | page:projects |
| 8 | Experience Page – Career Timeline | page:experience |
| 9 | Blog Index – Post Listing with Tag Filter | page:blog |
| 10 | Blog Post Page – Individual Post Viewer with Author Card | page:blog |
| 11 | Contact Page – Contact Information and Availability Status | page:contact |
| 12 | CI/CD Pipeline with Vercel Deployment | infra |
