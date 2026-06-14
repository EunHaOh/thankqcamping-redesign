# AGENTS.md

## Project Overview

이 저장소는 **땡큐캠핑 모바일 웹/PWA 리디자인 프로토타입**입니다.

프로젝트는 **Vite + React + TypeScript 기반**이며, 실제 앱 코드는 아래 폴더에 있습니다.

```text
thankyou-camping/
```

주요 작업 파일은 다음과 같습니다.

```text
thankyou-camping/src/pages
thankyou-camping/src/components
thankyou-camping/src/data
thankyou-camping/src/lib
thankyou-camping/src/hooks
thankyou-camping/src/index.css
thankyou-camping/vite.config.ts
thankyou-camping/vercel.json
```

이 프로젝트는 GitHub와 Vercel에 연결되어 있으며, 기본 배포 브랜치는 `main`입니다.

현재 프로젝트에는 다음 기능이 포함되어 있습니다.

* 홈 화면
* 검색 화면
* 검색결과 리스트
* 캠핑장 상세
* 전체 후기 / 후기 상세
* 사이트 선택 / 사이트 상세
* 예약 확인
* PWA 설치 및 서비스 워커
* GA4 / GTM / Microsoft Clarity 이벤트 계측
* Android 화면 너비 및 스크롤 성능 대응

---

## Core Rules

작업할 때는 항상 아래 규칙을 우선합니다.

1. 사용자가 요청한 범위만 수정합니다.
2. 기존 화면 구조와 사용자 흐름을 임의로 다시 설계하지 않습니다.
3. 기존 기능을 깨뜨릴 수 있는 리팩터링은 하지 않습니다.
4. 실제 코드에 없는 내용을 구현했다고 보고하지 않습니다.
5. 검증하지 않은 항목을 완료했다고 말하지 않습니다.
6. 수정 전후로 Git 상태와 변경 파일을 반드시 확인합니다.
7. 빌드 결과물이나 캐시 파일을 커밋하지 않습니다.
8. 사용자의 승인 없이 GitHub Issue를 닫거나 PR을 병합하지 않습니다.
9. 사용자가 “로컬만 수정” 또는 “커밋하지 마”라고 말하면 커밋/푸시/배포하지 않습니다.

---

## Git Rules

작업 전 반드시 확인합니다.

```bash
git status --short
git branch --show-current
git log --oneline -5
```

수정 완료 후에도 반드시 확인합니다.

```bash
git status --short
git diff
```

커밋하면 안 되는 파일:

```text
thankyou-camping/dist
thankyou-camping/dist/index.html
thankyou-camping/tsconfig.tsbuildinfo
node_modules
.env
.env.local
```

빌드 후 위 파일이 변경되면 커밋 전에 되돌립니다.

```bash
git restore "thankyou-camping/dist/index.html" "thankyou-camping/tsconfig.tsbuildinfo"
```

기본 커밋 방식은 사용자의 지시에 따릅니다.
현재 사용자가 직접 `main`에 push하는 방식으로 작업 중이라면, 임의로 브랜치/PR 방식을 강제하지 않습니다.

단, 사용자가 GitHub Issue 기반 작업, PR 작업, 협업 작업을 요청하면 별도 브랜치를 만들고 PR 기준으로 진행합니다.

---

## Implementation Workflow

작업은 아래 순서로 진행합니다.

1. 현재 Git 상태 확인
2. 관련 파일 위치 확인
3. 요청 범위에 해당하는 파일만 수정
4. 실제 코드에 수정이 반영되었는지 검색 명령어로 확인
5. `npm.cmd run build` 실행
6. 빌드 결과물 커밋 제외
7. 로컬 앱에서 화면/기능 확인
8. 사용자 승인 후 커밋 및 push
9. Vercel 배포 상태 확인
10. 실제 배포 URL에서 최종 확인

앱 실행은 아래 명령어를 사용합니다.

```bash
cd thankyou-camping
npm.cmd install
npm.cmd run dev
```

빌드는 아래 명령어를 사용합니다.

```bash
cd thankyou-camping
npm.cmd run build
```

---

## Verification Rule

작업 완료 보고 전, 반드시 실제 코드 존재 여부를 확인합니다.

예시:

```powershell
Select-String -Path ".\thankyou-camping\src\components\CoverImage.tsx" -Pattern "IntersectionObserver|rootMargin|decoding|loading"
```

```powershell
Select-String -Path ".\thankyou-camping\src\index.css" -Pattern "content-visibility|contain-intrinsic-size|home-performance-section"
```

