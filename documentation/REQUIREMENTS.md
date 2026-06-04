# Portfolio Website — Visitor-Facing Requirements

> **Design source:** `documentation/design/` — HTML prototypes for all 8 pages:
> `index.html`, `about.html`, `projects.html`, `experience.html`, `blog.html`,
> `blog-post.html`, `contact.html`, `chat.html`

---

## EPIC 1 — Global Navigation & Theme

**Goal:** Give every visitor a consistent, always-accessible way to move around the site and personalise their viewing experience.

### NAV-1 — Persistent navigation bar
As a visitor, I want a navigation bar visible on every page so that I can jump to any section without scrolling back to the top.
- The visitor should see a fixed navigation bar that stays at the top of the screen while scrolling.
- The bar should show links to: Projects, About, Experience, Blog, Chat, Contact.
- The currently active page's link should be visually distinguished (highlighted colour, different weight).

### NAV-2 — Logo home link
As a visitor, I want to click the site logo/name to return to the home page.
- Clicking "abhilash" in the top-left of the nav should take the visitor to the home page.

### NAV-3 — "Hire me" call-to-action in nav
As a visitor (recruiter/employer), I want a prominent contact shortcut in the nav so I can reach Abhilash immediately.
- The nav should contain a "Hire me" button that opens the visitor's email client pre-addressed to Abhilash's email.
- On hover, the button should show a subtle background fill.

### NAV-4 — Light / dark theme toggle
As a visitor, I want to switch between light and dark colour themes so the site is comfortable in any lighting condition.
- A toggle button (sun/moon icon) should appear in the nav on every page.
- Clicking it should instantly switch all page colours between light and dark modes.
- The visitor's preference should be remembered across page navigations within the session.

### NAV-5 — Nav blur on scroll
As a visitor, I want the navigation background to feel distinct from the page content when I scroll.
- After scrolling down, the nav background should apply a frosted-glass / blur effect.
- The nav border-bottom should remain visible to separate it from content.

### NAV-6 — Mobile navigation (implied)
As a visitor on a mobile device, I want to access all navigation links without them overflowing the screen.
- On small screens, the desktop nav links should collapse into a mobile-friendly menu (hamburger or drawer).
- All the same links should be accessible: Projects, About, Experience, Blog, Chat, Contact, Hire me, Theme toggle.

### NAV-7 — Footer social links
As a visitor, I want quick access to Abhilash's external profiles from the footer of any page.
- Every page should show a footer with links to GitHub, LinkedIn, and Email.
- Each link should change colour on hover.
- A copyright line "© 2025 Abhilash" should appear on the left.

---

## EPIC 2 — Home Page (Hero)

**Goal:** Make a strong first impression and immediately direct visitors towards the most relevant content.

### HOME-1 — Hero headline and tagline
As a visitor landing on the site for the first time, I want to instantly understand who Abhilash is and what he does.
- The visitor should see a large headline: "Hi, I'm Abhilash." with the subheading "I architect systems that scale to millions."
- A short description should appear below: "Lead Application Developer with 11+ years building distributed systems, cloud infrastructure, and engineering teams across Australia and India. Currently at Fabric Group, Melbourne."
- A role badge ("Lead Application Developer · Melbourne") should appear above the headline.

### HOME-2 — Stats bar
As a visitor, I want to see a quick summary of Abhilash's experience at a glance.
- Three headline statistics should appear below the description: "11+ years experience", "30+ microservices shipped", "3 countries worked in".

### HOME-3 — AI chat launcher on home page
As a visitor, I want to ask a quick question about Abhilash directly from the home page.
- A chat input box with placeholder text "Ask me anything about Abhilash…" should appear on the hero.
- Submitting a question (Enter key or send button) should navigate to the chat page with the question pre-filled and already sent.
- The send button should dim slightly on hover.

### HOME-4 — Suggested question chips
As a visitor who doesn't know what to ask, I want prompts to guide me.
- Below the chat input, four suggestion chips should appear: "What are Abhilash's top skills?", "Tell me about his role at Rapido", "Which projects has he led?", "How can I get in touch?"
- Clicking a chip should navigate to the chat page with that question sent automatically.
- Each chip should highlight with an accent colour on hover.

### HOME-5 — "Or browse" navigation hints
As a visitor who prefers browsing to chatting, I want direct links to the main content sections.
- Below the suggestion chips, a line of text should offer links: "or browse · projects · experience · contact".
- Each link should be styled in the accent colour and navigate to the respective page.

