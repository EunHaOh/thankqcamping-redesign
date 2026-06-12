import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';
import { HOME_SEARCH_PLACEHOLDER } from '../data/homeData';

export function HomeSearchBar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => navigate(ROUTES.searchInput)}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-surface-border bg-white px-4 py-2.5 text-left shadow-sm"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="#999999" strokeWidth="1.8" />
          <path d="M16 16l4 4" stroke="#999999" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="truncate text-sm text-ink-muted">{HOME_SEARCH_PLACEHOLDER}</span>
      </button>
      <button
        type="button"
        aria-label="알림"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border bg-white text-ink-secondary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4a5 5 0 00-5 5v3.5L5 15h14l-2-2.5V9a5 5 0 00-5-5zM10 18a2 2 0 004 0"
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
