# Capability: blog-post-page

## ADDED Requirements

### Requirement: Blog post page renders at slug URL

A `/blog/[slug]` route SHALL exist for every slug in `content/blog/`, statically generated at build time, so visitors can bookmark and share direct links to individual posts.

#### Scenario: Visitor opens a blog post

GIVEN a post with slug "my-post" exists in the blog content directory
WHEN a visitor opens `/blog/my-post`
THEN the post page is rendered with the post title visible

#### Scenario: All slugs are statically generated

GIVEN one or more posts exist in `content/blog/`
WHEN the site is built
THEN a static page exists for every slug with no runtime data fetching

---

### Requirement: Post navigation link

A "← All posts" link SHALL appear at the top of every post page and navigate to `/blog`, so visitors can return to the listing without using the browser back button.

#### Scenario: Navigation link is present and styled

GIVEN a visitor on a blog post page
WHEN the visitor views the top of the page
THEN a "← All posts" link is visible

#### Scenario: Navigation link adopts accent colour on hover

GIVEN a visitor on a blog post page
WHEN the visitor hovers over the "← All posts" link
THEN the link text changes to the accent colour

#### Scenario: Navigation link goes to the blog listing

GIVEN a visitor on a blog post page
WHEN the visitor activates the "← All posts" link
THEN they arrive at `/blog`

---

### Requirement: Post header

The post header SHALL display the topic tag, publication date, estimated read time, full title, and one-sentence summary before the article body, separated from the body by a horizontal rule, so visitors can orient themselves before reading.

#### Scenario: Header shows all post metadata

GIVEN a post with a tag, date, readTime, title, and summary
WHEN a visitor opens that post page
THEN the topic tag is visible above the title
AND the publication date is visible
AND the estimated read time is visible
AND the full post title is visible
AND the one-sentence summary is visible
AND a horizontal rule separates the header from the article body

---

### Requirement: Article body typography

The article body SHALL render MDX content with visually distinct styles for headings, paragraphs, bullet lists, bold, italic, code blocks, inline code, and blockquotes, so the reading experience is comfortable and the content hierarchy is clear.

#### Scenario: Body renders with generous line spacing

GIVEN a post with body paragraphs
WHEN a visitor reads the article
THEN paragraphs are rendered with generous line spacing and a readable font size

#### Scenario: Code blocks use contrasting background and monospace font

GIVEN a post with a fenced code block
WHEN a visitor views the article
THEN the code block has a contrasting background and monospace font
AND long lines scroll horizontally rather than wrapping

#### Scenario: Inline code is highlighted in accent colour

GIVEN a post with inline code spans
WHEN a visitor views the article
THEN inline code is highlighted in the accent colour

#### Scenario: Blockquotes use accent left-border and tinted background

GIVEN a post with a blockquote
WHEN a visitor views the article
THEN the blockquote has an accent-coloured left border
AND a tinted background behind the quoted text

---

### Requirement: Author card

An author card SHALL appear below the article body, showing Abhilash's photo (or a placeholder if no photo exists), name, and a short bio line, so readers know who wrote the post.

#### Scenario: Author card appears after the article

GIVEN a visitor who has read to the end of a post
WHEN the visitor views the area after the article body
THEN an author card is visible with the author's name
AND a short bio line is displayed
AND either a photo or a placeholder image is shown

---

### Requirement: More posts section

A "More posts" section SHALL appear below the author card, showing up to 2 other posts with their title, date, and read time, so visitors are invited to continue reading after finishing an article.

#### Scenario: More posts section shows up to two posts

GIVEN the blog has two or more posts
WHEN a visitor finishes reading any post
THEN a "More posts" section is visible below the author card
AND up to 2 other posts are shown with their title, date, and read time
AND the current post is not included among the suggestions

#### Scenario: More posts entry navigates to that post

GIVEN a visitor viewing the "More posts" section
WHEN the visitor activates a post entry
THEN they arrive at that post's individual page

#### Scenario: More posts entry highlights on hover

GIVEN a visitor viewing the "More posts" section
WHEN the visitor hovers over a post entry
THEN the entry background changes to the accent colour highlight

#### Scenario: Fewer than two other posts available

GIVEN the blog has exactly one post
WHEN a visitor opens that post page
THEN the "More posts" section is hidden or not rendered

---

### Requirement: Not-found state

If a visitor reaches a `/blog/[slug]` URL that does not match any known post, the page SHALL show "Post not found." and a "← Back to blog" link, so visitors are not left on a blank or erroring page.

#### Scenario: Unknown slug shows not-found message

GIVEN no post exists with slug "nonexistent-post"
WHEN a visitor opens `/blog/nonexistent-post`
THEN the text "Post not found." is visible on the page
AND a "← Back to blog" link is present

#### Scenario: Not-found page links back to listing

GIVEN a visitor on the not-found post page
WHEN the visitor activates the "← Back to blog" link
THEN they arrive at `/blog`
