import { useEffect, useMemo, useRef, useState } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const DEMO_TODAY = new Date(2026, 5, 12);
const MIN_MONTH_INDEX = 0;
const MAX_MONTH_INDEX = 6;
const CALENDAR_MONTHS = Array.from({ length: 7 }, (_, i) => ({
  year: 2026,
  month: 5 + i,
}));

export interface DateRange {
  checkIn: Date;
  checkOut: Date;
}

interface DatePickerBottomSheetProps {
  open: boolean;
  checkIn: Date;
  checkOut: Date;
  onApply: (range: DateRange) => void;
  onClose: () => void;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function isAfterDay(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

function formatSummary(date: Date | null) {
  if (!date) return '날짜 선택';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const day = DAY_LABELS[date.getDay()];
  return `${y}.${m}.${d} (${day})`;
}

export function formatDateRangeLabel(checkIn: Date, checkOut: Date) {
  return `${checkIn.getMonth() + 1}.${checkIn.getDate()}~${checkOut.getMonth() + 1}.${checkOut.getDate()}`;
}

function getNights(checkIn: Date, checkOut: Date) {
  const ms = startOfDay(checkOut).getTime() - startOfDay(checkIn).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function getStayLabel(checkIn: Date, checkOut: Date) {
  const nights = getNights(checkIn, checkOut);
  return `${nights}박 ${nights + 1}일`;
}

function monthIndexFromDate(date: Date) {
  return Math.min(MAX_MONTH_INDEX, Math.max(MIN_MONTH_INDEX, date.getMonth() - 5));
}

interface MonthCalendarProps {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  minDate: Date;
  onSelect: (date: Date) => void;
}

function MonthCalendar({
  year,
  month,
  checkIn,
  checkOut,
  minDate,
  onSelect,
}: MonthCalendarProps) {
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: (number | null)[] = [];

    for (let i = 0; i < firstDay; i += 1) result.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) result.push(d);

    return result;
  }, [year, month]);

  const rangeStart = checkIn && checkOut ? checkIn : checkIn;
  const rangeEnd = checkIn && checkOut ? checkOut : null;

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-8 items-center justify-center text-xs text-ink-muted"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-11" />;
          }

          const date = new Date(year, month, day);
          const disabled = isBeforeDay(date, minDate);
          const isStart = rangeStart ? isSameDay(date, rangeStart) : false;
          const isEnd = rangeEnd ? isSameDay(date, rangeEnd) : false;
          const inRange =
            rangeStart &&
            rangeEnd &&
            !isBeforeDay(date, rangeStart) &&
            !isAfterDay(date, rangeEnd);
          const isMiddle = inRange && !isStart && !isEnd;

          let rangeBg = '';
          if (isMiddle) rangeBg = 'bg-[#FFF4EE]';
          if (isStart && rangeEnd && !isSameDay(rangeStart!, rangeEnd)) {
            rangeBg = 'rounded-l-full bg-[#FFF4EE]';
          }
          if (isEnd && rangeStart && rangeEnd && !isSameDay(rangeStart, rangeEnd)) {
            rangeBg = 'rounded-r-full bg-[#FFF4EE]';
          }
          if (isStart && isEnd) rangeBg = '';

          return (
            <button
              key={`${year}-${month}-${day}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(date)}
              className={`relative flex h-11 items-center justify-center ${rangeBg} ${
                disabled ? 'cursor-not-allowed' : ''
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center text-sm ${
                  disabled
                    ? 'text-[#D1D5DB]'
                    : isStart || isEnd
                      ? 'rounded-full bg-[#F26522] font-semibold text-white'
                      : 'font-medium text-ink'
                }`}
              >
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MonthNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? '이전 달' : '다음 달'}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-border text-ink-secondary disabled:cursor-not-allowed disabled:opacity-30"
    >
      {direction === 'prev' ? '‹' : '›'}
    </button>
  );
}

export function DatePickerBottomSheet({
  open,
  checkIn,
  checkOut,
  onApply,
  onClose,
}: DatePickerBottomSheetProps) {
  const [draftCheckIn, setDraftCheckIn] = useState<Date | null>(checkIn);
  const [draftCheckOut, setDraftCheckOut] = useState<Date | null>(checkOut);
  const [monthIndex, setMonthIndex] = useState(monthIndexFromDate(checkIn));
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setDraftCheckIn(checkIn);
      setDraftCheckOut(checkOut);
      setMonthIndex(monthIndexFromDate(checkIn));
    }
  }, [open, checkIn, checkOut]);

  const minDate = startOfDay(DEMO_TODAY);
  const canApply = draftCheckIn !== null && draftCheckOut !== null;
  const canGoPrev = monthIndex > MIN_MONTH_INDEX;
  const canGoNext = monthIndex < MAX_MONTH_INDEX;
  const { year, month } = CALENDAR_MONTHS[monthIndex];
  const monthLabel = `${year}년 ${month + 1}월`;

  const goPrevMonth = () => {
    if (canGoPrev) setMonthIndex((i) => i - 1);
  };

  const goNextMonth = () => {
    if (canGoNext) setMonthIndex((i) => i + 1);
  };

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const diff = clientX - touchStartX.current;
    if (diff > 50) goPrevMonth();
    else if (diff < -50) goNextMonth();
    touchStartX.current = null;
  };

  const handleSelect = (date: Date) => {
    if (isBeforeDay(date, minDate)) return;

    if (!draftCheckIn || (draftCheckIn && draftCheckOut)) {
      setDraftCheckIn(date);
      setDraftCheckOut(null);
      return;
    }

    if (isBeforeDay(date, draftCheckIn) || isSameDay(date, draftCheckIn)) {
      setDraftCheckIn(date);
      setDraftCheckOut(null);
      return;
    }

    setDraftCheckOut(date);
  };

  const handleApply = () => {
    if (!draftCheckIn || !draftCheckOut) return;
    onApply({ checkIn: draftCheckIn, checkOut: draftCheckOut });
    onClose();
  };

  if (!open) return null;

  const stayLabel =
    draftCheckIn && draftCheckOut
      ? getStayLabel(draftCheckIn, draftCheckOut)
      : '날짜를 선택해주세요';

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
            <h2 className="text-base font-bold text-ink">날짜 선택</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-ink-muted"
            >
              ×
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-surface-border p-3">
            <div>
              <p className="mb-1 text-xs text-ink-muted">체크인</p>
              <p className="text-sm font-semibold text-ink">
                {formatSummary(draftCheckIn)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-ink-muted">체크아웃</p>
              <p className="text-sm font-semibold text-ink">
                {formatSummary(draftCheckOut)}
              </p>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <MonthNavButton direction="prev" disabled={!canGoPrev} onClick={goPrevMonth} />
            <p className="text-sm font-bold text-ink">{monthLabel}</p>
            <MonthNavButton direction="next" disabled={!canGoNext} onClick={goNextMonth} />
          </div>
        </div>

        <div
          className="shrink-0 px-4 pb-4"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
        >
          <MonthCalendar
            year={year}
            month={month}
            checkIn={draftCheckIn}
            checkOut={draftCheckOut}
            minDate={minDate}
            onSelect={handleSelect}
          />
        </div>

        <div className="mt-auto shrink-0 border-t border-surface-border bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <p className="text-sm font-semibold text-ink">{stayLabel}</p>
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={!canApply}
              className="btn-cta min-w-[120px] flex-1 disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