### HOME-6 — Scroll indicator
As a visitor, I want to know there is more content below the hero.
- A "scroll" label and animated downward-scrolling indicator (mouse icon with moving dot) should appear at the bottom of the hero.
- The animation should loop continuously.

### HOME-7 — Hero background texture
As a visitor, I want the hero to feel visually refined, not blank.
- A subtle grid line pattern and a soft radial glow should appear behind the hero content as decorative elements.
- These should not obscure or compete with the text.

---

## EPIC 3 — About Page

**Goal:** Let visitors learn who Abhilash is, what he values, and what technologies he works with.

### ABOUT-1 — Page header
As a visitor, I want to know I'm on the About page immediately.
- A page header with the label "About me" and subtitle "11+ years building systems across 3 countries and 4 industries." should appear at the top.

### ABOUT-2 — Personal bio
As a visitor, I want to read a brief personal statement about Abhilash's background and values.
- Three paragraphs of biographical text should appear, covering: his location and career arc, notable employers (ThoughtWorks, Rapido, Australia Post, Fabric Group), and his engineering philosophy.

### ABOUT-3 — Profile photo placeholder
As a visitor, I want to see what Abhilash looks like.
- A photo area (square, rounded corners) should appear beside the bio text.
- *(The design currently shows a placeholder silhouette — the final site should show a real photo.)*

### ABOUT-4 — Download résumé button
As a visitor (recruiter/hiring manager), I want to download Abhilash's résumé directly from the About page.
- A prominent "Download résumé" button should appear below the bio.
- Clicking it should download a PDF résumé file to the visitor's device.
- On hover, the button should dim slightly.

### ABOUT-5 — Blog cross-link
As a visitor on the About page, I want an easy way to discover Abhilash's writing.
- A secondary "Blog →" link should appear alongside the résumé button.
- On hover, the link should adopt the accent colour and border.
- Clicking it should navigate to the Blog page.

### ABOUT-6 — Skills section
As a visitor, I want to see a structured overview of Abhilash's technical skills grouped by category.
- A "What I work with" section header should appear below the bio.
- Skills should be grouped into four categories: Languages, Frameworks, Data & Messaging, Cloud & DevOps.
- Each category should appear as a card with the category name highlighted and individual skill tags listed inside.
- Cards should fade into view as the visitor scrolls to them.

---

## EPIC 4 — Projects Page

**Goal:** Showcase Abhilash's most significant engineering work with enough context for visitors to understand scope and impact.

### PROJ-1 — Page header
As a visitor, I want to know I'm on the Projects page.
- A header with label "Featured Projects" and subtitle "Things I've built" should appear.
- A short intro paragraph ("A selection of backend systems, developer tools, and product infrastructure I've shipped.") should appear below.

### PROJ-2 — Project card grid
As a visitor, I want to browse projects in a scannable layout.
- Projects should be displayed in a responsive grid (2 columns on wide screens, 1 column on mobile).
- Each card should contain: year badge, project name, tagline, Problem section, Impact callout, and tech stack tags.
- GitHub and (where available) live demo icons should appear in the top-right of each card.

### PROJ-3 — Project card hover state
As a visitor, I want visual feedback when I interact with a project card.
- Hovering a card should change its background to a slightly lighter shade and switch the border to the accent colour.
- An accent-coloured line should animate in along the top-left edge of the card on hover.

### PROJ-4 — Impact callout
As a visitor, I want the key outcome of each project to stand out.
- The "Impact" block on each card should be visually distinct — a left-border accent bar and slightly different background, clearly labelled "IMPACT".

### PROJ-5 — Tech stack tags
As a visitor, I want to know what technologies were used in each project.
- Technology names should appear as pill-shaped tags at the bottom of each card.

### PROJ-6 — GitHub link per project
As a visitor, I want to view the source code for projects.
- Each project card should have a GitHub icon link.
- The icon should brighten on hover.

### PROJ-7 — Live demo link per project
As a visitor, I want to see a working demo of a project where one exists.
- Project cards with a live demo should display an external link icon alongside the GitHub icon.
- Projects without a demo should not show this icon.

### PROJ-8 — Scroll-triggered card animation
As a visitor scrolling the page, I want the cards to feel alive.
- Each project card should fade in and slide up as it enters the viewport, with a staggered delay between cards.

### PROJ-9 — Individual project detail page (implied)
As a visitor who wants more depth on a specific project, I want a dedicated page with full details.
- *(The design only shows the listing view. A detail page per project is implied for full case-study depth.)*

