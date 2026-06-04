# Documentation Index — Abhilash Portfolio

Entry point for any agent working on this project. Read this first, then go to the relevant doc.

---

## Files

| File | Purpose | Read when… |
|------|---------|-----------|
| **AGENTS.md** | This index | Starting any task |
| **ARCHITECTURE.md** | Tech decisions: stack (Next.js 15 / TypeScript / Tailwind v4 / WebLLM), project file structure, data schemas (`lib/types.ts`), content loaders, routing, theme system, chat state machine, CI/CD pipeline | Implementing any feature; setting up the project; adding a new page or component |
| **REQUIREMENTS.md** | Full user stories with acceptance criteria, one story per requirement ID (NAV-1, HOME-3, CHAT-8, etc.) — visitor-facing perspective | Verifying what a feature must do; checking acceptance criteria for a story ID |
| **EPICS.md** | Epic summaries with story tables, observed interactions from HTML prototypes, implied requirements, and actual content data (4 experience roles, 4 blog posts, contact details, etc.) | Understanding interaction details; finding the actual content data; checking implied requirements not captured in user stories |
| **DESIGN.md** | Complete design system: color tokens (light/dark), typography scale (DM Sans + DM Mono), spacing, border-radius scale, every component's visual spec, do's and don'ts | Writing any CSS or Tailwind classes; implementing a component; checking allowed colors/radii/weights |
| **design/** | HTML+CSS prototypes for all 8 pages — the visual source of truth | Checking exact visual behavior; resolving ambiguity between docs and prototype |

---

## Story ID Format

Requirements use prefixed IDs. Find acceptance criteria in `REQUIREMENTS.md`, interaction details in `EPICS.md`:

| Prefix | Epic |
|--------|------|
| `NAV-*` | Global navigation & theme |
| `HOME-*` | Home page / hero |
| `ABOUT-*` | About page |
| `PROJ-*` | Projects page |
| `EXP-*` | Experience page |
| `BLOG-*` | Blog listing page |
| `POST-*` | Blog post page |
| `CONTACT-*` | Contact page |
| `CHAT-*` | AI chat page |
| `DATA-*` | Content data externalization |
| `XC-*` | Cross-cutting (animations, responsive, résumé download) |

---

## Content Data Files (from ARCHITECTURE.md)

All content lives in `content/` as human-editable JSON/MDX — never hardcoded in components:

| File | Powers |
|------|--------|
| `content/identity.json` | Name, title, employer, location (used everywhere) |
| `content/home.json` | Hero badge, headline, subheading, bio, 3 stats, 4 suggestion chips |
| `content/projects.json` | Project cards on Projects page |
| `content/skills.json` | Skill categories on About page |
| `content/experience.json` | Timeline entries on Experience page |
| `content/contact.json` | Email, LinkedIn, phone, availability status |
| `content/about.json` | 3 bio paragraphs on About page |
| `content/chat-chips.json` | 6 suggestion chips on Chat page |
| `content/blog/*.mdx` | Blog posts (frontmatter + MDX body) |

---

## Key Constraints (enforce these in any implementation)

- **DM Mono** only for: logotype, tags, labels, metadata, code, stat labels — never body copy
- **Font weight max: 600** (`font-semibold`) — never 700+
- **Border radius**: 4 / 6 / 8 / 10 / 12 / 14 / 100px only. `12px` for all content cards
- **One accent role per component** — not fill + border + text simultaneously
- **No box shadows in dark mode** — depth via background layering only
- **Chat page**: WebGPU required; graceful fallback if `navigator.gpu` is undefined
- **All pages**: SSG (static generation at build time) except chat page (client-only)
- **Content**: all reads happen at build time in Server Components — no runtime file I/O
