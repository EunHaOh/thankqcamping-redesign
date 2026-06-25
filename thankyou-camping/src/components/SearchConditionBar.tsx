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
    <div
      data-testid="search-condition-bar"
      className="flex h-[42px] items-center gap-1 rounded-[14px] border border-surface-border bg-[#FAFAFA] px-4 text-[13px] leading-[1.4]"
    >
      <button
        type="button"
        onClick={onDateClick}
        className="rounded px-1 font-medium text-ink hover:bg-white"
      >
        {dateLabel}
      </button>
      <span className="text-ink-muted">|</span>
      <button
        type="button"
        onClick={onRegionClick}
        className="rounded px-1 font-medium text-ink hover:bg-white"
      >
        {regionLabel}
      </button>
      <span className="text-ink-muted">|</span>
      <button
        type="button"
        onClick={onGuestClick}
        className="rounded px-1 font-medium text-ink hover:bg-white"
      >
        {guestLabel}
      </button>
    </div>
  );
}