---

## EPIC 5 — Experience Page

**Goal:** Present Abhilash's career history in a clear, chronological format that conveys progression and seniority.

### EXP-1 — Page header
As a visitor, I want to know I'm on the Experience page.
- A header with label "Experience" and subtitle "Where I've worked" should appear.

### EXP-2 — Vertical timeline layout
As a visitor, I want to read Abhilash's career in chronological order.
- Work history should be displayed as a vertical timeline with a continuous line on the left.
- Each entry should have a circular marker on the timeline.
- The most recent role's marker should be visually distinguished (accent colour with a glow/ring effect).

### EXP-3 — Role entry details
As a visitor, I want to understand each role clearly.
- Each timeline entry should show: job title (bold), company name (accent colour), date range (pill badge), and a bullet-point list of key responsibilities/achievements.

### EXP-4 — Scroll-triggered timeline animation
As a visitor scrolling down the timeline, I want entries to appear progressively.
- Each experience entry should fade in as it enters the viewport, staggered from top to bottom.

### EXP-5 — Download résumé CTA at bottom
As a visitor who has read the full experience, I want an easy way to get the complete work history.
- At the bottom of the timeline, a card should appear with text "Want the full picture?" and a "Download résumé" button.
- The button should dim on hover.
- Clicking it should download the PDF résumé.

---

## EPIC 6 — Blog Listing Page

**Goal:** Help visitors discover and filter Abhilash's technical writing.

### BLOG-1 — Page header
As a visitor, I want to know I'm on the Blog/Writing page.
- A header with label "Writing" and subtitle "Thoughts on engineering" should appear.
- A short intro paragraph should appear below: "I write about distributed systems, backend engineering, and the things I've learned by breaking things in production."

### BLOG-2 — Tag filter bar
As a visitor, I want to filter posts by topic.
- A row of topic filter buttons should appear (e.g., "All", "Systems Design", "Go", "PostgreSQL", "API Design").
- Clicking a tag should instantly show only posts in that category and hide the others.
- The active filter should be visually highlighted (accent colour background and border).
- Non-active filters should highlight the accent border on hover.

### BLOG-3 — Blog post cards
As a visitor, I want to scan post listings quickly.
- Each post should display: topic tag, publication date, estimated read time, post title, and a one-sentence summary.
- A "Read article →" link should appear below the summary.

### BLOG-4 — Card hover animation
As a visitor hovering a blog card, I want clear interactive feedback.
- Hovering a card should change the title colour to the accent colour and animate a coloured line along the top edge of the card.
- The card should lift slightly (translate upward) on hover.

### BLOG-5 — Scroll-triggered card animation
As a visitor scrolling the blog list, I want cards to fade in progressively.
- Each blog card should fade in and slide up into view as it enters the viewport, staggered by card index.

### BLOG-6 — Click through to post
As a visitor, I want to read a full post by clicking its card.
- Clicking anywhere on a blog card should navigate to the individual blog post page.

---

## EPIC 7 — Blog Post Page

**Goal:** Deliver a comfortable, focused reading experience for individual articles.

### POST-1 — "All posts" back link
As a visitor reading a post, I want to return to the blog listing.
- A "← All posts" link should appear at the top of the post.
- On hover, the link should adopt the accent colour.

### POST-2 — Post header
As a visitor, I want to orient myself at the start of an article.
- The post's topic tag, publication date, read time, full title, and summary sentence should appear before the article body.
- A horizontal rule should visually separate the header from the body.

### POST-3 — Readable article body
As a visitor, I want a clean, comfortable reading experience.
- Article body text should render with generous line spacing and a readable font size.
- Headings (section titles), paragraphs, bullet lists, code blocks, inline code, block quotes, bold text, and italic text should all be visually distinct.
- Code blocks should have a contrasting background, monospace font, and horizontal scroll for long lines.
- Inline code should be highlighted in the accent colour.
- Block quotes should have an accent left-border and tinted background.

### POST-4 — Author card
As a visitor who has finished reading, I want to know who wrote this.
- An author card should appear after the article body with Abhilash's photo (or placeholder), name, and a short bio line.

### POST-5 — "More posts" section
As a visitor who enjoyed an article, I want to discover other posts without going back to the listing.
- Up to 2 other posts should appear at the bottom of each post page, labelled "More posts".
- Each entry should show the post title, date, and read time.
- Clicking an entry should navigate to that post.
- Hovering an entry should highlight it with the accent colour background.

