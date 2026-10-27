import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll } from 'motion/react';
import {
    PiMagnifyingGlass,
    PiShoppingCart,
    PiCaretLeft,
    PiCaretRight,
    PiX,
    PiTrash,
    PiCheckCircle
} from 'react-icons/pi';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    setDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';
import Footer from '../components/footer';
import DashboardTopBar from '../components/dashboardTopBar';
import { queueNotification, orderLabel } from '../utils/notifications';
import {
    DEMO_CARDS,
    detectBrand,
    formatCardNumber,
    formatExpiry,
    processDemoPayment,
    validateCard
} from '../utils/payment';

const sampleProducts = [
    {
        id: 'sample-1',
        name: 'Fresh Roma Tomatoes',
        category: 'Vegetables',
        price: 22000,
        quantity: '1 crate',
        farmer: 'Adeola Green Farms',
        location: 'Ogun State',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        isSample: true
    },
    {
        id: 'sample-2',
        name: 'Golden Sweet Maize',
        category: 'Grains',
        price: 18000,
        quantity: '1 bag',
        farmer: 'Kano Grain Producers',
        location: 'Kano State',
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
        isSample: true
    },
    {
        id: 'sample-3',
        name: 'Fresh Oranges',
        category: 'Fruits',
        price: 12000,
        quantity: '1 basket',
        farmer: 'Benue Citrus Farms',
        location: 'Benue State',
        image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
        isSample: true
    },
    {
        id: 'sample-4',
        name: 'Fresh Sweet Potatoes',
        category: 'Tubers & Roots',
        price: 20000,
        quantity: '1 sack',
        farmer: 'Plateau Highland Harvest',
        location: 'Plateau State',
        image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80',
        isSample: true
    }
];

const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Tubers & Roots',
    'Legumes & Nuts',
    'Herbs & Spices',
    'Other Produce'
];

const itemsPerPage = 12;

const parsePrice = (price) => {
    const amount = Number(String(price ?? 0).replace(/[₦,\s]/g, ''));
    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
};

const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2
    }).format(parsePrice(price));

