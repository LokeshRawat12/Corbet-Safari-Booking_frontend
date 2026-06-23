import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Home/HomePage";
import BookingPage from "./pages/Booking/BookingPage";
import PackagesPage from "./pages/Packages/PackagesPage";
import HotelPage from "./pages/Hotel/HotelPage";
import ContactPage from "./pages/Contact/ContactPage";
import SafariBookingPage from "./pages/SafariBooking/SafariBookingPage";
import TicketPage from "./pages/Ticket/TicketPage";
import ZonePage from "./pages/Zone/ZonePage";
import AdminPage from "./pages/Admin/AdminPage";

// Info & Policy Pages
import PrivacyPolicyPage from "./pages/Info/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/Info/TermsConditionsPage";
import CancellationPolicyPage from "./pages/Info/CancellationPolicyPage";
import BestTimeToVisitPage from "./pages/Info/BestTimeToVisitPage";
import HowToReachPage from "./pages/Info/HowToReachPage";
import TigerConservationPage from "./pages/Info/TigerConservationPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Admin — full-screen, no site chrome ── */}
      <Route path="/admin" element={<AdminPage />} />

      {/* ── Public site ── */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-surface text-text">
            <TopBar />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/hotel" element={<HotelPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/safari-booking" element={<SafariBookingPage />} />
              <Route path="/tickets" element={<TicketPage />} />

              {/* Legacy file-style routes for direct folder access */}
              <Route path="/Dhikala" element={<ZonePage slug="dhikala" />} />
              <Route path="/Bizrani" element={<ZonePage slug="bijrani" />} />
              <Route path="/Jhirnazone" element={<ZonePage slug="jhirna" />} />
              <Route path="/Dhelazone" element={<ZonePage slug="dhela" />} />
              <Route path="/Durgadevizone" element={<ZonePage slug="durgadevi" />} />
              <Route path="/GirjiaDevi" element={<ZonePage slug="garjia" />} />
              <Route path="/Sitabani" element={<ZonePage slug="sitabani" />} />
              <Route path="/Phatozone" element={<ZonePage slug="phato" />} />
              <Route path="/Sonamnadi" element={<ZonePage slug="sonanadi" />} />

              <Route path="/zone/:slug" element={<ZonePage />} />
              
              {/* Footer Information Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-conditions" element={<TermsConditionsPage />} />
              <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
              <Route path="/best-time-to-visit" element={<BestTimeToVisitPage />} />
              <Route path="/how-to-reach" element={<HowToReachPage />} />
              <Route path="/tiger-conservation" element={<TigerConservationPage />} />

              <Route
                path="*"
                element={
                  <main className="p-8">
                    <h2 className="text-3xl font-bold">Page not found</h2>
                    <p className="mt-2 text-lg">The page you are looking for does not exist.</p>
                  </main>
                }
              />
            </Routes>
            <Footer />
          </div>
        }
      />
      </Routes>
    </>
  );
}
