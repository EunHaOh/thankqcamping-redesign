# Android 홈 화면 스크롤 성능 점검 체크리스트

## Android Chrome에서 스크롤 성능 확인 방법

1. 실제 Android 기기 또는 Chrome DevTools 기기 모드에서 홈(`/`) 접속
2. 360 / 390 / 412 / 430 / 480 / 600px 폭에서 세로 스크롤
3. 스크롤 중 끊김·버벅임·깜빡임 여부 확인
4. 개발 환경 Console에서 `[home-perf]` 로그 확인
5. `/performance-check`에서 이미지·lazy 적용·overflow 상태 확인

## Chrome DevTools Performance 탭 확인 방법

1. DevTools → Performance → Record
2. 홈 화면에서 위→아래 스크롤 3~5초
3. Stop 후 Main thread long task, Layout, Paint 비중 확인
4. 이미지 디코딩(Decode Image) 구간이 스크롤과 겹치는지 확인
5. 수정 전후 Recording 비교

## 실제 기기에서 확인할 항목

- 중저가 Android(360px급)에서 세로 스크롤 부드러움
- 가로 스크롤 섹션 스와이프 시 세로 스크롤이 끊기지 않는지
- 바텀 내비게이션 깜빡임 없음
- 이미지 로딩 중 레이아웃 점프 최소화
- 오프라인/느린 3G에서도 흰 화면·전체 멈춤 없음

## 이미지 lazy loading 확인 방법

1. DevTools → Elements → `main img` 검색
2. hero 배너: `loading="eager"`, `fetchpriority="high"`
3. 아래 섹션 카드: `loading="lazy"`
4. `/performance-check`의 lazy image count 확인
5. Network 탭에서 스크롤 전까지 하단 이미지 요청이 지연되는지 확인

## horizontal overflow 확인 방법

- Console: `[home-perf] horizontal overflow: false`
- 페이지 전체 좌우 스와이프 시 움직이지 않아야 함
- `/performance-check`의 `body scrollWidth` vs viewport width 비교

## 가로 스크롤 섹션 확인 방법

- 맞춤/예약/인기 캠핑장, 카테고리, 신생 지역 칩
- 섹션 내부에서만 가로 스크롤 (`touch-action: pan-x`)
- 바깥 wrapper `overflow-x-hidden`
- `-webkit-overflow-scrolling: touch` 적용

## 스크롤 렉이 남을 때 추가 확인할 항목

- Network Slow 3G에서 이미지가 한꺼번에 로드되는지
- `box-shadow` / `gradient` overlay가 과한지
- sticky header + fixed bottom nav repaint
- React DevTools Profiler로 홈 리렌더 횟수
- 큰 원본 JPG가 CSS로만 축소되는지 (현재 lazy img + 고정 높이 적용)
- production에서 불필요한 `console.log` 출력 여부

## 수정 후 기대 결과

- `CoverImage`가 native lazy loading 사용
- hero만 eager + high priority
- 홈 카드 `React.memo` 적용
- 홈 카드 shadow 축소, 가로 스크롤 `overscroll-behavior` 적용
- 개발 환경 `[home-perf]` 로그로 점검 가능
