import { useEffect, useMemo, useRef, useState } from 'react';
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
    canInstall,
    isStandalone,
    isInstalled,
    isIosSafari,
    isAndroidChrome,
    isDesktopChrome,
    isDismissed,
    browserType,
    installPromptAvailable,
    promptInstall,
    dismissInstallBanner,
  } = usePwaInstallPrompt();
  const [guideOpen, setGuideOpen] = useState(false);
  const viewedRef = useRef(false);

  const guideMessage = useMemo(() => {
    if (isAndroidChrome && !installPromptAvailable) {
      return "Chrome 메뉴에서 '앱 설치' 또는 '홈 화면에 추가'를 선택해주세요.";
    }
    if (isIosSafari) {
      return "Safari 공유 버튼을 누른 뒤 '홈 화면에 추가'를 선택해주세요.";
    }
    if (isDesktopChrome) {
      return "주소창 오른쪽 설치 아이콘 또는 Chrome 메뉴의 '저장 및 공유 > 앱 설치'를 확인해주세요.";
    }
    return '브라우저 메뉴에서 홈 화면에 추가를 확인해주세요.';
  }, [installPromptAvailable, isAndroidChrome, isDesktopChrome, isIosSafari]);

  useEffect(() => {
    if (!canInstall || viewedRef.current) return;

    viewedRef.current = true;
    trackEvent('tq_view_pwa_install_banner', {
      page_name: 'home',
      browser_type: browserType,
      install_prompt_available: installPromptAvailable,
      is_standalone: isStandalone,
      test_version: TEST_VERSION,
    });
  }, [browserType, canInstall, installPromptAvailable, isStandalone]);

  if (!canInstall || isStandalone || isInstalled || isDismissed) return null;

  const handleInstallClick = async () => {
    trackEvent('tq_click_pwa_install', {
      page_name: 'home',
      browser_type: browserType,
      install_prompt_available: installPromptAvailable,
      test_version: TEST_VERSION,
    });

    if (installPromptAvailable) {
      await promptInstall();
      return;
    }

    trackEvent('tq_click_pwa_install_guide', {
      page_name: 'home',
      browser_type: browserType,
      guide_type: browserType,
      test_version: TEST_VERSION,
    });
    setGuideOpen(true);
  };

  return (
    <section className="rounded-xl border border-surface-border bg-white p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">
            땡큐캠핑을 앱처럼 사용해보세요
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
            {installPromptAvailable
              ? '홈 화면에서 바로 열 수 있어요.'
              : guideMessage}
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
          onClick={() => dismissInstallBanner('banner_close')}
          aria-label="설치 안내 닫기"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-muted"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-3">
        <InstallGuide
          open={guideOpen}
          message={guideMessage}
          onClose={() => setGuideOpen(false)}
        />
      </div>
    </section>
  );
}
