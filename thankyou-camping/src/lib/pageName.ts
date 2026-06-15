export function getPageNameFromPath(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/search-input') return 'search_input';
  if (pathname === '/search') return 'search_results';
  if (pathname === '/pwa-check') return 'pwa_check';
  if (pathname === '/image-review') return 'image_review';
  if (/^\/campgrounds\/[^/]+\/confirm/.test(pathname)) return 'booking_confirm';
  if (/^\/campgrounds\/[^/]+\/sites/.test(pathname)) return 'site_select';
  if (/^\/campgrounds\/[^/]+\/reviews\/[^/]+/.test(pathname)) return 'review_detail';
  if (/^\/campgrounds\/[^/]+\/reviews/.test(pathname)) return 'reviews';
  if (/^\/campgrounds\/[^/]+/.test(pathname)) return 'camp_detail';
  return 'unknown';
}
