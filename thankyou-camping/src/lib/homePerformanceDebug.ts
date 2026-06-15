import { getBrowserType } from '../hooks/usePwaInstallPrompt';

export interface HomePerformanceSnapshot {
  renderCount: number;
  imageCount: number;
  lazyImageCount: number;
  viewportWidth: number;
  horizontalOverflow: boolean;
  isOnline: boolean;
  browserType: string;
}

function hasHorizontalOverflow(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.scrollWidth > window.innerWidth + 1;
}

export function collectHomePerformanceSnapshot(renderCount: number): HomePerformanceSnapshot {
  const main = document.querySelector('main');
  const images = main ? main.querySelectorAll('img') : document.querySelectorAll('img');
  const lazyImages = main
    ? main.querySelectorAll('img[loading="lazy"]')
    : document.querySelectorAll('img[loading="lazy"]');

  return {
    renderCount,
    imageCount: images.length,
    lazyImageCount: lazyImages.length,
    viewportWidth: window.innerWidth,
    horizontalOverflow: hasHorizontalOverflow(),
    isOnline: navigator.onLine,
    browserType: getBrowserType(),
  };
}

export function logHomePerformance(snapshot: HomePerformanceSnapshot) {
  if (!import.meta.env.DEV) return;

  console.log('[home-perf] render count:', snapshot.renderCount);
  console.log('[home-perf] image count:', snapshot.imageCount);
  console.log('[home-perf] lazy image count:', snapshot.lazyImageCount);
  console.log('[home-perf] viewport width:', snapshot.viewportWidth);
  console.log('[home-perf] horizontal overflow:', snapshot.horizontalOverflow);
  console.log('[home-perf] online:', snapshot.isOnline);
  console.log('[home-perf] browser_type:', snapshot.browserType);
}

export function logHomeLayoutDebug(mainElement: HTMLElement | null) {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  const innerWidth = window.innerWidth;
  const clientWidth = document.documentElement.clientWidth;
  const scrollWidth = document.body.scrollWidth;
  const overflow = hasHorizontalOverflow();
  const mainWidth = mainElement?.getBoundingClientRect().width ?? 0;

  console.log('[home-layout] innerWidth:', innerWidth);
  console.log('[home-layout] documentElement.clientWidth:', clientWidth);
  console.log('[home-layout] body.scrollWidth:', scrollWidth);
  console.log('[home-layout] horizontal overflow:', overflow);
  console.log('[home-layout] HomePage main width:', mainWidth);
  console.log('[home-layout] viewport width:', window.innerWidth);
  console.log('[home-layout] horizontal overflow:', overflow);
}

export function initHomeLayoutDebug(getMainElement: () => HTMLElement | null) {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  const log = () => logHomeLayoutDebug(getMainElement());

  const timer = window.setTimeout(log, 500);
  window.addEventListener('resize', log);
  window.addEventListener('orientationchange', log);

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener('resize', log);
    window.removeEventListener('orientationchange', log);
  };
}

export function initHomePerformanceDebug(getRenderCount: () => number) {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  const log = () => {
    logHomePerformance(collectHomePerformanceSnapshot(getRenderCount()));
  };

  const timer = window.setTimeout(log, 500);

  window.addEventListener('resize', log);

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener('resize', log);
  };
}
