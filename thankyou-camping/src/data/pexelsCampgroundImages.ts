/** 자동 생성 파일 — scripts/download-pexels-campground-images.mjs */

export interface PexelsCampgroundImageSet {
  listImages: string[];
  detailImages: string[];
  reviewImages: string[];
  concept: string;
}

const camp_1DetailImages = ["/images/campgrounds/pexels-sets/camp-1/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-1/detail/detail-10.jpg"];
const camp_2DetailImages = ["/images/campgrounds/pexels-sets/camp-2/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-2/detail/detail-10.jpg"];
const camp_3DetailImages = ["/images/campgrounds/pexels-sets/camp-3/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-3/detail/detail-10.jpg"];
const camp_4DetailImages = ["/images/campgrounds/pexels-sets/camp-4/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-4/detail/detail-10.jpg"];
const camp_5DetailImages = ["/images/campgrounds/pexels-sets/camp-5/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-5/detail/detail-10.jpg"];
const camp_6DetailImages = ["/images/campgrounds/pexels-sets/camp-6/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-6/detail/detail-10.jpg"];
const camp_7DetailImages = ["/images/campgrounds/pexels-sets/camp-7/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-7/detail/detail-10.jpg"];
const camp_8DetailImages = ["/images/campgrounds/pexels-sets/camp-8/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-8/detail/detail-10.jpg"];
const camp_9DetailImages = ["/images/campgrounds/pexels-sets/camp-9/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-9/detail/detail-10.jpg"];
const camp_10DetailImages = ["/images/campgrounds/pexels-sets/camp-10/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-10/detail/detail-10.jpg"];
const camp_11DetailImages = ["/images/campgrounds/pexels-sets/camp-11/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-11/detail/detail-10.jpg"];
const camp_12DetailImages = ["/images/campgrounds/pexels-sets/camp-12/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-12/detail/detail-10.jpg"];
const camp_13DetailImages = ["/images/campgrounds/pexels-sets/camp-13/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-13/detail/detail-10.jpg"];
const camp_14DetailImages = ["/images/campgrounds/pexels-sets/camp-14/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-14/detail/detail-10.jpg"];
const camp_15DetailImages = ["/images/campgrounds/pexels-sets/camp-15/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-15/detail/detail-10.jpg"];
const camp_16DetailImages = ["/images/campgrounds/pexels-sets/camp-16/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-16/detail/detail-10.jpg"];
const camp_17DetailImages = ["/images/campgrounds/pexels-sets/camp-17/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-17/detail/detail-10.jpg"];
const camp_18DetailImages = ["/images/campgrounds/pexels-sets/camp-18/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-18/detail/detail-10.jpg"];
const camp_19DetailImages = ["/images/campgrounds/pexels-sets/camp-19/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-19/detail/detail-10.jpg"];
const camp_20DetailImages = ["/images/campgrounds/pexels-sets/camp-20/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-20/detail/detail-10.jpg"];
const camp_21DetailImages = ["/images/campgrounds/pexels-sets/camp-21/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-21/detail/detail-10.jpg"];
const camp_22DetailImages = ["/images/campgrounds/pexels-sets/camp-22/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-22/detail/detail-10.jpg"];
const camp_23DetailImages = ["/images/campgrounds/pexels-sets/camp-23/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-23/detail/detail-10.jpg"];
const camp_24DetailImages = ["/images/campgrounds/pexels-sets/camp-24/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-24/detail/detail-10.jpg"];
const camp_25DetailImages = ["/images/campgrounds/pexels-sets/camp-25/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-25/detail/detail-10.jpg"];
const camp_26DetailImages = ["/images/campgrounds/pexels-sets/camp-26/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-26/detail/detail-10.jpg"];
const camp_27DetailImages = ["/images/campgrounds/pexels-sets/camp-27/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-27/detail/detail-10.jpg"];
const camp_28DetailImages = ["/images/campgrounds/pexels-sets/camp-28/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-28/detail/detail-10.jpg"];
const camp_29DetailImages = ["/images/campgrounds/pexels-sets/camp-29/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-29/detail/detail-10.jpg"];
const camp_30DetailImages = ["/images/campgrounds/pexels-sets/camp-30/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-30/detail/detail-10.jpg"];
const camp_31DetailImages = ["/images/campgrounds/pexels-sets/camp-31/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-31/detail/detail-10.jpg"];
const camp_32DetailImages = ["/images/campgrounds/pexels-sets/camp-32/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-32/detail/detail-10.jpg"];
const camp_33DetailImages = ["/images/campgrounds/pexels-sets/camp-33/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-33/detail/detail-10.jpg"];
const camp_34DetailImages = ["/images/campgrounds/pexels-sets/camp-34/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-34/detail/detail-10.jpg"];
const camp_35DetailImages = ["/images/campgrounds/pexels-sets/camp-35/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-35/detail/detail-10.jpg"];
const camp_36DetailImages = ["/images/campgrounds/pexels-sets/camp-36/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-36/detail/detail-10.jpg"];
const camp_37DetailImages = ["/images/campgrounds/pexels-sets/camp-37/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-37/detail/detail-10.jpg"];
const camp_38DetailImages = ["/images/campgrounds/pexels-sets/camp-38/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-38/detail/detail-10.jpg"];
const camp_39DetailImages = ["/images/campgrounds/pexels-sets/camp-39/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-39/detail/detail-10.jpg"];
const camp_40DetailImages = ["/images/campgrounds/pexels-sets/camp-40/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-40/detail/detail-10.jpg"];
const camp_41DetailImages = ["/images/campgrounds/pexels-sets/camp-41/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-41/detail/detail-10.jpg"];
const camp_42DetailImages = ["/images/campgrounds/pexels-sets/camp-42/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-42/detail/detail-10.jpg"];
const camp_43DetailImages = ["/images/campgrounds/pexels-sets/camp-43/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-43/detail/detail-10.jpg"];
const camp_44DetailImages = ["/images/campgrounds/pexels-sets/camp-44/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-44/detail/detail-10.jpg"];
const camp_45DetailImages = ["/images/campgrounds/pexels-sets/camp-45/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-45/detail/detail-10.jpg"];
const camp_46DetailImages = ["/images/campgrounds/pexels-sets/camp-46/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-46/detail/detail-10.jpg"];
const camp_47DetailImages = ["/images/campgrounds/pexels-sets/camp-47/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-47/detail/detail-10.jpg"];
const camp_48DetailImages = ["/images/campgrounds/pexels-sets/camp-48/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-48/detail/detail-10.jpg"];
const camp_49DetailImages = ["/images/campgrounds/pexels-sets/camp-49/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-49/detail/detail-10.jpg"];
const camp_50DetailImages = ["/images/campgrounds/pexels-sets/camp-50/detail/detail-01.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-02.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-03.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-04.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-05.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-06.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-07.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-08.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-09.jpg","/images/campgrounds/pexels-sets/camp-50/detail/detail-10.jpg"];

