import catalogJson from '../../scripts/campground-catalog.json';
import { pexelsCampgroundImages } from './pexelsCampgroundImages';

export interface CampgroundCatalogEntry {
  id: string;
  name: string;
  region: string;
  location: string;
  tags: string[];
  templateKey: string;
}

export const campgroundCatalog = catalogJson as CampgroundCatalogEntry[];

const TEMPLATE_CONCEPTS: Record<string, string> = {
  'forest-river': '숲속 계곡 캠핑장',
  'night-glamping': '야간 감성 글램핑',
  'family-camping': '가족형 캠핑장',
  'caravan-rv': '카라반 캠핑장',
  'sunset-lake': '노을 호수 캠핑장',
  'grass-lawn': '넓은 잔디 캠핑장',
  'starry-night': '별보기 오토캠핑',
  'forest-auto': '산속 오토캠핑장',
};

const catalogById = new Map(campgroundCatalog.map((entry) => [entry.id, entry]));

export function getCatalogEntry(id: string): CampgroundCatalogEntry | undefined {
  return catalogById.get(id);
}

export function getConceptForCamp(id: string): string {
  const pexelsConcept = pexelsCampgroundImages[id]?.concept;
  if (pexelsConcept) return pexelsConcept;

  const entry = getCatalogEntry(id);
  if (!entry) return '오토캠핑장';

  return TEMPLATE_CONCEPTS[entry.templateKey] ?? '오토캠핑장';
}

export function getUniqueCampgroundNames(): string[] {
  return campgroundCatalog.map((entry) => entry.name);
}
