# PWA 설치 안내 점검 체크리스트

## Android Chrome

1. HTTPS 배포 URL(또는 `localhost`)에서 홈 화면을 엽니다.
2. 홈 상단에 **“땡큐캠핑을 앱처럼 사용해보세요”** 배너가 보이는지 확인합니다.
3. **앱 설치하기** 클릭 시 Chrome 설치 프롬프트가 뜨는지 확인합니다.
4. `beforeinstallprompt`가 발생하지 않으면 배너 보조 문구로 Chrome 메뉴 안내가 표시됩니다.
5. 설치 완료 후 앱을 다시 열면 배너가 숨겨져야 합니다.

## iOS Safari

1. iPhone/iPad Safari에서 HTTPS URL로 접속합니다.
2. 홈 상단 설치 안내 배너가 보이는지 확인합니다.
3. **앱 설치하기** 클릭 시 안내 모달이 열리는지 확인합니다.
4. 모달 문구: **Safari 공유 버튼 → 홈 화면에 추가** 안내가 표시되어야 합니다.
5. 홈 화면에 추가한 뒤 standalone으로 실행하면 배너가 보이지 않아야 합니다.

## 데스크톱 Chrome

1. Chrome 최신 버전에서 HTTPS URL로 접속합니다.
2. 홈 상단 설치 안내 배너가 보이는지 확인합니다.
3. `beforeinstallprompt`가 있으면 **앱 설치하기**로 설치 프롬프트를 실행합니다.
4. 프롬프트가 없으면 주소창 설치 아이콘 또는 Chrome 메뉴 안내 문구가 표시됩니다.

## 설치 안내가 안 뜰 때 확인할 항목

- 이미 PWA로 설치되어 `display-mode: standalone`으로 실행 중인지
- 이전에 배너 **X** 버튼으로 닫아 `localStorage`에 저장되었는지
- `manifest.webmanifest`가 로드되는지 (DevTools → Application → Manifest)
- Service Worker가 등록되었는지 (DevTools → Application → Service Workers)
- 192x192 / 512x512 / maskable 512 아이콘이 존재하는지
- `start_url`, `scope`가 `/`인지
- HTTP(비보안) 환경이 아닌지 (로컬 `localhost` 또는 HTTPS 필요)
- iOS Safari / Android Chrome / Desktop Chrome 외 브라우저인지

## 이미 설치된 상태에서 안내가 안 보이는 이유

- `display-mode: standalone` 또는 iOS `navigator.standalone === true`이면 설치 완료로 판단합니다.
- `appinstalled` 이벤트 발생 후에도 안내를 숨깁니다.
- 정상 동작입니다.

## HTTPS 배포 URL에서 테스트해야 하는 이유

- Chrome의 PWA 설치 조건은 보안 컨텍스트(HTTPS 또는 localhost)를 요구합니다.
- Service Worker와 `beforeinstallprompt`는 배포 환경에서 최종 확인해야 합니다.

## Vercel 배포 후 확인 순서

1. `npm run build`로 빌드가 성공하는지 확인합니다.
2. Vercel에 배포 후 HTTPS URL을 엽니다.
3. `vercel.json` SPA fallback으로 새로고침 시 라우팅이 유지되는지 확인합니다.
4. DevTools → Application에서 Manifest / Service Worker를 확인합니다.
5. Android Chrome, iOS Safari, Desktop Chrome 각각에서 홈 설치 안내 배너를 확인합니다.
6. 설치 수락/거절/닫기/설치 완료 시 GTM dataLayer 이벤트를 확인합니다.

## GTM / GA4 이벤트

| 이벤트 | 설명 |
|--------|------|
| `tq_view_pwa_install_banner` | 설치 안내 배너 노출 |
| `tq_click_pwa_install` | 앱 설치하기 클릭 |
| `tq_accept_pwa_install` | 설치 프롬프트 수락 |
| `tq_dismiss_pwa_install` | 설치 프롬프트 거절 |
| `tq_app_installed` | 앱 설치 완료 |
