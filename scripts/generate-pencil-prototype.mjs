/**
 * Captures thankyou-camping screens from localhost:5173 and builds a Pencil .pen file.
 * Run: node scripts/generate-pencil-prototype.mjs
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'pencil-assets');
const OUTPUT_PEN = join(ROOT, 'thankqcamping-tobe.pen');
const BASE_URL = 'http://localhost:5173';
const FRAME_WIDTH = 390;
const FRAME_GAP = 48;
const ROW_GAP = 64;

const COLORS = {
  primary: '#F26522',
  primarySoft: '#FFF4EE',
  ink: '#222222',
  inkSecondary: '#666666',
  inkMuted: '#999999',
  border: '#E8ECF0',
  white: '#FFFFFF',
  bgMuted: '#FAFAFA',
  chipBg: '#F7F7F7',
  star: '#FFB020',
  overlay: '#00000066',
};

let idCounter = 0;
function uid(prefix = 'n') {
  idCounter += 1;
  return `${prefix}${idCounter.toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

function text(content, opts = {}) {
  return {
    type: 'text',
    id: uid('t'),
    content,
    fill: opts.fill ?? COLORS.ink,
    fontFamily: opts.fontFamily ?? 'Pretendard',
    fontSize: opts.fontSize ?? 14,
    fontWeight: opts.fontWeight ?? '400',
    lineHeight: opts.lineHeight ?? 1.4,
    textGrowth: opts.textGrowth ?? 'auto',
    ...(opts.width ? { width: opts.width } : {}),
    ...(opts.height ? { height: opts.height } : {}),
    ...(opts.textAlign ? { textAlign: opts.textAlign } : {}),
    name: opts.name ?? content.slice(0, 20),
  };
}

function frame(name, opts = {}) {
  const node = {
    type: 'frame',
    id: uid('f'),
    name,
    ...(opts.x !== undefined ? { x: opts.x } : {}),
    ...(opts.y !== undefined ? { y: opts.y } : {}),
    width: opts.width ?? 'fill_container',
    ...(opts.height !== undefined ? { height: opts.height } : {}),
    fill: opts.fill ?? COLORS.white,
    layout: opts.layout ?? 'vertical',
    ...(opts.gap !== undefined ? { gap: opts.gap } : {}),
    ...(opts.padding !== undefined ? { padding: opts.padding } : {}),
    ...(opts.cornerRadius !== undefined ? { cornerRadius: opts.cornerRadius } : {}),
    ...(opts.clip ? { clip: true } : {}),
    ...(opts.stroke ? { stroke: opts.stroke } : {}),
    ...(opts.justifyContent ? { justifyContent: opts.justifyContent } : {}),
    ...(opts.alignItems ? { alignItems: opts.alignItems } : {}),
    ...(opts.layout === 'none' ? { layout: 'none' } : {}),
    children: opts.children ?? [],
  };
  return node;
}

function imageFrame(name, width, height, dataUrl, opts = {}) {
  return frame(name, {
    width,
    height,
    fill: {
      type: 'image',
      enabled: true,
      url: dataUrl,
      mode: 'fill',
    },
    clip: true,
    cornerRadius: opts.cornerRadius ?? 0,
    layout: 'none',
    children: [],
  });
}

function strokeBorder() {
  return {
    thickness: 1,
    fill: COLORS.border,
  };
}

function backHeader(title, transparent = false) {
  return frame('Header', {
    width: FRAME_WIDTH,
    height: 56,
    fill: transparent ? '#00000000' : COLORS.white,
    stroke: transparent ? undefined : { thickness: { bottom: 1 }, fill: COLORS.border },
    layout: 'horizontal',
    padding: [0, 16],
    gap: 12,
    alignItems: 'center',
    children: [
      frame('Back Button', {
        width: 36,
        height: 36,
        cornerRadius: 999,
        fill: transparent ? '#00000033' : COLORS.white,
        stroke: transparent ? undefined : { thickness: 1, fill: COLORS.border },
        layout: 'none',
        children: [
          text('‹', {
            x: 10,
            y: 4,
            fontSize: 22,
            fontWeight: '600',
            fill: transparent ? COLORS.white : COLORS.ink,
          }),
        ],
      }),
      ...(title
        ? [
            text(title, {
              fontSize: 16,
              fontWeight: '600',
              fill: transparent ? COLORS.white : COLORS.ink,
            }),
          ]
        : []),
    ],
  });
}

function fixedCTA(label, leftLines = null, disabled = false) {
  return frame('Fixed CTA', {
    width: FRAME_WIDTH,
    height: 88,
    fill: COLORS.white,
    stroke: { thickness: { top: 1 }, fill: COLORS.border },
    layout: 'horizontal',
    padding: [12, 16, 20, 16],
    gap: 12,
    alignItems: 'center',
    children: [
      ...(leftLines
        ? [
            frame('CTA Left', {
              layout: 'vertical',
              gap: 2,
              children: leftLines.map((line, i) =>
                text(line.text, {
                  fontSize: line.size ?? (i === 0 ? 12 : 16),
                  fontWeight: line.bold ? '700' : '400',
                  fill: line.muted ? COLORS.inkMuted : COLORS.ink,
                }),
              ),
            }),
          ]
        : []),
      frame('CTA Button', {
        height: 56,
        cornerRadius: 14,
        fill: disabled ? '#E5E7EB' : COLORS.primary,
        layout: 'horizontal',
        justifyContent: 'center',
        alignItems: 'center',
        children: [
          text(label, {
            fontSize: 14,
            fontWeight: '600',
            fill: disabled ? '#9CA3AF' : COLORS.white,
          }),
        ],
      }),
    ],
  });
}

function chip(label, active = false) {
  return frame(label, {
    height: 32,
    cornerRadius: 999,
    fill: active ? COLORS.primary : COLORS.white,
    stroke: { thickness: 1, fill: active ? COLORS.primary : COLORS.border },
    padding: [6, 12],
    layout: 'horizontal',
    alignItems: 'center',
    children: [
      text(label, {
        fontSize: 12,
        fontWeight: '500',
        fill: active ? COLORS.white : COLORS.inkSecondary,
      }),
    ],
  });
}

function starRating(rating, reviewCount, size = 'md') {
  const fs = size === 'sm' ? 14 : 16;
  return frame('Star Rating', {
    layout: 'horizontal',
    gap: 6,
    alignItems: 'center',
    children: [
      text('★', { fontSize: fs, fill: COLORS.star, fontWeight: '700' }),
      text(rating.toFixed(1), { fontSize: fs, fontWeight: '600', fill: COLORS.ink }),
      ...(reviewCount !== undefined
        ? [
            text(`후기 ${reviewCount.toLocaleString('ko-KR')}개`, {
              fontSize: size === 'sm' ? 12 : 14,
              fill: COLORS.inkSecondary,
            }),
          ]
        : []),
    ],
  });
}

function searchConditionBar() {
  return frame('Search Condition Bar', {
    width: 'fill_container',
    cornerRadius: 8,
    fill: COLORS.bgMuted,
    stroke: { thickness: 1, fill: COLORS.border },
    padding: [8, 8],
    layout: 'horizontal',
    gap: 4,
    alignItems: 'center',
    children: [
      text('6.20(금) - 6.21(토)', { fontSize: 14, fontWeight: '500', fill: COLORS.ink }),
      text('|', { fontSize: 14, fill: COLORS.inkMuted }),
      text('전국', { fontSize: 14, fill: COLORS.inkSecondary }),
      text('|', { fontSize: 14, fill: COLORS.inkMuted }),
      text('성인 2 · 아이 0', { fontSize: 14, fill: COLORS.inkSecondary }),
    ],
  });
}

function filterChipsRow() {
  const filters = ['전체 필터', '예약 가능', '반려견 가능', '사이트 크기'];
  return frame('Filter Chips', {
    width: 'fill_container',
    layout: 'horizontal',
    gap: 8,
    children: filters.map((f, i) => chip(f, i === 1)),
  });
}

function campCard(name, location, rating, reviewCount, price, tags, heroDataUrl) {
  return frame(name, {
    width: 'fill_container',
    cornerRadius: 8,
    fill: COLORS.white,
    stroke: strokeBorder(),
    clip: true,
    layout: 'vertical',
    children: [
      imageFrame('Hero', 'fill_container', 200, heroDataUrl),
      frame('Body', {
        padding: 12,
        gap: 8,
        layout: 'vertical',
        children: [
          text(name, { fontSize: 16, fontWeight: '700' }),
          text(location, { fontSize: 14, fill: COLORS.inkSecondary }),
          starRating(rating, reviewCount, 'sm'),
          frame('Price Row', {
            layout: 'horizontal',
            justifyContent: 'space_between',
            alignItems: 'center',
            children: [
              text(`${price.toLocaleString('ko-KR')}원~`, { fontSize: 16, fontWeight: '700' }),
              text('예약 가능', { fontSize: 12, fontWeight: '500', fill: COLORS.primary }),
            ],
          }),
          frame('Tags', {
            layout: 'horizontal',
            gap: 4,
            children: tags.map((tag) =>
              frame(tag, {
                stroke: { thickness: 1, fill: COLORS.border },
                cornerRadius: 4,
                padding: [2, 6],
                children: [text(tag, { fontSize: 11, fill: COLORS.inkSecondary })],
              }),
            ),
          }),
        ],
      }),
    ],
  });
}

function buildSearchListScreen(heroImages, x, y) {
  return frame('01 · 검색결과 리스트', {
    x,
    y,
    width: FRAME_WIDTH,
    height: 844,
    fill: COLORS.white,
    clip: true,
    layout: 'vertical',
    children: [
      frame('Sticky Header', {
        width: FRAME_WIDTH,
        fill: COLORS.white,
        stroke: { thickness: { bottom: 1 }, fill: COLORS.border },
        padding: [16, 16, 12, 16],
        gap: 12,
        layout: 'vertical',
        children: [searchConditionBar(), filterChipsRow()],
      }),
      frame('Main', {
        width: FRAME_WIDTH,
        padding: [12, 16, 32, 16],
        gap: 12,
        layout: 'vertical',
        children: [
          frame('Result Meta', {
            layout: 'horizontal',
            justifyContent: 'space_between',
            alignItems: 'center',
            children: [
              text('검색결과 3곳', { fontSize: 14, fill: COLORS.inkSecondary }),
              frame('Sort', {
                stroke: { thickness: 1, fill: COLORS.border },
                cornerRadius: 4,
                padding: [4, 8],
                children: [text('추천순', { fontSize: 12, fill: COLORS.inkSecondary })],
              }),
            ],
          }),
          campCard(
            '숲속의 쉼터 캠핑장',
            '경기 가평군 청평면',
            4.8,
            328,
            45000,
            ['반려견 가능', '평균 8m × 10m'],
            heroImages.camp1,
          ),
          campCard(
            '별빛정원 글램핑',
            '강원 홍천군 서면',
            4.6,
            215,
            89000,
            ['글램핑', '수영장'],
            heroImages.camp2,
          ),
        ],
      }),
    ],
  });
}

function buildCampDetailScreen(heroImage, x, y) {
  const chips = [
    '반려견 가능',
    '평균 8m × 10m',
    '4인용 돔 텐트 가능',
    '후기 사진 있음',
  ];
  return frame('02 · 캠핑장 상세', {
    x,
    y,
    width: FRAME_WIDTH,
    height: 844,
    fill: COLORS.white,
    clip: true,
    layout: 'vertical',
    children: [
      frame('Hero Section', {
        width: FRAME_WIDTH,
        height: 320,
        layout: 'none',
        clip: true,
        children: [
          imageFrame('Hero Image', FRAME_WIDTH, 320, heroImage),
          frame('Header Overlay', {
            x: 0,
            y: 0,
            width: FRAME_WIDTH,
            children: [backHeader('', true)],
          }),
        ],
      }),
      frame('Content', {
        width: FRAME_WIDTH,
        padding: [20, 16, 160, 16],
        gap: 20,
        layout: 'vertical',
        children: [
          frame('Title Block', {
            gap: 8,
            layout: 'vertical',
            children: [
              text('숲속의 쉼터 캠핑장', { fontSize: 20, fontWeight: '700' }),
              text('경기 가평군 청평면', { fontSize: 14, fill: COLORS.inkSecondary }),
              starRating(4.8, 328),
              frame('Condition Chips', {
                layout: 'horizontal',
                gap: 6,
                children: chips.slice(0, 3).map((c) =>
                  frame(c, {
                    stroke: { thickness: 1, fill: COLORS.border },
                    fill: COLORS.chipBg,
                    cornerRadius: 4,
                    padding: [2, 8],
                    children: [text(c, { fontSize: 12, fill: COLORS.inkSecondary })],
                  }),
                ),
              }),
            ],
          }),
          frame('Site Summary Card', {
            cornerRadius: 16,
            stroke: strokeBorder(),
            padding: 16,
            gap: 10,
            layout: 'vertical',
            children: [
              text('내 조건 기준 사이트 요약', { fontSize: 16, fontWeight: '700' }),
              ...[
                ['사이트 크기', '평균 8m × 10m'],
                ['텐트 설치', '내 텐트 기준 설치 가능'],
                ['반려견 동반', '가능'],
              ].map(([k, v]) =>
                frame(k, {
                  layout: 'horizontal',
                  gap: 12,
                  children: [
                    text(k, { width: 88, fontSize: 14, fill: COLORS.inkSecondary }),
                    text(v, { fontSize: 14, fontWeight: '500' }),
                  ],
                }),
              ),
            ],
          }),
          frame('Review Summary Card', {
            cornerRadius: 16,
            stroke: strokeBorder(),
            padding: 16,
            gap: 8,
            layout: 'vertical',
            children: [
              text('후기 요약', { fontSize: 16, fontWeight: '700' }),
              text('· 사이트 간 간격이 넓다는 후기가 많아요', {
                fontSize: 14,
                fill: COLORS.inkSecondary,
              }),
              text('· 바닥이 평평하다는 후기가 많아요', {
                fontSize: 14,
                fill: COLORS.inkSecondary,
              }),
              frame('전체 후기 보기', {
                height: 40,
                cornerRadius: 8,
                stroke: strokeBorder(),
                layout: 'horizontal',
                justifyContent: 'center',
                alignItems: 'center',
                children: [text('전체 후기 보기', { fontSize: 14, fontWeight: '500' })],
              }),
            ],
          }),
        ],
      }),
      frame('Fixed CTA Wrapper', {
        x: 0,
        y: 756,
        width: FRAME_WIDTH,
        layout: 'none',
        children: [
          fixedCTA('사이트 확인 후 예약하기', [
            { text: '1박 기준', muted: true, size: 12 },
            { text: '45,000원~', bold: true, size: 16 },
          ]),
        ],
      }),
    ],
  });
}

function buildAllReviewsScreen(x, y) {
  const filters = ['전체', '사진 후기', 'A-1 사이트', 'A-2 사이트'];
  return frame('03 · 전체 후기', {
    x,
    y,
    width: FRAME_WIDTH,
    height: 844,
    fill: COLORS.white,
    clip: true,
    layout: 'vertical',
    children: [
      backHeader('전체 후기'),
      frame('Main', {
        padding: [16, 16, 32, 16],
        gap: 16,
        layout: 'vertical',
        children: [
          frame('Camp Info', {
            gap: 4,
            layout: 'vertical',
            children: [
              text('숲속의 쉼터 캠핑장', { fontSize: 16, fontWeight: '700' }),
              starRating(4.8, 328, 'sm'),
            ],
          }),
          frame('Review Filters', {
            layout: 'horizontal',
            gap: 8,
            children: filters.map((f, i) => chip(f, i === 0)),
          }),
          frame('Review Card', {
            cornerRadius: 12,
            stroke: strokeBorder(),
            padding: 12,
            gap: 8,
            layout: 'vertical',
            children: [
              text('캠퍼리버', { fontSize: 14, fontWeight: '700' }),
              text('A-1 사이트 이용', { fontSize: 12, fill: COLORS.inkMuted }),
              text('2026.05.12', { fontSize: 12, fill: COLORS.inkMuted }),
              starRating(5),
              text('사이트가 넓고 바닥이 평평해서 텐트 설치가 편했어요. 샤워장도 깨끗합니다.', {
                fontSize: 14,
                fill: COLORS.inkSecondary,
                lineHeight: 1.5,
              }),
              frame('자세히 보기', {
                height: 36,
                cornerRadius: 8,
                stroke: strokeBorder(),
                layout: 'horizontal',
                justifyContent: 'center',
                alignItems: 'center',
                children: [text('자세히 보기', { fontSize: 14, fontWeight: '500' })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function buildReviewDetailScreen(reviewImage, x, y) {
  return frame('04 · 후기 상세', {
    x,
    y,
    width: FRAME_WIDTH,
    height: 844,
    fill: COLORS.white,
    clip: true,
    layout: 'vertical',
    children: [
      backHeader('후기 상세'),
      frame('Main', {
        padding: [16, 16, 160, 16],
        gap: 16,
        layout: 'vertical',
        children: [
          frame('Author', {
            gap: 2,
            layout: 'vertical',
            children: [
              text('캠퍼리버', { fontSize: 14, fontWeight: '700' }),
              text('A-1 사이트 이용', { fontSize: 12, fill: COLORS.inkMuted }),
              text('2026.05.12', { fontSize: 12, fill: COLORS.inkMuted }),
            ],
          }),
          starRating(5),
          imageFrame('Review Photo', 'fill_container', 120, reviewImage, { cornerRadius: 8 }),
          text(
            '사이트가 넓고 바닥이 평평해서 텐트 설치가 편했어요. 옆 사이트와 간격이 있어 조용했고, 샤워장도 깨끗했습니다.',
            { fontSize: 14, fill: COLORS.inkSecondary, lineHeight: 1.6 },
          ),
          frame('Confirm Tags', {
            gap: 8,
            layout: 'vertical',
            children: [
              text('확인 태그', { fontSize: 12, fontWeight: '500', fill: COLORS.inkMuted }),
              frame('Tags', {
                layout: 'horizontal',
                gap: 6,
                children: ['사이트 간격 넓음', '바닥 평평함'].map((tag) =>
                  frame(tag, {
                    stroke: { thickness: 1, fill: COLORS.border },
                    fill: COLORS.chipBg,
                    cornerRadius: 4,
                    padding: [2, 8],
                    children: [text(tag, { fontSize: 12, fill: COLORS.inkSecondary })],
                  }),
                ),
              }),
            ],
          }),
        ],
      }),
      frame('Fixed CTA Wrapper', {
        x: 0,
        y: 756,
        width: FRAME_WIDTH,
        layout: 'none',
        children: [fixedCTA('A-1 사이트 보기')],
      }),
    ],
  });
}

function buildSiteSelectionScreen(siteImage, x, y) {
  return frame('05 · 사이트 선택', {
    x,
    y,
    width: FRAME_WIDTH,
    height: 844,
    fill: COLORS.white,
    clip: true,
    layout: 'vertical',
    children: [
      backHeader('사이트 선택'),
      frame('Main', {
        padding: [16, 16, 160, 16],
        gap: 16,
        layout: 'vertical',
        children: [
          frame('Camp Title', {
            gap: 4,
            layout: 'vertical',
            children: [
              text('숲속의 쉼터 캠핑장', { fontSize: 16, fontWeight: '700' }),
              text('경기 가평군 청평면', { fontSize: 14, fill: COLORS.inkSecondary }),
            ],
          }),
          frame('Schedule Card', {
            cornerRadius: 16,
            stroke: strokeBorder(),
            padding: 16,
            gap: 8,
            layout: 'vertical',
            children: [
              text('예약 일정', { fontSize: 14, fontWeight: '700' }),
              frame('Dates', {
                layout: 'horizontal',
                gap: 12,
                alignItems: 'center',
                children: [
                  frame('Check-in', {
                    cornerRadius: 12,
                    stroke: strokeBorder(),
                    padding: [10, 12],
                    gap: 2,
                    layout: 'vertical',
                    children: [
                      text('체크인', { fontSize: 12, fill: COLORS.inkMuted }),
                      text('2026.06.20 (금)', { fontSize: 14, fontWeight: '600' }),
                    ],
                  }),
                  text('→', { fill: COLORS.inkMuted }),
                  frame('Check-out', {
                    cornerRadius: 12,
                    stroke: strokeBorder(),
                    padding: [10, 12],
                    gap: 2,
                    layout: 'vertical',
                    children: [
                      text('체크아웃', { fontSize: 12, fill: COLORS.inkMuted }),
                      text('2026.06.21 (토)', { fontSize: 14, fontWeight: '600' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          frame('Tent Fit Banner', {
            cornerRadius: 8,
            fill: COLORS.bgMuted,
            stroke: strokeBorder(),
            padding: 12,
            children: [text('내 텐트 기준 설치 가능', { fontSize: 14, fontWeight: '700' })],
          }),
          frame('View Tabs', {
            layout: 'horizontal',
            stroke: { thickness: { bottom: 1 }, fill: COLORS.border },
            children: [
              frame('목록으로 보기', {
                padding: [0, 0, 10, 0],
                stroke: { thickness: { bottom: 2 }, fill: COLORS.primary },
                children: [
                  text('목록으로 보기', {
                    fontSize: 14,
                    fontWeight: '600',
                    fill: COLORS.primary,
                  }),
                ],
              }),
              frame('배치도로 보기', {
                padding: [0, 0, 10, 0],
                children: [
                  text('배치도로 보기', {
                    fontSize: 14,
                    fontWeight: '600',
                    fill: COLORS.inkMuted,
                  }),
                ],
              }),
            ],
          }),
          frame('Site Card', {
            cornerRadius: 8,
            stroke: { thickness: 2, fill: COLORS.primary },
            layout: 'vertical',
            clip: true,
            children: [
              frame('Site Header', {
                padding: [12, 12, 0, 12],
                layout: 'horizontal',
                justifyContent: 'space_between',
                children: [
                  text('A-1 사이트', { fontSize: 16, fontWeight: '700' }),
                  frame('예약 가능', {
                    fill: COLORS.primarySoft,
                    cornerRadius: 4,
                    padding: [2, 8],
                    children: [
                      text('예약 가능', { fontSize: 12, fontWeight: '500', fill: COLORS.primary }),
                    ],
                  }),
                ],
              }),
              frame('Site Image Wrap', {
                padding: [8, 12, 0, 12],
                children: [imageFrame('Site Photo', 334, 180, siteImage, { cornerRadius: 8 })],
              }),
              frame('Site Body', {
                padding: [8, 12, 12, 12],
                gap: 8,
                layout: 'vertical',
                children: [
                  text('8m × 10m', { fontSize: 14, fontWeight: '500' }),
                  text('입구에서 가까운 위치', { fontSize: 14, fill: COLORS.inkSecondary }),
                  text('55,000원/박', { fontSize: 16, fontWeight: '700' }),
                  frame('Actions', {
                    layout: 'horizontal',
                    gap: 8,
                    children: [
                      frame('자세히 보기', {
                        height: 40,
                        cornerRadius: 8,
                        stroke: strokeBorder(),
                        layout: 'horizontal',
                        justifyContent: 'center',
                        alignItems: 'center',
                        children: [text('자세히 보기', { fontSize: 14, fontWeight: '500' })],
                      }),
                      frame('선택됨', {
                        height: 40,
                        cornerRadius: 8,
                        fill: COLORS.primary,
                        layout: 'horizontal',
                        justifyContent: 'center',
                        alignItems: 'center',
                        children: [
                          text('선택됨', { fontSize: 14, fontWeight: '600', fill: COLORS.white }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      frame('Fixed CTA Wrapper', {
        x: 0,
        y: 756,
        width: FRAME_WIDTH,
        layout: 'none',
        children: [
          fixedCTA('예약 정보 확인', [{ text: 'A-1 사이트 선택됨', size: 14, fill: COLORS.inkSecondary }]),
        ],
      }),
    ],
  });
}

function buildSiteDetailBottomSheet(siteImage, x, y) {
  return frame('06 · 사이트 상세 바텀시트', {
    x,
    y,
    width: FRAME_WIDTH,
    height: 844,
    fill: COLORS.white,
    clip: true,
    layout: 'none',
    children: [
      frame('Dim Overlay', {
        x: 0,
        y: 0,
        width: FRAME_WIDTH,
        height: 844,
        fill: COLORS.overlay,
      }),
      frame('Bottom Sheet', {
        x: 0,
        y: 180,
        width: FRAME_WIDTH,
        height: 664,
        fill: COLORS.white,
        cornerRadius: [16, 16, 0, 0],
        clip: true,
        layout: 'vertical',
        children: [
          frame('Sheet Header', {
            padding: [16, 24, 0, 24],
            gap: 16,
            layout: 'vertical',
            children: [
              frame('Handle', {
                width: 40,
                height: 4,
                cornerRadius: 999,
                fill: COLORS.border,
                alignItems: 'center',
              }),
              frame('Title Row', {
                layout: 'horizontal',
                justifyContent: 'space_between',
                alignItems: 'center',
                children: [
                  text('A-1 사이트 상세', { fontSize: 16, fontWeight: '700' }),
                  frame('Close', {
                    width: 32,
                    height: 32,
                    cornerRadius: 999,
                    stroke: strokeBorder(),
                    layout: 'horizontal',
                    justifyContent: 'center',
                    alignItems: 'center',
                    children: [text('×', { fontSize: 18, fill: COLORS.inkMuted })],
                  }),
                ],
              }),
            ],
          }),
          frame('Sheet Body', {
            padding: [16, 24, 16, 24],
            gap: 20,
            layout: 'vertical',
            children: [
              imageFrame('Site Photos', 'fill_container', 160, siteImage, { cornerRadius: 16 }),
              frame('Location Section', {
                gap: 12,
                layout: 'vertical',
                children: [
                  text('위치', { fontSize: 14, fontWeight: '700' }),
                  frame('Mini Map', {
                    height: 144,
                    cornerRadius: 12,
                    stroke: strokeBorder(),
                    fill: '#EEF7EE',
                    padding: 12,
                    layout: 'none',
                    children: [
                      frame('Site Pin A1', {
                        x: 90,
                        y: 50,
                        width: 36,
                        height: 36,
                        cornerRadius: 999,
                        fill: COLORS.primary,
                        layout: 'horizontal',
                        justifyContent: 'center',
                        alignItems: 'center',
                        children: [text('A1', { fontSize: 10, fontWeight: '700', fill: COLORS.white })],
                      }),
                    ],
                  }),
                  text('· 입구에서 가까운 위치', { fontSize: 14, fill: COLORS.inkSecondary }),
                  text('· 개수대 도보 1분', { fontSize: 14, fill: COLORS.inkSecondary }),
                ],
              }),
              frame('Conditions', {
                cornerRadius: 12,
                stroke: strokeBorder(),
                padding: 12,
                gap: 10,
                layout: 'vertical',
                children: [
                  text('사이트 조건', { fontSize: 14, fontWeight: '700' }),
                  ...[
                    ['크기', '8m × 10m'],
                    ['텐트 설치', '내 텐트 기준 설치 가능'],
                    ['동반 조건', '반려견 동반 가능'],
                  ].map(([k, v]) =>
                    frame(k, {
                      layout: 'horizontal',
                      gap: 12,
                      children: [
                        text(k, { width: 72, fontSize: 14, fill: COLORS.inkSecondary }),
                        text(v, { fontSize: 14, fontWeight: '500' }),
                      ],
                    }),
                  ),
                ],
              }),
            ],
          }),
          frame('Sheet Footer', {
            stroke: { thickness: { top: 1 }, fill: COLORS.border },
            padding: [12, 24, 20, 24],
            layout: 'horizontal',
            gap: 12,
            alignItems: 'center',
            children: [
              frame('Price', {
                gap: 2,
                layout: 'vertical',
                children: [
                  text('1박 기준', { fontSize: 12, fill: COLORS.inkMuted }),
                  text('55,000원/박', { fontSize: 26, fontWeight: '700' }),
                ],
              }),
              frame('A-1 사이트 선택하기', {
                height: 56,
                cornerRadius: 14,
                fill: COLORS.primary,
                layout: 'horizontal',
                justifyContent: 'center',
                alignItems: 'center',
                children: [
                  text('A-1 사이트 선택하기', {
                    fontSize: 14,
                    fontWeight: '600',
                    fill: COLORS.white,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function buildBookingConfirmScreen(siteImage, x, y) {
  return frame('07 · 예약 확인', {
    x,
    y,
    width: FRAME_WIDTH,
    height: 844,
    fill: COLORS.white,
    clip: true,
    layout: 'vertical',
    children: [
      backHeader('예약 확인'),
      frame('Main', {
        padding: [16, 16, 160, 16],
        gap: 16,
        layout: 'vertical',
        children: [
          frame('Site Card', {
            cornerRadius: 16,
            stroke: strokeBorder(),
            clip: true,
            layout: 'vertical',
            children: [
              imageFrame('Site Hero', 'fill_container', 160, siteImage),
              frame('Site Info', {
                padding: 16,
                gap: 6,
                layout: 'vertical',
                children: [
                  text('A-1 사이트', { fontSize: 16, fontWeight: '700' }),
                  text('숲속의 쉼터 캠핑장', { fontSize: 14, fill: COLORS.inkSecondary }),
                  text('입구에서 가까운 위치', { fontSize: 14, fill: COLORS.inkSecondary }),
                  text('8m × 10m', { fontSize: 14 }),
                  frame('Tags', {
                    layout: 'horizontal',
                    gap: 6,
                    children: ['반려견 동반 가능', '4인용 돔 텐트 가능'].map((tag) =>
                      frame(tag, {
                        stroke: { thickness: 1, fill: COLORS.border },
                        cornerRadius: 4,
                        padding: [2, 8],
                        children: [text(tag, { fontSize: 12, fill: COLORS.inkSecondary })],
                      }),
                    ),
                  }),
                ],
              }),
            ],
          }),
          frame('Booking Info', {
            cornerRadius: 16,
            stroke: strokeBorder(),
            padding: 16,
            gap: 12,
            layout: 'vertical',
            children: [
              text('예약 정보', { fontSize: 16, fontWeight: '700' }),
              ...[
                ['체크인', '2026.06.20 (금) 15:00'],
                ['체크아웃', '2026.06.21 (토) 11:00'],
                ['인원', '성인 2명'],
                ['사이트', 'A-1 사이트'],
              ].map(([k, v]) =>
                frame(k, {
                  layout: 'horizontal',
                  justifyContent: 'space_between',
                  children: [
                    text(k, { fontSize: 14, fill: COLORS.inkSecondary }),
                    text(v, { fontSize: 14, fontWeight: '600' }),
                  ],
                }),
              ),
            ],
          }),
          frame('Payment', {
            cornerRadius: 16,
            stroke: strokeBorder(),
            padding: 16,
            gap: 8,
            layout: 'vertical',
            children: [
              text('결제 금액', { fontSize: 16, fontWeight: '700' }),
              frame('숙박비', {
                layout: 'horizontal',
                justifyContent: 'space_between',
                children: [
                  text('숙박비 1박', { fontSize: 14, fill: COLORS.inkSecondary }),
                  text('55,000원', { fontSize: 14 }),
                ],
              }),
              frame('Total', {
                stroke: { thickness: { top: 1 }, fill: COLORS.border },
                padding: [8, 0, 0, 0],
                layout: 'horizontal',
                justifyContent: 'space_between',
                children: [
                  text('총 결제 금액', { fontSize: 14, fontWeight: '700' }),
                  text('55,000원', { fontSize: 18, fontWeight: '700' }),
                ],
              }),
            ],
          }),
        ],
      }),
      frame('Fixed CTA Wrapper', {
        x: 0,
        y: 756,
        width: FRAME_WIDTH,
        layout: 'none',
        children: [
          fixedCTA('예약하기', [
            { text: '총 금액', muted: true, size: 12 },
            { text: '55,000원', bold: true, size: 16 },
          ]),
        ],
      }),
    ],
  });
}

function toDataUrl(filePath) {
  const buf = readFileSync(filePath);
  const ext = filePath.endsWith('.svg') ? 'svg+xml' : 'png';
  return `data:image/${ext};base64,${buf.toString('base64')}`;
}

async function captureScreenshots() {
  mkdirSync(ASSETS_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: FRAME_WIDTH, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const shots = {};

  async function shot(name, setup) {
    await setup(page);
    await page.waitForTimeout(500);
    const path = join(ASSETS_DIR, `${name}.png`);
    await page.screenshot({ path, fullPage: false });
    shots[name] = toDataUrl(path);
  }

  await shot('camp1-hero', async (p) => {
    await p.goto(`${BASE_URL}/campgrounds/camp-1`);
    await p.waitForLoadState('networkidle');
  });

  await shot('camp2-hero', async (p) => {
    await p.goto(`${BASE_URL}/`);
    await p.waitForLoadState('networkidle');
  });

  await shot('review-photo', async (p) => {
    await p.goto(`${BASE_URL}/campgrounds/camp-1/reviews/r1`);
    await p.waitForLoadState('networkidle');
  });

  await shot('site-photo', async (p) => {
    await p.goto(`${BASE_URL}/campgrounds/camp-1/sites`);
    await p.waitForLoadState('networkidle');
  });

  await shot('bottom-sheet', async (p) => {
    await p.goto(`${BASE_URL}/campgrounds/camp-1/sites`);
    await p.waitForLoadState('networkidle');
    await p.getByRole('button', { name: '자세히 보기' }).first().click();
    await p.waitForTimeout(800);
  });

  await shot('confirm-photo', async (p) => {
    await p.goto(`${BASE_URL}/campgrounds/camp-1/sites`);
    await p.waitForLoadState('networkidle');
    await p.locator('button', { hasText: '선택' }).first().click();
    await p.locator('button', { hasText: '예약 정보 확인' }).click();
    await p.waitForURL('**/confirm');
    await p.waitForLoadState('networkidle');
  });

  await browser.close();

  // Fallback to local SVG assets when screenshots overlap
  const svgHero1 = join(ROOT, 'thankyou-camping/public/assets/camp-1-hero.svg');
  const svgHero2 = join(ROOT, 'thankyou-camping/public/assets/camp-2-hero.svg');
  const svgSite1 = join(ROOT, 'thankyou-camping/public/assets/camp-1-photo-2.svg');

  return {
    camp1: shots['camp1-hero'] ?? toDataUrl(svgHero1),
    camp2: toDataUrl(svgHero2),
    review: shots['review-photo'] ?? toDataUrl(svgSite1),
    site: shots['site-photo'] ?? toDataUrl(svgSite1),
    bottomSheet: shots['bottom-sheet'] ?? toDataUrl(svgSite1),
    confirm: shots['confirm-photo'] ?? toDataUrl(svgSite1),
  };
}