```powershell
Select-String -Path ".\thankyou-camping\src\hooks\usePwaInstallPrompt.ts" -Pattern "beforeinstallprompt|deferredPrompt|appinstalled|standalone|localStorage"
```

```powershell
Select-String -Path ".\thankyou-camping\src\components\PwaInstallBanner.tsx" -Pattern "앱 설치하기|홈 화면에 추가|Safari|Chrome|tq_view_pwa_install_banner|tq_click_pwa_install"
```

검색 결과가 없으면 구현된 것으로 보고하지 않습니다.

---

## UI/UX Preservation Rules

다음 흐름은 임의로 변경하지 않습니다.

* 홈 화면 검색
* 홈 배너
* 카테고리 아이콘
* 캠핑장 카드
* 검색결과 리스트
* 필터
* 캠핑장 상세
* 후기
* 사이트 선택
* 예약 확인
* 하단 탭바

기존 화면을 고치는 경우에도, 요청받은 문제와 직접 관련된 부분만 수정합니다.

예를 들어 홈 가로 카드 패딩 문제를 수정할 때는 다음을 지킵니다.

* 홈 전체 레이아웃을 다시 디자인하지 않음
* 카드 리스트의 좌우 여백만 조정
* 카드 크기와 섹션 구조를 과하게 변경하지 않음
* 가로 스크롤과 세로 스크롤 동작을 동시에 유지

---

## Android Responsive Rules

Android 및 폴더블 대응 시 아래 기준을 사용합니다.

검증 화면 폭:

```text
360px
390px
412px
430px
480px
520px
600px 이상
```

기본 기준:

* 작은 Android에서 좌우 빈 여백이 생기지 않아야 함
* 390px 고정폭으로만 갇히지 않아야 함
* 520px 이상에서는 최대 480px까지 확장 가능
* body 전체에 horizontal overflow가 생기면 안 됨
* 홈 카드 가로 스크롤은 유지되어야 함
* 카드 위에서 세로 스크롤도 가능해야 함

MobileShell 기준:

```text
width: 100%
max-width: 390px
foldable 이상: max-width: min(100dvw, 480px)
overflow-x: clip
min-width: 0
```

Tailwind 기준이 필요하면 다음 값을 사용합니다.

```js
maxWidth: {
  mobile: "390px",
  "mobile-wide": "480px",
},
screens: {
  foldable: "520px",
}
```

---

## Scroll Performance Rules

Android 홈 화면 스크롤 성능 작업 시 아래를 지킵니다.

필수 확인 항목:

* 카드/이미지 위에서 세로 스크롤 가능
* 가로 카드 리스트 좌우 스크롤 가능
* 단순 탭 시 상세 이동 가능
* 세로 스크롤 중 카드 클릭 오작동 없음
* touchmove에서 preventDefault 사용 금지
* touch-action: none 사용 금지
* touch-action: pan-x 단독 적용 금지

권장 기준:

```css
.home-horizontal-list {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  touch-action: pan-x pan-y;
}

.home-horizontal-card,
.home-horizontal-card img {
  touch-action: auto;
}
```

성능 최적화 항목은 실제 코드에 있어야 합니다.

* CoverImage IntersectionObserver
* loading="lazy"
* decoding="async"
* content-visibility: auto
* contain-intrinsic-size

---

## PWA Rules

PWA 관련 작업 시 아래 항목을 확인합니다.

확인 파일:

```text
thankyou-camping/vite.config.ts
thankyou-camping/index.html
thankyou-camping/src/main.tsx
thankyou-camping/src/hooks/usePwaInstallPrompt.ts
thankyou-camping/src/components/PwaInstallBanner.tsx
thankyou-camping/public/icons
thankyou-camping/vercel.json
```

필수 조건:

* manifest name 존재
* short_name 존재
* start_url: "/"
* scope: "/"
* display: "standalone"
* theme_color 존재
* 192x192 아이콘 존재
* 512x512 아이콘 존재
* maskable 아이콘 존재
* service worker 등록
* registerType: "autoUpdate"
* SPA fallback 유지

PWA 설치 안내는 아래 항목을 실제 코드로 구현해야 합니다.

* beforeinstallprompt 이벤트 감지
* deferredPrompt 저장
* appinstalled 이벤트 감지
* standalone 상태 감지
* Android Chrome fallback 안내
* iOS Safari 홈 화면 추가 안내
* Desktop Chrome 설치 안내
* localStorage 기반 닫기 상태 저장
* PWA 설치 관련 GA 이벤트 전송

