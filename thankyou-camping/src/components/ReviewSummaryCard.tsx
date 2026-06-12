import { Link } from 'react-router-dom';

interface ReviewSummaryCardProps {
  items: string[];
  reviewsTo?: string;
  onViewAllReviews?: () => void;
}

export function ReviewSummaryCard({
  items,
  reviewsTo,
  onViewAllReviews,
}: ReviewSummaryCardProps) {
  return (
    <section className="rounded-2xl border border-surface-border bg-white p-4">
      <h2 className="mb-3 text-base font-bold text-ink">후기 요약</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-ink-secondary">
            <span className="shrink-0 text-[#F26522]" aria-hidden="true">
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {reviewsTo && (
        <Link
          to={reviewsTo}
          onClick={() => onViewAllReviews?.()}
          className="btn-secondary mt-4 flex h-10 w-full items-center justify-center"
        >
          전체 후기 보기
        </Link>
      )}
    </section>
  );
}
