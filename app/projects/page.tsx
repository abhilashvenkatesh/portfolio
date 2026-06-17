import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import ProjectLinks from "@/components/projects/ProjectLinks";
import { getProjects, projectSlug } from "@/lib/content";

export const metadata = {
  title: "Projects",
  description: "Things I've built — backend systems, developer tools, and infrastructure.",
  alternates: { canonical: "https://avbuild.dev/projects" },
  openGraph: {
    url: "https://avbuild.dev/projects",
    title: "Projects | Abhilash Venkatesh",
    description: "Things I've built — backend systems, developer tools, and infrastructure.",
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHeader
        label="Featured Projects"
        subtitle="Things I've built"
        intro="A selection of backend systems, developer tools, and product infrastructure I've shipped."
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => {
            const slug = projectSlug(project.id);
            return (
              <FadeIn key={project.id} delay={i * 80}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-surface-alt bg-surface px-7 pb-6 pt-7 transition-colors group-hover:border-accent-border group-hover:bg-surface-alt">
                  {/* Accent top-line: animates in on hover */}
                  <div className="absolute left-0 top-0 h-px w-0 bg-[linear-gradient(90deg,var(--color-accent),transparent)] transition-[width] duration-300 group-hover:w-[60%]" />

                  {/* Top row: year badge + icon links */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border border-surface-alt bg-surface-alt px-2.5 py-0.5 font-mono text-xs text-secondary">
                      {project.year}
                    </span>
                    <ProjectLinks name={project.name} github={project.github} demo={project.demo} />
                  </div>

                  {/* Name + tagline */}
                  <Link href={`/projects/${slug}`} className="mt-3 block">
                    <h2 className="text-xl font-semibold tracking-tight text-primary">
                      {project.name}
                    </h2>
                  </Link>
                  <p className="mt-1 font-mono text-[13px] text-secondary">
                    {project.tagline}
                  </p>

                  {/* Problem */}
                  <div className="mt-4">
                    <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
                      Problem
                    </div>
                    <p className="text-[14px] leading-[1.65] text-secondary">
                      {project.problem}
                    </p>
                  </div>

                  {/* IMPACT callout */}
                  <div className="mt-3.5 rounded-md border-l-2 border-accent bg-neutral px-3.5 py-3">
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
                      IMPACT
                    </div>
                    <p className="text-[14px] leading-[1.6] text-primary">
                      {project.impact}
                    </p>
                  </div>

                  {/* Stack tags */}
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-xs bg-surface-alt px-2.5 py-[3px] font-mono text-[11px] text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </>
  );
}
