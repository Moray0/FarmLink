import { Link } from 'react-router-dom';
import { motion, useScroll } from "motion/react";
import Footer from '../components/footer';

// The LandingPage component serves as the homepage for FarmLink
// It introduces users to the platform and showcases categories, fresh produce, and testimonials
const LandingPage = () => {
  const { scrollYProgress } = useScroll();

  // List of produce categories with relevant emojis and item counts
  const categories = [
    { id: 1, name: 'Fresh Vegetables', emoji: '🥬', count: '45+ items', desc: 'Tomatoes, peppers, leafy greens' },
    { id: 2, name: 'Juicy Fruits', emoji: '🍎', count: '30+ items', desc: 'Apples, oranges, bananas, mangos' },
    { id: 3, name: 'Grains & Cereals', emoji: '🌾', count: '25+ items', desc: 'Rice, maize, wheat, millet' },
    { id: 4, name: 'Tubers & Roots', emoji: '🥔', count: '18+ items', desc: 'Yam, cassava, sweet potatoes' },
    { id: 5, name: 'Legumes & Nuts', emoji: '🥜', count: '15+ items', desc: 'Beans, groundnuts, soybeans' },
    { id: 6, name: 'Herbs & Spices', emoji: '🌿', count: '20+ items', desc: 'Ginger, garlic, peppers, basil' },
  ];

  // List of sample fresh produce listings recently added by local farmers
  const freshListings = [
    {
      id: 1,
      name: 'Fresh Roma Tomatoes',
      category: 'Vegetables',
      price: '$22',
      unit: 'per crate',
      farmer: 'Adeola Green Farms',
      location: 'Ogun State',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      tag: 'Fresh Harvest',
    },
    {
      id: 2,
      name: 'Golden Sweet Maize',
      category: 'Grains',
      price: '$18',
      unit: 'per 50kg bag',
      farmer: 'Kano Grain Producers',
      location: 'Kano State',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
      tag: 'Bulk Available',
    },
    {
      id: 3,
      name: 'Crisp Bell Peppers',
      category: 'Vegetables',
      price: '$15',
      unit: 'per basket',
      farmer: 'Sunshine Agro Farms',
      location: 'Oyo State',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
      tag: 'Organic',
    },
    {
      id: 4,
      name: 'Organic Plantain Bunches',
      category: 'Fruits',
      price: '$14',
      unit: 'per large bunch',
      farmer: 'Delta Groves Agro',
      location: 'Delta State',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      tag: 'Fresh Harvest',
    },
    {
      id: 5,
      name: 'Red Spanish Onions',
      category: 'Vegetables',
      price: '$16',
      unit: 'per 25kg bag',
      farmer: 'Kebbi Green Fields',
      location: 'Kebbi State',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
      tag: 'Best Seller',
    },
    {
      id: 6,
      name: 'Farm Fresh Sweet Potatoes',
      category: 'Tubers',
      price: '$20',
      unit: 'per sack',
      farmer: 'Plateau Highland Harvest',
      location: 'Plateau State',
      image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80',
      tag: 'Organic',
    },
  ];

  // List of testimonials from verified farmers and buyers
  const testimonials = [
    {
      id: 1,
      name: 'Samuel Adeleke',
      role: 'Organic Maize & Pepper Farmer',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      quote:
        'FarmLink completely changed my farming business. I used to sell to middlemen at very low prices. Now, I connect directly with buyers and restaurants who pay fair prices promptly.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Grace Chukwu',
      role: 'Restaurant Owner & Fresh Food Buyer',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      quote:
        'Getting vegetables harvested just a day before delivery has elevated the quality of meals at our restaurant. The produce is always super fresh, and dealing directly with the farmers is simple.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Ibrahim Musa',
      role: 'Household Buyer',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      quote:
        'I love knowing exactly which farm my food comes from. Buying fresh produce for my family directly through FarmLink saves us money and guarantees healthy, pesticide-free food.',
      rating: 5,
    },
  ];

  return (
    <>
      <motion.div
        id="scroll-indicator"
        style={{
          scaleY: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 10,
          originY: 0,
          backgroundColor: "#16a34a",
          zIndex: 50,
        }}
      />
      <div className="space-y-20 pb-16">

        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="relative min-h-140 mb-0 flex items-center overflow-hidden">
          {/* Background Image of fresh crops and vegetables */}


          <img
            src="herobg.png"
            alt="Fresh agricultural farm crops and vegetables"
            className="absolute inset-0 w-full h-full object-cover object-[75%_center] sm:object-center"
          />


          {/* Soft Dark/Green Overlay for clear text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-green-950 via-green-950/85 to-black/20"></div>

          {/* Hero Content Container - Aligned with the rest of the page */}
          <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-24 text-white">
            <div className="max-w-3xl">

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Connecting <span className="text-green-400">Farmers</span> Directly With <span className="text-green-300">Buyers</span>
              </h1>

              {/* Subtitle / Explanation of FarmLink */}
              <p className="text-base sm:text-xl text-green-100 mb-8 leading-relaxed font-normal">
                Skip the middlemen. Buy fresh, organic produce straight from local growers
                at fair prices, or sell your harvests directly to thousands of ready buyers.
              </p>

              {/* Call-To-Action (CTA) Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="/marketplace"
                  className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center"
                >
                  Browse Fresh Produce
                </a>
                <a
                  href="/farmer-signup"
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/40 font-semibold rounded-xl backdrop-blur-xs transition-all text-center"
                >
                  Join as a Farmer
                </a>
              </div>

              {/* Quick Stats Highlights */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mt-12 pt-8 border-t border-white/20 text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">100%</p>
                  <p className="text-xs sm:text-sm text-green-200 mt-1">Direct From Farm</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
                  <p className="text-xs sm:text-sm text-green-200 mt-1">Verified Farmers</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">0%</p>
                  <p className="text-xs sm:text-sm text-green-200 mt-1">Middlemen Fees</p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* 2. BROWSE BY CATEGORY SECTION */}
        {/* ========================================================= */}
        <section id="categories" className="w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">

          {/* Section Title and Subtitle */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mt-3 mb-2">
              Browse by Category
            </h2>

            <p className="text-sm sm:text-base text-gray-600">
              Find exactly what you need from our wide variety of freshly harvested crops.
            </p>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href="#listings"
                className="group min-w-0 bg-white border border-green-100 hover:border-green-300 rounded-2xl p-3 sm:p-5 text-center shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between hover:-translate-y-1"
              >
                {/* Category Emoji Badge */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-3xl mb-3 transition-colors">
                  {cat.emoji}
                </div>

                {/* Category Title */}
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 text-sm sm:text-base mb-1 transition-colors">
                  {cat.name}
                </h3>

                {/* Available Count */}
                <span className="text-xs text-green-600 font-medium">
                  {cat.count}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. FRESH LISTINGS SECTION                                 */}
        {/* ========================================================= */}
        <section id="listings" className="w-full bg-green-100 py-12 mb-0 px-4 sm:px-6 lg:px-8">

          {/* Section Title and Subtitle */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">
              Fresh Listings
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Recently harvested produce available directly from local farms.
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {freshListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-sm mx-auto w-full"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />

                {/* Product Details */}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.farmer} • {item.location}
                  </p>

                  {/* Price and Action Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-green-700">
                      {item.price}
                      <span className="text-xs text-gray-500 font-normal"> / {item.unit}</span>
                    </span>

                    <Link
                      to="/marketplace"
                      className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Link to Marketplace */}
          <div className="text-center mt-10">
            <Link
              to="/marketplace"
              className="text-base font-semibold text-green-800 hover:text-green-600 hover:underline"
            >
              View More →
            </Link>
          </div>

        </section>


        {/* ========================================================= */}
        {/* 4. TESTIMONIALS SECTION                                   */}
        {/* ========================================================= */}
        <section className="bg-green-50/70 border-y my-0 border-green-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 mb-2">
                What Our Farmers & Buyers Say
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Discover how FarmLink is making agriculture profitable for farmers and convenient for buyers.
              </p>
            </div>

            {/* Testimonial Cards Grid (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-green-100 flex flex-col justify-between"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex text-amber-400 text-sm mb-4">
                      {'★'.repeat(test.rating)}
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                      "{test.quote}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <img
                      src={test.photo}
                      alt={test.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-green-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{test.name}</h4>
                      <p className="text-xs text-green-700 font-medium">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
export default LandingPage
