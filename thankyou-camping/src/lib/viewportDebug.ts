type BreakpointLabel =
  | 'small-android'
  | 'mobile'
  | 'design-base'
  | 'android-common'
  | 'large-mobile'
  | 'large-android'
  | 'foldable'
  | 'tablet';

function getBreakpoint(width: number): BreakpointLabel {
  if (width >= 768) return 'tablet';
  if (width >= 600) return 'foldable';
  if (width >= 480) return 'large-android';
  if (width >= 430) return 'large-mobile';
  if (width >= 412) return 'android-common';
  if (width >= 390) return 'design-base';
  if (width >= 375) return 'mobile';
  return 'small-android';
}

function hasHorizontalOverflow(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.scrollWidth > window.innerWidth + 1;
}

export function logViewportDiagnostics() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  const innerWidth = window.innerWidth;
  const clientWidth = document.documentElement.clientWidth;
  const scrollWidth = document.body.scrollWidth;
  const overflow = hasHorizontalOverflow();

  console.log('[viewport] innerWidth:', innerWidth);
  console.log('[viewport] documentElement.clientWidth:', clientWidth);
  console.log('[viewport] body.scrollWidth:', scrollWidth);
  console.log('[viewport] horizontal overflow:', overflow);
  console.log('[viewport] breakpoint:', getBreakpoint(innerWidth));
}

export function initViewportDebug() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  logViewportDiagnostics();
  window.addEventListener('resize', logViewportDiagnostics);
  window.addEventListener('orientationchange', logViewportDiagnostics);
}
