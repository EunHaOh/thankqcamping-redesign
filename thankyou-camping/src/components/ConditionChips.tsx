interface ConditionChipsProps {
  chips: string[];
}

export function ConditionChips({ chips }: ConditionChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded border border-surface-border bg-[#F7F7F7] px-2 py-0.5 text-xs text-ink-secondary"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
