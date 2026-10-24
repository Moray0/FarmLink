import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
