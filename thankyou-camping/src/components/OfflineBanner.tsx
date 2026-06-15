interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[130] border-b border-[#FCD9C8] bg-[#FFF4ED] px-4 py-2.5"
      style={{ paddingTop: 'max(0.625rem, env(safe-area-inset-top, 0px))' }}
    >
      <p className="text-center text-sm font-semibold text-ink">오프라인 상태입니다</p>
      <p className="mt-0.5 text-center text-xs text-ink-secondary">
        이전에 불러온 화면은 계속 확인할 수 있어요.
      </p>
    </div>
  );
}
