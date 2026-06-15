import { useEffect, useMemo, useState } from 'react';
import {
  BROAD_REGIONS,
  SUB_REGIONS,
  getBroadRegionFromLabel,
  getSubRegionFromLabel,
  searchRegions,
  toRegionDisplayValue,
  type BroadRegion,
} from '../data/regionData';

interface RegionPickerBottomSheetProps {
  open: boolean;
  selected: string;
  onApply: (region: string) => void;
  onClose: () => void;
}

export function RegionPickerBottomSheet({
  open,
  selected,
  onApply,
  onClose,
}: RegionPickerBottomSheetProps) {
  const [broadRegion, setBroadRegion] = useState<BroadRegion>('서울/경기');
  const [draftSub, setDraftSub] = useState('경기 가평');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      const broad = getBroadRegionFromLabel(selected);
      setBroadRegion(broad);
      if (selected === '전국') {
        setDraftSub('');
      } else {
        setDraftSub(getSubRegionFromLabel(selected, broad));
      }
      setSearchQuery('');
    }
  }, [open, selected]);

  const draftLabel = useMemo(() => {
    if (broadRegion === '전국') return '전국';
    return toRegionDisplayValue(broadRegion, draftSub);
  }, [broadRegion, draftSub]);

  const searchResults = useMemo(
    () => searchRegions(searchQuery),
    [searchQuery],
  );

  const subRegions = SUB_REGIONS[broadRegion];
  const showSearchResults = searchQuery.trim().length > 0;
  const canApply = draftLabel.length > 0;

  const handleBroadSelect = (broad: BroadRegion) => {
    setBroadRegion(broad);
    setSearchQuery('');
    if (broad === '전국') {
      setDraftSub('');
    } else {
      setDraftSub(SUB_REGIONS[broad][0]);
    }
  };

  const handleSubSelect = (sub: string) => {
    setDraftSub(sub);
    setSearchQuery('');
  };

  const handleSearchResult = (broad: BroadRegion, sub: string) => {
    setBroadRegion(broad);
    setDraftSub(sub);
    setSearchQuery('');
  };

  const handleApply = () => {
    if (!canApply) return;
    onApply(draftLabel);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="app-container relative z-10 w-full">
        <div className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-white">
        <div className="shrink-0 px-4 pt-4">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-surface-border" />
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink">지역 선택</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-ink-muted"
            >
              ×
            </button>
          </div>

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="지역명 검색"
            className="mb-4 h-11 w-full rounded-lg border border-surface-border px-3 text-sm text-ink placeholder:text-ink-muted"
          />
        </div>

        {showSearchResults ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            {searchResults.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">
                검색 결과가 없습니다.
              </p>
            ) : (
              <ul className="space-y-1">
                {searchResults.map(({ broad, sub }) => {
                  const label = toRegionDisplayValue(broad, sub);
                  const isSelected = draftLabel === label;
                  return (
                    <li key={`${broad}-${sub}`}>
                      <button
                        type="button"
                        onClick={() => handleSearchResult(broad, sub)}
                        className={`flex h-11 w-full items-center justify-between rounded-lg px-3 text-sm ${
                          isSelected
                            ? 'bg-[#FFF4EE] font-semibold text-[#F26522]'
                            : 'text-ink-secondary'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        {isSelected && <span className="shrink-0 text-[#F26522]">✓</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 border-t border-surface-border">
            <ul className="scrollbar-hide w-[108px] shrink-0 overflow-y-auto border-r border-surface-border py-2">
              {BROAD_REGIONS.map((broad) => {
                const active = broadRegion === broad;
                return (
                  <li key={broad}>
                    <button
                      type="button"
                      onClick={() => handleBroadSelect(broad)}
                      className={`flex h-11 w-full items-center px-3 text-left text-sm ${
                        active
                          ? 'bg-[#FFF4EE] font-semibold text-[#F26522]'
                          : 'text-ink-secondary'
                      }`}
                    >
                      <span className="truncate">{broad}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <ul className="scrollbar-hide min-w-0 flex-1 overflow-y-auto py-2 pl-1 pr-3">
              {broadRegion === '전국' ? (
                <li className="px-3 py-6 text-sm text-ink-muted">
                  전국 단위로 검색합니다.
                </li>
              ) : (
                subRegions.map((sub) => {
                  const isSelected = draftSub === sub;
                  return (
                    <li key={sub}>
                      <button
                        type="button"
                        onClick={() => handleSubSelect(sub)}
                        className={`flex h-11 w-full items-center justify-between rounded-lg px-3 text-sm ${
                          isSelected
                            ? 'font-semibold text-[#F26522]'
                            : 'text-ink-secondary'
                        }`}
                      >
                        <span className="truncate">{sub}</span>
                        {isSelected && (
                          <span className="shrink-0 text-[#F26522]">✓</span>
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}

        <div className="shrink-0 border-t border-surface-border bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {canApply ? draftLabel : '지역을 선택해주세요'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={!canApply}
              className="btn-cta min-w-[120px] shrink-0 disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
            >
              적용하기
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
