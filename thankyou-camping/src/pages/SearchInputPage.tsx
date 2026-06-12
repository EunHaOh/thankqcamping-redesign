import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileShell } from '../components/MobileShell';
import { useSearch } from '../context/SearchContext';
import {
  RECENT_SEARCHES,
  RECOMMENDED_SEARCHES,
  SEARCH_INPUT_PLACEHOLDER,
} from '../data/searchData';
import { ROUTES } from '../routes/paths';

function SearchKeywordChip({
  label,
  onClick,
}: {
  label: string;
  onClick: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(label)}
      className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-sm text-ink-secondary"
    >
      {label}
    </button>
  );
}

export function SearchInputPage() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeSearch = (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);
    navigate(ROUTES.searchResultList);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    executeSearch(inputValue);
  };

  return (
    <MobileShell>
      <header className="sticky top-0 z-30 border-b border-surface-border bg-white">
        <div className="flex h-14 items-center gap-2 px-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            aria-label="뒤로가기"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-border"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-surface-border bg-[#FAFAFA] px-3 py-2"
          >
            <input
              ref={inputRef}
              type="search"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={SEARCH_INPUT_PLACEHOLDER}
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              enterKeyHint="search"
            />
            <button
              type="submit"
              aria-label="검색"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M16 16l4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </header>

      <main className="space-y-6 px-4 py-5">
        <section>
          <h2 className="mb-3 text-sm font-bold text-ink">최근 검색어</h2>
          <div className="flex flex-wrap gap-2">
            {RECENT_SEARCHES.map((keyword) => (
              <SearchKeywordChip
                key={keyword}
                label={keyword}
                onClick={(value) => {
                  setInputValue(value);
                  executeSearch(value);
                }}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold text-ink">추천 검색어</h2>
          <div className="flex flex-wrap gap-2">
            {RECOMMENDED_SEARCHES.map((keyword) => (
              <SearchKeywordChip
                key={keyword}
                label={keyword}
                onClick={(value) => {
                  setInputValue(value);
                  executeSearch(value);
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </MobileShell>
  );
}
