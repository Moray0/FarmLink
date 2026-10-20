import { useState } from 'react';

// The Header component displays the top navigation bar of the FarmLink website
export default function Header() {
  // State to track if the mobile navigation menu is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle function for opening and closing the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo and Name */}
          <div className="flex items-center gap-2">
            <a href="#home" className="flex items-center gap-2 group">
              {/* Sprout Icon Badge */}
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl text-green-700 group-hover:bg-green-200 transition-colors">
                🌱
              </div>
              <span className="text-2xl font-bold text-green-800 tracking-tight">
                Farm<span className="text-green-600">Link</span>
              </span>
            </a>
          </div>

          {/* Middle: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#home" 
              className="text-base font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Home
            </a>
            <a 
              href="#marketplace" 
              className="text-base font-medium text-gray-600 hover:text-green-700 transition-colors"
            >
              Marketplace
            </a>
            <a 
              href="#farmers" 
              className="text-base font-medium text-gray-600 hover:text-green-700 transition-colors"
            >
              Farmers
            </a>
          </nav>

          {/* Right: Auth Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#login"
              className="px-4 py-2 text-sm font-semibold text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
            >
              Log in
            </a>
            <a
              href="#signup"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Sign up
            </a>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-green-700 hover:bg-green-50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                // Close 'X' icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-green-100 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#home"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-green-700 bg-green-50"
          >
            Home
          </a>
          <a
            href="#marketplace"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
          >
            Marketplace
          </a>
          <a
            href="#farmers"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
          >
            Farmers
          </a>

          {/* Mobile Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <a
              href="#login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-green-700 border border-green-600 rounded-lg hover:bg-green-50"
            >
              Log in
            </a>
            <a
              href="#signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm"
            >
              Sign up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
