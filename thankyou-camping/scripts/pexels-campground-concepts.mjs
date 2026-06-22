import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const MAX_CAMPGROUNDS = 50;

export const TARGET_COUNTS = {
  detail: 10,
  reviews: 4,
};

/** @typedef {{ key: string; concept: string; detailQueries: string[]; reviewQueries: string[]; forbiddenKeywords: string[] }} ConceptTemplate */
/** @typedef {{ id: string; name: string; region: string; location: string; tags: string[]; templateKey: string }} CampgroundCatalogEntry */

/** @type {ConceptTemplate[]} */
export const conceptTemplates = [
  {
    key: 'forest-river',
    concept: '숲속 계곡 캠핑장',
    detailQueries: [
      'forest river campsite tent',
      'riverside camping tent forest',
      'creek campsite tent',
      'camping tent near stream',
      'wooden deck forest camping',
      'pine forest campsite tent',
      'mountain stream camping site',
      'green forest camping tent',
      'tent under pine trees camping',
      'woodland campsite aerial',
    ],
    reviewQueries: [
      'camping chair by river',
      'camping table forest river',
      'tent detail forest campsite',
      'camping gear near stream',
      'campfire forest camping',
      'camping picnic table outdoor',
    ],
    forbiddenKeywords: ['beach', 'ocean', 'sea', 'hotel', 'city', 'pool resort', 'swimming pool'],
  },
  {
    key: 'night-glamping',
    concept: '야간 감성 글램핑',
    detailQueries: [
      'glamping tent night lights',
      'luxury glamping tent',
      'cozy glamping interior',
      'glamping deck lights',
      'glamping tent exterior evening',
      'camping string lights tent',
      'premium glamping site',
      'glamping wooden deck',
      'glamping tent bedroom',
      'outdoor glamping resort',
    ],
    reviewQueries: [
      'glamping interior table',
      'campfire glamping night',
      'tent lights night camping',
      'cozy camping table lights',
      'glamping food table outdoor',
      'camping chair glamping night',
    ],
    forbiddenKeywords: ['beach', 'rv', 'caravan', 'river', 'creek', 'hotel', 'city'],
  },
  {
    key: 'family-camping',
    concept: '가족형 캠핑장',
    detailQueries: [
      'family campsite tent',
      'kids camping tent',
      'summer family camping',
      'family tent campsite',
      'camping with children tent',
      'family camping park tent',
      'green lawn family camping',
      'playground camping area tent',
      'family camping picnic area',
      'large family tent camping',
    ],
    reviewQueries: [
      'family camping picnic table',
      'kids camping tent detail',
      'camping table family',
      'family campsite gear',
      'camping chair family tent',
      'picnic camping family outdoor',
    ],
    forbiddenKeywords: ['night club', 'hotel', 'beach resort', 'city', 'bar'],
  },
  {
    key: 'caravan-rv',
    concept: '카라반 캠핑장',
    detailQueries: [
      'caravan campsite forest',
      'rv campsite nature',
      'camper van camping',
      'caravan camping site',
      'motorhome camping forest',
      'camper van lakeside',
      'caravan deck camping',
      'rv camping site trees',
      'travel trailer camping',
      'camper van mountain view',
    ],
    reviewQueries: [
      'camper van camping table',
      'rv camping setup',
      'caravan camping detail',
      'camper van outdoor chairs',
      'caravan picnic camping',
      'rv camping gear outdoor',
    ],
    forbiddenKeywords: ['glamping tent', 'hotel', 'city', 'beach resort'],
  },
  {
    key: 'sunset-lake',
    concept: '노을 호수 캠핑장',
    detailQueries: [
      'lake campsite sunset',
      'tent by lake sunset',
      'camping by lake sunset',
      'mountain lake camping tent',
      'wooden deck camping sunset',
      'evening tent camping lake',
      'sunset forest camping tent',
      'golden hour campsite tent',
      'quiet lake camping site',
      'camping dock lake sunset',
    ],
    reviewQueries: [
      'camping chair lake sunset',
      'campfire sunset camping',
      'camping table lake',
      'tent detail sunset',
      'camping gear sunset',
      'evening camping chair tent',
    ],
    forbiddenKeywords: ['beach ocean', 'hotel', 'city', 'glamping interior'],
  },
  {
    key: 'grass-lawn',
    concept: '넓은 잔디 캠핑장',
    detailQueries: [
      'grass camping field tent',
      'lawn campsite tent',
      'open field camping tent',
      'green lawn tent camping',
      'spacious campsite grass',
      'camping on green grass',
      'sunny grass camping tent',
      'camping park grass field',
      'large grass camping area',
      'meadow camping tent',
    ],
    reviewQueries: [
      'camping picnic grass',
      'tent on lawn detail',
      'outdoor camping blanket',
      'family tent grass field',
      'camping table grass',
      'camping chair grass field',
    ],
    forbiddenKeywords: ['beach', 'ocean', 'hotel', 'city', 'glamping'],
  },
  {
    key: 'starry-night',
    concept: '별보기 오토캠핑',
    detailQueries: [
      'starry night camping tent',
      'night sky tent camping',
      'camping under stars',
      'dark sky camping tent',
      'night camping forest tent',
      'campfire stars night tent',
      'astronomy camping tent',
      'tent night sky mountains',
      'milky way camping tent',
      'night campsite mountains',
    ],
    reviewQueries: [
      'night camping tent lights',
      'stargazing camping photo',
      'campfire night sky camping',
      'camping chair night tent',
      'tent detail night camping',
      'camping table night stars',
    ],
    forbiddenKeywords: ['beach', 'ocean', 'hotel', 'city', 'pool', 'glamping interior'],
  },
  {
    key: 'forest-auto',
    concept: '산속 오토캠핑장',
    detailQueries: [
      'mountain forest camping tent',
      'auto camping site forest',
      'woodland campsite tent',
      'forest camping gravel site',
      'mountain campsite tent',
      'quiet forest camping tent',
      'pine tree camping site',
      'camping site mountain trees',
      'drive in forest campsite',
      'mountain auto camping area',
    ],
    reviewQueries: [
      'camping chair forest tent',
      'camping table mountain',
      'tent detail forest camping',
      'campfire mountain camping',
      'camping gear forest site',
      'outdoor camping chair tent',
    ],
    forbiddenKeywords: ['beach', 'ocean', 'hotel', 'city', 'glamping'],
  },
];

