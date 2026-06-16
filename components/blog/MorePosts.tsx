import Link from "next/link";
import type { BlogPostMeta } from "@/lib/types";

interface MorePostsProps {
  posts: BlogPostMeta[];
}

export default function MorePosts({ posts }: MorePostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-secondary">
        More posts
      </p>
      <div className="flex flex-col gap-1">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group -mx-3 flex items-center justify-between rounded-md px-3 py-3 transition-colors hover:bg-accent-dim"
          >
            <span className="text-[15px] font-medium text-primary transition-colors group-hover:text-accent">
              {post.title}
            </span>
            <span className="shrink-0 text-xs text-secondary">
              {post.date} · {post.readTime} min read
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
