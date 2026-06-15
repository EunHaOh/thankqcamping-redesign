import { useEffect, useRef } from 'react';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { usePwaInstallPrompt } from '../hooks/usePwaInstallPrompt';

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

function InstallGuideModal({
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
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 px-4 pb-6">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative z-10 w-full min-w-0 max-w-full rounded-2xl bg-white p-5 shadow-lg">
        <h3 className="mb-2 text-base font-bold text-ink">앱 설치 방법</h3>
        <p className="text-sm leading-relaxed text-ink-secondary">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="btn-cta mt-4 flex h-11 w-full items-center justify-center text-sm"
        >
          확인
        </button>
      </div>
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

  const trackedViewRef = useRef(false);

  useEffect(() => {
    if (!shouldShowBanner || trackedViewRef.current) return;

    trackedViewRef.current = true;
    trackEvent('tq_view_pwa_install_banner', {
      page_name: 'home',
      browser_type: browserType,
      install_prompt_available: installPromptAvailable,
      test_version: TEST_VERSION,
    });
  }, [browserType, installPromptAvailable, shouldShowBanner]);

  if (!shouldShowBanner) return null;

  return (
    <>
      <section className="rounded-xl border border-surface-border bg-white p-3 shadow-card">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">
              땡큐캠핑을 앱처럼 사용해보세요
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
              {helperText}
            </p>
            <button
              type="button"
              onClick={openInstallGuide}
              className="mt-2.5 inline-flex h-9 items-center justify-center rounded-lg bg-[#FF5A1F] px-3.5 text-xs font-semibold text-white"
            >
              앱 설치하기
            </button>
          </div>
          <button
            type="button"
            onClick={dismissBanner}
            aria-label="설치 안내 닫기"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-muted"
          >
            <CloseIcon />
          </button>
        </div>
      </section>

      <InstallGuideModal
        open={guideOpen}
        message={helperText}
        onClose={closeInstallGuide}
      />
    </>
  );
}
