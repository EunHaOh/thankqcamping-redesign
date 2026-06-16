const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function startOfDay(date: Date = new Date()): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** 앱 실행 시점 로컬 날짜 기준 오늘 00:00 */
export function getDefaultCheckIn(): Date {
  return startOfDay(new Date());
}

/** 기본 체크아웃: 오늘 + 1일 (로컬 시간) */
export function getDefaultCheckOut(): Date {
  return addDays(getDefaultCheckIn(), 1);
}

/** YYYY.MM.DD — toISOString() 사용하지 않음 (타임존 밀림 방지) */
export function formatDateForBooking(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
}

export function getDefaultBookingDateRange(): { checkIn: string; checkOut: string } {
  const checkIn = getDefaultCheckIn();
  const checkOut = getDefaultCheckOut();
  return {
    checkIn: formatDateForBooking(checkIn),
    checkOut: formatDateForBooking(checkOut),
  };
}

export function parseBookingDateString(value: string): Date {
  const [year, month, day] = value.split('.').map(Number);
  return startOfDay(new Date(year, month - 1, day));
}

export function formatBookingDateWithWeekday(value: string): string {
  const date = parseBookingDateString(value);
  return `${value} (${WEEKDAY_LABELS[date.getDay()]})`;
}
