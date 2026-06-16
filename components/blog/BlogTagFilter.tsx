"use client";

import { useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import type { BlogPostMeta } from "@/lib/types";

interface Props {
  posts: BlogPostMeta[];
  tags: string[];
}

export default function BlogTagFilter({ posts, tags }: Props) {
  const [activeTag, setActiveTag] = useState("All");

  const filteredPosts = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 pb-6">
        {["All", ...tags].map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              aria-pressed={isActive}
              className={
                isActive
                  ? "rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-dim)] px-3 py-1 font-mono text-xs text-accent transition-colors"
                  : "rounded-full border border-surface-alt bg-surface px-3 py-1 font-mono text-xs text-secondary transition-colors hover:border-[var(--color-accent-border)]"
              }
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Post list */}
      <div className="flex flex-col gap-5">
        {filteredPosts.map((post, i) => (
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
    </>
  );
}
