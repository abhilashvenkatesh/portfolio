import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPostMeta } from "@/lib/types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getBlogPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        readTime: data.readTime as number,
        tag: data.tag as string,
        summary: data.summary as string,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPostMeta | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

export function getBlogBody(slug: string): string | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return matter(raw).content;
}
