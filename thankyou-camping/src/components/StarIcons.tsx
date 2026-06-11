interface StarIconsProps {
  rating: number;
  size?: number;
}

export function StarIcons({ rating, size = 12 }: StarIconsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill={i < rating ? '#FFB020' : '#E8ECF0'}
          aria-hidden="true"
        >
          <path d="M8 1.5L9.9 5.8L14.5 6.3L11.2 9.4L12.1 14L8 11.7L3.9 14L4.8 9.4L1.5 6.3L6.1 5.8L8 1.5Z" />
        </svg>
      ))}
    </div>
  );
}
