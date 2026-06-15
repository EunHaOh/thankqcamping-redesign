# PWA 검증 체크리스트

## 홈 화면 설치 가능 여부 확인 방법

1. HTTPS 배포 URL(또는 `localhost`)에서 앱을 엽니다.
2. Chrome DevTools → **Application → Manifest**에서 manifest가 로드되는지 확인합니다.
3. **Application → Service Workers**에서 SW가 `activated` 상태인지 확인합니다.
4. `/pwa-check`에서 `manifest 로드`, `serviceWorker 등록`, `beforeinstallprompt` 상태를 확인합니다.
5. 홈 화면 설치 안내 배너 또는 Chrome 설치 아이콘이 표시되는지 확인합니다.

## Android Chrome 설치 확인 방법

1. Android Chrome에서 HTTPS URL 접속
2. 홈 상단 **앱 설치하기** 배너 또는 Chrome 메뉴 **앱 설치** 확인
3. 설치 후 홈 화면 아이콘 **땡큐캠핑** 표시 확인
4. standalone 실행 시 주소창이 숨겨지는지 확인
5. `theme_color` `#FF5A1F`가 상태바/테마에 반영되는지 확인

## iOS Safari 홈 화면 추가 확인 방법

1. iPhone Safari에서 HTTPS URL 접속
2. 공유 버튼 → **홈 화면에 추가** 선택
3. 앱 이름 **땡큐캠핑**과 아이콘 표시 확인
4. 홈 화면에서 실행 시 standalone처럼 동작하는지 확인
5. `apple-mobile-web-app-title`, `apple-touch-icon` 연결 확인

## 데스크톱 Chrome 설치 확인 방법

1. Chrome 최신 버전에서 HTTPS URL 접속
2. 주소창 오른쪽 설치 아이콘 또는 메뉴 **앱 설치** 확인
3. 설치 후 앱 창에서 `display: standalone` 동작 확인

## 서비스 워커 동작 확인 방법

1. `npm run build && npm run preview`로 프로덕션 빌드 미리보기
2. DevTools → Application → Service Workers
3. `sw.js` 등록 및 `activated` 상태 확인
4. Console에서 `tq_service_worker_registered` dataLayer 이벤트 확인 (GTM Preview)
5. `/pwa-check`에서 `serviceWorker 등록: true` 확인

개발 환경(`npm run dev`)에서는 SW가 등록되지 않을 수 있습니다. 최종 확인은 빌드/배포 환경에서 진행하세요.

## Chrome DevTools Application 탭에서 확인할 항목

| 항목 | 기대값 |
|------|--------|
| Manifest name | 땡큐캠핑 |
| short_name | 땡큐캠핑 |
| start_url | / |
| scope | / |
| display | standalone |
| theme_color | #FF5A1F |
| background_color | #FFFFFF |
| icons | 192x192, 512x512, maskable 512x512 |
| Service Worker | activated |
| Cache Storage | precache + local-assets-cache |

## 오프라인 테스트 방법

1. 프로덕션 빌드 미리보기 또는 Vercel HTTPS URL에서 앱을 한 번 이상 방문합니다.
2. 홈, 검색결과, 상세 등 주요 화면을 미리 열어둡니다.
3. DevTools → Network → **Offline** 체크 또는 기기 비행기 모드 ON
4. 새로고침 또는 화면 이동 시:
   - 홈화면이 표시되어야 함
   - 방문한 화면은 mockData 기준으로 표시되어야 함
   - 상단 **오프라인 상태입니다** 배너 표시
5. 캐시되지 않은 이미지는 placeholder fallback으로 표시되어야 함
6. 전체 앱이 흰 화면으로 멈추지 않아야 함

## PWA 아이콘 확인 방법

- `public/icons/icon-192.png` — Android/일반 아이콘
- `public/icons/icon-512.png` — 설치 스플래시/고해상도
- `public/icons/maskable-icon-512.png` — maskable (safe zone)
- DevTools Manifest 탭에서 아이콘 미리보기 확인
- 설치 후 홈 화면에서 잘림/깨짐 없는지 확인

## 앱 이름 / short_name 확인 방법

- Manifest: `name`, `short_name` 모두 **땡큐캠핑**
- `index.html`: `<title>`, `apple-mobile-web-app-title` 확인
- `/pwa-check` 페이지에서 manifest 필드 확인

## Lighthouse PWA 검사 방법

1. Chrome DevTools → Lighthouse
2. Mode: Navigation, Device: Mobile
3. Categories: **Progressive Web App** 체크
4. Analyze page load 실행
5. installable, service worker, manifest 항목 통과 확인

## Vercel 배포 후 확인 순서

1. `npm run build` 성공 확인
2. Vercel HTTPS URL 배포
3. `vercel.json` SPA fallback으로 `/search`, `/campgrounds/:id` 새로고침 정상
4. Manifest / Service Worker / Cache 확인
5. `/pwa-check` 접속하여 상태 점검
6. Android Chrome, iOS Safari, Desktop Chrome 설치 테스트
7. 오프라인 모드 테스트

## 설치 안내가 안 뜰 때 확인할 항목

- 이미 standalone으로 설치·실행 중인지
- 배너 X 버튼으로 닫아 `localStorage`에 저장되었는지
- manifest / service worker / icons 누락 여부
- HTTP(비보안) 환경이 아닌지
- `beforeinstallprompt` 미지원 브라우저인지 (iOS Safari 등)
- `/pwa-check`에서 각 항목 상태 확인

## 이미 설치된 경우 설치 안내가 안 보이는 이유

- `display-mode: standalone` 또는 iOS `navigator.standalone === true`이면 정상적으로 숨김
- `appinstalled` 이벤트 후에도 숨김
- 의도된 동작입니다

## GTM / GA4 PWA 점검 이벤트

| 이벤트 | 설명 |
|--------|------|
| `tq_view_pwa_check` | PWA 점검 페이지 진입 |
| `tq_detect_offline` | 오프라인 상태 감지 |
| `tq_detect_online` | 온라인 복귀 감지 |
| `tq_service_worker_registered` | SW 등록 성공 |
| `tq_service_worker_register_failed` | SW 등록 실패 |

기존 설치 안내 이벤트(`tq_view_pwa_install_banner` 등)는 홈 화면에서 그대로 유지됩니다.
