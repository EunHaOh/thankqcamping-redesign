/** GTM 컨테이너 ID — index.html 설치용 (확인용 상수, gtag 직접 호출 금지) */
export const GTM_CONTAINER_ID = 'GTM-KR93LNS7';

/** GA4 측정 ID — GTM Google tag 설정용 (앱에서 gtag 설치/호출하지 않음) */
export const GA4_MEASUREMENT_ID = 'G-C7J6MV88Y7';

export const TEST_VERSION = 'tobe';

const RETURN_FROM_DETAIL_KEY = 'tq_return_from_detail';
const PREVIOUS_CAMP_KEY = 'tq_previous_camp';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    clarity?: (command: 'event' | 'set', ...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  if (typeof window.clarity === 'function') {
    window.clarity('event', eventName);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        window.clarity!('set', key, String(value));
      }
    });
  }

  if (import.meta.env.DEV) {
    console.log('[analytics]', eventName, params);
  }
}

export function markDetailBackToList(campgroundId: string, campgroundName: string) {
  sessionStorage.setItem(RETURN_FROM_DETAIL_KEY, '1');
  sessionStorage.setItem(
    PREVIOUS_CAMP_KEY,
    JSON.stringify({ id: campgroundId, name: campgroundName }),
  );
}

export function trackAnotherCampAfterReturnIfNeeded(nextCamp: { id: string; name: string }) {
  if (sessionStorage.getItem(RETURN_FROM_DETAIL_KEY) !== '1') return;

  try {
    const prev = JSON.parse(sessionStorage.getItem(PREVIOUS_CAMP_KEY) ?? '{}') as {
      id?: string;
      name?: string;
    };

    if (prev.id && prev.id !== nextCamp.id) {
      trackEvent('tq_click_another_camp_after_return', {
        page_name: 'search_results',
        previous_campground_id: prev.id,
        previous_campground_name: prev.name ?? '',
        next_campground_id: nextCamp.id,
        next_campground_name: nextCamp.name,
        test_version: TEST_VERSION,
      });
    }
  } finally {
    sessionStorage.removeItem(RETURN_FROM_DETAIL_KEY);
    sessionStorage.removeItem(PREVIOUS_CAMP_KEY);
  }
}
