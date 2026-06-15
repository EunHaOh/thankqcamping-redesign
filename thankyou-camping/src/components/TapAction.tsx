import type { ReactNode, CSSProperties } from 'react';
import { useTapOnlyClick } from '../hooks/useTapOnlyClick';

interface TapActionProps {
  onTap: () => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  'aria-label'?: string;
}

export function TapAction({
  onTap,
  className = '',
  style,
  children,
  'aria-label': ariaLabel,
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
