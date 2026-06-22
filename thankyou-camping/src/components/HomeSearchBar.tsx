import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';
import { HOME_SEARCH_PLACEHOLDER } from '../data/homeData';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

export function HomeSearchBar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <span
        className="shrink-0 select-none text-[23px] font-extrabold leading-none text-[#F26522]"
        aria-label="땡큐캠핑 홈"
      >
        Q
      </span>
      <button
        type="button"
        onClick={() => {
          trackEvent('tq_click_home_search', {
            page_name: 'home',
            test_version: TEST_VERSION,
          });
          navigate(ROUTES.searchInput);
        }}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#F2F3F5] px-3.5 py-2 text-left"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="#5A5A5A" strokeWidth="1.8" />
          <path d="M16 16l4 4" stroke="#5A5A5A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="truncate text-[13px] text-ink-secondary">{HOME_SEARCH_PLACEHOLDER}</span>
      </button>
      <button
        type="button"
        aria-label="알림"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-secondary"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
