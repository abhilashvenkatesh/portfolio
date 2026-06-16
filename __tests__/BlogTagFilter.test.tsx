import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogTagFilter from "@/components/blog/BlogTagFilter";
import type { BlogPostMeta } from "@/lib/types";

const POSTS: BlogPostMeta[] = [
  { slug: "post-go-1", title: "Go Concurrency Patterns", date: "2026-05-01", readTime: 5, tag: "Go", summary: "How goroutines work." },
  { slug: "post-go-2", title: "Go Error Handling", date: "2026-04-01", readTime: 4, tag: "Go", summary: "Wrapping errors properly." },
  { slug: "post-sd-1", title: "Designing for Scale", date: "2026-03-01", readTime: 8, tag: "Systems Design", summary: "Horizontal vs vertical scaling." },
];

const TAGS = ["Go", "Systems Design"];

describe("BlogTagFilter", () => {
  it("renders All button plus one button per unique tag", () => {
    render(<BlogTagFilter posts={POSTS} tags={TAGS} />);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Systems Design" })).toBeInTheDocument();
  });

  it("shows all post cards when All is active on mount", () => {
    render(<BlogTagFilter posts={POSTS} tags={TAGS} />);
    for (const post of POSTS) {
      expect(screen.getByRole("heading", { level: 2, name: post.title })).toBeInTheDocument();
    }
  });

  it("shows only matching posts when a tag is clicked", async () => {
    const user = userEvent.setup();
    render(<BlogTagFilter posts={POSTS} tags={TAGS} />);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(screen.getByRole("heading", { level: 2, name: "Go Concurrency Patterns" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Go Error Handling" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "Designing for Scale" })).not.toBeInTheDocument();
  });

  it("restores all posts when All is clicked after a tag filter is active", async () => {
    const user = userEvent.setup();
    render(<BlogTagFilter posts={POSTS} tags={TAGS} />);
    await user.click(screen.getByRole("button", { name: "Systems Design" }));
    await user.click(screen.getByRole("button", { name: "All" }));
    for (const post of POSTS) {
      expect(screen.getByRole("heading", { level: 2, name: post.title })).toBeInTheDocument();
    }
  });

  it("marks the active button with aria-pressed=true and inactive buttons with aria-pressed=false", async () => {
    const user = userEvent.setup();
    render(<BlogTagFilter posts={POSTS} tags={TAGS} />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
  });
});
