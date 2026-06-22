import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

interface HomeSectionHeaderProps {
  title: string;
  onMore?: () => void;
}

export function HomeSectionHeader({ title, onMore }: HomeSectionHeaderProps) {
  const navigate = useNavigate();

  const scrollToPageTop = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  };

  const handleMore = () => {
    if (onMore) {
      onMore();
      scrollToPageTop();
      return;
    }
    navigate(ROUTES.searchResultList);
    scrollToPageTop();
  };

  return (
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      <button
        type="button"
        onClick={handleMore}
        aria-label={`${title} 더보기`}
        className="-mr-1 flex h-7 w-7 items-center justify-center text-ink-muted"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
