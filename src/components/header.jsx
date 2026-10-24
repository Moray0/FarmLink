import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PiPottedPlant } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-green-100 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold text-green-800 my-auto"
        >
          <PiPottedPlant className="w-9 h-9 inline-block" />
          Farm<span className="text-green-600">Link</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center text-[18px] gap-6">
          <Link to="/" className="text-gray-700 hover:text-green-700 font-medium">
            Home
          </Link>

          <Link to="/marketplace" className="text-gray-700 hover:text-green-700 font-medium">
            Marketplace
          </Link>

          <Link to="/farmers" className="text-gray-700 hover:text-green-700 font-medium">
            Farmers
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-green-700 font-medium hover:bg-green-50 rounded-lg"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-green-800 hover:bg-green-50 rounded-lg"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <HiX className="w-7 h-7" />
          ) : (
            <HiMenu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-green-100 bg-white px-4 py-4">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Home
            </Link>

            <Link
              to="/marketplace"
              onClick={closeMenu}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Marketplace
            </Link>

            <Link
              to="/farmers"
              onClick={closeMenu}
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Farmers
            </Link>

            <hr className="border-green-100" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="text-green-700 font-medium hover:bg-green-50 rounded-lg"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              onClick={closeMenu}
              className="text-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-sm"
            >
              Sign up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;