필수 이벤트:

```text
tq_view_pwa_install_banner
tq_click_pwa_install
tq_accept_pwa_install
tq_dismiss_pwa_install
tq_app_installed
tq_click_pwa_install_guide
```

---

## Analytics Rules

이 프로젝트는 GTM을 통해 GA4 이벤트를 전송합니다.

현재 사용 중인 ID:

```text
GTM ID: GTM-KR93LNS7
GA4 Measurement ID: G-C7J6MV88Y7
```

앱 코드에 GA4 gtag를 중복 설치하지 않습니다.
앱에는 GTM 컨테이너만 직접 설치합니다.

이벤트 전송은 기존 `trackEvent()` 구조를 사용합니다.

```ts
window.dataLayer = window.dataLayer || [];

window.dataLayer.push({
  event: eventName,
  ...params,
});
```

기존 GA4/GTM/Clarity 이벤트는 삭제하지 않습니다.

주요 이벤트 prefix는 `tq_`를 사용합니다.

---

## Image Rules

이미지 작업 시 다음을 지킵니다.

* 깨진 이미지가 없어야 함
* fallback 이미지 유지
* `loading="lazy"` 적용
* `decoding="async"` 적용
* 첫 화면 hero 이미지는 필요 시 `loading="eager"`와 `fetchPriority="high"` 사용 가능
* 후기 이미지와 대표 이미지를 섞지 않음
* raw 이미지를 후기 영역에 직접 사용하지 않음
* 음식, 식당, 번지점프, 동물, 간판 등 캠핑 후기와 무관한 이미지는 후기 이미지로 사용하지 않음

후기 이미지는 아래 폴더 기준으로 관리합니다.

```text
thankyou-camping/public/images/campgrounds/reviews
```

---

## GitHub Issue Workflow

GitHub Issue 기반 작업 시 아래 순서를 따릅니다.

1. 관련 이슈 내용 확인
2. 이슈에서 요구한 확인 필요 항목 정리
3. 실제 코드에서 해당 항목 존재 여부 확인
4. 없는 항목은 실제 코드에 구현
5. 검색 명령어로 구현 여부 검증
6. 빌드 확인
7. 로컬 화면 확인
8. 사용자 승인 후 커밋/푸시
9. Vercel 배포 상태 확인
10. 이슈 댓글용 검증 결과 작성

이슈를 닫는 조건:

* 요구 항목이 실제 코드에 존재함
* 빌드 성공
* 로컬 또는 배포 환경에서 검증 완료
* 사용자가 이슈 닫기를 승인함

사용자의 승인 없이 이슈를 닫지 않습니다.

---

## Vercel Deployment Rules

GitHub push 후 Vercel에서 최신 배포를 확인합니다.

확인 항목:

```text
Deployments
Branch: main
Commit: 방금 push한 커밋 메시지
Status: Ready
```

주의:

* 기존 배포의 Redeploy 버튼은 예전 커밋을 다시 배포할 수 있습니다.
* 반드시 최신 커밋 기준 배포가 생성되었는지 확인합니다.
* 배포 실패 시 완료 처리하지 않습니다.
* Production URL에서 실제 화면이 반영되었는지 확인합니다.
* PWA 캐시 때문에 예전 화면이 보일 수 있으므로 필요 시 Service Worker와 site data를 삭제합니다.

---

## Completion Report

작업 완료 보고에는 아래 항목을 포함합니다.

```text
변경사항 요약:
관련 GitHub Issue:
수정한 파일:
추가한 파일:
삭제한 파일:
검증 명령어:
빌드 결과:
로컬 확인 결과:
Git 커밋:
GitHub push 여부:
Vercel 배포 상태:
실제 배포 URL:
남은 문제:
미검증 항목:
```

검증하지 않은 항목은 “미검증”이라고 명확히 표시합니다.

---

## Forbidden Behavior

아래 행동은 금지합니다.

* 실제 코드에 없는 내용을 구현했다고 보고
* 검색 결과가 없는데 구현 완료라고 보고
* 빌드 실패 상태에서 push
* 사용자가 요청하지 않은 대규모 리팩터링
* 기존 사용자 흐름 임의 변경
* GA4/GTM/Clarity 이벤트 삭제
* PWA 설정 삭제
* `dist`, `node_modules`, `tsconfig.tsbuildinfo` 커밋
* 사용자의 승인 없는 GitHub Issue close
* 사용자의 승인 없는 PR merge
* 사용자의 승인 없는 force push