### POST-6 — Not-found state
As a visitor who reaches a non-existent post URL, I want a clear message.
- If no matching post exists, the page should show "Post not found." and a "← Back to blog" link.

---

## EPIC 8 — Contact Page

**Goal:** Make it effortless for interested visitors to reach Abhilash through their preferred channel.

### CONTACT-1 — Page header
As a visitor, I want to know I'm on the Contact page.
- A header with label "Get in touch" and subtitle "Let's work together" should appear.

### CONTACT-2 — Opening statement
As a visitor, I want to understand Abhilash's current availability before reaching out.
- A short paragraph should state: "I'm currently open to full-time roles and select consulting engagements. If you're building something interesting, I'd love to hear about it."

### CONTACT-3 — Contact method cards
As a visitor, I want clear, clickable contact options.
- Three contact cards should appear: Email, LinkedIn, Phone.
- Each card should show: an icon, the contact label (e.g., "EMAIL"), the contact value (e.g., the email address), and a short description of when to use that channel.
- An external-link arrow icon should appear on the right of each card.
- Clicking a card should open the appropriate action: email client for Email, LinkedIn profile for LinkedIn, phone dialler for Phone.

### CONTACT-4 — Contact card hover state
As a visitor, I want visual feedback when hovering a contact method.
- Hovering a card should apply an accent border, accent-tinted background, and lift the card slightly (translate upward).

### CONTACT-5 — Availability status indicator
As a visitor, I want to know at a glance whether Abhilash is currently available for work.
- A status banner should appear below the contact cards.
- It should show a pulsing green dot and the text: "Currently available — open to full-time and contract roles starting immediately."

---

## EPIC 9 — AI Chat Page

**Goal:** Let visitors have a natural conversation about Abhilash's background instead of searching through static pages.

### CHAT-1 — Chat page header
As a visitor, I want to understand what the chat is and isn't.
- The chat page should show the heading "Chat with my résumé" with a pulsing accent dot.
- A subtitle should read: "Ask anything about my work, skills, or experience · responses grounded in real CV data".

### CHAT-2 — Welcome message
As a visitor opening the chat for the first time, I want an introduction.
- The assistant should send an opening message: "Hey! I'm a chat layer over Abhilash's resume. Ask me about his experience, projects, skills, or how to get in touch."

### CHAT-3 — Suggestion chips in chat
As a visitor who doesn't know where to start, I want prompts to guide me.
- When only the welcome message is visible, a set of suggestion chips should appear: "What are his top skills?", "Tell me about his role at Rapido", "Which projects has he led?", "How can I get in touch?", "What's his current role?", "What cloud platforms does he know?"
- Clicking a chip should immediately send that question.

### CHAT-4 — Sending a message
As a visitor, I want to type and send my own question.
- A text input at the bottom of the page should let the visitor type freely.
- Pressing Enter or clicking the send button should submit the message.
- The send button should be disabled and visually muted when the input is empty or while a response is loading.

### CHAT-5 — Message thread display
As a visitor, I want to clearly distinguish my messages from the assistant's replies.
- The visitor's messages should appear right-aligned with an accent-tinted background.
- The assistant's replies should appear left-aligned with a neutral background.
- Both should show a small label ("you" / "Abhilash") and an avatar indicator.

### CHAT-6 — Typing / pending indicator
As a visitor waiting for a response, I want to know the assistant is thinking.
- While a response is being generated, a blinking cursor character (▍) should appear at the end of the assistant's placeholder message.
- The input placeholder text should change to "Thinking…" during this time.

### CHAT-7 — Auto-scroll
As a visitor in a long conversation, I want the latest message always in view.
- The chat thread should automatically scroll to the bottom whenever a new message appears.

### CHAT-8 — Pre-filled question from home page
As a visitor who submitted a question on the home page, I want that question answered automatically on the chat page.
- When arriving from the home page's chat launcher, the visitor's question should already appear in the thread and a response should be loading or visible — no extra step required.

### CHAT-9 — Error fallback message
As a visitor when the chat fails to respond, I want a helpful fallback.
- If the assistant cannot process a question, it should display: "Sorry, I couldn't process that. Try rephrasing, or reach Abhilash directly at [email]."

### CHAT-10 — Full-page chat layout
As a visitor, I want the chat to feel like a dedicated app, not a widget.
- The chat thread should occupy the full viewport height, with the input pinned to the bottom and the thread scrollable above it.

---

## EPIC 10 — Content Data Externalization

