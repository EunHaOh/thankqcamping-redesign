/** GTM 컨테이너 ID — index.html 설치용 (확인용 상수, gtag 직접 호출 금지) */
export const GTM_CONTAINER_ID = 'GTM-KR93LNS7';

/** GA4 측정 ID — GTM Google tag 설정용 (앱에서 gtag 설치/호출하지 않음) */
export const GA4_MEASUREMENT_ID = 'G-C7J6MV88Y7';

/**
 * Microsoft Clarity 프로젝트 ID — GTM Custom HTML 태그에 설정.
 * ID가 없으면 앱은 정상 동작하며, Clarity는 GTM에서 설치합니다.
 */
export const CLARITY_PROJECT_ID = 'CLARITY_PROJECT_ID_HERE';

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

export function isClarityAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.clarity === 'function';
}

function pushToClarity(eventName: string, params: AnalyticsParams) {
  if (!isClarityAvailable()) return;

  try {
    window.clarity!('event', eventName);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        window.clarity!('set', key, String(value));
      }
    });
  } catch {
    // Clarity 미설치 또는 스크립트 오류 시 앱 동작에 영향 없음
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  pushToClarity(eventName, params);

  if (import.meta.env.DEV) {
    console.log('[analytics]', eventName, params);
  }
}

export function getDataLayerSnapshot(): {
  exists: boolean;
  totalLength: number;
  tqEventCount: number;
  recentTqEvents: Array<Record<string, unknown>>;
} {
  if (typeof window === 'undefined' || !window.dataLayer) {
    return {
      exists: false,
      totalLength: 0,
      tqEventCount: 0,
      recentTqEvents: [],
    };
  }

  const tqEvents = window.dataLayer.filter(
    (item) =>
      typeof item.event === 'string' &&
      (item.event as string).startsWith('tq_'),
  );

  return {
    exists: true,
    totalLength: window.dataLayer.length,
    tqEventCount: tqEvents.length,
    recentTqEvents: tqEvents.slice(-10).reverse(),
  };
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
