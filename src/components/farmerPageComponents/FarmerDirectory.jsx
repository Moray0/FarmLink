import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useScroll } from 'motion/react';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../firebase.js';
import { FarmerDirectoryStateProvider } from './FarmerDirectoryContext';

const farmingCategories = ['All Farmers', 'Vegetables', 'Grains', 'Fruits', 'Tubers', 'Poultry', 'Livestock'];
const defaultFarmerImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80';

const FarmerDirectory = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const { scrollYProgress } = useScroll();
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
                const snapshot = await getDocs(collection(db, 'farmerProfiles'));
                const profiles = snapshot.docs
                    .map((item) => ({ id: item.id, ...item.data() }))
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
                if (active) setRegisteredFarmers(profiles);
            } catch (error) {
                console.error('Error loading farmer profiles:', error);
                if (active) setProfilesError('Could not load registered farmer profiles. Check your Firestore rules and connection.');
            }

            try {
                const snapshot = await getDocs(query(collection(db, 'products'), where('status', '==', 'Available')));
                if (active) setAvailableProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
            } catch (error) {
                console.error('Error loading available products:', error);
                if (active) setProductsError('Could not load available products. Farmer profiles can still be displayed.');
            }

            if (active) setLoading(false);
        };

        loadFarmers();
        return () => {
            active = false;
        };
    }, []);

    const farmers = registeredFarmers.map((farmer) => {
        const products = availableProducts.filter((product) => product.farmerId === farmer.id);
        const categories = products.map((product) => product.category).filter(Boolean);
        return {
            ...farmer,
            specialty: farmer.specialty !== 'Agricultural Produce' ? farmer.specialty : categories[0] || 'Agricultural Produce',
            products,
        };
    });
    const filteredFarmers = farmers.filter((farmer) => selectedCategory === 'All Farmers' ||
        farmer.specialty === selectedCategory ||
        farmer.products.some((product) => typeof product !== 'string' && product.category === selectedCategory));

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
        setSendingContact(true);
        setContactError('');
        try {
            await addDoc(collection(db, 'notifications'), {
                userId: contactFarmer.id,
                actorId: user.uid,
                type: 'farmer_inquiry',
                title: `New message from ${user.displayName || 'a buyer'}`,
                message: `${message}\nReply to: ${user.email || 'the buyer through FarmLink'}`,
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

    const value = {
        contactError, contactFarmer, contactMessage, contactSent, defaultFarmerImage,
        filteredFarmers, farmingCategories, loading, openContactForm, closeContactForm,
        productsError, profilesError, scrollYProgress, selectedCategory, sendContactMessage,
        sendingContact, setContactMessage, setSelectedCategory, user,
        openedFromBuyerDashboard: location.state?.fromBuyerDashboard === true,
    };

    return (
        <FarmerDirectoryStateProvider value={value}>
            {children}
        </FarmerDirectoryStateProvider>
    );
};

export default FarmerDirectory;
