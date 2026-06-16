import PageHeader from "@/components/ui/PageHeader";
import BlogTagFilter from "@/components/blog/BlogTagFilter";
import { getBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Writing",
  description: "Thoughts on distributed systems, backend engineering, and things learned in production.",
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const tags = [...new Set(posts.map((p) => p.tag))];

  return (
    <>
      <PageHeader
        label="Writing"
        subtitle="Thoughts on engineering"
        intro="I write about distributed systems, backend engineering, and the things I've learned by breaking things in production."
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-4">
        <BlogTagFilter posts={posts} tags={tags} />
      </section>
    </>
  );
}
