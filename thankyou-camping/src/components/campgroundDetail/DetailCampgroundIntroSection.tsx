import { getCampgroundIntro } from '../../data/campgroundDetailHelpers';
import type { Campground } from '../../types';

interface DetailCampgroundIntroSectionProps {
  campground: Campground;
}

export function DetailCampgroundIntroSection({ campground }: DetailCampgroundIntroSectionProps) {
  const intro = getCampgroundIntro(campground);

  return (
    <section id="campground-intro" className="px-5 py-7">
      <h2 className="text-[18px] font-bold text-ink">캠핑장 소개</h2>

      <h3 className="mt-4 text-[16px] font-bold leading-[1.45] text-ink">{intro.title}</h3>

      <p className="mt-2 text-[14px] leading-[1.65] text-ink-secondary">{intro.body}</p>

      <button
        type="button"
        className="mt-5 flex h-[38px] w-full items-center justify-center rounded-[14px] bg-[#F5F5F5] text-[13px] font-medium text-ink-secondary"
      >
        더 보기 &gt;
      </button>
    </section>
  );
}
