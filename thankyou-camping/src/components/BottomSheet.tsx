import type { ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

function SheetHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-surface-border" />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-ink-muted"
        >
          ×
        </button>
      </div>
    </>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />
      {footer ? (
        <div className="relative z-10 flex max-h-[85vh] w-full max-w-mobile flex-col overflow-hidden rounded-t-2xl bg-white">
          <div className="shrink-0 px-6 pt-4">
            <SheetHeader title={title} onClose={onClose} />
          </div>
          <div className="scrollbar-hide min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6">
            {children}
          </div>
          <div className="shrink-0 border-t border-surface-border bg-white px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
            {footer}
          </div>
        </div>
      ) : (
        <div className="relative z-10 max-h-[85vh] w-full max-w-mobile overflow-y-auto rounded-t-2xl bg-white px-4 pb-8 pt-4">
          <SheetHeader title={title} onClose={onClose} />
          {children}
        </div>
      )}
    </div>
  );
}
