import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { GithubIcon } from "@/components/ui/icons";
import { getProjects, projectSlug } from "@/lib/content";

export const metadata = {
  title: "Projects",
  description: "Things I've built — backend systems, developer tools, and infrastructure.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHeader
        label="Projects"
        subtitle="Things I've built"
        intro="A selection of backend systems, developer tools, and product infrastructure I've shipped."
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, i) => {
            const slug = projectSlug(project.id);
            return (
              <FadeIn key={project.id} delay={i * 80}>
                <article className="flex h-full flex-col rounded-xl border border-surface-alt bg-surface p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border border-surface-alt bg-surface-alt px-2.5 py-0.5 font-mono text-xs text-secondary">
                      {project.year}
                    </span>
                    <div className="flex items-center gap-3 text-secondary">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} on GitHub`}
                        className="transition-colors hover:text-primary"
                      >
                        <GithubIcon />
                      </a>
                      {project.demo ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.name} live demo`}
                          className="transition-colors hover:text-primary"
                        >
                          <ExternalLink size={18} />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <Link href={`/projects/${slug}`} className="mt-4 block">
                    <h2 className="text-xl font-semibold tracking-tight text-primary">
                      {project.name}
                    </h2>
                    <p className="mt-1 text-[15px] leading-relaxed text-secondary">
                      {project.tagline}
                    </p>
                  </Link>

                  <Link
                    href={`/projects/${slug}`}
                    className="mt-4 inline-flex items-center gap-1 font-mono text-sm text-accent hover:underline"
                  >
                    Read case study →
                  </Link>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </>
  );
}
