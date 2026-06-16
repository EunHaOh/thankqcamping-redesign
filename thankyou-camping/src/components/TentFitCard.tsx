import type { TentFitStatus } from '../types';
import { MY_TENT_SIZE } from '../data/mockData';

interface TentFitCardProps {
  status: TentFitStatus;
  message: string;
}

const statusConfig: Record<
  TentFitStatus,
  { label: string; bg: string; text: string; icon: string }
> = {
  fit: {
    label: '설치 가능',
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    icon: '✓',
  },
  tight: {
    label: '빡빡함',
    bg: 'bg-accent-soft',
    text: 'text-brand-accessible',
    icon: '!',
  },
  not_fit: {
    label: '설치 어려움',
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: '×',
  },
};

export function TentFitCard({ status, message }: TentFitCardProps) {
  const config = statusConfig[status];

  return (
    <div className={`rounded-2xl p-4 ${config.bg}`}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${config.text} bg-white`}
        >
          {config.icon}
        </span>
        <span className={`text-sm font-bold ${config.text}`}>
          내 텐트 기준 {config.label}
        </span>
      </div>
      <p className={`text-sm leading-relaxed ${config.text}`}>{message}</p>
      <p className="mt-2 text-xs text-ink-muted">
        기준 텐트: {MY_TENT_SIZE.name} ({MY_TENT_SIZE.width}m × {MY_TENT_SIZE.depth}m)
      </p>
    </div>
  );
}
