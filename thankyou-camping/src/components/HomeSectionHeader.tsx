import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

interface HomeSectionHeaderProps {
  title: string;
  onMore?: () => void;
}

export function HomeSectionHeader({ title, onMore }: HomeSectionHeaderProps) {
  const navigate = useNavigate();

  const handleMore = () => {
    if (onMore) {
      onMore();
      return;
    }
    navigate(ROUTES.searchResultList);
  };

  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <button
        type="button"
        onClick={handleMore}
        aria-label={`${title} 더보기`}
        className="flex h-8 w-8 items-center justify-center text-ink-muted"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
