import { CampImage } from './CampImage';

interface HorizontalPhotoScrollProps {
  photos: string[];
  height?: number;
  cardWidth?: number;
}

export function HorizontalPhotoScroll({
  photos,
  height = 160,
  cardWidth = 280,
}: HorizontalPhotoScrollProps) {
  return (
    <div
      className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto scroll-smooth px-4"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {photos.map((photo, index) => (
        <CampImage
          key={`${photo}-${index}`}
          src={photo}
          height={height}
          containerClassName="shrink-0 rounded-lg"
          imageClassName="rounded-lg"
          style={{ width: cardWidth }}
        />
      ))}
    </div>
  );
}
