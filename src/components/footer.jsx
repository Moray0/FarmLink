import { Link } from 'react-router-dom';
import { PiPottedPlant } from 'react-icons/pi';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white -mt-5 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-b border-green-800 pb-6">
        {/* Brand & Tagline */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold"><PiPottedPlant className="w-10 h-10 inline-block" /> FarmLink</h3>
          <p className="text-green-200 text-sm">
            Fresh produce directly from local farmers to your table.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-green-300">Home</Link>
          <Link to="/marketplace" className="hover:text-green-300">Marketplace</Link>
          <Link to="/farmers" className="hover:text-green-300">Farmers</Link>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-green-400 pt-6">
        © 2026 FarmLink. All rights reserved.
      </p>
    </footer>
  );
}
export default Footer
