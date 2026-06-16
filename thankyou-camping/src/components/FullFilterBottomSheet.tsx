import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_FULL_FILTER_CHIPS,
  FILTER_SECTIONS,
  FILTER_TABS,
  type FilterTabId,
} from '../data/filterData';

export type FullFilterState = string[];

interface FullFilterBottomSheetProps {
  open: boolean;
  filters: FullFilterState;
  onDraftChange?: (filters: FullFilterState) => void;
  onApply: (filters: FullFilterState, options: { resetAll: boolean }) => void;
  onClose: () => void;
  resultCount: number;
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 text-sm font-medium ${
        selected
          ? 'bg-[#F26522] text-white'
          : 'bg-[#F3F4F6] text-[#5F6875]'
      }`}
    >
      {label}
    </button>
  );
}

export function FullFilterBottomSheet({
  open,
  filters,
  onDraftChange,
  onApply,
  onClose,
  resultCount,
}: FullFilterBottomSheetProps) {
  const [draft, setDraft] = useState<FullFilterState>(filters);
  const [resetAllOnApply, setResetAllOnApply] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTabId>('type');
  const sectionRefs = useRef<Partial<Record<FilterTabId, HTMLElement | null>>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setDraft(filters);
      setResetAllOnApply(false);
      onDraftChange?.(filters);
    }
    wasOpenRef.current = open;
  }, [open, filters, onDraftChange]);

  const updateDraft = (next: FullFilterState) => {
    setResetAllOnApply(false);
    setDraft(next);
    onDraftChange?.(next);
  };

  const toggleChip = (chip: string) => {
    updateDraft(
      draft.includes(chip) ? draft.filter((c) => c !== chip) : [...draft, chip],
    );
  };

  const handleReset = () => {
    setResetAllOnApply(true);
    setDraft([]);
    onDraftChange?.([]);
  };

  const handleApply = () => {
    onApply(draft, { resetAll: resetAllOnApply });
    onClose();
  };

  const scrollToTab = (tabId: FilterTabId) => {
    setActiveTab(tabId);
    sectionRefs.current[tabId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="app-container relative z-10 w-full">
        <div className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-white">
        <div className="shrink-0 px-4 pt-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-surface-border" />
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-ink-muted"
            >
              ×
            </button>
          </div>

          <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto border-b border-surface-border px-4 pb-0">
            {FILTER_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToTab(tab.id)}
                  className={`shrink-0 whitespace-nowrap pb-2.5 text-sm ${
                    active
                      ? 'border-b-2 border-[#F26522] font-semibold text-ink'
                      : 'border-b-2 border-transparent text-ink-muted'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-4"
        >
          {FILTER_SECTIONS.map((section) => (
            <section
              key={section.id}
              ref={(el) => {
                if (section.tabId) sectionRefs.current[section.tabId] = el;
              }}
              className="mb-6"
            >
              <h3 className="mb-3 text-sm font-bold text-ink">{section.title}</h3>
              <div className="flex flex-wrap gap-2">
                {section.chips.map((chip) => (
                  <FilterChip
                    key={chip}
                    label={chip}
                    selected={draft.includes(chip)}
                    onClick={() => toggleChip(chip)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-surface-border bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary flex h-[52px] min-w-[100px] flex-1 items-center justify-center text-sm font-semibold"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="btn-cta flex h-[52px] min-w-0 flex-[1.4] items-center justify-center text-sm font-semibold"
            >
              결과보기 {resultCount.toLocaleString()}건
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_FULL_FILTER_CHIPS };
