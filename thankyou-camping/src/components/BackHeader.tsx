import { useNavigate } from 'react-router-dom';

interface BackHeaderProps {
  title?: string;
  transparent?: boolean;
  backTo?: string;
}

export function BackHeader({
  title,
  transparent = false,
  backTo,
}: BackHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }
    navigate(-1);
  };

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 items-center gap-3 px-4 ${
        transparent
          ? 'bg-gradient-to-b from-black/40 to-transparent text-white'
          : 'border-b border-surface-border bg-white'
      }`}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로가기"
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          transparent ? 'bg-black/20' : 'border border-surface-border'
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {title && (
        <h1
          className={`truncate text-base font-semibold ${
            transparent ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h1>
      )}
    </header>
  );
}
