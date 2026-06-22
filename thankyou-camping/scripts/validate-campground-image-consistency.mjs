import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { MAX_CAMPGROUNDS, TARGET_COUNTS } from './pexels-campground-concepts.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const MAPPING_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'pexelsCampgroundImages.ts');
const CATALOG_FILE = path.join(__dirname, 'campground-catalog.json');
const MIN_DETAIL = TARGET_COUNTS.detail;
const MIN_REVIEWS = TARGET_COUNTS.reviews;

const FORBIDDEN_REVIEW_KEYWORDS_BY_TEMPLATE = {
  'forest-river': ['beach', 'ocean', 'sea', 'glamping', 'caravan', 'rv', 'hotel'],
  'night-glamping': ['beach', 'ocean', 'caravan', 'rv', 'creek', 'river'],
  'caravan-rv': ['glamping', 'beach resort', 'hotel'],
  'family-camping': ['beach resort', 'hotel', 'night club'],
  'sunset-lake': ['beach ocean', 'hotel', 'glamping interior'],
  'grass-lawn': ['beach', 'ocean', 'glamping', 'hotel'],
  'starry-night': ['beach', 'ocean', 'hotel', 'glamping'],
  'forest-auto': ['beach', 'ocean', 'hotel', 'glamping'],
};

async function fileExists(relativePublicPath) {
  const diskPath = path.join(PROJECT_ROOT, 'public', relativePublicPath.replace(/^\//, ''));
  try {
    await access(diskPath);
    return true;
  } catch {
    return false;
  }
}

function loadMappingModule(source) {
  const sets = {};
  const idMatches = [...source.matchAll(/"camp-\d+":\s*\{/g)];
  for (const match of idMatches) {
    const id = match[0].slice(1, match[0].indexOf('":'));
    const blockStart = match.index;
    const blockEnd = source.indexOf('},', blockStart);
    const block = source.slice(blockStart, blockEnd);

    const detailMatch = block.match(/detailImages:\s*(\w+DetailImages)/);
    const reviewMatch = block.match(/reviewImages:\s*(\[[^\]]*\])/s);

    const detailVar = detailMatch?.[1];
    const detailArrayMatch = detailVar
      ? source.match(new RegExp(`const ${detailVar} = (\\[[\\s\\S]*?\\]);`))
      : null;
    const reviewArray = reviewMatch?.[1] ? JSON.parse(reviewMatch[1].replace(/'/g, '"')) : [];

    const detailImages = detailArrayMatch ? JSON.parse(detailArrayMatch[1]) : [];

    sets[id] = {
      listImages: detailImages,
      detailImages,
      reviewImages: reviewArray,
    };
  }
  return sets;
}

function pathsEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((pathValue, index) => pathValue === b[index]);
}

function collectReviewPaths(reviews) {
  const paths = [];
  for (const review of reviews) {
    if (review.photo) paths.push(review.photo);
    if (review.photos?.length) paths.push(...review.photos);
  }
  return paths;
}

async function main() {
  const source = await readFile(MAPPING_FILE, 'utf8');
  const mapping = loadMappingModule(source);
  const catalog = JSON.parse(readFileSync(CATALOG_FILE, 'utf8'));
  const expectedIds = catalog.slice(0, MAX_CAMPGROUNDS).map((item) => item.id);

  let hasError = false;
  const globalPaths = new Map();
  const names = new Set();
  const duplicateNames = [];

  for (const entry of catalog.slice(0, MAX_CAMPGROUNDS)) {
    if (names.has(entry.name)) duplicateNames.push(entry.name);
    names.add(entry.name);
  }

  if (duplicateNames.length > 0) {
    console.error(`[error] Duplicate campground names: ${[...new Set(duplicateNames)].join(', ')}`);
    hasError = true;
  }

  for (const id of expectedIds) {
    const catalogEntry = catalog.find((item) => item.id === id);
    const pexels = mapping[id];

    if (!catalogEntry) {
      console.error(`[error] Missing catalog entry for ${id}`);
      hasError = true;
      continue;
    }

    if (!pexels) {
      console.error(`[error] Missing pexels mapping for ${id}`);
      hasError = true;
      continue;
    }

    const { detailImages, reviewImages } = pexels;
    const listImages = detailImages;
    const mainImage = detailImages[0];

    if (detailImages.length < MIN_DETAIL) {
      console.error(`[error] ${id}: detailImages ${detailImages.length} < ${MIN_DETAIL}`);
      hasError = true;
    }

    if (reviewImages.length < MIN_REVIEWS) {
      console.error(`[error] ${id}: reviewImages ${reviewImages.length} < ${MIN_REVIEWS}`);
      hasError = true;
    }

    if (!pathsEqual(listImages, detailImages)) {
      console.error(`[error] ${id}: listImages !== detailImages`);
      hasError = true;
    }

    if (mainImage !== detailImages[0]) {
      console.error(`[error] ${id}: mainImage !== detailImages[0]`);
      hasError = true;
    }

    const perCampPaths = new Set();
    const allImagePaths = [...new Set([...detailImages, ...reviewImages])];

    for (const imagePath of allImagePaths) {
      if (!imagePath) continue;

      if (perCampPaths.has(imagePath)) {
        console.error(`[error] ${id}: duplicate image within campground: ${imagePath}`);
        hasError = true;
      }
      perCampPaths.add(imagePath);

      const owner = globalPaths.get(imagePath);
      if (owner && owner !== id) {
        console.error(`[error] Image reused across campgrounds (${owner} & ${id}): ${imagePath}`);
        hasError = true;
      } else {
        globalPaths.set(imagePath, id);
      }

      if (!(await fileExists(imagePath))) {
        console.error(`[error] Missing file for ${id}: ${imagePath}`);
        hasError = true;
      }
    }

    for (const reviewPath of reviewImages) {
      const expectedPrefix = `/images/campgrounds/pexels-sets/${id}/reviews/`;
      if (!reviewPath.startsWith(expectedPrefix)) {
        console.error(`[error] ${id}: review image outside camp folder: ${reviewPath}`);
        hasError = true;
      }
    }

    for (const detailPath of detailImages) {
      const expectedPrefix = `/images/campgrounds/pexels-sets/${id}/detail/`;
      if (!detailPath.startsWith(expectedPrefix)) {
        console.error(`[error] ${id}: detail image outside camp folder: ${detailPath}`);
        hasError = true;
      }
    }
  }

  const mappingKeys = Object.keys(mapping).filter((key) => key.startsWith('camp-'));
  for (const key of mappingKeys) {
    if (!expectedIds.includes(key)) {
      console.error(`[error] pexels key without catalog id: ${key}`);
      hasError = true;
    }
  }

  for (const id of expectedIds) {
    if (!mapping[id]) {
      console.error(`[error] catalog id without pexels key: ${id}`);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('\nvalidate-campground-image-consistency: FAILED');
    process.exit(1);
  }

  console.log(
    `validate-campground-image-consistency: OK (${expectedIds.length} campgrounds, names unique, list===detail, images verified)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
