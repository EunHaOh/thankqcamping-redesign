/**
 * Extract publicly visible campground images from m.thankqcamping.com
 *
 * Usage:
 *   npm run extract:images
 *
 * Notes:
 * - Does not access login, payment, or personal account areas
 * - Stops gracefully if the server blocks requests
 */
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';
import imageSize from 'image-size';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'public', 'images', 'campgrounds', 'raw');
const MAP_FILE = join(ROOT, 'public', 'images', 'campgrounds', 'image-map.json');

const BASE_URL = 'https://m.thankqcamping.com/';
const MIN_DIMENSION = 300;
const MAX_PAGES = 20;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_BANNER_ASPECT = 2.4;

/** 공개 페이지 시드 — 로그인/결제/마이페이지 제외 */
const SEED_URLS = [
  'https://m.thankqcamping.com/',
  'https://m.thankqcamping.com/search/searchMain.do',
  'https://m.thankqcamping.com/camp/campList.do',
  'https://m.thankqcamping.com/theme/themeList.do',
  'https://m.thankqcamping.com/event/eventList.do',
];

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const BLOCKED_PATH_PATTERN =
  /(login|signin|signup|join|member|mypage|auth|pay|payment|checkout|cart|order|reserve\/confirm|personal|privacy|terms)/i;
const BLOCKED_URL_PATTERN =
  /(logo|icon|favicon|sprite|avatar|profile|emoji|blank|placeholder|pixel|tracking|analytics|banner-ad|loading\.svg|main_icon|\/images\/)/i;
const CAPTCHA_HOST_PATTERN = /(stclab|botmanager|captcha)/i;
const CAMPGROUND_PHOTO_PATTERN = /\/file\//i;

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

