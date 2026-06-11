import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AllReviewsPage } from './pages/AllReviewsPage';
import { BookingConfirmPage } from './pages/BookingConfirmPage';
import { CampgroundDetailPage } from './pages/CampgroundDetailPage';
import { CampgroundListPage } from './pages/CampgroundListPage';
import { ReviewDetailPage } from './pages/ReviewDetailPage';
import { SiteSelectionPage } from './pages/SiteSelectionPage';

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CampgroundListPage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}
