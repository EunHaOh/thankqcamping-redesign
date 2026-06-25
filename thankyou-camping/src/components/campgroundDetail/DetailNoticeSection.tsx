import { getNoticeItems } from '../../data/campgroundDetailHelpers';
import type { Campground } from '../../types';

interface DetailNoticeSectionProps {
  campground: Campground;
}

export function DetailNoticeSection({ campground }: DetailNoticeSectionProps) {
  const notice = getNoticeItems(campground)[0] ?? `[NOTICE] ${campground.name} 이용 안내`;

  return (
    <section id="notice" className="px-5 py-7">
      <h2 className="text-[17px] font-bold text-ink">📢 Notice</h2>
      <div className="mt-4 rounded-[16px] border border-[#E9E9E9] bg-white px-[18px] py-4">
        <p className="line-clamp-2 text-[15px] leading-[1.45] text-ink">{notice}</p>
      </div>
    </section>
  );
}
