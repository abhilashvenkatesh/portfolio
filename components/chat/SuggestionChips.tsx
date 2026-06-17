export default function SuggestionChips({
  chips,
  onPick,
}: {
  chips: string[];
  onPick: (chip: string) => void;
}) {
  return (
    <div className="px-1 pb-6 pl-14 pt-3">
      <div className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-secondary">
        Try asking
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onPick(chip)}
            className="rounded-full border border-surface-alt bg-surface-alt px-3.5 py-2 text-left text-[13px] text-primary transition-colors hover:border-accent hover:bg-accent-dim hover:text-accent"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
