import { MarketplaceStateProvider } from './MarketplaceContext';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { db } from '../../firebase';
import { useAuth } from '../../auth/AuthContext';
import { queueNotification, orderLabel } from '../../utils/notifications';
import { processDemoPayment, validateCard } from '../../utils/payment';

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
    const amount = Number(String(price ?? 0).replace(/[â‚¦,\s]/g, ''));
    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
};

const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 2
    }).format(parsePrice(price));

const MarketplaceState = ({ children }) => {
    const location = useLocation();
    const openedFromBuyerDashboard =
        location.state?.fromBuyerDashboard === true;

    
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
                    ? `Payment received (ref ${receipt.reference}). Your order ${orderLabel(orderRef.id)} was placed and is awaiting confirmation.`
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
    const marketplaceContext = {
        addToCart, authLoading, buyerName, buyerPhone, cart, cartError, cartItemImage,
        cartReady, cardCvv, cardExpiry, cardName, cardNumber, categories, checkoutError,
        currentPage, currentProducts, deliveryAddress, error, filteredProducts, firestoreProducts, formatPrice,
        goToPage, isCartOpen, isCheckoutOpen, loading, openCheckout, orderSuccess, paymentMethod,
        placeOrder, placingOrder, placingStep, profile, removeFromCart, role, searchTerm,
        selectedCategory, setBuyerName, setBuyerPhone, setCardCvv, setCardExpiry, setCardName,
        setCardNumber, setCurrentPage, setDeliveryAddress, setIsCartOpen, setIsCheckoutOpen,
        setPaymentMethod, setSearchTerm, setSelectedCategory, totalCartCount, totalCartPrice,
        totalPages, user, openedFromBuyerDashboard,
    };

    return (
        <MarketplaceStateProvider value={marketplaceContext}>
            {children}
        </MarketplaceStateProvider>
    );
};

export default MarketplaceState;
