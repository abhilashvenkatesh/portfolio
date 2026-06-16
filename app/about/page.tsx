import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { getAboutBio } from "@/lib/content";

export default function AboutPage() {
  const bio = getAboutBio();

  return (
    <>
      <PageHeader
        label="About me"
        subtitle="11+ years building systems across 3 countries and 4 industries."
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-4">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_auto] md:gap-20">
          <FadeIn>
            <div className="flex flex-col gap-5">
              {bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
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

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-md border border-surface-alt px-4 py-2.5 font-mono text-[13px] text-secondary transition-colors hover:border-accent hover:text-accent"
              >
                Blog →
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div
              aria-hidden="true"
              className="flex h-[200px] w-[200px] shrink-0 flex-col items-center justify-center gap-2 rounded-[14px] border border-surface-alt bg-surface-alt"
            >
              <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
                <circle
                  cx="24"
                  cy="18"
                  r="10"
                  stroke="currentColor"
                  className="text-secondary/40"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 44c0-11 9-19 20-19s20 8 20 19"
                  stroke="currentColor"
                  className="text-secondary/40"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-mono text-[11px] text-secondary/60">
                photo
              </span>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
