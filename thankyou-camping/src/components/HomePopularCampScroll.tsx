import type { ReactNode } from 'react';

interface HomePopularCampScrollProps {
  children: ReactNode;
}

/** 실시간 인기 캠핑장 전용 가로 스크롤 — 첫 카드 강조 + 다음 카드 peek */
export function HomePopularCampScroll({ children }: HomePopularCampScrollProps) {
  return (
    <div className="w-[calc(100%+24px)] -mx-3 overflow-x-hidden">
      <div className="flex snap-x snap-proximity gap-2.5 overflow-x-auto overscroll-x-contain px-3 pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}
