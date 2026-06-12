import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { SearchProvider } from './context/SearchContext';
import { AllReviewsPage } from './pages/AllReviewsPage';
import { BookingConfirmPage } from './pages/BookingConfirmPage';
import { CampgroundDetailPage } from './pages/CampgroundDetailPage';
import { CampgroundListPage } from './pages/CampgroundListPage';
import { HomePage } from './pages/HomePage';
import { ReviewDetailPage } from './pages/ReviewDetailPage';
import { SearchInputPage } from './pages/SearchInputPage';
import { SiteSelectionPage } from './pages/SiteSelectionPage';
import { ImageReviewPage } from './pages/ImageReviewPage';

export default function App() {
  return (
    <BookingProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search-input" element={<SearchInputPage />} />
            <Route path="/search" element={<CampgroundListPage />} />
            <Route
              path="/campgrounds/:id/reviews/:reviewId"
              element={<ReviewDetailPage />}
            />
            <Route path="/campgrounds/:id/reviews" element={<AllReviewsPage />} />
            <Route
              path="/campgrounds/:id/sites"
              element={<SiteSelectionPage />}
            />
            <Route
              path="/campgrounds/:id/confirm"
              element={<BookingConfirmPage />}
            />
            <Route path="/campgrounds/:id" element={<CampgroundDetailPage />} />
            <Route path="/image-review" element={<ImageReviewPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </BookingProvider>
  );
}
