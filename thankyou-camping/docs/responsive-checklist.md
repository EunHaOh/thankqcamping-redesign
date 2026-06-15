# 반응형 화면 너비 점검 체크리스트

## Android Chrome에서 확인할 화면 폭

| 기준 | 너비 | 확인 포인트 |
|------|------|-------------|
| 작은 Android | 360px | 좌우 불필요 여백 없음, 카드·CTA full width |
| 일반 모바일 | 375px | 검색창·배너·바텀바 정렬 |
| 기준 디자인 | 390px | 기존 디자인 기준과 동일하게 표시 |
| Android 일반 | 412px | 390px 고정 제거 후 좌우 여백 없어야 함 |
| 큰 모바일 | 430px | 콘텐츠가 viewport 100% 사용 |
| 큰 Android | 480px | 가로 스크롤 섹션만 내부 스크롤 |
| 폴더블/대화면 | 600px+ | `app-container` max 600px 중앙 정렬 |
| 태블릿 | 768px+ | 단일 컬럼 유지, 배경 흰색 유지 |

## Chrome DevTools 기기 모드 확인 순서

1. Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Responsive 모드에서 360 / 390 / 412 / 430 / 480 / 600 / 768 순서로 확인
3. 각 폭에서 홈, 검색결과, 상세, 사이트 선택, 예약 확인 진입
4. Console에서 `[viewport]` 로그 확인 (개발 환경만)
5. `horizontal overflow: false` 인지 확인
6. 바텀시트(날짜/지역/인원/필터/사이트 상세) 열어 너비 확인
7. 하단 내비게이션·Fixed CTA가 화면 너비와 정렬되는지 확인

## 가로 스크롤 발생 여부 확인 방법

개발 환경 Console:

```
[viewport] horizontal overflow: false
```

수동 확인:

- 페이지 전체를 좌우로 스와이프했을 때 움직이지 않아야 함
- 필터 칩·홈 가로 카드·사이트 사진은 섹션 내부에서만 스크롤

## 실제 기기에서 확인해야 하는 항목

- Galaxy / Pixel 등 412px급 기기에서 좌우 여백 없음
- 폴더블 펼침(600px+)에서 콘텐츠·바텀바·CTA 정렬
- PWA standalone 모드에서 safe-area 하단 여백
- 키보드 열림 시 검색/바텀시트 레이아웃 깨짐 여부

## 수정 후 기대 결과

- `max-w-mobile (390px)` 고정 제거
- 모바일(320~480px)에서 `width: 100%`로 viewport를 꽉 채움
- 600px 이상에서만 `max-width: 600px` 중앙 정렬
- body / #root에 `overflow-x: hidden`
- bottom navigation, Fixed CTA, bottom sheet가 동일 `app-container` 기준 정렬
