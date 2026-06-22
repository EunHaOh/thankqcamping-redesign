import type { ReactNode } from 'react';

interface HomeNewCampBundleScrollProps {
  children: ReactNode;
}

/** 신생 캠핑장 전용 — 카드 2개 묶음 가로 스크롤 + 다음 묶음 peek */
export function HomeNewCampBundleScroll({ children }: HomeNewCampBundleScrollProps) {
  return (
    <div className="-mr-3 w-[calc(100%+12px)] overflow-x-hidden">
      <div className="flex snap-x snap-proximity gap-2.5 overflow-x-auto overscroll-x-contain pl-0 pr-3 pb-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}