export const pexelsCampgroundImages: Record<string, PexelsCampgroundImageSet> = {
  "camp-1": {
    listImages: camp_1DetailImages,
    detailImages: camp_1DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-1/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-1/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-1/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-1/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-2": {
    listImages: camp_2DetailImages,
    detailImages: camp_2DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-2/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-2/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-2/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-2/reviews/review-04.jpg"],
    concept: "야간 감성 글램핑",
  },
  "camp-3": {
    listImages: camp_3DetailImages,
    detailImages: camp_3DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-3/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-3/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-3/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-3/reviews/review-04.jpg"],
    concept: "카라반 캠핑장",
  },
  "camp-4": {
    listImages: camp_4DetailImages,
    detailImages: camp_4DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-4/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-4/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-4/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-4/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-5": {
    listImages: camp_5DetailImages,
    detailImages: camp_5DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-5/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-5/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-5/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-5/reviews/review-04.jpg"],
    concept: "가족형 캠핑장",
  },
  "camp-6": {
    listImages: camp_6DetailImages,
    detailImages: camp_6DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-6/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-6/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-6/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-6/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-7": {
    listImages: camp_7DetailImages,
    detailImages: camp_7DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-7/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-7/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-7/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-7/reviews/review-04.jpg"],
    concept: "넓은 잔디 캠핑장",
  },
  "camp-8": {
    listImages: camp_8DetailImages,
    detailImages: camp_8DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-8/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-8/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-8/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-8/reviews/review-04.jpg"],
    concept: "별보기 오토캠핑",
  },
  "camp-9": {
    listImages: camp_9DetailImages,
    detailImages: camp_9DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-9/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-9/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-9/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-9/reviews/review-04.jpg"],
    concept: "야간 감성 글램핑",
  },
  "camp-10": {
    listImages: camp_10DetailImages,
    detailImages: camp_10DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-10/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-10/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-10/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-10/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-11": {
    listImages: camp_11DetailImages,
    detailImages: camp_11DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-11/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-11/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-11/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-11/reviews/review-04.jpg"],
    concept: "넓은 잔디 캠핑장",
  },
  "camp-12": {
    listImages: camp_12DetailImages,
    detailImages: camp_12DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-12/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-12/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-12/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-12/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-13": {
    listImages: camp_13DetailImages,
    detailImages: camp_13DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-13/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-13/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-13/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-13/reviews/review-04.jpg"],
    concept: "야간 감성 글램핑",
  },
  "camp-14": {
    listImages: camp_14DetailImages,
    detailImages: camp_14DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-14/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-14/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-14/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-14/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-15": {
    listImages: camp_15DetailImages,
    detailImages: camp_15DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-15/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-15/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-15/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-15/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-16": {
    listImages: camp_16DetailImages,
    detailImages: camp_16DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-16/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-16/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-16/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-16/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-17": {
    listImages: camp_17DetailImages,
    detailImages: camp_17DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-17/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-17/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-17/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-17/reviews/review-04.jpg"],
    concept: "별보기 오토캠핑",
  },
  "camp-18": {
    listImages: camp_18DetailImages,
    detailImages: camp_18DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-18/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-18/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-18/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-18/reviews/review-04.jpg"],
    concept: "야간 감성 글램핑",
  },
  "camp-19": {
    listImages: camp_19DetailImages,
    detailImages: camp_19DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-19/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-19/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-19/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-19/reviews/review-04.jpg"],
    concept: "넓은 잔디 캠핑장",
  },
  "camp-20": {
    listImages: camp_20DetailImages,
    detailImages: camp_20DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-20/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-20/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-20/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-20/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-21": {
    listImages: camp_21DetailImages,
    detailImages: camp_21DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-21/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-21/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-21/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-21/reviews/review-04.jpg"],
    concept: "가족형 캠핑장",
  },
  "camp-22": {
    listImages: camp_22DetailImages,
    detailImages: camp_22DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-22/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-22/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-22/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-22/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-23": {
    listImages: camp_23DetailImages,
    detailImages: camp_23DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-23/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-23/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-23/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-23/reviews/review-04.jpg"],
    concept: "가족형 캠핑장",
  },
  "camp-24": {
    listImages: camp_24DetailImages,
    detailImages: camp_24DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-24/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-24/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-24/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-24/reviews/review-04.jpg"],
    concept: "카라반 캠핑장",
  },
  "camp-25": {
    listImages: camp_25DetailImages,
    detailImages: camp_25DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-25/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-25/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-25/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-25/reviews/review-04.jpg"],
    concept: "별보기 오토캠핑",
  },
  "camp-26": {
    listImages: camp_26DetailImages,
    detailImages: camp_26DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-26/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-26/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-26/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-26/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-27": {
    listImages: camp_27DetailImages,
    detailImages: camp_27DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-27/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-27/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-27/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-27/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-28": {
    listImages: camp_28DetailImages,
    detailImages: camp_28DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-28/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-28/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-28/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-28/reviews/review-04.jpg"],
    concept: "넓은 잔디 캠핑장",
  },
  "camp-29": {
    listImages: camp_29DetailImages,
    detailImages: camp_29DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-29/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-29/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-29/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-29/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-30": {
    listImages: camp_30DetailImages,
    detailImages: camp_30DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-30/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-30/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-30/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-30/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-31": {
    listImages: camp_31DetailImages,
    detailImages: camp_31DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-31/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-31/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-31/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-31/reviews/review-04.jpg"],
    concept: "가족형 캠핑장",
  },
  "camp-32": {
    listImages: camp_32DetailImages,
    detailImages: camp_32DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-32/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-32/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-32/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-32/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-33": {
    listImages: camp_33DetailImages,
    detailImages: camp_33DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-33/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-33/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-33/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-33/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-34": {
    listImages: camp_34DetailImages,
    detailImages: camp_34DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-34/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-34/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-34/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-34/reviews/review-04.jpg"],
    concept: "넓은 잔디 캠핑장",
  },
  "camp-35": {
    listImages: camp_35DetailImages,
    detailImages: camp_35DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-35/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-35/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-35/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-35/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-36": {
    listImages: camp_36DetailImages,
    detailImages: camp_36DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-36/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-36/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-36/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-36/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-37": {
    listImages: camp_37DetailImages,
    detailImages: camp_37DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-37/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-37/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-37/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-37/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-38": {
    listImages: camp_38DetailImages,
    detailImages: camp_38DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-38/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-38/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-38/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-38/reviews/review-04.jpg"],
    concept: "가족형 캠핑장",
  },
  "camp-39": {
    listImages: camp_39DetailImages,
    detailImages: camp_39DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-39/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-39/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-39/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-39/reviews/review-04.jpg"],
    concept: "넓은 잔디 캠핑장",
  },
  "camp-40": {
    listImages: camp_40DetailImages,
    detailImages: camp_40DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-40/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-40/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-40/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-40/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-41": {
    listImages: camp_41DetailImages,
    detailImages: camp_41DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-41/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-41/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-41/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-41/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-42": {
    listImages: camp_42DetailImages,
    detailImages: camp_42DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-42/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-42/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-42/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-42/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-43": {
    listImages: camp_43DetailImages,
    detailImages: camp_43DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-43/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-43/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-43/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-43/reviews/review-04.jpg"],
    concept: "노을 호수 캠핑장",
  },
  "camp-44": {
    listImages: camp_44DetailImages,
    detailImages: camp_44DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-44/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-44/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-44/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-44/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-45": {
    listImages: camp_45DetailImages,
    detailImages: camp_45DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-45/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-45/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-45/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-45/reviews/review-04.jpg"],
    concept: "가족형 캠핑장",
  },
  "camp-46": {
    listImages: camp_46DetailImages,
    detailImages: camp_46DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-46/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-46/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-46/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-46/reviews/review-04.jpg"],
    concept: "별보기 오토캠핑",
  },
  "camp-47": {
    listImages: camp_47DetailImages,
    detailImages: camp_47DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-47/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-47/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-47/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-47/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-48": {
    listImages: camp_48DetailImages,
    detailImages: camp_48DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-48/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-48/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-48/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-48/reviews/review-04.jpg"],
    concept: "숲속 계곡 캠핑장",
  },
  "camp-49": {
    listImages: camp_49DetailImages,
    detailImages: camp_49DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-49/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-49/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-49/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-49/reviews/review-04.jpg"],
    concept: "산속 오토캠핑장",
  },
  "camp-50": {
    listImages: camp_50DetailImages,
    detailImages: camp_50DetailImages,
    reviewImages: ["/images/campgrounds/pexels-sets/camp-50/reviews/review-01.jpg","/images/campgrounds/pexels-sets/camp-50/reviews/review-02.jpg","/images/campgrounds/pexels-sets/camp-50/reviews/review-03.jpg","/images/campgrounds/pexels-sets/camp-50/reviews/review-04.jpg"],
    concept: "야간 감성 글램핑",
  },
};
