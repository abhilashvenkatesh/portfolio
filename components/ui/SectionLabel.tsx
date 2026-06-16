interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="mb-12 flex items-center gap-3">
      <div className="h-px flex-1 bg-surface-alt" />
      <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
        {children}
      </span>
      <div className="h-px flex-1 bg-surface-alt" />
    </div>
  );
}
