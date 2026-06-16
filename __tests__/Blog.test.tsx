import { render, screen } from "@testing-library/react";
import BlogPage from "@/app/blog/page";
import { getBlogPosts } from "@/lib/blog";

describe("BlogPage", () => {
  it("renders the page header label", () => {
    render(<BlogPage />);
    expect(screen.getByText("Writing")).toBeInTheDocument();
  });

  it("renders the page header subtitle as h1", () => {
    render(<BlogPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Thoughts on engineering" })
    ).toBeInTheDocument();
  });

  it("renders a card per post", () => {
    render(<BlogPage />);
    const posts = getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(screen.getByRole("heading", { level: 2, name: post.title })).toBeInTheDocument();
      expect(screen.getByText(post.summary)).toBeInTheDocument();
    }
  });

  it("renders topic tag, date, and read time for each post", () => {
    render(<BlogPage />);
    for (const post of getBlogPosts()) {
      expect(screen.getByText(post.tag)).toBeInTheDocument();
      expect(screen.getByText(post.date)).toBeInTheDocument();
      expect(screen.getByText(`${post.readTime} min read`)).toBeInTheDocument();
    }
  });

  it("wraps each card in a link to /blog/<slug>", () => {
    render(<BlogPage />);
    for (const post of getBlogPosts()) {
      const heading = screen.getByRole("heading", { level: 2, name: post.title });
      const link = heading.closest("a");
      expect(link).toHaveAttribute("href", `/blog/${post.slug}`);
    }
  });

  it("renders a Read article CTA for each post", () => {
    render(<BlogPage />);
    const ctas = screen.getAllByText(/Read article/);
    expect(ctas.length).toBe(getBlogPosts().length);
  });
});
