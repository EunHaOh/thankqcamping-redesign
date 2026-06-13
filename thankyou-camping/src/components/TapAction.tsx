import type { CSSProperties, ReactNode } from 'react';
import { useTapOnlyClick } from '../hooks/useTapOnlyClick';

interface TapActionProps {
  onTap: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function TapAction({
  onTap,
  children,
  className = '',
  style,
  ariaLabel,
}: TapActionProps) {
  const handlers = useTapOnlyClick(onTap);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      className={className}
      style={style}
      {...handlers}
    >
      {children}
    </div>
  );
}
