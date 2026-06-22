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
const MIN_TOTAL = 500;

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

    const listMatch = block.match(/listImages:\s*(\w+DetailImages)/);
    const detailMatch = block.match(/detailImages:\s*(\w+DetailImages)/);
    const reviewMatch = block.match(/reviewImages:\s*(\[[^\]]*\])/s);

    const listVar = listMatch?.[1];
    const detailVar = detailMatch?.[1];
    const listArrayMatch = listVar ? source.match(new RegExp(`const ${listVar} = (\\[[\\s\\S]*?\\]);`)) : null;
    const detailArrayMatch = detailVar ? source.match(new RegExp(`const ${detailVar} = (\\[[\\s\\S]*?\\]);`)) : null;
    const reviewArray = reviewMatch?.[1] ? JSON.parse(reviewMatch[1].replace(/'/g, '"')) : [];

    sets[id] = {
      listImages: listArrayMatch ? JSON.parse(listArrayMatch[1]) : [],
      detailImages: detailArrayMatch ? JSON.parse(detailArrayMatch[1]) : [],
      reviewImages: reviewArray,
    };
  }
  return sets;
}

function pathsEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((pathValue, index) => pathValue === b[index]);
}

async function main() {
  const source = await readFile(MAPPING_FILE, 'utf8');
  const mapping = loadMappingModule(source);
  const catalog = JSON.parse(readFileSync(CATALOG_FILE, 'utf8'));
  const expectedIds = catalog.slice(0, MAX_CAMPGROUNDS).map((item) => item.id);

  let hasError = false;
  const allPaths = new Set();
  const duplicatePaths = [];
  const missingFiles = [];

  for (const id of expectedIds) {
    const entry = mapping[id];
    if (!entry) {
      console.error(`[error] Missing mapping for ${id}`);
      hasError = true;
      continue;
    }

    if (entry.detailImages.length < MIN_DETAIL) {
      console.error(`[error] ${id}: detail ${entry.detailImages.length} < ${MIN_DETAIL}`);
      hasError = true;
    }

    if (entry.reviewImages.length < MIN_REVIEWS) {
      console.error(`[error] ${id}: reviews ${entry.reviewImages.length} < ${MIN_REVIEWS}`);
      hasError = true;
    }

    if (!pathsEqual(entry.listImages, entry.detailImages)) {
      console.error(`[error] ${id}: listImages !== detailImages`);
      hasError = true;
    }

    for (const imagePath of [...entry.detailImages, ...entry.reviewImages]) {
      if (allPaths.has(imagePath)) {
        duplicatePaths.push(imagePath);
        hasError = true;
      } else {
        allPaths.add(imagePath);
      }

      if (imagePath.includes('/list/')) {
        console.error(`[error] ${id}: list 폴더 경로 금지 -> ${imagePath}`);
        hasError = true;
      }

      if (!(await fileExists(imagePath))) {
        missingFiles.push(imagePath);
        hasError = true;
      }
    }
  }

  if (duplicatePaths.length > 0) {
    console.error(`[error] Duplicate paths: ${duplicatePaths.length}`);
  }

  if (missingFiles.length > 0) {
    console.error(`[error] Missing files: ${missingFiles.length}`);
  }

  if (allPaths.size < MIN_TOTAL) {
    console.error(`[error] Total unique paths ${allPaths.size} < ${MIN_TOTAL}`);
    hasError = true;
  }

  if (hasError) {
    process.exitCode = 1;
    return;
  }

  console.log(
    `[validate:pexels-image-sets] OK — ${expectedIds.length} campgrounds, ${allPaths.size} unique paths`,
  );
}

main().catch((error) => {
  console.error('[validate:pexels-image-sets] Failed:', error.message);
  process.exitCode = 1;
});
