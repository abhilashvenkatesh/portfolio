import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career history across fintech, healthcare, retail, and consulting — distributed systems, cloud architecture, and engineering leadership.",
  alternates: { canonical: "https://avbuild.dev/experience" },
  openGraph: {
    url: "https://avbuild.dev/experience",
    title: "Experience | Abhilash Venkatesh",
    description:
      "Career history across fintech, healthcare, retail, and consulting — distributed systems, cloud architecture, and engineering leadership.",
  },
};
import FadeIn from "@/components/ui/FadeIn";
import { getExperience } from "@/lib/content";

export default function ExperiencePage() {
  const experience = getExperience();

  return (
    <>
      <PageHeader label="Experience" subtitle="Where I've worked" />

      <section className="mx-auto max-w-[720px] px-6 pb-24 pt-4">
        <div className="relative">
          {/* Continuous timeline line */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-2 bottom-0 w-px bg-surface-alt"
          />

          {experience.map((role, i) => (
            <FadeIn key={`${role.company}-${role.period}`} delay={i * 80}>
              <div className="relative pl-8 pb-14">
                {/* Marker dot — current role distinguished with accent + ring */}
                <div
                  aria-hidden="true"
                  className={`absolute -left-[5px] top-2 h-[11px] w-[11px] rounded-full border ${
                    i === 0
                      ? "border-accent bg-accent ring-4 ring-accent-dim"
                      : "border-surface-alt bg-surface"
                  }`}
                />

                <div className="flex flex-wrap items-start justify-between gap-1.5">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-primary">
                      {role.title}
                    </h3>
                    <span className="font-mono text-sm text-accent">
                      {role.company}
                    </span>
                  </div>
                  <span className="whitespace-nowrap rounded-full border border-surface-alt bg-surface-alt px-2.5 py-0.5 font-mono text-xs text-secondary">
                    {role.period}
                  </span>
                </div>

                <ul className="mt-4 flex list-none flex-col gap-2.5">
                  {role.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-[15px] leading-relaxed text-secondary"
                    >
                      <span className="shrink-0 text-accent">–</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA card */}
        <FadeIn delay={experience.length * 80}>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-surface-alt bg-surface-alt p-7">
            <div>
              <div className="font-semibold text-primary">
                Want the full picture?
              </div>
              <div className="text-sm text-secondary">
                Download my résumé for a complete work history.
              </div>
            </div>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-mono text-[13px] font-semibold text-black transition-opacity hover:opacity-85"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Download résumé
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
