interface AvailabilityBannerProps {
  show: boolean;
  message: string;
}

export default function AvailabilityBanner({
  show,
  message,
}: AvailabilityBannerProps) {
  if (!show) return null;

  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-accent/30 bg-accent/10 px-6 py-5">
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent shadow-[0_0_0_3px_theme(colors.accent/0.1)]"
      />
      <p className="font-mono text-sm text-accent">{message}</p>
    </div>
  );
}
