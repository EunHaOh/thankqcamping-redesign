import { useEffect, useRef } from 'react';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { isAppInstalled, usePwaInstallPrompt } from '../hooks/usePwaInstallPrompt';

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InstallGuide({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="rounded-xl border border-[#FCD9C8] bg-[#FFF7F2] p-3 text-xs leading-relaxed text-ink-secondary">
      <p>{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 text-xs font-semibold text-[#F26522]"
      >
        안내 닫기
      </button>
    </div>
  );
}

export function PwaInstallBanner() {
  const {
    browserType,
    installPromptAvailable,
    shouldShowBanner,
    helperText,
    guideOpen,
    openInstallGuide,
    closeInstallGuide,
    dismissBanner,
  } = usePwaInstallPrompt();
  const viewedRef = useRef(false);

  useEffect(() => {
    if (!shouldShowBanner || viewedRef.current) return;

    viewedRef.current = true;
    trackEvent('tq_view_pwa_install_banner', {
      page_name: 'home',
      browser_type: browserType,
      install_prompt_available: installPromptAvailable,
      is_standalone: isAppInstalled(),
      test_version: TEST_VERSION,
    });
  }, [browserType, installPromptAvailable, shouldShowBanner]);

  if (!shouldShowBanner) return null;

  const handleInstallClick = async () => {
    if (!installPromptAvailable) {
      trackEvent('tq_click_pwa_install_guide', {
        page_name: 'home',
        browser_type: browserType,
        guide_type: browserType,
        test_version: TEST_VERSION,
      });
    }
    openInstallGuide();
  };

  const handleDismiss = () => {
    trackEvent('tq_dismiss_pwa_install', {
      page_name: 'home',
      browser_type: browserType,
      reason: 'banner_close',
      test_version: TEST_VERSION,
    });
    dismissBanner();
  };

  return (
    <section className="rounded-2xl border border-surface-border bg-white p-3.5 shadow-soft">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">
            땡큐캠핑을 앱처럼 사용해보세요
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
            {installPromptAvailable
              ? '홈 화면에서 바로 열 수 있어요.'
              : helperText}
          </p>
          <button
            type="button"
            onClick={handleInstallClick}
            className="mt-2.5 inline-flex h-9 items-center justify-center rounded-lg bg-[#FF5A1F] px-3.5 text-xs font-semibold text-white"
          >
            {installPromptAvailable ? '앱 설치하기' : '설치 방법 보기'}
          </button>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="설치 안내 닫기"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-muted"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-3">
        <InstallGuide
          open={guideOpen}
          message={helperText}
          onClose={closeInstallGuide}
        />
      </div>
    </section>
  );
}
