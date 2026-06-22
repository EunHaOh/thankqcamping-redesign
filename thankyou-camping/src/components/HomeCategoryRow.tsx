import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import type { HomeCategory } from '../data/homeData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { TapAction } from './TapAction';

const CATEGORY_EMOJI: Record<string, string> = {
  auto: '⛺',
  glamping: '🏕️',
  caravan: '🚐',
  pension: '🏡',
  car: '🚙',
  kids: '🧸',
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
      <div className="overflow-hidden rounded-[22px] border border-[#EEF0F2] bg-white py-3 shadow-section">
        <div className="home-horizontal-list">
          {categories.map((category) => (
            <TapAction
              key={category.id}
              onTap={() => handleClick(category)}
              ariaLabel={`${category.label} 카테고리`}
              className="home-horizontal-card flex w-[54px] cursor-pointer flex-col items-center gap-1"
            >
              <span className="text-[27px] leading-none" aria-hidden="true">
                {CATEGORY_EMOJI[category.id] ?? '⛺'}
              </span>
              <span className="whitespace-nowrap text-[12px] font-medium text-ink-secondary">
                {category.label}
              </span>
            </TapAction>
          ))}
        </div>
      </div>
    </section>
  );
}
