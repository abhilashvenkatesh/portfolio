import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug, getBlogBody } from "@/lib/blog";
import { getIdentity, getHomeContent } from "@/lib/content";
import BlogPost from "@/components/blog/BlogPost";
import AuthorCard from "@/components/blog/AuthorCard";
import MorePosts from "@/components/blog/MorePosts";

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `https://avbuild.dev/blog/${slug}` },
    openGraph: {
      type: "article",
      url: `https://avbuild.dev/blog/${slug}`,
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      authors: ["https://avbuild.dev"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const body = getBlogBody(slug);
  if (!body) notFound();

  const identity = getIdentity();
  const home = getHomeContent();

  const morePosts = getBlogPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    url: `https://avbuild.dev/blog/${slug}`,
    author: {
      "@type": "Person",
      name: identity.name,
      url: "https://avbuild.dev",
    },
  };

  return (
    <article className="mx-auto max-w-[720px] px-6 pb-24 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <Link
        href="/blog"
        className="inline-block text-sm text-secondary transition-colors hover:text-accent"
      >
        ← All posts
      </Link>

      <header className="mt-8">
        <div className="flex items-center gap-3 text-xs text-secondary">
          <span className="font-medium text-accent">{post.tag}</span>
          <span>{post.date}</span>
          <span>{post.readTime} min read</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary">
          {post.title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">
          {post.summary}
        </p>
      </header>

      <hr className="my-8 border-surface-alt" />

      <BlogPost source={body} />

      <AuthorCard name={identity.name} bio={home.bio} />

      <MorePosts posts={morePosts} />
    </article>
  );
}
