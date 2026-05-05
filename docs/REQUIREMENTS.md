# Portfolio Website — Requirements Document

## 1. Overview

Personal portfolio website for Abhilash, a Lead Application Developer / Backend & Product Engineer with 11+ years of experience. The site presents professional identity, showcases projects, documents work history, hosts a technical blog, and provides contact information.

---

## 2. Pages & Scope

The site comprises six pages:

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing and first impression |
| About | `/about` | Personal bio, skills inventory |
| Projects | `/projects` | Featured project showcase |
| Experience | `/experience` | Work history timeline |
| Blog | `/blog` | Technical writing index |
| Blog Post | `/blog-post?id=<slug>` | Individual article reader |
| Contact | `/contact` | Contact methods and availability |

---

## 3. Global Requirements

### 3.1 Navigation
- Persistent top navigation bar on all pages, fixed to viewport top
- Nav links: Projects, About, Experience, Blog, Contact
- Active page link is visually distinguished
- "Hire me" shortcut link (`mailto:`) present in nav
- Logo/name in nav links back to home page
- Light/dark theme toggle button in nav; preference persisted to `localStorage`
- Nav must be responsive; mobile menu required

### 3.2 Footer
- Present on all pages
- Displays copyright year and owner name
- Social links: GitHub, LinkedIn, Email

### 3.3 Theme
- Light and dark mode supported
- Selected theme stored in `localStorage` under key `portfolio-theme`
- Default: system preference or light

### 3.4 Responsive Layout
- All pages must be usable at mobile, tablet, and desktop widths
- No horizontal scrolling on any supported viewport

### 3.5 Scroll Behavior
- Elements animate in on scroll (fade + slide up) as they enter the viewport
- Uses `IntersectionObserver` for scroll detection

---

## 4. Page Requirements

### 4.1 Home Page

**Hero Section**
- Full-viewport-height hero section
- Displays: name, professional tagline, brief descriptor (role, years of experience, current employer and location)
- Two CTA buttons: "View Projects" (→ projects page) and "Contact me" (→ contact page)
- Three key stats displayed: years of experience (11+), microservices shipped (30+), countries worked in (3)
- Scroll indicator at bottom of hero

---

### 4.2 About Page

**Bio Section**
- Three paragraphs of personal/professional narrative
- Profile photo placeholder (actual photo to be supplied)
- "Download résumé" primary CTA button (links to résumé file)
- Secondary link to Blog page

**Skills Section**
- Grouped skills inventory displayed as tags, organized by category:
  - **Languages:** Java, Node.js, TypeScript, JavaScript, Ruby, Python
  - **Frameworks:** Spring Boot, Vert.x, React, Vue.js, Express, Dropwizard, RxJava
  - **Data & Messaging:** MySQL, MongoDB, Elasticsearch, Redis, Kafka, DynamoDB, Cloud Spanner
  - **Cloud & DevOps:** AWS, GCP, Docker, Jenkins, Ansible, CI/CD, Microservices

---

### 4.3 Projects Page

**Project List**
- Displays all featured projects as cards in a responsive grid
- Each project card must show:
  - Project year (as a tag)
  - Project name
  - Tagline / one-liner description
  - Problem statement (labeled "Problem")
  - Impact statement (labeled "Impact") — quantified where possible
  - Technology stack as tags
  - GitHub link
  - Live demo link (optional; omit if not available)

**Projects data (initial content):**

| # | Name | Year | Stack |
|---|------|------|-------|
| 1 | MCL Insurance Portal | 2023 | AWS Lambda, DynamoDB, SQS, Step Functions, CloudFront, API Gateway, Splunk |
| 2 | Australia Post Event Platform | 2022 | Java, Spring Boot, GCP, Cloud Spanner, Redis, Vue.js |
| 3 | Rapido Platform Core | 2020 | Java, Vert.x, Node.js, Kafka, Elasticsearch, Redis |
| 4 | Enterprise Learning Platform | 2016 | Java, Node.js, MongoDB, Kafka, Elasticsearch, Ember.js, OrientDB |

---

### 4.4 Experience Page

**Timeline**
- Chronological work history displayed as a vertical timeline
- Most recent role visually distinguished (highlighted marker)
- Each entry shows:
  - Job title
  - Company name
  - Employment period (e.g. "Aug 2023 — Present")
  - Bullet-point responsibilities and achievements

**Work History (initial content):**

