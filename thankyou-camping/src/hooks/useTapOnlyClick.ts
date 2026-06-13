import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from 'react';

const TAP_THRESHOLD_PX = 10;

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

      if (import.meta.env.DEV) {
        console.log('[home-touch]', {
          start,
          end: { x: event.clientX, y: event.clientY },
          dx,
          dy,
          intent: dx <= threshold && dy <= threshold ? 'tap' : 'scroll',
        });
      }

      if (dx <= threshold && dy <= threshold) {
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
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      onTap();
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
