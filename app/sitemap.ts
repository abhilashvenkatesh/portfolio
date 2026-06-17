import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import { getProjects, projectSlug } from "@/lib/content";

const BASE = "https://avbuild.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE}/about`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/experience`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/projects`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/contact`, priority: 0.7, changeFrequency: "yearly" },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.7,
    changeFrequency: "yearly",
  }));

  const projectRoutes: MetadataRoute.Sitemap = getProjects().map((p) => ({
    url: `${BASE}/projects/${projectSlug(p.id)}`,
    priority: 0.7,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
