import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from 'react';

const TAP_THRESHOLD_PX = 10;

export type TouchIntent = 'tap' | 'scroll';

export interface TouchDebugInfo {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  dx: number;
  dy: number;
  intent: TouchIntent;
}

function logTouchDebug(info: TouchDebugInfo) {
  if (!import.meta.env.DEV) return;

  console.log('[home-touch] touchstart:', { x: info.startX, y: info.startY });
  console.log('[home-touch] touchend:', { x: info.endX, y: info.endY });
  console.log('[home-touch] dx/dy:', { dx: info.dx, dy: info.dy });
  console.log('[home-touch] intent:', info.intent);
}

export function useTapOnlyClick(onTap: () => void, threshold = TAP_THRESHOLD_PX) {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    startRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;

      const dx = Math.abs(event.clientX - start.x);
      const dy = Math.abs(event.clientY - start.y);
      const intent: TouchIntent =
        dx <= threshold && dy <= threshold ? 'tap' : 'scroll';

      logTouchDebug({
        startX: start.x,
        startY: start.y,
        endX: event.clientX,
        endY: event.clientY,
        dx,
        dy,
        intent,
      });

      if (intent === 'tap') {
        onTap();
      }
    },
    [onTap, threshold],
  );

  const onPointerCancel = useCallback(() => {
    startRef.current = null;
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onTap();
      }
    },
    [onTap],
  );

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
  };
}
