import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import type { HomeCategory } from '../data/homeData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { TapAction } from './TapAction';

const CATEGORY_ICONS: Record<string, string> = {
  auto: '/icons/AutoCamping.png',
  glamping: '/icons/Glamping.png',
  caravan: '/icons/CaraBan.png',
  pension: '/icons/Penshon.png',
  kids: '/icons/Kids.png',
  transfer: '/icons/Change.png',
};

interface HomeCategoryRowProps {
  categories: HomeCategory[];
}

export function HomeCategoryRow({ categories }: HomeCategoryRowProps) {
  const navigate = useNavigate();
  const { applyTheme } = useSearch();

  const handleClick = (category: HomeCategory) => {
    trackEvent('tq_click_home_category', {
      page_name: 'home',
      category_name: category.label,
      destination_page: 'search_results',
      test_version: TEST_VERSION,
    });
    applyTheme(category);
    navigate(ROUTES.searchResultList);
  };

  return (
    <section className="px-3">
      <div className="rounded-[22px] border border-[#EEF0F2] bg-white py-3 shadow-section">
        <div className="home-horizontal-list home-category-list">
          {categories.map((category) => (
            <TapAction
              key={category.id}
              onTap={() => handleClick(category)}
              ariaLabel={`${category.label} 카테고리`}
              className="home-category-item flex shrink-0 cursor-pointer flex-col items-center gap-1"
            >
              <img
                src={CATEGORY_ICONS[category.id] ?? CATEGORY_ICONS.auto}
                alt=""
                aria-hidden="true"
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="w-full text-center text-[13px] font-medium leading-snug text-ink-secondary">
                {category.label}
              </span>
            </TapAction>
          ))}
        </div>
      </div>
    </section>
  );
}