| Role | Company | Period |
|------|---------|--------|
| Lead Application Developer | Fabric Group | Aug 2023 — Present |
| Senior Consultant / Senior Software Engineer | Braves Technologies | Aug 2022 — Jul 2023 |
| Lead Consultant / Software Architect | Rapido (Roppen Transportation) | Dec 2019 — Aug 2022 |
| Senior Consultant / Senior Software Engineer | ThoughtWorks | Aug 2014 — Nov 2019 |

**Résumé CTA**
- Banner at end of timeline with "Download résumé" button linking to résumé file

---

### 4.5 Blog Index Page

**Header**
- Page title: "Writing"
- Subtitle: "Thoughts on engineering"
- Brief description paragraph

**Tag Filter**
- Filter bar with "All" and one button per distinct tag present in blog data
- Clicking a tag filters the list to matching posts; "All" resets filter
- Only one tag active at a time

**Post List**
- Filtered posts rendered as a list/grid of cards
- Each card links to the individual blog post page (`/blog-post?id=<slug>`)
- Each card shows:
  - Post tag (category)
  - Publication date
  - Estimated read time
  - Post title
  - Summary (one or two sentences)
  - "Read article" link

**Initial blog posts:**

| Slug | Title | Tag | Date | Read Time |
|------|-------|-----|------|-----------|
| `why-boring-systems-win` | Why Boring Systems Win | Systems Design | April 18, 2025 | 6 min |
| `go-concurrency-patterns` | Go Concurrency Patterns I Actually Use | Go | March 5, 2025 | 8 min |
| `postgres-performance-tuning` | PostgreSQL Performance Tuning: A Practical Checklist | PostgreSQL | January 22, 2025 | 10 min |
| `api-design-lessons` | API Design Lessons From 5 Years of Breaking Things | API Design | December 10, 2024 | 7 min |

---

### 4.6 Blog Post Page

**Routing**
- Accepts `?id=<slug>` query parameter
- If slug not found, display "Post not found" message with link back to blog index
- Page `<title>` updated dynamically to `<post title> — Abhilash`

**Post Content**
- Back link to blog index ("All posts")
- Post metadata: tag, date, read time
- Post title (large heading)
- Post summary paragraph
- Horizontal rule separator
- Full post body rendered from Markdown source

**Markdown Rendering**
- Supports: `##` headings, paragraphs, unordered lists (`-`), code blocks (fenced with triple backticks), inline code, bold (`**`), italic (`*`), blockquotes (`>`)
- No external Markdown library required; custom renderer acceptable

**Author Card**
- Shown below post body
- Displays: author name (Abhilash), short bio, profile photo

**Related Posts**
- Up to 2 other posts shown below author card
- Each shows: title, date, read time, link to that post

---

### 4.7 Contact Page

**Intro**
- Short availability statement ("open to full-time roles and select consulting engagements")

**Contact Methods**
Three contact entries, each with: icon, label, value, description, external link:

| Label | Value | Description |
|-------|-------|-------------|
| Email | abhilashfeb30@gmail.com | Best for work enquiries and opportunities |
| LinkedIn | linkedin.com/in/abhilash | Professional history and recommendations |
| GitHub | github.com/abhilash | Open-source work and personal projects |

**Availability Banner**
- Status indicator showing current availability: "Currently available — open to full-time and contract roles starting immediately."

---

## 5. Content Management

- All structured data (projects, experience, blog posts, skills) is defined in a single shared data file
- No CMS or database required for v1; data is hardcoded in source
- Blog post body content is stored as a Markdown string within the data file

---

## 6. Non-Functional Requirements

| Requirement | Constraint |
|-------------|-----------|
| Performance | No heavy client-side frameworks required at runtime beyond what is necessary |
| Accessibility | All interactive elements must have accessible labels; theme toggle must have `aria-label` |
| SEO | Each page must have a meaningful `<title>` tag |
| No backend | Site must be fully static; no server-side rendering or API calls required |
| Browser support | Modern evergreen browsers (Chrome, Firefox, Safari, Edge) |
| Résumé download | Must link to a downloadable résumé file (PDF); file path TBD |
| Social links | GitHub, LinkedIn URLs to be updated with real profile URLs before launch |
| Email | Contact email: abhilashfeb30@gmail.com |

---

## 7. Out of Scope (v1)

- Contact form with server-side submission
- CMS or admin interface for editing content
- Search functionality
- Comments on blog posts
- Analytics integration
- Sitemap / robots.txt
- Internationalisation
