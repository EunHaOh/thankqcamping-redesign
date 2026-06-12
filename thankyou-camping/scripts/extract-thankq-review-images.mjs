/**
 * Extract review-area images from m.thankqcamping.com
 *
 * Usage:
 *   npm run extract:review-images
 *
 * Saves to public/images/campgrounds/reviews/review-001.jpg ...
 */
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';
import imageSize from 'image-size';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'public', 'images', 'campgrounds', 'reviews');
const MAP_FILE = join(ROOT, 'public', 'images', 'campgrounds', 'review-image-map.json');

const BASE_URL = 'https://m.thankqcamping.com/';
const MIN_DIMENSION = 300;
const MAX_PAGES = 15;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_BANNER_ASPECT = 2.4;

const SEED_URLS = [
  'https://m.thankqcamping.com/',
  'https://m.thankqcamping.com/search/searchMain.do',
  'https://m.thankqcamping.com/camp/campList.do',
];

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const BLOCKED_PATH_PATTERN =
  /(login|signin|signup|join|member|mypage|auth|pay|payment|checkout|cart|order|reserve\/confirm|personal|privacy|terms)/i;
const BLOCKED_URL_PATTERN =
  /(logo|icon|favicon|sprite|avatar|profile|emoji|blank|placeholder|pixel|tracking|analytics|banner-ad|loading\.svg|main_icon|\/images\/)/i;
const CAPTCHA_HOST_PATTERN = /(stclab|botmanager|captcha)/i;
const CAMPGROUND_PHOTO_PATTERN = /\/file\//i;

const REVIEW_URL_HINT =
  /(review|후기|photoreview|userphoto|sitephoto|campsite|comment|reply|board|photo)/i;
const REVIEW_DOM_HINT =
  /(review|후기|comment|reply|photo|사진|이용후기|board|평점)/i;
const EXCLUDE_REVIEW_URL_HINT =
  /(banner|event|promo|coupon|logo|icon|food|menu|restaurant|cafe|bird|animal|bungee|jump)/i;

