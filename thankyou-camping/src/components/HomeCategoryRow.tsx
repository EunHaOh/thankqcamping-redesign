import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import type { HomeCategory } from '../data/homeData';
import { ROUTES } from '../routes/paths';

function CategoryIcon({ id }: { id: string }) {
  const common = 'stroke-current';
  switch (id) {
    case 'auto':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 18h16M6 14l2-6h8l2 6" className={common} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" className={common} strokeWidth="1.8" />
        </svg>
      );
    case 'glamping':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 18h16M7 18l5-10 5 10" className={common} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'caravan':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="8" width="14" height="8" rx="1.5" className={common} strokeWidth="1.8" />
          <path d="M17 11h3v5h-3M7 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" className={common} strokeWidth="1.8" />
        </svg>
      );
    case 'pension':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 19V9l8-4 8 4v10" className={common} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 19v-6h6v6" className={common} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'car':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 17h14l-1.5-5H6.5L5 17z" className={common} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" className={common} strokeWidth="1.8" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3" className={common} strokeWidth="1.8" />
          <path d="M6 18c1.5-2.5 4-3.5 6-3.5s4.5 1 6 3.5" className={common} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  auto: 'bg-[#FFF4EE] text-[#F26522]',
  glamping: 'bg-[#F3E8FF] text-[#7C3AED]',
  caravan: 'bg-[#E8F4FD] text-[#2563EB]',
  pension: 'bg-[#F0FDF4] text-[#16A34A]',
  car: 'bg-[#FEF3C7] text-[#D97706]',
  kids: 'bg-[#FCE7F3] text-[#DB2777]',
};

interface HomeCategoryRowProps {
  categories: HomeCategory[];
}

export function HomeCategoryRow({ categories }: HomeCategoryRowProps) {
  const navigate = useNavigate();
  const { applyTheme } = useSearch();

  const handleClick = (category: HomeCategory) => {
    applyTheme(category);
    navigate(ROUTES.searchResultList);
  };

  return (
    <section className="-mx-4">
      <div
        className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-1"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleClick(category)}
            className="flex w-[56px] shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                CATEGORY_COLORS[category.id] ?? 'bg-white text-ink'
              }`}
            >
              <CategoryIcon id={category.id} />
            </span>
            <span className="whitespace-nowrap text-[11px] font-medium text-ink-secondary">
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