async function main() {
  console.log('Capturing reference screenshots from', BASE_URL);
  let images;
  try {
    images = await captureScreenshots();
    console.log('Screenshots captured.');
  } catch (err) {
    console.warn('Screenshot capture failed, using local SVG assets:', err.message);
    const svgHero1 = join(ROOT, 'thankyou-camping/public/assets/camp-1-hero.svg');
    const svgHero2 = join(ROOT, 'thankyou-camping/public/assets/camp-2-hero.svg');
    const svgSite1 = join(ROOT, 'thankyou-camping/public/assets/camp-1-photo-2.svg');
    images = {
      camp1: toDataUrl(svgHero1),
      camp2: toDataUrl(svgHero2),
      review: toDataUrl(svgSite1),
      site: toDataUrl(svgSite1),
      bottomSheet: toDataUrl(svgSite1),
      confirm: toDataUrl(svgSite1),
    };
  }

  const screens = [
    buildSearchListScreen({ camp1: images.camp1, camp2: images.camp2 }, 0, 0),
    buildCampDetailScreen(images.camp1, FRAME_WIDTH + FRAME_GAP, 0),
    buildAllReviewsScreen((FRAME_WIDTH + FRAME_GAP) * 2, 0),
    buildReviewDetailScreen(images.review, (FRAME_WIDTH + FRAME_GAP) * 3, 0),
    buildSiteSelectionScreen(images.site, 0, 844 + ROW_GAP),
    buildSiteDetailBottomSheet(images.bottomSheet, FRAME_WIDTH + FRAME_GAP, 844 + ROW_GAP),
    buildBookingConfirmScreen(images.confirm, (FRAME_WIDTH + FRAME_GAP) * 2, 844 + ROW_GAP),
  ];

  const pen = {
    version: '2.13',
    name: '땡큐캠핑 TO-BE 모바일 프로토타입',
    children: [
      frame('땡큐캠핑 TO-BE · 390px Mobile Prototype', {
        x: 0,
        y: 0,
        width: (FRAME_WIDTH + FRAME_GAP) * 4 - FRAME_GAP,
        height: (844 + ROW_GAP) * 2 - ROW_GAP,
        fill: '#F2F3F0',
        layout: 'none',
        clip: false,
        children: screens,
      }),
    ],
    variables: {
      '--primary': { type: 'color', value: [{ value: COLORS.primary }] },
      '--ink': { type: 'color', value: [{ value: COLORS.ink }] },
      '--border': { type: 'color', value: [{ value: COLORS.border }] },
    },
  };

  writeFileSync(OUTPUT_PEN, JSON.stringify(pen, null, 2), 'utf8');
  console.log('Wrote', OUTPUT_PEN);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
