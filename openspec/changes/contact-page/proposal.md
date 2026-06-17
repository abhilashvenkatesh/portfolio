---
linear_story_id: POR-176
linear_story_url: https://linear.app/abhilash-projects/issue/POR-176/contact-page-header-opening-statement-cards-availability-banner
finished_at: 2026-06-17T00:20:00Z
---

# Proposal: contact-page

## Linear Issue
POR-176 — Contact page — header, opening statement, cards, availability banner

## What
Build the `/contact` page: a focused, action-oriented page that gives visitors clear, clickable ways to reach Abhilash.

Four sections:
1. **Page header** — `PageHeader` with label "Get in touch" / subtitle "Let's work together" and the standard grid-line background pattern fading toward content
2. **Opening statement** — centred paragraph explaining current availability and openness to interesting work
3. **Contact method cards** — three stacked cards (Email, LinkedIn, Phone) each with icon, label, value, description, and external-link arrow; hover lifts + accent border + tinted background
4. **Availability banner** — configurable status strip with pulsing green dot driven by `content/contact.json`

## Why
Phase 5 (Contact & Chat) of the portfolio. The contact page is the conversion endpoint for every recruiter, collaborator, and client who lands on the site. Without it, visitors who want to reach Abhilash have no structured path — only the footer links.

## Scope
- New route `app/contact/page.tsx` (SSG, Server Component)
- New `components/contact/` directory: `ContactCard.tsx`, `AvailabilityBanner.tsx`
- `content/contact.json` already exists with `email`, `linkedin`, `phone`, `availability.show`, `availability.message`; extend with `phone` value and per-card `description` fields if not present
- `lib/content.ts` already exports `getContactInfo()` — no new loader needed
- Hover states via Tailwind group-hover; no JS event handlers in RSC
- Availability banner conditionally rendered based on `availability.show`

## Out of scope
- Contact form / server action
- Sending email server-side
- Any new content type or CMS integration

## Acceptance criteria (from REQUIREMENTS.md)
- CONTACT-1: Header label "Get in touch", subtitle "Let's work together"
- CONTACT-2: Opening statement paragraph (exact text)
- CONTACT-3: Three cards — Email, LinkedIn, Phone — with icon, label, value, description, external-link arrow; clicking opens correct action
- CONTACT-4: Hover — accent border, accent-tinted background, translateY(-2px)
- CONTACT-5: Pulsing green dot + availability text from `contact.json`; banner visibility controlled by `show` flag
