import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-6 pb-24 pt-28">
      <p className="text-secondary">Post not found.</p>
      <Link
        href="/blog"
        className="mt-4 inline-block text-sm text-secondary transition-colors hover:text-accent"
      >
        ← Back to blog
      </Link>
    </div>
  );
}
