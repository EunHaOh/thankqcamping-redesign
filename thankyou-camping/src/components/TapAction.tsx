import type { ReactNode, CSSProperties } from 'react';
import { useTapOnlyClick } from '../hooks/useTapOnlyClick';

interface TapActionProps {
  onTap: () => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  ariaLabel?: string;
  'aria-label'?: string;
}

export function TapAction({
  onTap,
  className = '',
  style,
  children,
  ariaLabel: ariaLabelProp,
  'aria-label': ariaLabel,
}: TapActionProps) {
  const handlers = useTapOnlyClick(onTap);
  const resolvedAriaLabel = ariaLabelProp ?? ariaLabel;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={resolvedAriaLabel}
      className={className}
      style={style}
      {...handlers}
    >
      {children}
    </div>
  );
}
