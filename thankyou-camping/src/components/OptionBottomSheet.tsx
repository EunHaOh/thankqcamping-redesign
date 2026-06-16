import { BottomSheet } from './BottomSheet';

interface OptionBottomSheetProps {
  open: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function OptionBottomSheet({
  open,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionBottomSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              onSelect(option);
              onClose();
            }}
            className={`flex h-11 w-full items-center justify-between rounded-lg border px-4 text-sm ${
              selected === option
                ? 'border-primary bg-primary-soft font-semibold text-brand-accessible'
                : 'border-surface-border text-ink'
            }`}
          >
            {option}
            {selected === option && <span>✓</span>}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
