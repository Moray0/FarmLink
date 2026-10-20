// The Footer component displays the bottom area of the website with links and info
export default function Footer() {
  // Current year for the copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-green-800">
          
          {/* Column 1: FarmLink Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-2xl font-bold tracking-tight text-white">
                Farm<span className="text-green-300">Link</span>
              </span>
            </div>
            <p className="text-sm text-green-100 leading-relaxed">
              Connecting local farmers directly with consumers and businesses. 
              Empowering agriculture with fair prices, reduced food waste, and guaranteed fresh harvests.
            </p>
            <div className="pt-2 flex items-center gap-3 text-lg">
              <span className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center cursor-pointer hover:bg-green-700">🌍</span>
              <span className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center cursor-pointer hover:bg-green-700">💬</span>
              <span className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center cursor-pointer hover:bg-green-700">📧</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-green-200 mb-4 tracking-wide uppercase text-xs">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-green-100">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-white transition-colors">Marketplace</a>
              </li>
              <li>
                <a href="#farmers" className="hover:text-white transition-colors">Farmers Network</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">Browse Categories</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Agricultural Categories */}
          <div>
            <h4 className="text-base font-semibold text-green-200 mb-4 tracking-wide uppercase text-xs">
              Popular Produce
            </h4>
            <ul className="space-y-2.5 text-sm text-green-100">
              <li>
                <a href="#categories" className="hover:text-white transition-colors">🥬 Fresh Vegetables</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">🍎 Organic Fruits</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">🌾 Grains & Cereals</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">🥔 Tubers & Roots</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Join FarmLink */}
          <div>
            <h4 className="text-base font-semibold text-green-200 mb-4 tracking-wide uppercase text-xs">
              Get Started
            </h4>
            <p className="text-sm text-green-100 mb-4">
              Are you a farmer looking to expand your buyer base? Join our verified network today.
            </p>
            <a
              href="#signup"
              className="inline-block px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Register as Farmer
            </a>
          </div>

        </div>

        {/* Footer Bottom: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-green-300 gap-4">
          <p>© {currentYear} FarmLink. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#support" className="hover:text-white transition-colors">Support & FAQs</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
