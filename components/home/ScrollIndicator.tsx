export default function ScrollIndicator() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-secondary opacity-40"
    >
      <span className="font-mono text-[11px] tracking-wider">scroll</span>
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
        <rect
          x="0.75"
          y="0.75"
          width="10.5"
          height="18.5"
          rx="5.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="6"
          cy="6"
          r="1.5"
          fill="currentColor"
          className="animate-scroll-dot motion-reduce:animate-none"
        />
      </svg>
    </div>
  );
}