function extractUrlsFromSrcset(srcset, baseUrl) {
  if (!srcset) return [];
  return srcset
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .map((part) => normalizeUrl(part, baseUrl))
    .filter(Boolean);
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

function shouldSkipUrl(url) {
  if (BLOCKED_URL_PATTERN.test(url)) return true;
  if (!CAMPGROUND_PHOTO_PATTERN.test(url)) return true;
  const ext = getExtension(url);
  if (!ext) return true;
  return false;
}

function isCaptchaPage(url) {
  try {
    const parsed = new URL(url);
    return CAPTCHA_HOST_PATTERN.test(parsed.hostname) || CAPTCHA_HOST_PATTERN.test(parsed.pathname);
  } catch {
    return false;
  }
}

function isImageResponse(response) {
  const contentType = response.headers()['content-type'] ?? '';
  if (/image\/(jpeg|jpg|png|webp)/i.test(contentType)) return true;
  return /\.(jpe?g|png|webp)(?:$|[?#])/i.test(response.url());
}

function attachNetworkImageCollector(page, candidates) {
  page.on('response', (response) => {
    if (response.status() !== 200 || !isImageResponse(response)) return;

    const normalized = normalizeUrl(response.url(), BASE_URL);
    if (!normalized || shouldSkipUrl(normalized)) return;

    const key = hashUrl(normalized);
    if (!candidates.has(key)) {
      candidates.set(key, {
        url: normalized,
        width: 0,
        height: 0,
        source: 'network',
        foundOn: page.url() || BASE_URL,
      });
    }
  });
}

function hashUrl(url) {
  return createHash('sha1').update(url).digest('hex');
}

async function collectPageImages(page) {
  return page.evaluate(() => {
    const results = [];

    document.querySelectorAll('img').forEach((img) => {
      const src = img.currentSrc || img.src;
      if (src) {
        results.push({
          url: src,
          width: img.naturalWidth || img.width || 0,
          height: img.naturalHeight || img.height || 0,
          source: 'img',
        });
      }

      const srcset = img.getAttribute('srcset');
      if (srcset) {
        srcset.split(',').forEach((part) => {
          const candidate = part.trim().split(/\s+/)[0];
          if (candidate) {
            results.push({
              url: candidate,
              width: img.naturalWidth || img.width || 0,
              height: img.naturalHeight || img.height || 0,
              source: 'srcset',
            });
          }
        });
      }
    });

    document.querySelectorAll('*').forEach((element) => {
      const style = window.getComputedStyle(element);
      const backgroundImage = style.backgroundImage;
      if (!backgroundImage || backgroundImage === 'none') return;

      const matches = backgroundImage.match(/url\((['"]?)(.*?)\1\)/g);
      if (!matches) return;

      matches.forEach((match) => {
        const url = match.replace(/^url\((['"]?)/, '').replace(/(['"]?)\)$/, '');
        if (!url || url.startsWith('data:')) return;
        const rect = element.getBoundingClientRect();
        results.push({
          url,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          source: 'background-image',
        });
      });
    });

    return results;
  });
}

async function discoverPublicLinks(page, currentUrl) {
  return page.evaluate(
    ({ blockedPatternSource }) => {
      const blockedPattern = new RegExp(blockedPatternSource, 'i');
      const links = new Set();

      document.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('javascript:')) return;

        try {
          const url = new URL(href, window.location.href);
          if (!url.hostname.includes('thankqcamping.com')) return;
          if (blockedPattern.test(url.pathname)) return;
          links.add(url.toString());
        } catch {
          // ignore invalid URLs
        }
      });

      return [...links];
    },
    { blockedPatternSource: BLOCKED_PATH_PATTERN.source },
  );
}

async function waitForStablePage(page) {
  await page.waitForLoadState('domcontentloaded', { timeout: REQUEST_TIMEOUT_MS }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1500);
}

async function safeCollectPageImages(page, pageUrl) {
  try {
    return await collectPageImages(page);
  } catch (error) {
    console.warn(`Image collection failed on ${pageUrl}: ${error.message}`);
    return [];
  }
}

async function safeDiscoverPublicLinks(page, pageUrl) {
  try {
    return await discoverPublicLinks(page, pageUrl);
  } catch (error) {
    console.warn(`Link discovery failed on ${pageUrl}: ${error.message}`);
    return [];
  }
}

async function autoScroll(page) {
  try {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const distance = 500;
        let total = 0;
        const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const timer = window.setInterval(() => {
          window.scrollBy(0, distance);
          total += distance;
          if (total >= maxScroll) {
            window.clearInterval(timer);
            resolve(undefined);
          }
        }, 250);
      });
    });
    await page.waitForTimeout(1000);
  } catch (error) {
    console.warn(`Scroll skipped: ${error.message}`);
  }
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

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType && !/image\/(jpeg|jpg|png|webp)/i.test(contentType)) {
      throw new Error(`Unsupported content-type: ${contentType}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timeout);
  }
}

function getDimensions(buffer, fallbackWidth, fallbackHeight) {
  try {
    const size = imageSize(buffer);
    return {
      width: size.width ?? fallbackWidth,
      height: size.height ?? fallbackHeight,
    };
  } catch {
    return { width: fallbackWidth, height: fallbackHeight };
  }
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

function loadExistingImageMap() {
  if (!existsSync(MAP_FILE)) return [];
  try {
    const raw = JSON.parse(readFileSync(MAP_FILE, 'utf8'));
    return Array.isArray(raw.images) ? raw.images : [];
  } catch {
    return [];
  }
}

function mergeImageMap(newImages) {
  const merged = new Map();
  for (const item of loadExistingImageMap()) {
    merged.set(item.sourceUrl, item);
  }
  for (const item of newImages) {
    merged.set(item.sourceUrl, item);
  }
  return [...merged.values()].sort((a, b) => a.file.localeCompare(b.file));
}

function getExistingSourceUrls() {
  return new Set(loadExistingImageMap().map((item) => item.sourceUrl));
}

function getNextFileIndex() {
  if (!existsSync(OUTPUT_DIR)) return 1;
  const files = readdirSync(OUTPUT_DIR).filter((name) => /^camp-\d+\.(jpe?g|png|webp)$/i.test(name));
  if (files.length === 0) return 1;
  const max = files.reduce((acc, name) => {
    const match = name.match(/^camp-(\d+)/i);
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, 0);
  return max + 1;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(dirname(MAP_FILE), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 390, height: 844 },
    locale: 'ko-KR',
  });
  const page = await context.newPage();
  const discovered = new Set(SEED_URLS);
  const visited = new Set();
  const candidates = new Map();

  attachNetworkImageCollector(page, candidates);

  console.log(`Collecting public image URLs from ${BASE_URL}`);

  try {
    while (visited.size < MAX_PAGES && discovered.size > 0) {
      const nextUrl = [...discovered].find((url) => !visited.has(url));
      if (!nextUrl) break;

      visited.add(nextUrl);
      console.log(`Scanning page (${visited.size}/${MAX_PAGES}): ${nextUrl}`);

      let response;
      try {
        response = await page.goto(nextUrl, {
          waitUntil: 'load',
          timeout: REQUEST_TIMEOUT_MS,
        });
        await waitForStablePage(page);
      } catch (error) {
        console.warn(`Skip unreachable page: ${nextUrl} (${error.message})`);
        continue;
      }

      const finalUrl = page.url();
      const onCaptchaPage = isCaptchaPage(finalUrl);

      if (onCaptchaPage) {
        console.warn(
          `Bot protection page detected (${finalUrl}). Using network-captured image URLs only.`,
        );
        await page.waitForTimeout(3000);
        break;
      } else if (BLOCKED_PATH_PATTERN.test(new URL(finalUrl).pathname)) {
        console.warn(`Skip blocked path after redirect: ${finalUrl}`);
        continue;
      } else if (!response || response.status() >= 400) {
        console.warn(`Skip page with status ${response?.status()}: ${nextUrl}`);
        continue;
      } else {
        await autoScroll(page);

        const pageImages = await safeCollectPageImages(page, finalUrl);
        for (const item of pageImages) {
          const normalized = normalizeUrl(item.url, nextUrl);
          if (!normalized || shouldSkipUrl(normalized)) continue;

          const key = hashUrl(normalized);
          const existing = candidates.get(key);
          if (!existing || item.width * item.height > existing.width * existing.height) {
            candidates.set(key, {
              url: normalized,
              width: item.width,
              height: item.height,
              source: item.source,
              foundOn: finalUrl,
            });
          }
        }

        if (visited.size < MAX_PAGES) {
          const links = await safeDiscoverPublicLinks(page, finalUrl);
          links
            .filter((link) => !visited.has(link) && !discovered.has(link))
            .slice(0, MAX_PAGES)
            .forEach((link) => discovered.add(link));
        }
      }

      // Allow network listener time to finish after initial HTML load.
      await page.waitForTimeout(3000);
    }
  } catch (error) {
    console.warn(`Stopped early due to site restriction or network issue: ${error.message}`);
  } finally {
    await browser.close();
  }

  console.log(`Found ${candidates.size} unique image candidates`);

  const saved = [];
  let blockedCount = 0;
  let index = getNextFileIndex();
  const knownSourceUrls = getExistingSourceUrls();

  for (const candidate of candidates.values()) {
    if (knownSourceUrls.has(candidate.url)) continue;

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
      console.log(
        `Skip small image (${dimensions.width}x${dimensions.height}): ${candidate.url}`,
      );
      continue;
    }

    if (isLikelyBannerOrPromo(dimensions.width, dimensions.height)) {
      console.log(
        `Skip banner/promo (${dimensions.width}x${dimensions.height}): ${candidate.url}`,
      );
      continue;
    }

    const filename = `camp-${padFileNumber(index)}${ext}`;
    const outputPath = join(OUTPUT_DIR, filename);
    writeFileSync(outputPath, buffer);

    saved.push({
      file: filename,
      path: `/images/campgrounds/raw/${filename}`,
      sourceUrl: candidate.url,
      width: dimensions.width,
      height: dimensions.height,
      source: candidate.source,
      foundOn: candidate.foundOn,
    });

    console.log(`Saved ${filename} (${dimensions.width}x${dimensions.height})`);
    knownSourceUrls.add(candidate.url);
    index += 1;
  }

  const mergedImages = mergeImageMap(saved);
  const map = {
    source: BASE_URL,
    extractedAt: new Date().toISOString(),
    minDimension: MIN_DIMENSION,
    pagesVisited: [...visited],
    totalCandidates: candidates.size,
    downloadedCount: mergedImages.length,
    newDownloadsThisRun: saved.length,
    blockedOrFailedCount: blockedCount,
    images: mergedImages,
  };

  writeFileSync(MAP_FILE, JSON.stringify(map, null, 2), 'utf8');

  console.log('');
  console.log(`Downloaded ${saved.length} images to ${OUTPUT_DIR}`);
  console.log(`Image map saved to ${MAP_FILE}`);

  if (saved.length === 0 && mergedImages.length === 0) {
    console.warn(
      'No images were downloaded. The site may be blocking automated access. Try again later from a normal network.',
    );
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