const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function normalizeUrl(rawUrl, baseUrl) {
  try {
    const url = new URL(rawUrl, baseUrl);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname.includes('thankqcamping.com')) return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function hashUrl(url) {
  return createHash('sha1').update(url).digest('hex');
}

function getExtension(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  const ext = extname(pathname);
  if (ALLOWED_EXTENSIONS.has(ext)) return ext === '.jpeg' ? '.jpg' : ext;
  const match = pathname.match(/\.(jpe?g|png|webp)(?:$|[?#])/i);
  if (!match) return null;
  const normalized = `.${match[1].toLowerCase()}`;
  return normalized === '.jpeg' ? '.jpg' : normalized;
}

function isLikelyBannerOrPromo(width, height) {
  if (width <= 0 || height <= 0) return true;
  const aspect = width / height;
  if (height <= 320 && aspect >= 1.8) return true;
  if (height <= 240) return true;
  return aspect >= MAX_BANNER_ASPECT && height < 500;
}

function padFileNumber(index) {
  return String(index).padStart(3, '0');
}

function getNextFileIndex() {
  if (!existsSync(OUTPUT_DIR)) return 1;
  const files = readdirSync(OUTPUT_DIR).filter((name) => /^review-\d+\.(jpe?g|png|webp)$/i.test(name));
  if (files.length === 0) return 1;
  return (
    files.reduce((acc, name) => {
      const match = name.match(/^review-(\d+)/i);
      return match ? Math.max(acc, Number(match[1])) : acc;
    }, 0) + 1
  );
}

function loadExistingMap() {
  if (!existsSync(MAP_FILE)) return [];
  try {
    const raw = JSON.parse(readFileSync(MAP_FILE, 'utf8'));
    return Array.isArray(raw.images) ? raw.images : [];
  } catch {
    return [];
  }
}

function isReviewContext(pageUrl, requestUrl, domHint = '') {
  const combined = `${pageUrl} ${requestUrl} ${domHint}`.toLowerCase();
  if (EXCLUDE_REVIEW_URL_HINT.test(combined)) return false;
  if (REVIEW_URL_HINT.test(requestUrl) || REVIEW_URL_HINT.test(pageUrl)) return true;
  if (REVIEW_DOM_HINT.test(domHint)) return true;
  return false;
}

function shouldSkipCandidate(url, context) {
  if (BLOCKED_URL_PATTERN.test(url)) return true;
  if (!CAMPGROUND_PHOTO_PATTERN.test(url)) return true;
  if (!getExtension(url)) return true;
  if (!isReviewContext(context.pageUrl, url, context.domHint)) return true;
  return false;
}

async function collectReviewDomImages(page) {
  return page.evaluate(() => {
    const hints = /review|후기|comment|reply|photo|사진|이용후기|board|평점/i;
    const results = [];

    document.querySelectorAll('img').forEach((img) => {
      let node = img.parentElement;
      let depth = 0;
      let domHint = '';

      while (node && depth < 6) {
        const cls = node.className?.toString?.() ?? '';
        const id = node.id ?? '';
        const text = (node.textContent ?? '').slice(0, 120);
        domHint = `${cls} ${id} ${text}`;
        if (hints.test(domHint)) break;
        node = node.parentElement;
        depth += 1;
      }

      const src = img.currentSrc || img.src;
      if (!src || src.startsWith('data:')) return;

      results.push({
        url: src,
        width: img.naturalWidth || img.width || 0,
        height: img.naturalHeight || img.height || 0,
        domHint,
        source: 'dom-review',
      });
    });

    return results;
  });
}

async function fetchImageBuffer(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Referer: BASE_URL,
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType && !/image\/(jpeg|jpg|png|webp)/i.test(contentType)) {
      throw new Error(`Unsupported content-type: ${contentType}`);
    }
    return Buffer.from(await response.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

function getDimensions(buffer, fallbackWidth, fallbackHeight) {
  try {
    const size = imageSize(buffer);
    return { width: size.width ?? fallbackWidth, height: size.height ?? fallbackHeight };
  } catch {
    return { width: fallbackWidth, height: fallbackHeight };
  }
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 390, height: 844 },
    locale: 'ko-KR',
  });
  const page = await context.newPage();
  const candidates = new Map();
  const knownSources = new Set(loadExistingMap().map((item) => item.sourceUrl));

  const attachReviewNetworkCollector = () => {
    page.on('response', (response) => {
      if (response.status() !== 200) return;
      const contentType = response.headers()['content-type'] ?? '';
      const responseUrl = response.url();
      const isImage =
        /image\/(jpeg|jpg|png|webp)/i.test(contentType) ||
        /\.(jpe?g|png|webp)(?:$|[?#])/i.test(responseUrl);
      if (!isImage) return;

      const normalized = normalizeUrl(responseUrl, BASE_URL);
      if (!normalized) return;

      const pageUrl = page.url() || BASE_URL;
      if (
        shouldSkipCandidate(normalized, {
          pageUrl,
          domHint: REVIEW_URL_HINT.test(normalized) ? 'network-review-url' : '',
        })
      ) {
        return;
      }

      const key = hashUrl(normalized);
      if (!candidates.has(key)) {
        candidates.set(key, {
          url: normalized,
          width: 0,
          height: 0,
          source: 'network-review',
          foundOn: pageUrl,
        });
      }
    });
  };

  attachReviewNetworkCollector();

  const visited = new Set();
  const discovered = new Set(SEED_URLS);

  try {
    while (visited.size < MAX_PAGES && discovered.size > 0) {
      const nextUrl = [...discovered].find((url) => !visited.has(url));
      if (!nextUrl) break;
      visited.add(nextUrl);

      console.log(`Scanning review context (${visited.size}/${MAX_PAGES}): ${nextUrl}`);

      try {
        await page.goto(nextUrl, { waitUntil: 'load', timeout: REQUEST_TIMEOUT_MS });
        await page.waitForTimeout(2000);
      } catch (error) {
        console.warn(`Skip unreachable page: ${nextUrl} (${error.message})`);
        continue;
      }

      const finalUrl = page.url();
      if (isCaptchaPage(finalUrl)) {
        console.warn(`Bot protection detected (${finalUrl}). Using captured review candidates only.`);
        break;
      }

      const domImages = await collectReviewDomImages(page).catch(() => []);
      for (const item of domImages) {
        const normalized = normalizeUrl(item.url, finalUrl);
        if (!normalized) continue;
        if (
          shouldSkipCandidate(normalized, {
            pageUrl: finalUrl,
            domHint: item.domHint,
          })
        ) {
          continue;
        }
        const key = hashUrl(normalized);
        const existing = candidates.get(key);
        if (!existing || item.width * item.height > existing.width * existing.height) {
          candidates.set(key, {
            url: normalized,
            width: item.width,
            height: item.height,
            source: item.source,
            foundOn: finalUrl,
            domHint: item.domHint,
          });
        }
      }

      await page.waitForTimeout(2000);
    }
  } finally {
    await browser.close();
  }

  console.log(`Found ${candidates.size} review image candidates`);

  const saved = [];
  let index = getNextFileIndex();
  let blockedCount = 0;

  for (const candidate of candidates.values()) {
    if (knownSources.has(candidate.url)) continue;

    let buffer;
    try {
      buffer = await fetchImageBuffer(candidate.url);
    } catch (error) {
      blockedCount += 1;
      console.warn(`Download skipped: ${candidate.url} (${error.message})`);
      continue;
    }

    const ext = getExtension(candidate.url) ?? '.jpg';
    const dimensions = getDimensions(buffer, candidate.width, candidate.height);

    if (dimensions.width <= MIN_DIMENSION || dimensions.height <= MIN_DIMENSION) {
      console.log(`Skip small image (${dimensions.width}x${dimensions.height}): ${candidate.url}`);
      continue;
    }

    if (isLikelyBannerOrPromo(dimensions.width, dimensions.height)) {
      console.log(`Skip banner/promo (${dimensions.width}x${dimensions.height}): ${candidate.url}`);
      continue;
    }

    const filename = `review-${padFileNumber(index)}${ext}`;
    writeFileSync(join(OUTPUT_DIR, filename), buffer);

    saved.push({
      file: filename,
      path: `/images/campgrounds/reviews/${filename}`,
      sourceUrl: candidate.url,
      width: dimensions.width,
      height: dimensions.height,
      source: candidate.source,
      foundOn: candidate.foundOn,
    });

    console.log(`Saved ${filename} (${dimensions.width}x${dimensions.height})`);
    knownSources.add(candidate.url);
    index += 1;
  }

  const merged = new Map(loadExistingMap().map((item) => [item.sourceUrl, item]));
  for (const item of saved) merged.set(item.sourceUrl, item);

  const map = {
    source: BASE_URL,
    extractedAt: new Date().toISOString(),
    minDimension: MIN_DIMENSION,
    pagesVisited: [...visited],
    totalCandidates: candidates.size,
    downloadedCount: merged.size,
    newDownloadsThisRun: saved.length,
    blockedOrFailedCount: blockedCount,
    images: [...merged.values()].sort((a, b) => a.file.localeCompare(b.file)),
  };

  writeFileSync(MAP_FILE, JSON.stringify(map, null, 2), 'utf8');
  console.log(`Review images saved to ${OUTPUT_DIR}`);
  console.log(`Review map saved to ${MAP_FILE}`);

  if (merged.size === 0) {
    const seeded = seedReviewImagesIfEmpty();
    if (seeded.length > 0) {
      console.log(`Seeded ${seeded.length} review images from curated camping photos`);
    }
  }
}

const SEED_CAMPING_RAW = [
  'camp-021.jpg',
  'camp-022.jpg',
  'camp-003.jpg',
  'camp-024.jpg',
  'camp-005.jpg',
  'camp-006.jpg',
  'camp-002.jpg',
  'camp-019.jpg',
  'camp-025.jpg',
  'camp-001.jpg',
  'camp-004.jpg',
];

function seedReviewImagesIfEmpty() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  const existing = readdirSync(OUTPUT_DIR).filter((name) =>
    /^review-\d+\.(jpe?g|png|webp)$/i.test(name),
  );
  if (existing.length > 0) return [];

  const rawDir = join(ROOT, 'public', 'images', 'campgrounds', 'raw');
  const seeded = [];
  let index = 1;

  for (const filename of SEED_CAMPING_RAW) {
    const sourcePath = join(rawDir, filename);
    if (!existsSync(sourcePath)) continue;
    const ext =
      extname(filename).toLowerCase() === '.jpeg' ? '.jpg' : extname(filename).toLowerCase();
    const targetName = `review-${padFileNumber(index)}${ext}`;
    writeFileSync(join(OUTPUT_DIR, targetName), readFileSync(sourcePath));
    seeded.push({
      file: targetName,
      path: `/images/campgrounds/reviews/${targetName}`,
      sourceUrl: `seed:${filename}`,
      width: 0,
      height: 0,
      source: 'seed-curated-camping',
      foundOn: 'local-curation',
    });
    console.log(`Seeded ${targetName} from raw/${filename}`);
    index += 1;
  }

  if (seeded.length > 0) {
    writeFileSync(
      MAP_FILE,
      JSON.stringify(
        {
          source: BASE_URL,
          extractedAt: new Date().toISOString(),
          minDimension: MIN_DIMENSION,
          seeded: true,
          note: 'CAPTCHA 또는 후기 영역 접근 제한으로 캠핑 사이트·시설 사진을 선별해 시드했습니다.',
          images: seeded,
        },
        null,
        2,
      ),
      'utf8',
    );
  }

  return seeded;
}

function isCaptchaPage(url) {
  try {
    const parsed = new URL(url);
    return CAPTCHA_HOST_PATTERN.test(parsed.hostname) || CAPTCHA_HOST_PATTERN.test(parsed.pathname);
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
