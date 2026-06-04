interface PageHeaderProps {
  label: string;
  subtitle: string;
  intro?: string;
}

export default function PageHeader({ label, subtitle, intro }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden pt-24 pb-12 px-6">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="page-header-grid"
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
          <radialGradient id="page-header-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="page-header-mask">
            <ellipse cx="50%" cy="50%" rx="40%" ry="30%" fill="url(#page-header-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#page-header-grid)"
          mask="url(#page-header-mask)"
        />
      </svg>

      <div className="relative max-w-5xl mx-auto">
        <p className="font-mono text-sm text-accent mb-3">{label}</p>
        <h1 className="text-4xl font-semibold text-primary tracking-tight">{subtitle}</h1>
        {intro && (
          <p className="mt-4 text-lg text-secondary max-w-2xl">{intro}</p>
        )}
      </div>
    </div>
  );
}