const catalogPath = path.join(__dirname, 'campground-catalog.json');
/** @type {CampgroundCatalogEntry[]} */
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

/** @type {CampgroundCatalogEntry[]} */
export const campgroundCatalog = catalog.slice(0, MAX_CAMPGROUNDS);

const templateMap = new Map(conceptTemplates.map((item) => [item.key, item]));

function rotateQueries(queries, campNumber) {
  const offset = campNumber % queries.length;
  return [...queries.slice(offset), ...queries.slice(0, offset)];
}

function assignConcept(meta, campNumber) {
  const template = templateMap.get(meta.templateKey);
  if (!template) {
    throw new Error(`Unknown template key: ${meta.templateKey} for ${meta.id}`);
  }

  return {
    id: meta.id,
    name: meta.name,
    concept: template.concept,
    templateKey: template.key,
    detailQueries: rotateQueries(template.detailQueries, campNumber),
    reviewQueries: rotateQueries(template.reviewQueries, campNumber),
    forbiddenKeywords: template.forbiddenKeywords,
  };
}

/** @type {ReturnType<typeof assignConcept>[]} */
export const campgroundConcepts = campgroundCatalog.map((meta) => {
  const campNumber = Number.parseInt(meta.id.replace('camp-', ''), 10);
  return assignConcept(meta, campNumber);
});
