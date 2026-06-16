import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { getBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Writing",
  description: "Thoughts on distributed systems, backend engineering, and things learned in production.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <>
      <PageHeader
        label="Writing"
        subtitle="Thoughts on engineering"
        intro="I write about distributed systems, backend engineering, and the things I've learned by breaking things in production."
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-4">
        <div className="flex flex-col gap-5">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 80}>
              <Link href={`/blog/${post.slug}`} className="block">
                <article className="group relative overflow-hidden rounded-xl border border-surface-alt bg-surface px-7 py-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent-border)] hover:bg-surface-alt">
                  {/* Top-edge accent line */}
                  <div className="absolute left-0 top-0 h-px w-0 bg-[linear-gradient(90deg,var(--color-accent),transparent)] transition-[width] duration-300 group-hover:w-[60%]" />

                  {/* Meta row: tag + date + read time */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-surface-alt bg-surface-alt px-2.5 py-0.5 font-mono text-xs text-accent">
                      {post.tag}
                    </span>
                    <span className="font-mono text-xs text-secondary">{post.date}</span>
                    <span className="font-mono text-xs text-secondary">{post.readTime} min read</span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-primary transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>

                  {/* Summary */}
                  <p className="mt-2 text-[14px] leading-[1.65] text-secondary">
                    {post.summary}
                  </p>

                  {/* CTA */}
                  <p className="mt-4 font-mono text-[13px] text-accent">
                    Read article →
                  </p>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
