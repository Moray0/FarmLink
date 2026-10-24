
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { db } from '../firebase.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import {
    PiPottedPlant,
    PiHouse,
    PiStorefront,
    PiUsers,
    PiReceipt,
    PiShoppingCart,
    PiHeart,
    PiUser,
    PiSignOut,
    PiList,
    PiX,
    PiTrash,
} from 'react-icons/pi';

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

const BuyerDashboardPage = () => {
    const navigate = useNavigate();
    const { user, profile, logOut } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [cart, setCart] = useState([]);
    const [savedProducts, setSavedProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState('');

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
                    getDocs(query(
                        collection(db, 'orders'),
                        where('buyerId', '==', user.uid)
                    )),
                    getDocs(query(
                        collection(db, 'products'),
                        where('status', '==', 'Available')
                    )),
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

                if (productsResult.status === 'fulfilled') {
                    setProducts(productsResult.value.docs.map((item) => ({
                        id: item.id,
                        ...item.data(),
                    })));
                } else {
                    setProducts([]);
                }

                if (farmersResult.status === 'fulfilled') {
                    setFarmers(farmersResult.value.docs
                        .map((item) => ({ id: item.id, ...item.data() }))
                        .filter((farmer) => farmer.role === 'farmer'));
                } else {
                    setFarmers([]);
                }

                if (cartResult.status === 'fulfilled') {
                    setCart(cartResult.value.exists()
                        ? cartResult.value.data().items || []
                        : []);
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
                if (active) {
                    setDashboardError('Something went wrong while loading your dashboard.');
                }
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
                items: updatedCart,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Could not save cart:', error);
            setDashboardError('Your cart could not be saved. Check your Firestore rules.');
        }
    };

    const updateCartQuantity = (productId, change) => {
        const updatedCart = cart
            .map((item) => item.id === productId
                ? { ...item, quantityInCart: item.quantityInCart + change }
                : item)
            .filter((item) => item.quantityInCart > 0);

        setCart(updatedCart);
        saveCart(updatedCart);
    };

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
        (order) => String(order.status || '').toLowerCase() === 'pending'
    ).length;
    const completedOrders = orders.filter(
        (order) => String(order.status || '').toLowerCase() === 'completed'
    ).length;
    const cartCount = cart.reduce(
        (total, item) => total + Number(item.quantityInCart || 0), 0
    );
    const cartTotal = cart.reduce(
        (total, item) => total + Number(item.price || 0) * Number(item.quantityInCart || 0), 0
    );

    const stats = [
        { title: 'Total Orders', value: totalOrders },
        { title: 'Pending Orders', value: pendingOrders },
        { title: 'Completed Orders', value: completedOrders },
        { title: 'Saved Products', value: savedProducts.length },
    ];

    const navItems = [
        { name: 'Dashboard', icon: PiHouse },
        { name: 'Marketplace', icon: PiStorefront, link: '/marketplace' },
        { name: 'Farmers', icon: PiUsers, link: '/farmers' },
        { name: 'My Orders', icon: PiReceipt },
        { name: 'My Cart', icon: PiShoppingCart },
        { name: 'Saved Products', icon: PiHeart },
        { name: 'Profile', icon: PiUser },
    ];

    const buyerName = profile?.displayName || user?.displayName || 'Buyer';
    const buyerEmail = profile?.email || user?.email || 'Email unavailable';

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const openTab = (name) => {
        setActiveTab(name);
        setSidebarOpen(false);
    };

    const removeSavedProduct = async (productId) => {
        try {
            const { deleteDoc } = await import('firebase/firestore');
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
            : [...cart, {
                ...currentProduct,
                quantityInCart: 1,
            }];

        setCart(updatedCart);
        await saveCart(updatedCart);
        setActiveTab('My Cart');
    };

    const renderOrders = (limit = null) => {
        const visibleOrders = limit === null ? orders : orders.slice(0, limit);

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b text-xs text-gray-500 uppercase">
                            <th className="pb-3 pr-4">Order ID</th>
                            <th className="pb-3 pr-4">Product</th>
                            <th className="pb-3 pr-4">Order Date</th>
                            <th className="pb-3 pr-4">Amount</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {!loading && visibleOrders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    You have no orders yet. Browse the marketplace to get started.
                                </td>
                            </tr>
                        )}

                        {visibleOrders.map((order) => {
                            const firstItem = order.items?.[0];
                            const productName = firstItem?.productName || firstItem?.name || 'Product unavailable';
                            const productLabel = order.items?.length > 1
                                ? `${productName} + ${order.items.length - 1} more`
                                : productName;
                            const status = order.status || 'Pending';
                            const statusStyle = status.toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : status.toLowerCase() === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800';

                            return (
                                <tr key={order.id}>
                                    <td className="py-3 pr-4 font-medium">{order.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="py-3 pr-4">{productLabel}</td>
                                    <td className="py-3 pr-4 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                                    <td className="py-3 pr-4 whitespace-nowrap font-semibold text-green-700">
                                        {formatPrice(order.totalAmount)}
                                    </td>
                                    <td className="py-3">
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${statusStyle}`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderProducts = (items, saved = false) => {
        if (!loading && items.length === 0) {
            return (
                <div className="py-10 text-center text-sm text-gray-500">
                    {saved ? 'You have no saved products yet.' : 'No products are available right now.'}
                    <div className="mt-3">
                        <Link to="/marketplace" className="font-semibold text-green-700 hover:underline">
                            Browse Marketplace
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                    <div key={product.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        {product.image ? (
                            <img src={product.image} alt={product.name || 'Farm produce'} className="h-36 w-full object-cover" />
                        ) : (
                            <div className="flex h-36 items-center justify-center bg-green-50 text-4xl">🌾</div>
                        )}
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900">{product.name || 'Unnamed Product'}</h3>
                            <p className="mt-1 text-xs text-gray-500">{product.farmer || product.farmName || product.farmerName || 'Local Farmer'}</p>
                            <p className="mt-2 font-semibold text-green-700">{formatPrice(product.price)}</p>
                            {saved && (
                                <button
                                    onClick={() => removeSavedProduct(product.id)}
                                    className="mt-3 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    Remove Saved Product
                                </button>
                            )}
                            <button
                                onClick={() => saved ? addSavedProductToCart(product) : navigate('/marketplace')}
                                className="mt-2 w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                                {saved ? 'Add to Cart' : 'Shop in Marketplace'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:hidden">
                <Link to="/" className="flex items-center gap-2 font-bold text-green-800">
                    <PiPottedPlant className="h-6 w-6 text-green-600" />
                    FarmLink Buyer
                </Link>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded border p-1" aria-label="Toggle sidebar">
                    {sidebarOpen ? <PiX className="h-6 w-6" /> : <PiList className="h-6 w-6" />}
                </button>
            </div>

            <aside className={`${sidebarOpen ? 'block' : 'hidden'} w-full shrink-0 border-r border-gray-200 bg-white p-5 md:flex md:w-64 md:flex-col md:justify-between`}>
                <div>
                    <div className="mb-6 hidden md:block">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-green-800">
                            <PiPottedPlant className="h-8 w-8 text-green-600" />
                            Farm<span className="text-green-600">Link</span>
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">Buyer Dashboard</p>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = activeTab === item.name;

                            if (item.link) {
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.link}
                                        onClick={() => openTab(item.name)}
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-50 hover:text-green-800'}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            }

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => openTab(item.name)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-50 hover:text-green-800'}`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                    {item.name === 'My Cart' && cartCount > 0 && (
                                        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs text-green-800">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                        <PiSignOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="min-w-0 flex-1 space-y-6 p-4 md:p-8">
                <section className="rounded-xl border border-gray-200 bg-white p-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {activeTab === 'Dashboard' ? `Welcome Back, ${buyerName}!` : activeTab}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {activeTab === 'Dashboard'
                            ? 'Discover fresh farm produce directly from farmers and track your orders.'
                            : `Manage your ${activeTab.toLowerCase()} on FarmLink.`}
                    </p>
                </section>

                {dashboardError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {dashboardError}
                    </div>
                )}

                {activeTab === 'Dashboard' && (
                    <>
                        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {loading ? '—' : stat.value}
                                    </p>
                                </div>
                            ))}
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-5">
                            <h2 className="mb-3 font-bold text-gray-900">Quick Actions</h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <Link to="/marketplace" className="rounded-lg bg-green-50 p-3 text-center text-sm font-semibold text-green-800 hover:bg-green-100">
                                    Browse Marketplace
                                </Link>
                                <button onClick={() => openTab('My Orders')} className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800 hover:bg-green-100">
                                    View My Orders
                                </button>
                                <button onClick={() => openTab('My Cart')} className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800 hover:bg-green-100">
                                    View Cart ({cartCount})
                                </button>
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900">Recent Orders</h2>
                                <button onClick={() => openTab('My Orders')} className="text-xs font-semibold text-green-700 hover:underline">
                                    View all
                                </button>
                            </div>
                            {loading ? <p className="py-6 text-sm text-gray-500">Loading orders...</p> : renderOrders(5)}
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900">Recommended Products</h2>
                                <Link to="/marketplace" className="text-xs font-semibold text-green-700 hover:underline">View all</Link>
                            </div>
                            {loading ? <p className="text-sm text-gray-500">Loading products...</p> : renderProducts(products.slice(0, 3))}
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900">Featured Farmers</h2>
                                <Link to="/farmers" className="text-xs font-semibold text-green-700 hover:underline">View all</Link>
                            </div>
                            {loading ? (
                                <p className="text-sm text-gray-500">Loading farmers...</p>
                            ) : farmers.length === 0 ? (
                                <p className="text-sm text-gray-500">No farmer profiles available yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {farmers.slice(0, 3).map((farmer) => (
                                        <div key={farmer.id} className="rounded-lg bg-gray-50 p-4">
                                            <p className="font-bold text-gray-900">{farmer.displayName || 'Farmer'}</p>
                                            <p className="mt-1 text-sm text-green-700">{farmer.farmName || 'Farm name unavailable'}</p>
                                            <p className="text-xs text-gray-500">{farmer.location || 'Location unavailable'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}

                {activeTab === 'My Orders' && (
                    <section className="rounded-xl border border-gray-200 bg-white p-5">
                        {loading ? <p className="py-6 text-sm text-gray-500">Loading orders...</p> : renderOrders()}
                    </section>
                )}

                {activeTab === 'My Cart' && (
                    <section className="rounded-xl border border-gray-200 bg-white p-5">
                        {cart.length === 0 ? (
                            <div className="py-10 text-center">
                                <PiShoppingCart className="mx-auto h-10 w-10 text-gray-400" />
                                <p className="mt-3 font-semibold text-gray-800">Your cart is empty.</p>
                                <Link to="/marketplace" className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                                    Browse Marketplace
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-green-50">🌾</div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                                                <p className="mt-1 text-sm font-semibold text-green-700">
                                                    {formatPrice(Number(item.price || 0) * Number(item.quantityInCart || 0))}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => updateCartQuantity(item.id, -1)} className="rounded border px-3 py-1 hover:bg-gray-50" aria-label={`Decrease ${item.name} quantity`}>−</button>
                                                <span className="min-w-4 text-center">{item.quantityInCart}</span>
                                                <button onClick={() => updateCartQuantity(item.id, 1)} className="rounded border px-3 py-1 hover:bg-gray-50" aria-label={`Increase ${item.name} quantity`}>+</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total ({cartCount} item(s))</p>
                                        <p className="text-2xl font-bold text-green-700">{formatPrice(cartTotal)}</p>
                                    </div>
                                    <Link to="/marketplace?cart=open" className="rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700">
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </>
                        )}
                    </section>
                )}

                {activeTab === 'Saved Products' && (
                    <section className="rounded-xl border border-gray-200 bg-white p-5">
                        {loading ? <p className="text-sm text-gray-500">Loading saved products...</p> : renderProducts(savedProducts, true)}
                    </section>
                )}

                {activeTab === 'Profile' && (
                    <section className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
                            {buyerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="font-semibold text-gray-900">{buyerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email Address</p>
                                <p className="font-semibold text-gray-900">{buyerEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Account Role</p>
                                <p className="font-semibold capitalize text-gray-900">{profile?.role || 'buyer'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Account UID</p>
                                <p className="break-all font-mono text-sm text-gray-700">{user?.uid || 'Unavailable'}</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default BuyerDashboardPage;
