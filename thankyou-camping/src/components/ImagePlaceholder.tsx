import type { CSSProperties } from 'react';

interface ImagePlaceholderProps {
  className?: string;
  style?: CSSProperties;
}

export function ImagePlaceholder({ className = '', style }: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-[#E5E7EB] ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
