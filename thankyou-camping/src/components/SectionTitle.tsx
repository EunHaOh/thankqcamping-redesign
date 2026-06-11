interface SectionTitleProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, action, onAction }: SectionTitleProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-medium text-brand-500"
        >
          {action}
        </button>
      )}
    </div>
  );
}
