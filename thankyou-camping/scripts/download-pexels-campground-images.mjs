import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  campgroundConcepts,
  MAX_CAMPGROUNDS,
  TARGET_COUNTS,
} from './pexels-campground-concepts.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_ROOT = path.join(PROJECT_ROOT, 'public', 'images', 'campgrounds', 'pexels-sets');

const DETAIL_TARGET = TARGET_COUNTS.detail;
const DETAIL_MAX = TARGET_COUNTS.detail;
const REVIEW_TARGET = TARGET_COUNTS.reviews;
const MIN_TOTAL_IMAGES = 500;
const MIN_CAMPGROUND_FOLDERS = MAX_CAMPGROUNDS;

const MAPPING_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'pexelsCampgroundImages.ts');
const SOURCE_NOTES_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'imageSourceNotes.ts');
const ENV_FILE = path.join(PROJECT_ROOT, '.env.local');

const globalUsedPhotoIds = new Set();
const apiDelayMs = 300;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadEnvFromFile(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function pickImageUrl(photo) {
  return photo?.src?.large2x || photo?.src?.large || photo?.src?.medium || null;
}

function isForbiddenPhoto(photo, forbiddenKeywords) {
  const haystack = `${photo.alt || ''} ${photo.photographer || ''} ${photo.url || ''}`.toLowerCase();
  return forbiddenKeywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function canUsePhoto(photo, campUsedPhotoIds) {
  if (!photo?.id) return false;
  if (globalUsedPhotoIds.has(photo.id)) return false;
  if (campUsedPhotoIds.has(photo.id)) return false;
  return true;
}

function reservePhoto(photo, campUsedPhotoIds) {
  globalUsedPhotoIds.add(photo.id);
  campUsedPhotoIds.add(photo.id);
}

async function searchPexels(query, page = 1, attempt = 0) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error('PEXELS_API_KEY가 없습니다. thankyou-camping/.env.local 파일을 확인하세요.');
  }

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', '15');
  url.searchParams.set('page', String(page));
  url.searchParams.set('orientation', 'landscape');

  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (response.status === 401) {
    throw new Error('Pexels API 401: PEXELS_API_KEY가 올바른지 확인하세요.');
  }

  if (response.status === 429) {
    if (attempt < 3) {
      await sleep(2000 * (attempt + 1));
      return searchPexels(query, page, attempt + 1);
    }
    throw new Error('Pexels API 429: rate limit 가능성이 있습니다. 잠시 후 다시 시도하세요.');
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pexels API ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = await response.json();
  return Array.isArray(data.photos) ? data.photos : [];
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`이미지 다운로드 실패 (${response.status}): ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
}

function toPublicPath(campgroundId, folder, fileName) {
  return `/images/campgrounds/pexels-sets/${campgroundId}/${folder}/${fileName}`;
}

async function collectImagesForBucket({
  concept,
  bucketName,
  targetCount,
  maxCount,
  queries,
  campUsedPhotoIds,
}) {
  const folder = bucketName === 'detail' ? 'detail' : 'reviews';
  const prefix = bucketName === 'detail' ? 'detail' : 'review';
  const outputDir = path.join(OUTPUT_ROOT, concept.id, folder);
  await mkdir(outputDir, { recursive: true });

  const saved = [];
  let page = 1;
  let queryIndex = 0;
  const hardMax = maxCount ?? targetCount;

  while (saved.length < hardMax && queryIndex < queries.length) {
    const query = queries[queryIndex];
    let photos = [];

    try {
      photos = await searchPexels(query, page);
      await sleep(apiDelayMs);
    } catch (error) {
      console.warn(
        `[warn] 검색 실패 (${concept.id}/${bucketName}, query="${query}", page=${page}): ${error.message}`,
      );
      queryIndex += 1;
      page = 1;
      continue;
    }

    if (photos.length === 0) {
      queryIndex += 1;
      page = 1;
      continue;
    }

    for (const photo of photos) {
      if (saved.length >= hardMax) break;
      if (!canUsePhoto(photo, campUsedPhotoIds)) continue;
      if (isForbiddenPhoto(photo, concept.forbiddenKeywords)) continue;

      const imageUrl = pickImageUrl(photo);
      if (!imageUrl) continue;

      const fileName = `${prefix}-${String(saved.length + 1).padStart(2, '0')}.jpg`;
      const outputPath = path.join(outputDir, fileName);

      try {
        await downloadImage(imageUrl, outputPath);
        reservePhoto(photo, campUsedPhotoIds);

        const publicPath = toPublicPath(concept.id, folder, fileName);
        saved.push({
          publicPath,
          photoId: photo.id,
          query,
        });
        console.log(`[ok] ${concept.id}/${bucketName}: ${fileName} (photo ${photo.id})`);
      } catch (error) {
        console.warn(
          `[warn] 다운로드 실패 (${concept.id}/${bucketName}, photo ${photo.id}): ${error.message}`,
        );
      }
    }

    if (saved.length < hardMax) {
      page += 1;
      if (page > 10) {
        queryIndex += 1;
        page = 1;
      }
    }
  }

  if (saved.length < targetCount) {
    console.warn(
      `[warn] ${concept.id}/${bucketName}: 목표 ${targetCount}장 중 ${saved.length}장만 확보했습니다.`,
    );
  }

  return saved;
}

function serializeTsString(value) {
  return JSON.stringify(value);
}

async function writeImageMapping(results) {
  const lines = [
    '/** 자동 생성 파일 — scripts/download-pexels-campground-images.mjs */',
    '',
    'export interface PexelsCampgroundImageSet {',
    '  listImages: string[];',
    '  detailImages: string[];',
    '  reviewImages: string[];',
    '  concept: string;',
    '}',
    '',
  ];

  for (const result of results) {
    const varName = `${result.id.replace(/-/g, '_')}DetailImages`;
    lines.push(`const ${varName} = ${serializeTsString(result.detail)};`);
  }

  lines.push('');
  lines.push('export const pexelsCampgroundImages: Record<string, PexelsCampgroundImageSet> = {');

  for (const result of results) {
    const varName = `${result.id.replace(/-/g, '_')}DetailImages`;
    lines.push(`  ${serializeTsString(result.id)}: {`);
    lines.push(`    listImages: ${varName},`);
    lines.push(`    detailImages: ${varName},`);
    lines.push(`    reviewImages: ${serializeTsString(result.reviews)},`);
    lines.push(`    concept: ${serializeTsString(result.concept)},`);
    lines.push('  },');
  }

  lines.push('};');
  lines.push('');

  await writeFile(MAPPING_FILE, lines.join('\n'), 'utf8');
  console.log(`[done] mapping -> ${path.relative(PROJECT_ROOT, MAPPING_FILE)}`);
}

async function writeSourceNotes(results) {
  const campgroundSummaries = results.map((result) => ({
    campgroundId: result.id,
    campgroundName: result.name,
    concept: result.concept,
    templateKey: result.templateKey,
    downloaded: {
      detail: result.detail.length,
      reviews: result.reviews.length,
      listSameAsDetail: true,
      total: result.detail.length + result.reviews.length,
    },
  }));

  const content = `/** 자동 생성 파일 — scripts/download-pexels-campground-images.mjs */

export const imageSourceNotes = {
  provider: 'Pexels',
  purpose: 'prototype visual asset',
  note: '실제 캠핑장 사진이 아닌 땡큐캠핑 리디자인 프로토타입용 분위기 이미지입니다.',
  licenseUrl: 'https://www.pexels.com/license/',
  apiUrl: 'https://www.pexels.com/api/',
  listDetailPolicy: 'listImages와 detailImages는 동일한 detail 폴더 이미지 세트를 공유합니다.',
  campgroundSummaries: ${JSON.stringify(campgroundSummaries, null, 2)} as const,
};
`;

  await writeFile(SOURCE_NOTES_FILE, content, 'utf8');
  console.log(`[done] source notes -> ${path.relative(PROJECT_ROOT, SOURCE_NOTES_FILE)}`);
}

function reportFailure(message) {
  console.error(`[fail] ${message}`);
  process.exitCode = 1;
}

async function main() {
  console.log(`PROJECT_ROOT: ${PROJECT_ROOT}`);
  console.log(`OUTPUT_ROOT: ${OUTPUT_ROOT}`);

  await loadEnvFromFile(ENV_FILE);

  if (!process.env.PEXELS_API_KEY) {
    console.error('PEXELS_API_KEY가 없습니다. .env.local 파일을 확인하세요.');
    process.exit(1);
  }

  try {
    await rm(OUTPUT_ROOT, { recursive: true, force: true });
  } catch (error) {
    console.warn(`[warn] 기존 pexels-sets 삭제 중 경고: ${error.message}`);
  }

  await mkdir(OUTPUT_ROOT, { recursive: true });

  const results = [];

  for (const concept of campgroundConcepts) {
    console.log(`\n==> ${concept.id} ${concept.name} (${concept.concept})`);
    const campUsedPhotoIds = new Set();

    const detailSaved = await collectImagesForBucket({
      concept,
      bucketName: 'detail',
      targetCount: DETAIL_TARGET,
      maxCount: DETAIL_MAX,
      queries: concept.detailQueries,
      campUsedPhotoIds,
    });

    const reviewSaved = await collectImagesForBucket({
      concept,
      bucketName: 'reviews',
      targetCount: REVIEW_TARGET,
      maxCount: REVIEW_TARGET,
      queries: concept.reviewQueries,
      campUsedPhotoIds,
    });

    const detailPaths = detailSaved.map((item) => item.publicPath);
    const reviewPaths = reviewSaved.map((item) => item.publicPath);

    results.push({
      id: concept.id,
      name: concept.name,
      concept: concept.concept,
      templateKey: concept.templateKey,
      detail: detailPaths,
      reviews: reviewPaths,
    });
  }

  await writeImageMapping(results);
  await writeSourceNotes(results);

  const totalImages = results.reduce((sum, item) => sum + item.detail.length + item.reviews.length, 0);
  const folderCount = results.length;
  const detailMin = Math.min(...results.map((item) => item.detail.length));
  const reviewMin = Math.min(...results.map((item) => item.reviews.length));
  const shortages = results.filter(
    (item) => item.detail.length < DETAIL_TARGET || item.reviews.length < REVIEW_TARGET,
  );

  console.log('\n=== Download summary ===');
  console.log(`TARGET_CAMPGROUNDS: ${MAX_CAMPGROUNDS}`);
  console.log(`CAMPGROUND_FOLDER_COUNT: ${folderCount}`);
  console.log(`DOWNLOADED_TOTAL: ${totalImages}`);
  console.log(`DETAIL_MIN: ${detailMin}`);
  console.log(`REVIEW_MIN: ${reviewMin}`);
  console.log(`OUTPUT_ROOT: ${OUTPUT_ROOT}`);

  if (shortages.length > 0) {
    console.error('\n=== Shortages ===');
    for (const item of shortages) {
      console.error(
        `${item.id}: detail ${item.detail.length}/${DETAIL_TARGET}, reviews ${item.reviews.length}/${REVIEW_TARGET}`,
      );
    }
  }

  if (folderCount < MIN_CAMPGROUND_FOLDERS) {
    reportFailure(`CAMPGROUND_FOLDER_COUNT ${folderCount} < ${MIN_CAMPGROUND_FOLDERS}`);
    return;
  }

  if (totalImages < MIN_TOTAL_IMAGES) {
    reportFailure(`DOWNLOADED_TOTAL ${totalImages} < ${MIN_TOTAL_IMAGES}`);
    return;
  }

  if (shortages.length > 0) {
    reportFailure('일부 캠핑장이 detail/review 최소 수량 미달');
    return;
  }

  console.log('[success] 다운로드 기준 충족');
}

main().catch((error) => {
  console.error(`[fatal] ${error.message}`);
  process.exit(1);
});
