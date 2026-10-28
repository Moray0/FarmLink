import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardTopBar from '../components/dashboardTopBar';
import { motion, useScroll } from 'motion/react';
import {
    PiMapPin,
    PiPlant,
    PiEnvelope,
    PiX,
} from 'react-icons/pi';
import {
    addDoc,
    collection,
    query,
    serverTimestamp,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import Footer from '../components/footer';
import { useAuth } from '../auth/AuthContext';

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
    const location = useLocation();
    const openedFromBuyerDashboard =
        location.state?.fromBuyerDashboard === true;

    const { scrollYProgress } = useScroll();
    const { user } = useAuth();

    const [selectedCategory, setSelectedCategory] = useState('All Farmers');
    const [contactFarmer, setContactFarmer] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [contactError, setContactError] = useState('');
    const [contactSent, setContactSent] = useState(false);
    const [sendingContact, setSendingContact] = useState(false);
    const [registeredFarmers, setRegisteredFarmers] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profilesError, setProfilesError] = useState('');
    const [productsError, setProductsError] = useState('');

    useEffect(() => {
        let active = true;

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
                        specialty:
                            profile.specialty ||
                            profile.category ||
                            'Agricultural Produce',
                        verified: profile.verified === true,
                        image:
                            profile.image ||
                            profile.photoURL ||
                            defaultFarmerImage,
                        bio:
                            profile.bio ||
                            'Welcome to this farmer’s profile. Check back for available products.',
                        products: [],
                    }));

                if (active) setRegisteredFarmers(profiles);
            } catch (error) {
                console.error('Error loading farmer profiles:', error);

                if (active) {
                    setProfilesError(
                        'Could not load registered farmer profiles. Check your Firestore rules and connection.'
                    );
                }
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

                if (active) setAvailableProducts(products);
            } catch (error) {
                console.error('Error loading available products:', error);

                if (active) {
                    setProductsError(
                        'Could not load available products. Farmer profiles can still be displayed.'
                    );
                }
            }

            if (active) setLoading(false);
        };

        loadFarmers();

        return () => {
            active = false;
        };
    }, []);

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

    // Only registered farmers are displayed.
    const farmers = farmersWithProducts;

    const filteredFarmers = farmers.filter((farmer) => (
        selectedCategory === 'All Farmers' ||
        farmer.specialty === selectedCategory ||
        farmer.products.some(
            (product) =>
                typeof product !== 'string' &&
                product.category === selectedCategory
        )
    ));

    const renderDashboardTopBar = () => (
        openedFromBuyerDashboard ? (
            <div className="bg-green-700">
                <DashboardTopBar />
            </div>
        ) : null
    );

    const openContactForm = (farmer) => {
        setContactFarmer(farmer);
        setContactMessage('');
        setContactError('');
        setContactSent(false);
    };

    const closeContactForm = () => {
        if (sendingContact) return;
        setContactFarmer(null);
        setContactMessage('');
        setContactError('');
        setContactSent(false);
    };

    const sendContactMessage = async (event) => {
        event.preventDefault();

        if (!user) {
            setContactError('Please log in as a buyer before contacting a farmer.');
            return;
        }

        const message = contactMessage.trim();

        if (!message) {
            setContactError('Please write a short message.');
            return;
        }

        const contactText = `${message}\nReply to: ${
            user.email || 'the buyer through FarmLink'
        }`;

        setSendingContact(true);
        setContactError('');

        try {
            await addDoc(collection(db, 'notifications'), {
                userId: contactFarmer.id,
                actorId: user.uid,
                type: 'farmer_inquiry',
                title: `New message from ${user.displayName || 'a buyer'}`,
                message: contactText,
                orderId: '',
                read: false,
                createdAt: serverTimestamp(),
            });

            setContactSent(true);
            setContactMessage('');
        } catch (error) {
            console.error('Could not send farmer inquiry:', error);
            setContactError('The message could not be sent. Please try again.');
        } finally {
            setSendingContact(false);
        }
    };

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
                <section className="bg-green-700 text-white px-4 sm:px-6 pb-16">
                    {renderDashboardTopBar()}

                    <div className="max-w-4xl mx-auto text-center pt-8">
                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                            Meet the Farmers Behind Your Food
                        </h1>

                        <p className="text-green-100 text-sm sm:text-base max-w-2xl mx-auto">
                            Get to know local farmers and explore the products they currently have available.
                        </p>
                    </div>
                </section>

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

                    {!loading && !profilesError && filteredFarmers.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4">🧑‍🌾</div>
                            <h3 className="text-lg font-bold text-gray-800">
                                No farmers found
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                No registered farmers match this category.
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

                                    <div className="p-5 flex min-h-70 flex-col">
                                        <div>
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {farmer.name}
                                                    </h3>

                                                    <p className="text-sm text-green-700 font-medium mt-1">
                                                        {farmer.farmName}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                                    {farmerProducts.length} product{farmerProducts.length === 1 ? '' : 's'}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-3">
                                                <PiMapPin className="w-4 h-4" />
                                                {farmer.location}
                                            </p>

                                            <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                {farmer.specialty}
                                            </span>
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <p className="text-xs text-gray-500 mb-3">
                                                {farmerProducts.length > 0
                                                    ? `Selling ${farmerProducts
                                                        .slice(0, 2)
                                                        .map((product) => product.name || 'fresh produce')
                                                        .join(' and ')}${farmerProducts.length > 2 ? ' and more' : ''}.`
                                                    : 'No available products yet.'}
                                            </p>

                                            <button
                                                type="button"
                                                aria-label={`Contact ${farmer.farmName}`}
                                                onClick={() => openContactForm(farmer)}
                                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition"
                                            >
                                                <PiEnvelope className="w-4 h-4" />
                                                Contact Farmer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

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

            {contactFarmer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Contact {contactFarmer.farmName}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Send a short message to this farmer.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeContactForm}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close contact form"
                            >
                                <PiX className="h-5 w-5" />
                            </button>
                        </div>

                        {!user && (
                            <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                Please log in as a buyer before sending a message.
                            </p>
                        )}

                        {contactSent ? (
                            <div className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                                Your message was sent. The farmer will see it in their notifications.
                            </div>
                        ) : (
                            <form onSubmit={sendContactMessage} className="mt-5 space-y-4">
                                <div>
                                    <label
                                        htmlFor="farmer-message"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Your message
                                    </label>
                                    <textarea
                                        id="farmer-message"
                                        value={contactMessage}
                                        onChange={(event) => setContactMessage(event.target.value)}
                                        maxLength={220}
                                        rows={4}
                                        placeholder="Ask about product availability, price, or delivery."
                                        className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <p className="mt-1 text-right text-xs text-gray-400">
                                        {contactMessage.length}/220
                                    </p>
                                </div>

                                {contactError && (
                                    <p role="alert" className="text-sm text-red-600">
                                        {contactError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={sendingContact || !user}
                                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {sendingContact ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default FarmerPage;