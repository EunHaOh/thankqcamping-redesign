# Analytics 점검 체크리스트

## 1. GTM 적용 확인 방법

### 소스 코드 / 배포 HTML

1. Vercel 배포 사이트에서 **Ctrl+U** (페이지 소스 보기)
2. `GTM-KR93LNS7` 검색
3. `<head>` 안 GTM script + `<body>` 직후 noscript iframe **2곳** 모두 동일 ID인지 확인
4. `GTM-여기에_GTM_ID_입력` 같은 placeholder가 없는지 확인

### Tag Assistant Preview

1. [Google Tag Assistant](https://tagassistant.google.com/) 접속
2. 배포 URL 연결 후 Preview 시작
3. 홈 → 검색 → 상세 → 사이트 선택 → 예약 확인 흐름 이동
4. `tq_` 로 시작하는 Custom Event 발생 여부 확인
5. `/analytics-check`에서 **테스트 이벤트 보내기** → `tq_test_analytics_event` 확인

### tq_ 이벤트 확인 (브라우저 Console)

```js
dataLayer.filter((e) => e.event?.startsWith('tq_'))
```

개발 환경에서는 `[analytics]` 로그도 함께 출력됩니다.

---

## 2. GA4 적용 확인 방법

> **중요:** 앱 코드에는 GTM만 설치합니다. GA4 gtag script를 index.html에 중복 추가하지 마세요.

### GA4 실시간 보고서

1. GA4 속성 `G-C7J6MV88Y7` → **보고서 → 실시간**
2. 배포 사이트에서 홈·검색·상세 이동
3. `tq_view_home`, `tq_view_search_results`, `tq_view_camp_detail` 등 이벤트 확인

### DebugView

1. GTM Preview 또는 GA4 DebugView 활성화
2. `tq_` 이벤트와 파라미터(`page_name`, `test_version` 등) 확인

### 이벤트가 바로 안 보일 때

- 실시간: 수초~1분 내 반영
- 표준 보고서: 24~48시간 지연 가능
- GTM 게시(Publish) 후 배포 URL에서 재확인

---

## 3. GTM 설정값 (컨테이너에서 설정)

| 항목 | 값 |
|------|-----|
| Google tag 태그 ID | `G-C7J6MV88Y7` |
| Custom Event Trigger | `^tq_.*` (정규식) |
| GA4 Event name | `{{Event}}` |
| GA4 Event parameters | Data Layer Variable 매핑 |

### 주요 Data Layer Variable 예시

- `page_name`
- `page_path`
- `test_version`
- `campground_id`
- `campground_name`
- `search_term`
- `filter_name` / `filter_value`
- `selected_filters`
- `selected_date` / `selected_region` / `selected_guest`
- `section_name`
- `review_id`
- `site_id` / `site_name`
- `view_mode`
- `destination_page`
- `result_count` / `card_index`

---

## 4. Microsoft Clarity 적용 확인 방법

### Clarity 프로젝트 ID

- 코드 상수: `CLARITY_PROJECT_ID_HERE` (placeholder)
- 실제 ID는 Clarity 대시보드 → Settings → Overview에서 확인
- **앱에 직접 스크립트를 넣지 않고 GTM Custom HTML로 설치 권장**

### GTM Custom HTML 예시

```html
<script type="text/javascript">
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'YOUR_CLARITY_PROJECT_ID');
</script>
```

`YOUR_CLARITY_PROJECT_ID`를 실제 ID로 교체 후 GTM에서 All Pages 트리거로 게시합니다.

### Clarity 세션 녹화 확인

1. Clarity 대시보드 → Recordings
2. 배포 URL 세션 재생
3. 홈·검색·상세 흐름 녹화 여부 확인

### clarity event 확인

- `trackEvent()` 호출 시 Clarity가 로드되어 있으면 `clarity('event', ...)` / `clarity('set', ...)` 전달
- `/analytics-check`에서 `window.clarity: true` 확인
- Clarity 미설치 시에도 앱 오류 없음 (try/catch 처리)

---

## 5. 주요 검증 이벤트

### 리스트에서 후보 좁히기

- `tq_click_filter_chip`
- `tq_open_full_filter` / `tq_apply_filter`
- `tq_click_sort`
- `tq_click_camp_card`

### 상세에서 정보 확인

- `tq_view_camp_detail`
- `tq_view_detail_section`
- `tq_swipe_site_photo` / `tq_click_site_photo`
- `tq_click_review_more` / `tq_click_review_detail`
- `tq_click_map_preview`

### 예약 확인 도달

- `tq_click_site_reserve_cta`
- `tq_view_site_select` / `tq_click_site_select`
- `tq_click_reservation_info`
- `tq_view_reservation_confirm`
- `tq_click_final_reserve`

### 리스트 복귀 검증

- `tq_click_detail_back_to_list`
- `tq_click_another_camp_after_return`

### PWA (기존 유지)

- `tq_view_pwa_install_banner`
- `tq_click_pwa_install` / `tq_accept_pwa_install` / `tq_dismiss_pwa_install`
- `tq_app_installed`

---

## 6. 검증용 페이지

| 경로 | 용도 |
|------|------|
| `/analytics-check` | dataLayer·GTM·GA4·Clarity 상태, 테스트 이벤트 |
| `/pwa-check` | PWA 설치·SW 상태 |
| `/performance-check` | 홈 스크롤 성능 |

홈 화면·바텀탭에는 노출되지 않습니다. URL로 직접 접근하세요.
