import { ensureCuratedImage } from '../data/images';



interface CampCardPhotoStripProps {

  photos: string[];

}



/** 검색결과 리스트 카드 전용 — 연속 갤러리형 가로 스트립 */

export function CampCardPhotoStrip({ photos }: CampCardPhotoStripProps) {

  if (photos.length === 0) return null;



  return (

    <div className="px-4 pt-3">

      <div className="overflow-hidden rounded-[16px]">

        <div

          className="scrollbar-hide flex h-[130px] snap-x snap-mandatory gap-[3px] overflow-x-auto overscroll-x-contain bg-[#E5E7EB]"

          style={{

            WebkitOverflowScrolling: 'touch',

            touchAction: 'pan-x pan-y',

          }}

        >

          {photos.map((photo, index) => (

            <div

              key={`${photo}-${index}`}

              className="h-full w-[120px] shrink-0 snap-start overflow-hidden"

            >

              <img

                src={ensureCuratedImage(photo)}

                alt=""

                loading="lazy"

                decoding="async"

                draggable={false}

                className="block h-full w-full object-cover"

              />

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