const MarketplacePage = () => {
    const location = useLocation();
    const openedFromBuyerDashboard =
        location.state?.fromBuyerDashboard === true;

    const { scrollYProgress } = useScroll();
    const { user, profile, role, loading: authLoading } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const [cart, setCart] = useState([]);
    const [cartReady, setCartReady] = useState(false);
    const [cartOwnerId, setCartOwnerId] = useState(null);
    const [cartError, setCartError] = useState('');

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const [firestoreProducts, setFirestoreProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [buyerName, setBuyerName] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const [checkoutError, setCheckoutError] = useState('');
    const [placingOrder, setPlacingOrder] = useState(false);
    const [placingStep, setPlacingStep] = useState('');
    const [orderSuccess, setOrderSuccess] = useState('');

    // Set the buyer's name from their account.
    useEffect(() => {
        if (profile?.displayName || user?.displayName) {
            setBuyerName((previous) =>
                previous || profile?.displayName || user?.displayName || ''
            );
        }
    }, [profile, user]);

    // Load the signed-in buyer's cart from Firestore.
    useEffect(() => {
        let active = true;

        const loadCart = async () => {
            if (authLoading) return;

            if (!user || role !== 'buyer') {
                setCart([]);
                setCartOwnerId(null);
                setCartReady(false);
                setCartError('');
                return;
            }

            setCartReady(false);
            setCartError('');
            setCartOwnerId(null);

            try {
                const cartRef = doc(db, 'carts', user.uid);
                const cartSnapshot = await getDoc(cartRef);

                if (!active) return;

                const savedItems = cartSnapshot.exists()
                    ? cartSnapshot.data().items
                    : [];

                setCart(Array.isArray(savedItems) ? savedItems : []);
                setCartOwnerId(user.uid);
                setCartReady(true);
            } catch (err) {
                console.error('Error loading buyer cart:', err);

                if (active) {
                    setCartError(
                        'Your saved cart could not be loaded. Please refresh the page.'
                    );
                    setCartReady(false);
                }
            }
        };

        loadCart();

        return () => {
            active = false;
        };
    }, [user?.uid, role, authLoading]);

    // Save cart changes after the correct buyer's cart has loaded.
    useEffect(() => {
        if (
            !cartReady ||
            !user ||
            role !== 'buyer' ||
            cartOwnerId !== user.uid
        ) {
            return;
        }

        const saveCart = async () => {
            try {
                // Photos are not saved in the cart to keep it small.
                // They are looked up from the product list when shown.
                await setDoc(doc(db, 'carts', user.uid), {
                    buyerId: user.uid,
                    items: cart.map((cartItem) => {
                        const saved = { ...cartItem };
                        delete saved.image;
                        return saved;
                    }),
                    updatedAt: serverTimestamp()
                });
            } catch (err) {
                console.error('Error saving buyer cart:', err);
                setCartError(
                    'Your cart could not be saved. Check your connection and Firestore rules.'
                );
            }
        };

        saveCart();
    }, [cart, cartReady, cartOwnerId, user?.uid, role]);

    // Load available products from Firestore.
    useEffect(() => {
        let active = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError('');

                const productsQuery = query(
                    collection(db, 'products'),
                    where('status', '==', 'Available')
                );

                const snapshot = await getDocs(productsQuery);

                const products = snapshot.docs.map((productDoc) => {
                    const data = productDoc.data();

                    return {
                        id: productDoc.id,
                        name: data.name || 'Unnamed Product',
                        category: data.category || 'Other Produce',
                        price: parsePrice(data.price),
                        quantity: data.quantity || 'Quantity not specified',
                        farmerId: data.farmerId || '',
                        farmer:
                            data.farmName ||
                            data.farmerName ||
                            'Local Farmer',
                        location:
                            data.location ||
                            data.state ||
                            'Location not provided',
                        image: data.image || '',
                        // null means the farmer does not track stock.
                        stock:
                            typeof data.stock === 'number'
                                ? data.stock
                                : null,
                        isSample: false
                    };
                });

                if (active) {
                    setFirestoreProducts(products);
                }
            } catch (err) {
                console.error('Error loading marketplace products:', err);

                if (active) {
                    setError(
                        'Could not load products. Please refresh the page.'
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadProducts();

        return () => {
            active = false;
        };
    }, []);

    // Display Firestore products and sample products together.
    const allProducts = [
        ...firestoreProducts,
        ...sampleProducts
    ];

    // Search and filter products.
    const filteredProducts = allProducts.filter((product) => {
        const term = searchTerm.toLowerCase();

        const matchesSearch =
            product.name.toLowerCase().includes(term) ||
            product.farmer.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term);

        const matchesCategory =
            selectedCategory === 'All' ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const totalPages =
        Math.ceil(filteredProducts.length / itemsPerPage) || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const totalCartCount = cart.reduce(
        (total, item) => total + Number(item.quantityInCart || 0),
        0
    );

    const totalCartPrice = cart.reduce(
        (total, item) =>
            total +
            parsePrice(item.price) *
                Number(item.quantityInCart || 0),
        0
    );

    // Add a product to the cart.
    const addToCart = (product) => {
        if (authLoading) {
            alert('Please wait while your account loads.');
            return;
        }

        if (!user || role !== 'buyer') {
            alert(
                'Please sign in with your buyer account to add products to your cart.'
            );
            return;
        }

        if (!cartReady || cartOwnerId !== user.uid) {
            alert('Your saved cart is still loading. Please try again.');
            return;
        }

        if (product.isSample) {
            alert('Sample products cannot be purchased.');
            return;
        }

        if (!product.farmerId) {
            alert('This product is missing its farmer information.');
            return;
        }

        const alreadyInCart = Number(
            cart.find((item) => item.id === product.id)?.quantityInCart || 0
        );

        if (
            typeof product.stock === 'number' &&
            alreadyInCart + 1 > product.stock
        ) {
            alert(
                product.stock === 0
                    ? `${product.name} is sold out.`
                    : `Only ${product.stock} of ${product.name} available, and you already have ${alreadyInCart} in your cart.`
            );
            return;
        }

        setOrderSuccess('');
        setCartError('');

        setCart((previousCart) => {
            const existing = previousCart.find(
                (item) => item.id === product.id
            );

            if (existing) {
                return previousCart.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantityInCart:
                                  Number(item.quantityInCart || 0) + 1
                          }
                        : item
                );
            }

            return [
                ...previousCart,
                {
                    ...product,
                    quantityInCart: 1
                }
            ];
        });
    };

    // Cart items are saved without their photo, so find it in the product list.
    const cartItemImage = (item) =>
        item.image ||
        firestoreProducts.find((product) => product.id === item.id)?.image ||
        '';

    // Remove a product from the cart.
    const removeFromCart = (productId) => {
        setCart((previousCart) =>
            previousCart.filter((item) => item.id !== productId)
        );
    };

    const openCheckout = () => {
        setCheckoutError('');
        setOrderSuccess('');
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    // Validate products and place an order.
    const placeOrder = async (event) => {
        event.preventDefault();
        setCheckoutError('');
        setOrderSuccess('');

        if (authLoading) {
            setCheckoutError('Please wait while your account loads.');
            return;
        }

        if (!user) {
            setCheckoutError('Please sign in to place an order.');
            return;
        }

        if (role !== 'buyer') {
            setCheckoutError(
                'Only a signed-in buyer account can place an order.'
            );
            return;
        }

        if (!cartReady || cartOwnerId !== user.uid) {
            setCheckoutError(
                'Your saved cart is still loading. Please try again.'
            );
            return;
        }

        if (cart.length === 0) {
            setCheckoutError('Your cart is empty.');
            return;
        }

        if (
            !buyerName.trim() ||
            !buyerPhone.trim() ||
            !deliveryAddress.trim()
        ) {
            setCheckoutError('Please complete all checkout fields.');
            return;
        }

        if (paymentMethod === 'card') {
            const cardProblem = validateCard({
                name: cardName,
                number: cardNumber,
                expiry: cardExpiry,
                cvv: cardCvv
            });

            if (cardProblem) {
                setCheckoutError(cardProblem);
                return;
            }
        }

        setPlacingOrder(true);

        let receipt = null;

        try {
            // Step 1: take the (demo) card payment.
            if (paymentMethod === 'card') {
                setPlacingStep('Processing payment...');
                receipt = await processDemoPayment({ number: cardNumber });
            }

            // Step 2: in one transaction, re-check every product, take the
            // stock and create the order, so two buyers can never buy the
            // same last item.
            setPlacingStep('Placing order...');

            const orderRef = doc(collection(db, 'orders'));

            await runTransaction(db, async (transaction) => {
                const productRefs = cart.map((item) =>
                    doc(db, 'products', item.id)
                );

                const snapshots = await Promise.all(
                    productRefs.map((ref) => transaction.get(ref))
                );

                const verifiedItems = [];
                const stockChanges = [];

                snapshots.forEach((productSnapshot, index) => {
                    const item = cart[index];

                    if (
                        !productSnapshot.exists() ||
                        productSnapshot.data().status !== 'Available'
                    ) {
                        throw new Error(
                            `${item.name} is no longer available. Remove it from your cart.`
                        );
                    }

                    const productData = productSnapshot.data();

                    if (
                        !productData.farmerId ||
                        productData.farmerId !== item.farmerId
                    ) {
                        throw new Error(
                            `We could not verify the farmer for ${item.name}.`
                        );
                    }

                    const currentPrice = parsePrice(productData.price);
                    const itemQuantity = Number(item.quantityInCart);

                    if (currentPrice <= 0) {
                        throw new Error(
                            `${item.name} has an invalid price. Please contact the farmer.`
                        );
                    }

                    if (
                        !Number.isInteger(itemQuantity) ||
                        itemQuantity < 1
                    ) {
                        throw new Error(
                            `The quantity for ${item.name} is invalid.`
                        );
                    }

                    if (typeof productData.stock === 'number') {
                        if (itemQuantity > productData.stock) {
                            throw new Error(
                                `Only ${productData.stock} of ${item.name} left in stock. Reduce the quantity in your cart.`
                            );
                        }

                        const remaining = productData.stock - itemQuantity;

                        stockChanges.push({
                            ref: productRefs[index],
                            stock: remaining,
                            status: remaining === 0 ? 'Sold Out' : 'Available'
                        });
                    }

                    verifiedItems.push({
                        productId: item.id,
                        productName: productData.name || item.name,
                        farmerId: productData.farmerId,
                        farmerName:
                            productData.farmName ||
                            productData.farmerName ||
                            item.farmer,
                        unitPrice: currentPrice,
                        quantity: itemQuantity,
                        subtotal: currentPrice * itemQuantity
                    });
                });

                const totalAmount = verifiedItems.reduce(
                    (total, item) => total + item.subtotal,
                    0
                );

                const farmerIds = [
                    ...new Set(verifiedItems.map((item) => item.farmerId))
                ];

                stockChanges.forEach((change) => {
                    transaction.update(change.ref, {
                        stock: change.stock,
                        status: change.status
                    });
                });

                transaction.set(orderRef, {
                    buyerId: user.uid,
                    buyerName: buyerName.trim(),
                    buyerEmail: user.email || '',
                    buyerPhone: buyerPhone.trim(),
                    deliveryAddress: deliveryAddress.trim(),
                    items: verifiedItems,
                    farmerIds,
                    totalAmount,
                    status: 'Pending',
                    paymentMethod,
                    paymentStatus: receipt
                        ? 'Paid (Demo)'
                        : 'Pay on Delivery',
                    paymentReference: receipt?.reference || '',
                    cardBrand: receipt?.brand || '',
                    cardLast4: receipt?.last4 || '',
                    createdAt: serverTimestamp()
                });

                const label = orderLabel(orderRef.id);

                farmerIds.forEach((farmerId) => {
                    queueNotification(transaction, {
                        userId: farmerId,
                        actorId: user.uid,
                        type: 'order_placed',
                        title: `New order ${label}`,
                        message: `${buyerName.trim()} ordered ${
                            verifiedItems.filter(
                                (item) => item.farmerId === farmerId
                            ).length
                        } of your product(s).`,
                        orderId: orderRef.id
                    });
                });

                queueNotification(transaction, {
                    userId: user.uid,
                    actorId: user.uid,
                    type: 'order_placed',
                    title: `Order ${label} placed`,
                    message:
                        'Your order was received and is waiting for the farmer to accept it.',
                    orderId: orderRef.id
                });
            });

            // Empty the cart. The cart-saving effect will update Firestore.
            setCart([]);
            setBuyerPhone('');
            setDeliveryAddress('');
            setCardName('');
            setCardNumber('');
            setCardExpiry('');
            setCardCvv('');
            setIsCheckoutOpen(false);

            setOrderSuccess(
                receipt
                    ? `Payment received (demo, ref ${receipt.reference}). Your order ${orderLabel(orderRef.id)} was placed and is awaiting confirmation.`
                    : `Your order ${orderLabel(orderRef.id)} was placed. You will pay on delivery.`
            );
        } catch (err) {
            console.error('Error placing order:', err);

            setCheckoutError(
                receipt
                    ? `${
                          err.message ||
                          'Your order could not be placed.'
                      } You were not charged (demo payment reversed).`
                    : err.message ||
                          'Your order could not be placed. Please try again.'
            );
        } finally {
            setPlacingOrder(false);
            setPlacingStep('');
        }
    };

    return (
        <>
            <motion.div
                id="scroll-indicator"
                style={{
                    scaleY: scrollYProgress,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 5,
                    originY: 0,
                    backgroundColor: '#16a34a',
                    zIndex: 50
                }}
            />

            <div className="min-h-screen bg-gray-50">
                {/* Marketplace heading and cart button */}
                <section className="bg-green-700 text-white py-10 px-4 sm:px-6">
                    {openedFromBuyerDashboard && <DashboardTopBar />}

                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold">
                                Marketplace
                            </h1>

                            <p className="text-green-100 mt-2 text-sm sm:text-base max-w-xl">
                                Discover fresh harvest, grains, tubers, and
                                organic produce sourced directly from local
                                farmers.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-white mr-10 text-green-800 p-3 rounded-full shadow-lg hover:bg-green-50 cursor-pointer shrink-0"
                            aria-label="Open shopping cart"
                        >
                            <PiShoppingCart className="w-6 h-6 text-green-700" />

                            {totalCartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {totalCartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    {orderSuccess && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                            <PiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <p className="text-sm">{orderSuccess}</p>
                        </div>
                    )}

                    {cartError && (
                        <div
                            role="alert"
                            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                        >
                            {cartError}
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative w-full max-w-xl mb-6">
                        <PiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                        <input
                            type="text"
                            placeholder="Search products or farmers..."
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                        />

                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <PiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Product categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    selectedCategory === category
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <div className="text-center py-12 text-gray-500">
                            Loading available products...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>

                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        firestoreProducts.length === 0 && (
                            <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                Showing sample products for now. Sample
                                products cannot be purchased.
                            </p>
                        )}

                    {!loading &&
                        !error &&
                        filteredProducts.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-5xl mb-4">🌱</div>

                                <h3 className="text-lg font-bold text-gray-800">
                                    No products found
                                </h3>

                                <p className="text-gray-500 text-sm mt-1">
                                    Try a different search or category.
                                </p>

                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('All');
                                        setCurrentPage(1);
                                    }}
                                    className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                >
                                    View all produce
                                </button>
                            </div>
                        )}

                    {/* Product cards */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                                >
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-green-50 flex items-center justify-center text-5xl">
                                            🌾
                                        </div>
                                    )}

                                    <div className="p-4 space-y-2">
                                        {product.isSample && (
                                            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                                Sample product
                                            </span>
                                        )}

                                        <h3 className="text-lg font-bold text-gray-900">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {product.farmer} · {product.location}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Category: {product.category}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Pack size: {product.quantity}
                                        </p>

                                        {typeof product.stock === 'number' && (
                                            <p
                                                className={`text-xs font-semibold ${
                                                    product.stock <= 5
                                                        ? 'text-amber-700'
                                                        : 'text-green-700'
                                                }`}
                                            >
                                                {product.stock <= 5
                                                    ? `Only ${product.stock} left in stock`
                                                    : `${product.stock} in stock`}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                                            <span className="text-lg font-bold text-green-700">
                                                {formatPrice(product.price)}
                                            </span>

                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={
                                                    product.isSample ||
                                                    authLoading ||
                                                    product.stock === 0 ||
                                                    (user?.uid &&
                                                        role === 'buyer' &&
                                                        !cartReady)
                                                }
                                                className={`px-3 py-1.5 text-sm font-medium text-white rounded-lg ${
                                                    product.isSample
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50'
                                                }`}
                                            >
                                                {product.isSample
                                                    ? 'Sample Only'
                                                    : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:text-gray-300 text-gray-700 hover:bg-green-50"
                            >
                                <PiCaretLeft className="w-4 h-4" />
                                Prev
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => goToPage(index + 1)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium ${
                                            currentPage === index + 1
                                                ? 'bg-green-600 text-white'
                                                : 'text-gray-600 hover:bg-green-50'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:text-gray-300 text-gray-700 hover:bg-green-50"
                            >
                                Next
                                <PiCaretRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Shopping cart drawer */}
                {isCartOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
                        <button
                            aria-label="Close cart overlay"
                            className="absolute inset-0 cursor-default"
                            onClick={() => setIsCartOpen(false)}
                        />

                        <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-green-50">
                                <h2 className="font-bold text-gray-900 text-lg">
                                    Your Cart ({totalCartCount})
                                </h2>

                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-200"
                                    aria-label="Close cart"
                                >
                                    <PiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto">
                                {!user || role !== 'buyer' ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-3">🔐</div>
                                        <p className="font-bold text-gray-800">
                                            Sign in as a buyer
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Sign in to save products to your cart.
                                        </p>
                                    </div>
                                ) : !cartReady ? (
                                    <p className="text-center py-12 text-gray-500">
                                        Loading your saved cart...
                                    </p>
                                ) : cart.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-4xl mb-3">🛒</div>
                                        <p className="font-bold text-gray-800">
                                            Your cart is empty
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Add some products!
                                        </p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 py-4 border-b border-gray-100"
                                        >
                                            {cartItemImage(item) ? (
                                                <img
                                                    src={cartItemImage(item)}
                                                    alt={item.name}
                                                    className="w-14 h-14 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center">
                                                    🌾
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900">
                                                    {item.name}
                                                </h4>

                                                <p className="text-xs text-gray-500">
                                                    {formatPrice(item.price)} ×{' '}
                                                    {item.quantityInCart}
                                                </p>

                                                <p className="text-sm font-medium">
                                                    {formatPrice(
                                                        item.price *
                                                            item.quantityInCart
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                className="text-gray-400 hover:text-red-500"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <PiTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {user &&
                                role === 'buyer' &&
                                cartReady &&
                                cart.length > 0 && (
                                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-gray-500 text-sm">
                                                Total
                                            </span>

                                            <span className="font-bold text-lg text-gray-900">
                                                {formatPrice(totalCartPrice)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={openCheckout}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* Checkout modal */}
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b p-5">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Checkout
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Confirm your delivery and payment details.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!placingOrder) {
                                            setIsCheckoutOpen(false);
                                        }
                                    }}
                                    disabled={placingOrder}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                    aria-label="Close checkout"
                                >
                                    <PiX className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={placeOrder}
                                className="space-y-5 p-5"
                            >
                                <div className="rounded-xl bg-green-50 p-4">
                                    <p className="text-sm text-gray-600">
                                        {totalCartCount} item(s) in your order
                                    </p>

                                    <p className="mt-1 text-2xl font-extrabold text-green-700">
                                        {formatPrice(totalCartPrice)}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Delivery fees, if applicable, are not included.
                                    </p>
                                </div>

                                {!user && (
                                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                        Sign in with your buyer account before placing your order.
                                    </p>
                                )}

                                {role && role !== 'buyer' && (
                                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                        You must use a buyer account to place an order.
                                    </p>
                                )}

                                <div>
                                    <label
                                        htmlFor="buyerName"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Full name
                                    </label>

                                    <input
                                        id="buyerName"
                                        value={buyerName}
                                        onChange={(event) =>
                                            setBuyerName(event.target.value)
                                        }
                                        required
                                        maxLength={100}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="buyerPhone"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Phone number
                                    </label>

                                    <input
                                        id="buyerPhone"
                                        type="tel"
                                        value={buyerPhone}
                                        onChange={(event) =>
                                            setBuyerPhone(event.target.value)
                                        }
                                        required
                                        maxLength={25}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="deliveryAddress"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Delivery address
                                    </label>

                                    <textarea
                                        id="deliveryAddress"
                                        value={deliveryAddress}
                                        onChange={(event) =>
                                            setDeliveryAddress(event.target.value)
                                        }
                                        required
                                        maxLength={500}
                                        rows={3}
                                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your full delivery address"
                                    />
                                </div>

                                {/* Payment */}
                                <fieldset className="space-y-3">
                                    <legend className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Payment method
                                    </legend>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: 'card', label: 'Pay by card' },
                                            { value: 'cod', label: 'Pay on delivery' }
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                                                    paymentMethod === option.value
                                                        ? 'border-green-600 bg-green-50 text-green-800'
                                                        : 'border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={option.value}
                                                    checked={paymentMethod === option.value}
                                                    onChange={() =>
                                                        setPaymentMethod(option.value)
                                                    }
                                                    disabled={placingOrder}
                                                    className="accent-green-600"
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>

                                    {paymentMethod === 'card' ? (
                                        <div className="space-y-3 rounded-xl border border-gray-200 p-4">
                                            <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
                                                <strong>Demo payment.</strong> No real money
                                                is charged. Try{' '}
                                                {DEMO_CARDS.map((card, index) => (
                                                    <span key={card.number}>
                                                        {index > 0 && ', '}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setCardNumber(card.number)
                                                            }
                                                            className="font-mono underline"
                                                            title={card.result}
                                                        >
                                                            {card.number}
                                                        </button>{' '}
                                                        ({card.result.toLowerCase()})
                                                    </span>
                                                ))}
                                                . Use any future expiry and any 3-digit code.
                                            </p>

                                            <input
                                                value={cardName}
                                                onChange={(event) =>
                                                    setCardName(event.target.value)
                                                }
                                                autoComplete="cc-name"
                                                maxLength={60}
                                                disabled={placingOrder}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Name on card"
                                                aria-label="Name on card"
                                            />

                                            <div className="relative">
                                                <input
                                                    value={cardNumber}
                                                    onChange={(event) =>
                                                        setCardNumber(
                                                            formatCardNumber(
                                                                event.target.value
                                                            )
                                                        )
                                                    }
                                                    inputMode="numeric"
                                                    autoComplete="cc-number"
                                                    disabled={placingOrder}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-24 font-mono outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="Card number"
                                                    aria-label="Card number"
                                                />

                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                                                    {detectBrand(cardNumber) !== 'Card'
                                                        ? detectBrand(cardNumber)
                                                        : ''}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    value={cardExpiry}
                                                    onChange={(event) =>
                                                        setCardExpiry(
                                                            formatExpiry(
                                                                event.target.value
                                                            )
                                                        )
                                                    }
                                                    inputMode="numeric"
                                                    autoComplete="cc-exp"
                                                    disabled={placingOrder}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="MM/YY"
                                                    aria-label="Expiry date"
                                                />

                                                <input
                                                    value={cardCvv}
                                                    onChange={(event) =>
                                                        setCardCvv(
                                                            event.target.value
                                                                .replace(/\D/g, '')
                                                                .slice(0, 4)
                                                        )
                                                    }
                                                    inputMode="numeric"
                                                    autoComplete="cc-csc"
                                                    type="password"
                                                    disabled={placingOrder}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="CVV"
                                                    aria-label="Security code"
                                                />
                                            </div>

                                            <p className="text-xs text-gray-500">
                                                Only the card brand and last 4 digits are
                                                kept with your order.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
                                            Pay the farmer when your order is delivered. The
                                            order is marked as paid once the farmer completes
                                            it.
                                        </p>
                                    )}
                                </fieldset>

                                {checkoutError && (
                                    <p
                                        role="alert"
                                        className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                                    >
                                        {checkoutError}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        disabled={placingOrder}
                                        onClick={() =>
                                            setIsCheckoutOpen(false)
                                        }
                                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            placingOrder ||
                                            authLoading ||
                                            !cartReady
                                        }
                                        className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {placingOrder
                                            ? placingStep || 'Placing Order...'
                                            : paymentMethod === 'card'
                                                ? `Pay ${formatPrice(totalCartPrice)}`
                                                : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default MarketplacePage;