// Main App Component for FarmLink
// Currently assembling the Landing Page with Header and Footer components
import Header from './components/header';
import LandingPage from './pages/landingPage';
import Footer from './components/footer';

export default function App() {
  return (
    // Main container with clean white background and min-height for full screen coverage
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Page Content - Currently displaying the Landing Page */}
      <main className="flex-grow">
        <LandingPage />
      </main>

      {/* Bottom Footer Area */}
      <Footer />

    </div>
  );
}
