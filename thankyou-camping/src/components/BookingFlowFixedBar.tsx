interface BookingFlowFixedBarProps {
  dateLabel: string;
  subLabel: string;
  buttonLabel: string;
  disabled?: boolean;
  onClick: () => void;
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="shrink-0 text-ink-secondary"
      aria-hidden="true"
    >
      <path d="M7 3v2M17 3v2M5 8h14M6 5h12a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1z" />
    </svg>
  );
}

/** 캠핑장 상세 / 사이트 상세 공통 예약 흐름 하단 고정바 */
export function BookingFlowFixedBar({
  dateLabel,
  subLabel,
  buttonLabel,
  disabled = false,
  onClick,
}: BookingFlowFixedBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-mobile min-w-0 -translate-x-1/2 overflow-x-clip border-t border-[#EFEFEF] bg-white foldable:max-w-[min(100dvw,480px)]">
      <div className="flex min-h-[72px] items-center gap-3 px-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <CalendarIcon />
            <p className="truncate text-[16px] font-bold leading-tight text-ink">{dateLabel}</p>
          </div>
          <p className="mt-1 truncate text-[14px] font-medium leading-snug text-ink-secondary">
            {subLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="ml-auto h-[52px] min-w-[148px] max-w-[58%] flex-1 rounded-[14px] bg-[#F26522] px-3 text-[15px] font-bold leading-tight text-white disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