**Goal:** All site content must live in editable data files — not embedded in code — so any section can be updated without touching the site's logic.

> Note: Stories in this epic are from the site owner's perspective, not the visitor's. Updates made here should be invisible to visitors — they see the same result either way.

### DATA-1 — Projects data file
As a site owner, I want to manage my featured projects in a single data file so I can add, remove, or update a project without editing any page logic.
- All project entries must be sourced from a single external data file, not from inline code.
- Each project record must include: unique ID, name, tagline, year, problem description, impact statement, tech stack (list), GitHub URL, demo URL (optional).
- Adding a new project to the file must make it appear on the Projects page with no other change.
- Removing an entry must remove it from the page.

### DATA-2 — Skills data file
As a site owner, I want to manage my skills list in a data file so I can update it as my stack evolves.
- All skill categories and their items must be sourced from a single external data file.
- Each entry must have: category name and a list of skills within that category.
- Adding or removing a skill or category must be reflected on the About page with no other change.

### DATA-3 — Blog posts data file
As a site owner, I want to write and manage blog posts in external files so I can publish new articles without modifying page logic.
- Each blog post must be stored as its own file (e.g., a Markdown file) or as an entry in a dedicated data file.
- Each post record must include: unique ID/slug, title, publication date, estimated read time, topic tag, one-sentence summary, and full article body (in Markdown).
- Adding a new post file/entry must make it appear on the Blog listing page and be accessible at its own URL, with no other change.
- Removing a post entry must remove it from the listing.

### DATA-4 — Experience / work history data file
As a site owner, I want to manage my career history in a data file so I can update roles without touching the page layout.
- All experience entries must be sourced from a single external data file.
- Each record must include: job title, company name, date range, and a list of responsibility/achievement bullets.
- Entries must appear on the Experience page in the order defined in the file (most recent first).
- Adding or updating a role must be reflected without any other change.

### DATA-5 — Contact details data file
As a site owner, I want my contact information in a data file so I can update it in one place and have it appear everywhere it's used.
- Email address, LinkedIn URL, and phone number must be sourced from a single external data file.
- The contact page cards and the nav "Hire me" mailto link must both read from this file.
- The availability status message ("Currently available — open to full-time and contract roles starting immediately.") must be a configurable field in this file, along with a boolean flag to show or hide the availability banner.

### DATA-6 — Home page content data file
As a site owner, I want the hero section content to be configurable in a data file.
- The following must be sourced from a data file: role badge text, headline, subheading, bio paragraph, and the three statistics (number + label pairs).
- The home page suggestion chips (4 questions shown below the chat input) must be a configurable list in the same or a related data file.

### DATA-7 — Chat suggestion chips data file
As a site owner, I want the suggestion chips on the chat page to be configurable in a data file.
- The 6 suggestion chips displayed on the Chat page must be sourced from a data file.
- Updating the list must immediately change what chips appear, with no other change.

### DATA-8 — About page bio data file
As a site owner, I want my About page biography to be editable in a data file.
- The 3 bio paragraphs on the About page must be sourced from a data file.
- Updating the text must be reflected on the page with no other change.

### DATA-9 — Single source of truth for personal identity
As a site owner, I want my name, current role, location, and employer to be defined once and used everywhere they appear.
- A single data file (or a dedicated section of a shared config file) must define: full name, current job title, current employer, and location.
- Any page or component that displays this identity information must read from this file, not from hardcoded strings.

---

## Cross-Cutting Requirements

### XC-1 — Page-in scroll animations
As a visitor, I want content to feel alive as I scroll through any page.
- All content sections should fade in and slide up (approximately 14px) into view as they enter the viewport.
- Where multiple items exist in a section (cards, timeline entries), each should animate with a staggered delay based on its position in the list.

### XC-2 — Responsive layout on all pages
As a visitor on any device, I want the site to be fully usable.
- All pages should reflow for mobile screen sizes: single-column layouts, touch-friendly tap targets, no horizontal overflow.
- The navigation should adapt for small screens (see NAV-6).
- On the About page, the bio and photo should stack vertically on mobile.

### XC-3 — Background grid texture on hero/header areas
As a visitor, I want section headers to feel visually distinct.
- The home hero and all inner-page headers should show a subtle grid-line background pattern that fades out toward the content.

### XC-4 — Résumé file download
As a visitor, I want to download a PDF résumé from any page that offers it.
- The résumé download buttons (About, Experience) should serve the same PDF file.
- The download should start immediately on click without requiring a new page load.
