import type { ReactNode } from 'react';

interface FixedCTAProps {
  label: string;
  sublabel?: string;
  onClick: () => void;
  disabled?: boolean;
  leftContent?: ReactNode;
}

export function FixedCTA({
  label,
  sublabel,
  onClick,
  disabled = false,
  leftContent,
}: FixedCTAProps) {
  return (
    <div className="app-fixed-bar bottom-0 border-t border-surface-border bg-white shadow-cta">
      <div className="flex w-full min-w-0 max-w-full items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        {leftContent && <div className="min-w-0 flex-1">{leftContent}</div>}
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="btn-cta min-w-[120px] flex-1 px-2 leading-tight disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
        >
          {label}
        </button>
      </div>
      {sublabel && (
        <div className="w-full min-w-0 max-w-full">
          <p className="-mt-2 px-4 pb-3 text-center text-xs text-ink-muted">{sublabel}</p>
        </div>
      )}
    </div>
  );
}
