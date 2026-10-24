
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'motion/react';
import {
    PiMapPin,
    PiPlant,
    PiEnvelope,
    PiArrowLeft,
} from 'react-icons/pi';
import {
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import Footer from '../components/footer';

// Sample farmer profiles
const allFarmers = [
    {
        id: 'sample-1',
        name: 'Adeola Okafor',
        farmName: 'Adeola Green Farms',
        location: 'Ogun State',
        specialty: 'Vegetables',
        verified: true,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Adeola grows fresh vegetables in Ogun State, supplying tomatoes, peppers, and leafy greens.',
        products: ['Fresh Roma Tomatoes', 'Crisp Bell Peppers', 'Fresh Green Spinach', 'Hot Habanero Peppers'],
    },
    {
        id: 'sample-2',
        name: 'Fatima Bello',
        farmName: 'Kano Grain Producers',
        location: 'Kano State',
        specialty: 'Grains',
        verified: true,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        bio: 'Fatima specializes in maize, millet, and sorghum.',
        products: ['Golden Sweet Maize', 'Red Sorghum & Millet', 'Long Grain White Rice'],
    },
    {
        id: 'sample-3',
        name: 'Chukwuemeka Nwosu',
        farmName: 'Delta Groves Agro',
        location: 'Delta State',
        specialty: 'Fruits',
        verified: true,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Chukwuemeka grows tropical fruits, including plantains, bananas, and citrus fruits.',
        products: ['Organic Plantain Bunches', 'Ripe Cavendish Bananas', 'Juicy Valencia Oranges'],
    },
    {
        id: 'sample-4',
        name: 'Hauwa Ibrahim',
        farmName: 'Plateau Highland Harvest',
        location: 'Plateau State',
        specialty: 'Tubers',
        verified: false,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf028c311?auto=format&fit=crop&w=400&q=80',
        bio: 'Hauwa farms sweet potatoes, carrots, and other root crops.',
        products: ['Farm Fresh Sweet Potatoes', 'Crunchy Orange Carrots', 'Yellow Cassava Tubers'],
    },
    {
        id: 'sample-5',
        name: 'Tunde Adeyemi',
        farmName: 'Sunrise Poultry Farms',
        location: 'Ogun State',
        specialty: 'Poultry',
        verified: true,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        bio: 'Tunde operates a poultry farm producing eggs and chickens.',
        products: ['Farm Fresh Eggs', 'Whole Chicken', 'Turkey'],
    },
    {
        id: 'sample-6',
        name: 'Amina Yusuf',
        farmName: 'Sokoto Grain Fields',
        location: 'Sokoto State',
        specialty: 'Grains',
        verified: true,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        bio: 'Amina specializes in sorghum and millet.',
        products: ['Red Sorghum & Millet', 'Golden Sweet Maize'],
    },
    {
        id: 'sample-7',
        name: 'Emeka Eze',
        farmName: 'Abakaliki Rice Mills',
        location: 'Ebonyi State',
        specialty: 'Grains',
        verified: true,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        bio: 'Emeka grows long-grain rice in Ebonyi State.',
        products: ['Long Grain White Rice'],
    },
    {
        id: 'sample-8',
        name: 'Grace Okonkwo',
        farmName: 'Cross River Plantations',
        location: 'Cross River State',
        specialty: 'Fruits',
        verified: false,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
        bio: 'Grace grows bananas and other tropical fruits.',
        products: ['Ripe Cavendish Bananas', 'Whole Sweet Watermelon'],
    },
    {
        id: 'sample-9',
        name: 'Ibrahim Musa',
        farmName: 'Zaki Biam Yam Mart',
        location: 'Benue State',
        specialty: 'Tubers',
        verified: true,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        bio: 'Ibrahim grows premium white yams and other root crops.',
        products: ['Premium White Yam Tubers', 'Yellow Cassava Tubers'],
    },
    {
        id: 'sample-10',
        name: 'Blessing Adekunle',
        farmName: 'Lagos Urban Greens',
        location: 'Lagos State',
        specialty: 'Vegetables',
        verified: true,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        bio: 'Blessing grows leafy greens and herbs in Lagos.',
        products: ['Fresh Green Spinach', 'Fresh Lemongrass & Basil'],
    },
    {
        id: 'sample-11',
        name: 'Sule Abdullahi',
        farmName: 'Kaduna Agro Hub',
        location: 'Kaduna State',
        specialty: 'Livestock',
        verified: true,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
        bio: 'Sule raises cattle and goats.',
        products: ['Fresh Beef', 'Goat Meat', 'Fresh Milk'],
    },
    {
        id: 'sample-12',
        name: 'Ngozi Ibe',
        farmName: 'Green Herb Sanctuary',
        location: 'Enugu State',
        specialty: 'Vegetables',
        verified: false,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Ngozi grows culinary herbs and fresh vegetables.',
        products: ['Fresh Lemongrass & Basil', 'Fresh Ginger Roots', 'Aromatic Garlic Bulbs'],
    },
];

const farmingCategories = [
    'All Farmers',
    'Vegetables',
    'Grains',
    'Fruits',
    'Tubers',
    'Poultry',
    'Livestock',
];

const defaultFarmerImage =
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';

const FarmerPage = () => {
    const { scrollYProgress } = useScroll();

    const [selectedCategory, setSelectedCategory] = useState('All Farmers');
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [registeredFarmers, setRegisteredFarmers] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profilesError, setProfilesError] = useState('');
    const [productsError, setProductsError] = useState('');

    // Load public farmer profiles and available products separately.
    // A farmer can appear even when they have not added any products.
    useEffect(() => {
        const loadFarmers = async () => {
            setLoading(true);
            setProfilesError('');
            setProductsError('');

            try {
                const profilesSnapshot = await getDocs(
                    collection(db, 'farmerProfiles')
                );

                const profiles = profilesSnapshot.docs
                    .map((profileDoc) => ({
                        id: profileDoc.id,
                        ...profileDoc.data(),
                    }))
                    .filter((profile) => profile.role === 'farmer')
                    .map((profile) => ({
                        id: profile.uid || profile.id,
                        name: profile.displayName || 'FarmLink Farmer',
                        farmName: profile.farmName || 'My Farm',
                        location: profile.location || 'Location not provided',
                        specialty: profile.specialty || profile.category || 'Agricultural Produce',
                        verified: profile.verified === true,
                        image: profile.image || profile.photoURL || defaultFarmerImage,
                        bio: profile.bio || 'Welcome to this farmer’s profile. Check back for available products.',
                        products: [],
                    }));

                setRegisteredFarmers(profiles);
            } catch (error) {
                console.error('Error loading farmer profiles:', error);
                setProfilesError(
                    'Could not load registered farmer profiles. Check your Firestore rules and connection.'
                );
            }

            try {
                const productsQuery = query(
                    collection(db, 'products'),
                    where('status', '==', 'Available')
                );

                const productsSnapshot = await getDocs(productsQuery);

                const products = productsSnapshot.docs.map((productDoc) => ({
                    id: productDoc.id,
                    ...productDoc.data(),
                }));

                setAvailableProducts(products);
            } catch (error) {
                console.error('Error loading available products:', error);
                setProductsError(
                    'Could not load available products. Farmer profiles can still be displayed.'
                );
            }

            setLoading(false);
        };

        loadFarmers();
    }, []);

    // Match available products to farmers using farmerId.
    const farmersWithProducts = registeredFarmers.map((farmer) => {
        const farmerProducts = availableProducts.filter(
            (product) => product.farmerId === farmer.id
        );

        const productCategories = farmerProducts
            .map((product) => product.category)
            .filter(Boolean);

        return {
            ...farmer,
            specialty:
                farmer.specialty !== 'Agricultural Produce'
                    ? farmer.specialty
                    : productCategories[0] || 'Agricultural Produce',
            products: farmerProducts,
        };
    });

    // Keep the sample farmers and add real registered farmers.
    const farmers = [
        ...farmersWithProducts,
        ...allFarmers,
    ];

    const filteredFarmers = farmers.filter((farmer) => (
        selectedCategory === 'All Farmers' ||
        farmer.specialty === selectedCategory ||
        farmer.products.some(
            (product) =>
                typeof product !== 'string' &&
                product.category === selectedCategory
        )
    ));

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Individual farmer profile.
    if (selectedFarmer) {
        const farmerProducts = Array.isArray(selectedFarmer.products)
            ? selectedFarmer.products
            : [];

        return (
            <>
                <motion.div
                    style={{
                        scaleY: scrollYProgress,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: 5,
                        originY: 0,
                        backgroundColor: '#16a34a',
                        zIndex: 50,
                    }}
                />

                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
                        <button
                            onClick={() => {
                                setSelectedFarmer(null);
                                scrollToTop();
                            }}
                            className="flex items-center gap-2 text-green-700 font-medium mb-6"
                        >
                            <PiArrowLeft className="w-5 h-5" />
                            Back to All Farmers
                        </button>

                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-12">
                            <div className="flex flex-col sm:flex-row">
                                <img
                                    src={selectedFarmer.image || defaultFarmerImage}
                                    alt={selectedFarmer.name}
                                    className="w-full sm:w-64 h-64 object-cover"
                                />

                                <div className="p-6 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {selectedFarmer.name}
                                        </h1>

                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedFarmer.verified
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {selectedFarmer.verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>

                                    <p className="text-green-700 font-medium mt-1">
                                        {selectedFarmer.farmName}
                                    </p>

                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-3">
                                        <PiMapPin className="w-4 h-4" />
                                        {selectedFarmer.location}
                                    </p>

                                    <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        {selectedFarmer.specialty}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <h2 className="text-lg font-bold mb-2">About</h2>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {selectedFarmer.bio}
                                </p>
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <h2 className="text-lg font-bold mb-4">
                                    Available Products ({farmerProducts.length})
                                </h2>

                                {farmerProducts.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No available products yet.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {farmerProducts.map((product, index) => (
                                            <span
                                                key={product.id || `${product}-${index}`}
                                                className="px-3 py-2 bg-green-50 text-green-800 text-sm rounded-lg"
                                            >
                                                {typeof product === 'string'
                                                    ? product
                                                    : `${product.name || 'Unnamed Product'} — ₦${String(product.price ?? '').replace(/^₦/, '')}`}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <button
                                    onClick={() => alert('Buyer inquiries are not connected yet.')}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl"
                                >
                                    <PiEnvelope className="w-5 h-5" />
                                    Send Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    return (
        <>
            <motion.div
                style={{
                    scaleY: scrollYProgress,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 5,
                    originY: 0,
                    backgroundColor: '#16a34a',
                    zIndex: 50,
                }}
            />

            <div className="min-h-screen bg-gray-50">
                {/* Hero section */}
                <section className="bg-green-700 text-white py-16 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                            Meet the Farmers Behind Your Food
                        </h1>

                        <p className="text-green-100 text-sm sm:text-base max-w-2xl mx-auto">
                            Get to know local farmers and explore the products they currently have available.
                        </p>
                    </div>
                </section>

                {/* Farmer directory */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Explore Farmer Profiles
                    </h2>

                    <p className="text-sm text-gray-500 mb-8">
                        Each profile includes the farmer’s information and available products.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {farmingCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <p className="text-sm text-gray-500 mb-4">
                            Loading farmer profiles and products...
                        </p>
                    )}

                    {profilesError && (
                        <p role="alert" className="text-sm text-red-600 mb-4">
                            {profilesError}
                        </p>
                    )}

                    {productsError && (
                        <p role="alert" className="text-sm text-amber-700 mb-4">
                            {productsError}
                        </p>
                    )}

                    <p className="text-sm text-gray-500 mb-6">
                        Showing{' '}
                        <span className="font-semibold text-gray-800">
                            {filteredFarmers.length}
                        </span>{' '}
                        farmer{filteredFarmers.length !== 1 ? 's' : ''}
                    </p>

                    {filteredFarmers.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4">🧑‍🌾</div>
                            <h3 className="text-lg font-bold text-gray-800">
                                No farmers found
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Try selecting a different category.
                            </p>
                            <button
                                onClick={() => setSelectedCategory('All Farmers')}
                                className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg text-sm"
                            >
                                View all farmers
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFarmers.map((farmer) => {
                            const farmerProducts = Array.isArray(farmer.products)
                                ? farmer.products
                                : [];

                            return (
                                <div
                                    key={farmer.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                                >
                                    <div className="relative">
                                        <img
                                            src={farmer.image || defaultFarmerImage}
                                            alt={farmer.name}
                                            className="w-full h-48 object-cover"
                                        />

                                        <span
                                            className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${farmer.verified
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {farmer.verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>

                                    <div className="p-4 space-y-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {farmer.name}
                                        </h3>

                                        <p className="text-sm text-green-700 font-medium">
                                            {farmer.farmName}
                                        </p>

                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <PiMapPin className="w-4 h-4" />
                                            {farmer.location}
                                        </p>

                                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                            {farmer.specialty}
                                        </span>

                                        {/* Available products inside the farmer card */}
                                        <div className="pt-3 border-t border-gray-100">
                                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                                Available Products ({farmerProducts.length})
                                            </h4>

                                            {farmerProducts.length === 0 ? (
                                                <p className="text-xs text-gray-500">
                                                    No available products yet.
                                                </p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {farmerProducts.map((product, index) => (
                                                        <span
                                                            key={product.id || `${product}-${index}`}
                                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                        >
                                                            {typeof product === 'string'
                                                                ? product
                                                                : product.name || 'Unnamed Product'}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedFarmer(farmer);
                                                scrollToTop();
                                            }}
                                            className="w-full mt-2 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Become a farmer */}
                <section className="bg-green-700 text-white py-16 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <PiPlant className="w-12 h-12 mx-auto mb-4 text-green-300" />

                        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                            Are You a Farmer?
                        </h2>

                        <p className="text-green-100 text-sm sm:text-base mb-6 max-w-xl mx-auto">
                            Join FarmLink and sell your fresh produce directly to buyers.
                            No middlemen, no hidden fees — just fair prices for your hard work.
                        </p>

                        <Link
                            to="/farmer-signup"
                            className="inline-block px-8 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 shadow-lg"
                        >
                            Register as a Farmer
                        </Link>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default FarmerPage;
