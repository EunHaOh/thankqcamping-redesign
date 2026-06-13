import type { ReactNode } from 'react';

interface HomeHorizontalScrollProps {
  children: ReactNode;
}

export function HomeHorizontalScroll({ children }: HomeHorizontalScrollProps) {
  return (
    <div className="home-horizontal-viewport">
      <div className="home-horizontal-list pb-1">{children}</div>
    </div>
  );
}
