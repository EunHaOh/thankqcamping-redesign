interface FilterChipsProps {
  filters: string[];
  activeFilters: string[];
  onToggle: (filter: string) => void;
  onFullFilterClick: () => void;
}

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  );
}

export function FilterChips({
  filters,
  activeFilters,
  onToggle,
  onFullFilterClick,
}: FilterChipsProps) {
  return (
    <div className="scrollbar-hide -mx-4 flex items-center gap-2 overflow-x-auto px-4">
      <button
        type="button"
        onClick={onFullFilterClick}
        className="flex shrink-0 items-center gap-1 rounded-full border border-surface-border bg-white px-2.5 py-1.5 text-xs font-medium text-ink-secondary"
      >
        <FilterIcon />
        <span>전체 필터</span>
      </button>
      {filters.map((filter) => {
        const active = activeFilters.includes(filter);
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onToggle(filter)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
              active
                ? 'border-[#F26522] bg-[#F26522] text-white'
                : 'border-surface-border bg-white text-ink-secondary'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
