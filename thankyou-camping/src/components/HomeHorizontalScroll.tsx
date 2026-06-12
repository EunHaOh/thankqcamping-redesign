import type { ReactNode } from 'react';

interface HomeHorizontalScrollProps {
  children: ReactNode;
}

export function HomeHorizontalScroll({ children }: HomeHorizontalScrollProps) {
  return (
    <div
      className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-1"
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-x',
        scrollSnapType: 'x proximity',
      }}
    >
      {children}
    </div>
  );
}
