import { useEffect, useState } from 'react';
import { formatGuestSummary, type GuestCounts } from '../data/guestData';

interface GuestPickerBottomSheetProps {
  open: boolean;
  selected: GuestCounts;
  onApply: (counts: GuestCounts) => void;
  onClose: () => void;
}

interface CounterRowProps {
  title: string;
  subtitle: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function CounterButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label === '+' ? '증가' : '감소'}
      className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg leading-none ${
        disabled
          ? 'cursor-not-allowed border-[#E5E7EB] bg-[#F5F5F5] text-[#D1D5DB]'
          : 'border-surface-border bg-white text-ink'
      }`}
    >
      {label}
    </button>
  );
}

function CounterRow({ title, subtitle, value, min, max, onChange }: CounterRowProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className="flex items-center justify-between rounded-xl border border-surface-border px-4 py-3">
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <CounterButton
          label="−"
          disabled={!canDecrease}
          onClick={() => onChange(value - 1)}
        />
        <span className="w-6 text-center text-lg font-bold text-ink">{value}</span>
        <CounterButton
          label="+"
          disabled={!canIncrease}
          onClick={() => onChange(value + 1)}
        />
      </div>
    </div>
  );
}

export function GuestPickerBottomSheet({
  open,
  selected,
  onApply,
  onClose,
}: GuestPickerBottomSheetProps) {
  const [draft, setDraft] = useState<GuestCounts>(selected);

  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  const summary = formatGuestSummary(draft);
  const canApply = draft.adults >= 1;

  const handleApply = () => {
    if (!canApply) return;
    onApply(draft);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-mobile flex-col rounded-t-2xl bg-white">
        <div className="shrink-0 px-4 pt-4">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-surface-border" />
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">인원 선택</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-ink-muted"
            >
              ×
            </button>
          </div>
        </div>

        <div className="shrink-0 space-y-3 px-4 pb-4">
          <CounterRow
            title="성인"
            subtitle="만 13세 이상"
            value={draft.adults}
            min={1}
            max={6}
            onChange={(adults) => setDraft((prev) => ({ ...prev, adults }))}
          />
          <CounterRow
            title="아동"
            subtitle="만 12세 이하"
            value={draft.children}
            min={0}
            max={6}
            onChange={(children) => setDraft((prev) => ({ ...prev, children }))}
          />
          <CounterRow
            title="반려견"
            subtitle="동반 시 선택"
            value={draft.pets}
            min={0}
            max={3}
            onChange={(pets) => setDraft((prev) => ({ ...prev, pets }))}
          />

          <div className="rounded-xl border border-surface-border bg-[#FAFAFA] px-4 py-3">
            <p className="mb-1 text-xs text-ink-muted">선택 인원</p>
            <p className="text-sm font-semibold text-ink">{summary}</p>
          </div>
        </div>

        <div className="mt-auto shrink-0 border-t border-surface-border bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{summary}</p>
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={!canApply}
              className="btn-cta min-w-[120px] shrink-0 disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
