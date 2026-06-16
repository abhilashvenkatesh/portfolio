import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock BlogPost (async RSC wrapping MDXRemote) to avoid async component issues in tests
vi.mock("@/components/blog/BlogPost", () => ({
  default: ({ source }: { source: string }) => (
    <div data-testid="blog-body">{source}</div>
  ),
}));

// Mock notFound so we can assert it was triggered
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import BlogPostPage from "@/app/blog/[slug]/page";
import BlogPostNotFound from "@/app/blog/[slug]/not-found";
import AuthorCard from "@/components/blog/AuthorCard";
import MorePosts from "@/components/blog/MorePosts";
import type { BlogPostMeta } from "@/lib/types";

const SLUG = "placeholder";

async function renderPage(slug: string) {
  const ui = await BlogPostPage({ params: Promise.resolve({ slug }) });
  render(ui);
}

describe("BlogPostPage — happy path", () => {
  it("renders the back navigation link", async () => {
    await renderPage(SLUG);
    expect(
      screen.getByRole("link", { name: /← All posts/i })
    ).toBeInTheDocument();
  });

  it("renders the post title as h1", async () => {
    await renderPage(SLUG);
    expect(
      screen.getByRole("heading", { level: 1, name: "Placeholder Post" })
    ).toBeInTheDocument();
  });

  it("renders post metadata — tag, date, read time", async () => {
    await renderPage(SLUG);
    expect(screen.getByText("Systems Design")).toBeInTheDocument();
    expect(screen.getByText("2026-01-01")).toBeInTheDocument();
    expect(screen.getByText(/1 min read/)).toBeInTheDocument();
  });

  it("renders the summary sentence", async () => {
    await renderPage(SLUG);
    expect(
      screen.getByText("Placeholder blog post — will be replaced with real content.")
    ).toBeInTheDocument();
  });

  it("renders the author's name", async () => {
    await renderPage(SLUG);
    expect(screen.getByText("Abhilash Venkatesh")).toBeInTheDocument();
  });
});

describe("BlogPostPage — not-found path", () => {
  it("triggers notFound for an unknown slug", async () => {
    await expect(
      BlogPostPage({ params: Promise.resolve({ slug: "nonexistent-slug-xyz" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("BlogPostNotFound", () => {
  it('renders "Post not found." message', () => {
    render(<BlogPostNotFound />);
    expect(screen.getByText("Post not found.")).toBeInTheDocument();
  });

  it('renders a "← Back to blog" link to /blog', () => {
    render(<BlogPostNotFound />);
    const link = screen.getByRole("link", { name: /← Back to blog/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/blog");
  });
});

describe("AuthorCard", () => {
  it("renders the author name and bio", () => {
    render(
      <AuthorCard
        name="Abhilash Venkatesh"
        bio="Lead Application Developer with 11+ years."
      />
    );
    expect(screen.getByText("Abhilash Venkatesh")).toBeInTheDocument();
    expect(
      screen.getByText("Lead Application Developer with 11+ years.")
    ).toBeInTheDocument();
  });

  it("renders an avatar placeholder or image", () => {
    const { container } = render(
      <AuthorCard name="Abhilash Venkatesh" bio="Short bio." />
    );
    // Either an <img> or a div with initials "AV"
    const hasImg = container.querySelector("img") !== null;
    const hasInitials = screen.queryByText("AV") !== null;
    expect(hasImg || hasInitials).toBe(true);
  });
});

describe("MorePosts", () => {
  const POSTS: BlogPostMeta[] = [
    {
      slug: "post-a",
      title: "First Related Post",
      date: "2026-05-01",
      readTime: 3,
      tag: "Go",
      summary: "About Go.",
    },
    {
      slug: "post-b",
      title: "Second Related Post",
      date: "2026-04-01",
      readTime: 5,
      tag: "Systems Design",
      summary: "About systems.",
    },
  ];

  it("renders post titles and read times", () => {
    render(<MorePosts posts={POSTS} />);
    expect(screen.getByText("First Related Post")).toBeInTheDocument();
    expect(screen.getByText("Second Related Post")).toBeInTheDocument();
    expect(screen.getByText(/3 min read/)).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });

  it("each post entry links to /blog/<slug>", () => {
    render(<MorePosts posts={POSTS} />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/blog/post-a");
    expect(hrefs).toContain("/blog/post-b");
  });

  it("renders nothing when posts array is empty", () => {
    const { container } = render(<MorePosts posts={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
