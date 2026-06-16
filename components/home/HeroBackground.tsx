/**
 * Decorative hero texture: a grid-line pattern that fades toward the centre
 * (radial mask) plus a soft radial accent glow. Both layers are purely
 * decorative — aria-hidden, pointer-events-none, behind the content at z-0.
 * Grid stroke uses currentColor so it stays theme-aware; place a text colour
 * on the wrapper to tint it.
 */
export default function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 text-primary"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="hero-grid-fade" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-grid-mask">
            <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hero-grid)"
          mask="url(#hero-grid-mask)"
        />
      </svg>

      {/* Soft radial accent glow */}
      <div className="absolute left-1/2 top-[20%] h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[80px]" />
    </div>
  );
}
