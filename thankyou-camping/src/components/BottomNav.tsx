import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

type TabId = 'home' | 'search' | 'bookings' | 'wishlist' | 'my';

interface TabItem {
  id: TabId;
  label: string;
  path?: string;
}

const TABS: TabItem[] = [
  { id: 'home', label: '홈', path: ROUTES.home },
  { id: 'search', label: '검색', path: ROUTES.searchResultList },
  { id: 'bookings', label: '예약' },
  { id: 'wishlist', label: '찜' },
  { id: 'my', label: '마이' },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke={active ? '#F26522' : '#999999'}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke={active ? '#F26522' : '#999999'} strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke={active ? '#F26522' : '#999999'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke={active ? '#F26522' : '#999999'} strokeWidth="1.8" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke={active ? '#F26522' : '#999999'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.6-7-9.5a4 4 0 017-2.6A4 4 0 0119 10.5C19 15.4 12 20 12 20z"
        stroke={active ? '#F26522' : '#999999'}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke={active ? '#F26522' : '#999999'} strokeWidth="1.8" />
      <path
        d="M5 20c1.2-3 3.8-4.5 7-4.5s5.8 1.5 7 4.5"
        stroke={active ? '#F26522' : '#999999'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TabIcon({ id, active }: { id: TabId; active: boolean }) {
  switch (id) {
    case 'home':
      return <HomeIcon active={active} />;
    case 'search':
      return <SearchIcon active={active} />;
    case 'bookings':
      return <CalendarIcon active={active} />;
    case 'wishlist':
      return <HeartIcon active={active} />;
    case 'my':
      return <UserIcon active={active} />;
    default:
      return null;
  }
}

function isTabActive(tab: TabItem, pathname: string): boolean {
  if (tab.id === 'home') return pathname === ROUTES.home;
  if (tab.id === 'search') return pathname === ROUTES.searchResultList;
  return false;
}

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-mobile border-t border-surface-border bg-white"
      aria-label="하단 내비게이션"
    >
      <div className="flex items-stretch pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {TABS.map((tab) => {
          const active = isTabActive(tab, pathname);
          const content = (
            <>
              <TabIcon id={tab.id} active={active} />
              <span
                className={`mt-0.5 text-[10px] font-medium ${
                  active ? 'text-[#F26522]' : 'text-ink-muted'
                }`}
              >
                {tab.label}
              </span>
            </>
          );

          if (tab.path) {
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className="flex min-w-0 flex-1 flex-col items-center justify-center py-1.5"
              >
                {content}
              </NavLink>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              disabled
              aria-disabled="true"
              className="flex min-w-0 flex-1 flex-col items-center justify-center py-1.5 opacity-60"
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export const BOTTOM_NAV_HEIGHT = '4.5rem';
