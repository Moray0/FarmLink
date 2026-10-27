
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/protectedRoute';
import Header from './components/header';
import LandingPage from './pages/landingPage';
import MarketplacePage from './pages/marketplacePage';
import FarmerPage from './pages/farmerPage';
import BuyerLoginPage from './pages/buyerLoginPage';
import FarmerLoginPage from './pages/farmerLoginPage';
import BuyerSignupPage from './pages/buyerSignupPage';
import FarmerSignupPage from './pages/farmerSignupPage';
import AdminDashboardPage from './pages/admindashboardPage';
import BuyerDashboardPage from './pages/buyerdashboardPage';
import FarmerDashboardPage from './pages/farmerdashboardPage';

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold text-green-700">404</h1>
      <p className="mt-3 text-gray-600">We couldn't find that page.</p>
      <Link
        to="/"
        className="mt-6 px-5 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800"
      >
        Back to home
      </Link>
    </div>
  );
}

function AppRoutes() {
  const { pathname, state } = useLocation();

  const isDashboard = [
    '/admindashboard',
    '/buyerdashboard',
    '/farmerdashboard',
  ].includes(pathname);

  const isBuyerDashboardPage =
    ['/marketplace', '/farmers'].includes(pathname) &&
    state?.fromBuyerDashboard === true;

  return (
    <>
      {!isDashboard && !isBuyerDashboardPage && <Header />}

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/farmers" element={<FarmerPage />} />
        <Route path="/login" element={<BuyerLoginPage />} />
        <Route path="/buyer-login" element={<BuyerLoginPage />} />
        <Route path="/farmer-login" element={<FarmerLoginPage />} />
        <Route path="/signup" element={<BuyerSignupPage />} />
        <Route path="/buyer-signup" element={<BuyerSignupPage />} />
        <Route path="/farmer-signup" element={<FarmerSignupPage />} />

        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute
              loginPath="/login"
              allowedRole="admin"
            >
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyerdashboard"
          element={
            <ProtectedRoute
              loginPath="/buyer-login"
              allowedRole="buyer"
            >
              <BuyerDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmerdashboard"
          element={
            <ProtectedRoute
              loginPath="/farmer-login"
              allowedRole="farmer"
            >
              <FarmerDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
