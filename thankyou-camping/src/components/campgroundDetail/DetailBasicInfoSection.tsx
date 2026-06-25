import { getCampgroundEnvironment } from '../../data/campgroundDetailHelpers';
import type { Campground } from '../../types';

interface DetailBasicInfoSectionProps {
  campground: Campground;
}

const MORE_BUTTON_CLASS =
  'mt-5 flex h-[38px] w-full items-center justify-center rounded-[14px] bg-[#F5F5F5] text-[13px] font-medium text-ink-secondary';

export function DetailBasicInfoSection({ campground }: DetailBasicInfoSectionProps) {
  const environment = getCampgroundEnvironment(campground);

  return (
    <section id="basic-info" className="px-5 py-7">
      <h2 className="text-[18px] font-bold text-ink">캠핑장 기본 정보</h2>

      <div className="mt-5 rounded-[14px] bg-[#F5F5F5] px-4 py-4">
        <div className="flex gap-4 text-[13px]">
          <span className="w-[72px] shrink-0 text-ink-secondary">매너타임</span>
          <span className="font-semibold text-ink">오후 10:00 - 오전 8:00</span>
        </div>
        <div className="mt-2 flex gap-4 text-[13px]">
          <span className="w-[72px] shrink-0 text-ink-secondary">입퇴실</span>
          <span className="font-semibold text-ink">오후 3:00 - 오전 11:00</span>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-[13px]">
        <div className="flex gap-4">
          <span className="w-[72px] shrink-0 text-ink-secondary">환경</span>
          <span className="font-medium text-ink">{environment}</span>
        </div>
        <div className="flex gap-4">
          <span className="w-[72px] shrink-0 text-ink-secondary">위치</span>
          <span className="line-clamp-2 font-medium text-ink">{campground.address}</span>
        </div>
      </div>

      <button type="button" className={MORE_BUTTON_CLASS}>
        더 보기 &gt;
      </button>
    </section>
  );
}
