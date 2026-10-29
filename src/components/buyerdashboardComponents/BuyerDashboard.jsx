import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../firebase.js';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { cancelOrder } from '../../utils/orders';
import {
    PiHeart,
    PiHouse,
    PiReceipt,
    PiShoppingCart,
    PiStorefront,
    PiUser,
    PiUsers,
} from 'react-icons/pi';
import { BuyerDashboardStateProvider } from './BuyerDashboardContext';

const formatPrice = (value) => {
    const price = Number(String(value ?? 0).replace(/[₦,\s]/g, ''));
    return `₦${(Number.isFinite(price) ? price : 0).toLocaleString('en-NG')}`;
};

const formatDate = (value) => {
    if (!value) return 'Date unavailable';

    const date = typeof value.toDate === 'function'
        ? value.toDate()
        : new Date(value);

    if (Number.isNaN(date.getTime())) return 'Date unavailable';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const BuyerDashboard = ({ children }) => {
    const navigate = useNavigate();
    const { user, profile, logOut, justSignedUp } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [cart, setCart] = useState([]);
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            if (!user?.uid) {
                setOrders([]);
                setProducts([]);
                setFarmers([]);
                setCart([]);
                setSavedProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setDashboardError('');

            try {
                const results = await Promise.allSettled([
                    getDocs(query(collection(db, 'orders'), where('buyerId', '==', user.uid))),
                    getDocs(query(collection(db, 'products'), where('status', '==', 'Available'))),
                    getDocs(collection(db, 'farmerProfiles')),
                    getDoc(doc(db, 'carts', user.uid)),
                    getDocs(collection(db, 'savedProducts', user.uid, 'items')),
                ]);

                if (!active) return;

                const [ordersResult, productsResult, farmersResult, cartResult, savedResult] = results;

                if (ordersResult.status === 'fulfilled') {
                    const buyerOrders = ordersResult.value.docs.map((item) => ({
                        id: item.id,
                        ...item.data(),
                    }));

                    buyerOrders.sort((a, b) => {
                        const dateA = a.createdAt?.toMillis
                            ? a.createdAt.toMillis()
                            : new Date(a.createdAt || 0).getTime();
                        const dateB = b.createdAt?.toMillis
                            ? b.createdAt.toMillis()
                            : new Date(b.createdAt || 0).getTime();
                        return dateB - dateA;
                    });
                    setOrders(buyerOrders);
                } else {
                    setOrders([]);
                    setDashboardError('Your orders could not be loaded. Check your Firestore rules.');
                }

                setProducts(productsResult.status === 'fulfilled'
                    ? productsResult.value.docs.map((item) => ({ id: item.id, ...item.data() }))
                    : []);
                setFarmers(farmersResult.status === 'fulfilled'
                    ? farmersResult.value.docs
                        .map((item) => ({ id: item.id, ...item.data() }))
                        .filter((farmer) => farmer.role === 'farmer')
                    : []);

                if (cartResult.status === 'fulfilled') {
                    setCart(cartResult.value.exists() ? cartResult.value.data().items || [] : []);
                } else {
                    setCart([]);
                    console.error('Could not load cart:', cartResult.reason);
                }

                if (savedResult.status === 'fulfilled') {
                    setSavedProducts(savedResult.value.docs.map((item) => ({
                        id: item.id,
                        ...item.data(),
                    })));
                } else {
                    setSavedProducts([]);
                    console.error('Could not load saved products:', savedResult.reason);
                }
            } catch (error) {
                console.error('Dashboard loading failed:', error);
                if (active) setDashboardError('Something went wrong while loading your dashboard.');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadDashboard();
        return () => {
            active = false;
        };
    }, [user?.uid]);

    const saveCart = async (updatedCart) => {
        if (!user?.uid) return;

        try {
            await setDoc(doc(db, 'carts', user.uid), {
                buyerId: user.uid,
                items: updatedCart.map((cartItem) => {
                    const saved = { ...cartItem };
                    delete saved.image;
                    return saved;
                }),
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Could not save cart:', error);
            setDashboardError('Your cart could not be saved. Check your Firestore rules.');
        }
    };

    const updateCartQuantity = (productId, change) => {
        const liveProduct = products.find((product) => product.id === productId);
        const currentItem = cart.find((item) => item.id === productId);

        if (
            change > 0 &&
            typeof liveProduct?.stock === 'number' &&
            Number(currentItem?.quantityInCart || 0) + change > liveProduct.stock
        ) {
            setDashboardError(`Only ${liveProduct.stock} of ${currentItem?.name || 'this product'} in stock.`);
            return;
        }

        setDashboardError('');
        const updatedCart = cart
            .map((item) => item.id === productId
                ? { ...item, quantityInCart: item.quantityInCart + change }
                : item)
            .filter((item) => item.quantityInCart > 0);
        setCart(updatedCart);
        saveCart(updatedCart);
    };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navigateToMarketplace = () => navigate('/marketplace', {
        state: { fromBuyerDashboard: true },
    });

    const openTab = (name) => {
        setActiveTab(name);
        setSidebarOpen(false);
    };

    const removeSavedProduct = async (productId) => {
        try {
            await deleteDoc(doc(db, 'savedProducts', user.uid, 'items', productId));
            setSavedProducts((previous) => previous.filter((item) => item.id !== productId));
        } catch (error) {
            console.error('Could not remove saved product:', error);
            setDashboardError('Could not remove the saved product.');
        }
    };

    const addSavedProductToCart = async (product) => {
        const currentProduct = products.find((item) => item.id === product.id) || product;

        if (!currentProduct.farmerId) {
            setDashboardError('This product has no verified farmer information and cannot be added to your cart.');
            return;
        }

        const existing = cart.find((item) => item.id === currentProduct.id);
        const updatedCart = existing
            ? cart.map((item) => item.id === currentProduct.id
                ? { ...item, quantityInCart: Number(item.quantityInCart || 1) + 1 }
                : item)
            : [...cart, { ...currentProduct, quantityInCart: 1 }];

        setCart(updatedCart);
        await saveCart(updatedCart);
        setActiveTab('My Cart');
    };

    const handleCancelOrder = async (order) => {
        if (!window.confirm('Cancel this order? Any card payment will be refunded (demo).')) return;

        const buyerName = profile?.displayName || user?.displayName || 'Buyer';
        setCancellingId(order.id);
        setDashboardError('');

        try {
            const result = await cancelOrder(order, user.uid, 'buyer', buyerName);
            setOrders((previous) => previous.map((item) =>
                item.id === order.id ? { ...item, ...result } : item
            ));
        } catch (error) {
            console.error('Could not cancel order:', error);
            setDashboardError(error.message || 'Could not cancel this order. Please try again.');
        } finally {
            setCancellingId(null);
        }
    };

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => String(order.status || '').toLowerCase() === 'pending').length;
    const completedOrders = orders.filter((order) => String(order.status || '').toLowerCase() === 'completed').length;
    const cartCount = cart.reduce((total, item) => total + Number(item.quantityInCart || 0), 0);
    const cartTotal = cart.reduce((total, item) =>
        total + Number(item.price || 0) * Number(item.quantityInCart || 0), 0
    );
    const buyerName = profile?.displayName || user?.displayName || 'Buyer';
    const buyerEmail = profile?.email || user?.email || 'Email unavailable';

    const value = {
        activeTab, addSavedProductToCart, buyerEmail, buyerName, cancellingId, cart, cartCount,
        cartItemImage: (item) => item.image || products.find((product) => product.id === item.id)?.image || '',
        cartTotal, completedOrders, dashboardError, farmers, formatDate, formatPrice, handleCancelOrder,
        handleLogout, loading, navItems: [
            { name: 'Dashboard', icon: PiHouse },
            { name: 'Marketplace', icon: PiStorefront, link: '/marketplace' },
            { name: 'Farmers', icon: PiUsers, link: '/farmers' },
            { name: 'My Orders', icon: PiReceipt },
            { name: 'My Cart', icon: PiShoppingCart },
            { name: 'Saved Products', icon: PiHeart },
            { name: 'Profile', icon: PiUser },
        ], navigateToMarketplace, openTab, orders, pendingOrders, products, profile, removeSavedProduct, savedProducts,
        setActiveTab, setSidebarOpen, sidebarOpen, stats: [
            { title: 'Total Orders', value: totalOrders },
            { title: 'Pending Orders', value: pendingOrders },
            { title: 'Completed Orders', value: completedOrders },
            { title: 'Saved Products', value: savedProducts.length },
        ], updateCartQuantity, user, justSignedUp,
    };

    return (
        <BuyerDashboardStateProvider value={value}>
            {children}
        </BuyerDashboardStateProvider>
    );
};

export default BuyerDashboard;
