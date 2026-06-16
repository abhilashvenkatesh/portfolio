import { getHomeContent } from "@/lib/content";
import HeroBackground from "./HeroBackground";
import HeroStats from "./HeroStats";

// Hardcoded accent clause (design decision 4): the trailing clause of the
// subheading is emphasised in the accent colour. If the subheading wording in
// content/home.json changes, update this constant to match.
const ACCENT_CLAUSE = "scale to millions.";

export default function Hero() {
  const { roleBadge, headline, subheading, bio, stats } = getHomeContent();

  const accentIndex = subheading.lastIndexOf(ACCENT_CLAUSE);
  const subheadingLead =
    accentIndex >= 0 ? subheading.slice(0, accentIndex) : subheading;
  const subheadingAccent = accentIndex >= 0 ? ACCENT_CLAUSE : "";

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <HeroBackground />

      <div className="relative z-10 max-w-3xl">
        <span className="inline-block rounded-full bg-accent-dim px-4 py-1.5 font-mono text-sm text-accent">
          {roleBadge}
        </span>

        <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-primary sm:text-6xl md:text-7xl">
          {headline}
          <br />
          <span className="font-light text-secondary">
            {subheadingLead}
            {subheadingAccent && (
              <span className="text-accent">{subheadingAccent}</span>
            )}
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-secondary">
          {bio}
        </p>

        {/* POR-167: chat launcher (input, chips, browse hints) mounts here. */}

        <HeroStats stats={stats} />
      </div>

      {/* POR-167: scroll indicator anchors to the bottom edge of this section. */}
    </section>
  );
}
