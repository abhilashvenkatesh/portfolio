import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { GithubIcon } from "@/components/ui/icons";
import {
  getProjects,
  getProjectBySlug,
  getProjectBody,
  projectSlug,
} from "@/lib/content";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: projectSlug(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `https://avbuild.dev/projects/${slug}` },
    openGraph: {
      url: `https://avbuild.dev/projects/${slug}`,
      title: project.name,
      description: project.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.tagline,
    },
  };
}

/** MDX element styling — no typography plugin; map elements to design tokens. */
const mdxComponents = {
  h2: (props: { children?: ReactNode }) => (
    <h2 className="mt-10 text-xl font-semibold tracking-tight text-primary" {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="mt-8 text-lg font-semibold tracking-tight text-primary" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="mt-4 text-[15px] leading-relaxed text-secondary" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="mt-4 flex list-none flex-col gap-2.5" {...props} />
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="flex gap-3 text-[15px] leading-relaxed text-secondary">
      <span aria-hidden="true" className="shrink-0 text-accent">
        –
      </span>
      <span>{props.children}</span>
    </li>
  ),
  a: (props: { children?: ReactNode; href?: string }) => (
    <a
      className="text-accent hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: (props: { children?: ReactNode }) => (
    <code
      className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-sm text-primary"
      {...props}
    />
  ),
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const body = getProjectBody(slug);

  return (
    <article className="mx-auto max-w-[720px] px-6 pb-24 pt-28">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-sm text-secondary transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-surface-alt bg-surface-alt px-2.5 py-0.5 font-mono text-xs text-secondary">
          {project.year}
        </span>
        {project.timeline ? (
          <span className="font-mono text-xs text-secondary">{project.timeline}</span>
        ) : null}
      </div>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-primary">
        {project.name}
      </h1>
      <p className="mt-2 text-lg text-secondary">{project.tagline}</p>

      {project.role ? (
        <p className="mt-3 font-mono text-sm text-accent">{project.role}</p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
        >
          <GithubIcon size={16} />
          Source
        </a>
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-secondary transition-colors hover:text-primary"
          >
            <ExternalLink size={16} />
            Live demo
          </a>
        ) : null}
      </div>

      <section className="mt-10">
        <h2 className="font-mono text-sm text-accent">Problem</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-secondary">
          {project.problem}
        </p>
      </section>

      <section className="mt-8 border-l-2 border-accent bg-surface-alt/40 py-3 pl-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-accent">Impact</h2>
        <p className="mt-1 text-[15px] leading-relaxed text-primary">{project.impact}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-mono text-sm text-accent">Tech stack</h2>
        <ul className="mt-3 flex list-none flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-surface-alt bg-surface-alt px-2.5 py-0.5 font-mono text-xs text-secondary"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {body ? (
        <section className="mt-12 border-t border-surface-alt pt-2">
          <MDXRemote source={body} components={mdxComponents} />
        </section>
      ) : null}
    </article>
  );
}
