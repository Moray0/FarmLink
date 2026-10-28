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
      price: '₦22,000',
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
      price: '₦18,000',
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
      price: '₦15,000',
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
      price: '₦14,000',
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
      price: '₦16,000',
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
      price: '₦20,000',
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


          <motion.img
            src="herobg.png"
            alt="Fresh agricultural farm crops and vegetables"
            animate={{ scale: [1, 1.035, 1] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 h-full w-full object-cover object-[75%_center] sm:object-center"
          />


          {/* Soft Dark/Green Overlay for clear text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-green-950 via-green-950/85 to-black/20"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-green-400/15 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 1.2, ease: 'easeOut' }}
            className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute right-[12%] top-1/4 hidden text-5xl opacity-70 drop-shadow-lg sm:block"
            aria-hidden="true"
          >
            🌿
          </motion.div>

          {/* Hero Content Container - Aligned with the rest of the page */}
          <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-24 text-white">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-3xl"
            >

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
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/marketplace"
                  className="block px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center"
                >
                  Browse Fresh Produce
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/farmer-signup"
                  className="block px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/40 font-semibold rounded-xl backdrop-blur-xs transition-all text-center"
                >
                  Join as a Farmer
                </Link>
              </motion.div>
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
            </motion.div>
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
              <motion.a
                key={cat.id}
                href="#listings"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group min-w-0 rounded-2xl border border-green-100 bg-white p-3 text-center shadow-sm transition-colors duration-200 hover:border-green-300 hover:shadow-lg sm:p-5"
              >
                {/* Category Emoji Badge */}
                <motion.div
                  whileHover={{ y: -4, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-3xl transition-colors group-hover:bg-green-100 sm:h-14 sm:w-14"
                >
                  {cat.emoji}
                </motion.div>

                {/* Category Title */}
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 text-sm sm:text-base mb-1 transition-colors">
                  {cat.name}
                </h3>

                {/* Available Count */}
                <span className="text-xs text-green-600 font-medium">
                  {cat.count}
                </span>
              </motion.a>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {freshListings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -6 }}
                className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  />
                </div>

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
              </motion.div>
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
                <motion.div
                  key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: test.id * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="flex flex-col justify-between rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg sm:p-7"
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
                </motion.div>
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
