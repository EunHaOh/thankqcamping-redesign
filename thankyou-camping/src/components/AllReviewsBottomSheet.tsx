import type { Review } from '../types';
import { BottomSheet } from './BottomSheet';
import { ReviewCard } from './ReviewCard';

interface AllReviewsBottomSheetProps {
  open: boolean;
  reviews: Review[];
  onClose: () => void;
  onReviewDetail: (review: Review) => void;
}

export function AllReviewsBottomSheet({
  open,
  reviews,
  onClose,
  onReviewDetail,
}: AllReviewsBottomSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="전체 후기">
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onDetail={() => {
              onReviewDetail(review);
              onClose();
            }}
          />
        ))}
      </div>
    </BottomSheet>
  );
}
