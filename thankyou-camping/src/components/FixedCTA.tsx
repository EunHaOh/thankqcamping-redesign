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
    <div className="fixed bottom-0 left-0 right-0 z-[100] mx-auto w-full max-w-mobile border-t border-surface-border bg-white shadow-cta">
      <div className="flex items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        {leftContent && <div className="shrink-0">{leftContent}</div>}
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
        <p className="-mt-2 px-4 pb-3 text-center text-xs text-ink-muted">{sublabel}</p>
      )}
    </div>
  );
}
