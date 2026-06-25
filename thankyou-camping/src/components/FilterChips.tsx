import type { SelectedFilterChip } from '../data/filterData';

interface FilterChipsProps {
  filters: string[];
  activeFilters: string[];
  selectedFilterChips: SelectedFilterChip[];
  fullFilterCount: number;
  onToggle: (filter: string) => void;
  onRemoveSelectedFilter: (chip: SelectedFilterChip) => void;
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

function RemoveIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function FilterChips({
  filters,
  activeFilters,
  selectedFilterChips,
  fullFilterCount,
  onToggle,
  onRemoveSelectedFilter,
  onFullFilterClick,
}: FilterChipsProps) {
  const fullFilterLabel =
    fullFilterCount > 0 ? `전체필터 ${fullFilterCount}` : '전체필터';

  return (
    <div className="space-y-2 overflow-x-hidden">
      <div className="scrollbar-hide -mx-4 flex items-center gap-2 overflow-x-auto px-4">
        <button
          type="button"
          onClick={onFullFilterClick}
          className={`flex h-[34px] shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium ${
            fullFilterCount > 0
              ? 'border-[#F26522] bg-[#FFF4ED] text-[#F26522]'
              : 'border-surface-border bg-white text-ink-secondary'
          }`}
        >
          <FilterIcon />
          <span>{fullFilterLabel}</span>
        </button>
        {filters.map((filter) => {
          const active = activeFilters.includes(filter);
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onToggle(filter)}
              className={`flex h-[34px] shrink-0 items-center rounded-full border px-3 text-[12px] font-medium ${
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

      {selectedFilterChips.length > 0 && (
        <div className="scrollbar-hide -mx-4 flex items-center gap-2 overflow-x-auto px-4">
          {selectedFilterChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onRemoveSelectedFilter(chip)}
              aria-label={`${chip.label} 필터 해제`}
              className="flex h-[34px] shrink-0 items-center gap-1 rounded-full border border-[#F26522] bg-[#FFF4ED] px-3 text-[12px] font-medium text-[#F26522]"
            >
              <span>{chip.label}</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F26522]/10">
                <RemoveIcon />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
