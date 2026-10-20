// The LandingPage component serves as the homepage for FarmLink
// It introduces users to the platform and showcases categories, fresh produce, and testimonials
export default function LandingPage() {

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
    <div className="space-y-20 pb-16">

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative min-h-[200px] flex items-center justify-center overflow-hidden">
        {/* Background Image of fresh crops and vegetables */}
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
          alt="Fresh agricultural farm crops and vegetables"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft Dark/Green Overlay for clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-900/75 to-black/60"></div>

        {/* Hero Content Container */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-200 text-sm font-semibold mb-6 backdrop-blur-xs">
            <span>🌿</span>
            <span>Direct Agricultural Marketplace</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-6">
            Connecting <span className="text-green-400">Farmers</span> Directly With <span className="text-green-300">Buyers</span>
          </h1>

          {/* Subtitle / Explanation of FarmLink */}
          <p className="text-base sm:text-xl text-green-100 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Skip the middlemen. Buy fresh, organic produce straight from local growers
            at fair prices, or sell your harvests directly to thousands of ready buyers.
          </p>

          {/* Call-To-Action (CTA) Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#listings"
              className="w-full sm:w-auto px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center"
            >
              Browse Fresh Produce
            </a>
            <a
              href="#signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/40 font-semibold rounded-xl backdrop-blur-xs transition-all text-center"
            >
              Join as a Farmer
            </a>
          </div>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mt-14 pt-8 border-t border-white/20 text-center">
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
      </section>


      {/* ========================================================= */}
      {/* 2. BROWSE BY CATEGORY SECTION                             */}
      {/* ========================================================= */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title and Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-full">
            Explore Produce
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 mb-2">
            Browse by Category
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Find exactly what you need from our wide variety of freshly harvested crops.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#listings"
              className="group bg-white border border-green-100 hover:border-green-300 rounded-2xl p-5 text-center shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between hover:-translate-y-1"
            >
              {/* Category Emoji Badge */}
              <div className="w-14 h-14 rounded-2xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-3xl mb-3 transition-colors">
                {cat.emoji}
              </div>

              {/* Category Title */}
              <h3 className="font-semibold text-gray-800 group-hover:text-green-700 text-sm sm:text-base mb-1 transition-colors">
                {cat.name}
              </h3>

              {/* Available count */}
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
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with "View All" link to Marketplace */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Straight From The Farm
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 mb-1">
              Fresh Listings
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Recently harvested produce available directly from local farms.
            </p>
          </div>

          {/* View All Link to Marketplace */}
          <a
            href="#marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 group"
          >
            <span>View All Produce</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {freshListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col group"
            >
              {/* Product Image and Tag */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                  {item.tag}
                </span>
                <span className="absolute top-3 right-3 bg-green-700 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-xs">
                  {item.category}
                </span>
              </div>

              {/* Product Content Details */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">

                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {item.name}
                  </h3>

                  {/* Farmer Name and Location */}
                  <div className="mt-2 flex items-center text-xs text-gray-500 gap-3">
                    <span className="flex items-center gap-1">
                      <span>👨‍🌾</span>
                      <span>{item.farmer}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-green-700">{item.price}</span>
                    <span className="text-xs text-gray-500 ml-1">/ {item.unit}</span>
                  </div>

                  <a
                    href="#order"
                    className="px-3.5 py-2 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-600 hover:text-white rounded-lg transition-colors"
                  >
                    View Details
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>


      {/* ========================================================= */}
      {/* 4. TESTIMONIALS SECTION                                   */}
      {/* ========================================================= */}
      <section className="bg-green-50/70 border-y border-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-green-700 bg-green-200/60 px-3 py-1 rounded-full">
              Real Experiences
            </span>
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
  );
}
