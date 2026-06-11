interface ViewTabsProps {
  active: 'list' | 'map';
  onChange: (tab: 'list' | 'map') => void;
}

export function ViewTabs({ active, onChange }: ViewTabsProps) {
  const tabs = [
    { id: 'list' as const, label: '목록으로 보기' },
    { id: 'map' as const, label: '배치도로 보기' },
  ];

  return (
    <div className="flex gap-2 border-b border-surface-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 border-b-2 pb-2.5 text-sm font-semibold transition-colors ${
            active === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-muted'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
