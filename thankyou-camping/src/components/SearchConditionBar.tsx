interface SearchConditionBarProps {
  dateLabel: string;
  regionLabel: string;
  guestLabel: string;
  onDateClick: () => void;
  onRegionClick: () => void;
  onGuestClick: () => void;
}

export function SearchConditionBar({
  dateLabel,
  regionLabel,
  guestLabel,
  onDateClick,
  onRegionClick,
  onGuestClick,
}: SearchConditionBarProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-surface-border bg-[#FAFAFA] px-2 py-2 text-sm">
      <button
        type="button"
        onClick={onDateClick}
        className="rounded px-2 py-1 font-medium text-ink hover:bg-white"
      >
        {dateLabel}
      </button>
      <span className="text-ink-muted">|</span>
      <button
        type="button"
        onClick={onRegionClick}
        className="rounded px-2 py-1 text-ink-secondary hover:bg-white"
      >
        {regionLabel}
      </button>
      <span className="text-ink-muted">|</span>
      <button
        type="button"
        onClick={onGuestClick}
        className="rounded px-2 py-1 text-ink-secondary hover:bg-white"
      >
        {guestLabel}
      </button>
    </div>
  );
}
