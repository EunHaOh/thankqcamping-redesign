import { formatPrice } from '../data/mockData';

interface SiteDetailFixedCtaProps {
  label: string;
  price: number;
  disabled?: boolean;
  onClick: () => void;
}

/** 사이트 상세 전용 하단 고정바 — 캠핑장 상세 FixedCTA와 분리 */
export function SiteDetailFixedCta({
  label,
  price,
  disabled = false,
  onClick,
}: SiteDetailFixedCtaProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-mobile min-w-0 -translate-x-1/2 overflow-x-clip border-t border-[#EFEFEF] bg-white foldable:max-w-[min(100dvw,480px)]">
      <div className="flex min-h-[72px] items-center gap-3 px-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
        <div className="min-w-0 shrink-0">
          <p className="text-[12px] text-ink-muted">1박 기준</p>
          <p className="text-[18px] font-bold leading-tight text-ink">
            {formatPrice(price)}
            <span className="text-[13px] font-medium text-ink-secondary">/박</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="ml-auto h-[52px] min-w-[148px] max-w-[58%] flex-1 rounded-[14px] bg-[#F26522] px-3 text-[15px] font-bold leading-tight text-white disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
