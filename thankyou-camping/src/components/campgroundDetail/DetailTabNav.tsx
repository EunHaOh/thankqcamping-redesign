import { DETAIL_TAB_ITEMS, type DetailTabId } from '../../data/campgroundDetailHelpers';

interface DetailTabNavProps {
  activeTab: DetailTabId;
  onTabClick: (tabId: DetailTabId) => void;
}

export function DetailTabNav({ activeTab, onTabClick }: DetailTabNavProps) {
  return (
    <nav className="sticky top-0 z-20 flex h-11 overflow-x-auto border-b border-surface-border bg-white px-4 scrollbar-hide">
      {DETAIL_TAB_ITEMS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            data-active={active}
            onClick={() => onTabClick(tab.id)}
            className={`relative shrink-0 px-3 text-[14px] font-semibold ${
              active ? 'text-ink' : 'text-ink-secondary'
            }`}
          >
            {tab.label}
            {active ? (
              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-ink" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
