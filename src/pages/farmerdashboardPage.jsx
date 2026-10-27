
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import {
    PiPottedPlant,
    PiHouse,
    PiPackage,
    PiPlusCircle,
    PiReceipt,
    PiUser,
    PiChatDots,
    PiGear,
    PiSignOut,
    PiList,
    PiX,
    PiTrash,
    PiPencilSimple,
} from 'react-icons/pi';

const formatPrice = (value) => {
    const amount = Number(String(value ?? 0).replace(/[₦,\s]/g, ''));

    return `₦${(Number.isFinite(amount) ? amount : 0).toLocaleString('en-NG')}`;
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

const getOrderItems = (order, farmerId) => {
    if (!Array.isArray(order.items)) return [];

    return order.items.filter(
        (item) => item.farmerId === farmerId
    );
};

const getFarmerOrderTotal = (order, farmerId) => {
    return getOrderItems(order, farmerId).reduce((total, item) => {
        if (item.subtotal !== undefined) {
            return total + Number(
                String(item.subtotal).replace(/[₦,\s]/g, '')
            );
        }

        const price = Number(
            String(item.unitPrice ?? 0).replace(/[₦,\s]/g, '')
        );

        const quantity = Number(item.quantity ?? 1);

        return total + (
            (Number.isFinite(price) ? price : 0) *
            (Number.isFinite(quantity) ? quantity : 1)
        );
    }, 0);
};

const getNextStatus = (status) => {
    if (String(status).toLowerCase() === 'pending') {
        return 'Processing';
    }

    if (String(status).toLowerCase() === 'processing') {
        return 'Completed';
    }

    return null;
};

const FarmerDashboardPage = () => {
    const navigate = useNavigate();

    const {
    user,
    profile: authProfile,
    role,
    loading: authLoading,
    logOut,
    justSignedUp,
} = useAuth();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [productsLoading, setProductsLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);

    const [productError, setProductError] = useState('');
    const [orderError, setOrderError] = useState('');

    const [savingProduct, setSavingProduct] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showAddForm, setShowAddForm] = useState(false);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Vegetables');
    const [quantity, setQuantity] = useState('');

    const profile = {
        name: authProfile?.displayName || user?.displayName || 'Farmer',
        farmName: authProfile?.farmName?.trim() || 'Your Farm',
        location: authProfile?.location?.trim() || 'Location not added',
    };

    const navItems = [
        { name: 'Dashboard', icon: PiHouse },
        { name: 'My Products', icon: PiPackage },
        { name: 'Add Product', icon: PiPlusCircle },
        { name: 'Orders', icon: PiReceipt },
        { name: 'My Farm Profile', icon: PiUser },
        { name: 'Messages', icon: PiChatDots },
        { name: 'Settings', icon: PiGear },
    ];

    // Load the signed-in farmer's products and orders.
    useEffect(() => {
        if (authLoading) return;

        let isMounted = true;

        const loadDashboard = async () => {
            if (!user?.uid || role !== 'farmer') {
                setProducts([]);
                setOrders([]);
                setProductsLoading(false);
                setOrdersLoading(false);
                return;
            }

            setProductsLoading(true);
            setOrdersLoading(true);
            setProductError('');
            setOrderError('');

            const results = await Promise.allSettled([
                getDocs(
                    query(
                        collection(db, 'products'),
                        where('farmerId', '==', user.uid)
                    )
                ),
                getDocs(
                    query(
                        collection(db, 'orders'),
                        where('farmerIds', 'array-contains', user.uid)
                    )
                ),
            ]);

            if (!isMounted) return;

            const [productsResult, ordersResult] = results;

            if (productsResult.status === 'fulfilled') {
                const farmerProducts = productsResult.value.docs.map(
                    (productDoc) => ({
                        id: productDoc.id,
                        ...productDoc.data(),
                    })
                );

                farmerProducts.sort((a, b) => {
                    const dateA = a.createdAt?.toMillis
                        ? a.createdAt.toMillis()
                        : 0;

                    const dateB = b.createdAt?.toMillis
                        ? b.createdAt.toMillis()
                        : 0;

                    return dateB - dateA;
                });

                setProducts(farmerProducts);
            } else {
                console.error(
                    'Error loading farmer products:',
                    productsResult.reason
                );

                setProducts([]);
                setProductError(
                    'Could not load your products. Check your Firestore rules and try again.'
                );
            }

            if (ordersResult.status === 'fulfilled') {
                const farmerOrders = ordersResult.value.docs
                    .map((orderDoc) => ({
                        id: orderDoc.id,
                        ...orderDoc.data(),
                    }))
                    .filter((order) =>
                        getOrderItems(order, user.uid).length > 0
                    );

                farmerOrders.sort((a, b) => {
                    const dateA = a.createdAt?.toMillis
                        ? a.createdAt.toMillis()
                        : 0;

                    const dateB = b.createdAt?.toMillis
                        ? b.createdAt.toMillis()
                        : 0;

                    return dateB - dateA;
                });

                setOrders(farmerOrders);
            } else {
                console.error(
                    'Error loading farmer orders:',
                    ordersResult.reason
                );

                setOrders([]);
                setOrderError(
                    'Could not load customer orders. Check your Firestore rules and order data.'
                );
            }

            setProductsLoading(false);
            setOrdersLoading(false);
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [user?.uid, role, authLoading]);

    // Save a new product to Firestore.
    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!user?.uid || role !== 'farmer') {
            setProductError('Please sign in with a farmer account.');
            return;
        }

        const cleanName = name.trim();
        const cleanPrice = price.trim().replace(/^₦\s*/, '');
        const cleanQuantity = quantity.trim() || 'In stock';

        if (
            !cleanName ||
            !cleanPrice ||
            !Number.isFinite(Number(cleanPrice.replace(/,/g, ''))) ||
            Number(cleanPrice.replace(/,/g, '')) <= 0
        ) {
            setProductError('Enter a valid product name and price.');
            return;
        }

        setSavingProduct(true);
        setProductError('');

        const productData = {
            farmerId: user.uid,
            farmerName: profile.name,
            farmName: profile.farmName,
            location: profile.location,
            name: cleanName,
            category,
            price: cleanPrice,
            quantity: cleanQuantity,
            status: 'Available',
            image: '',
            createdAt: serverTimestamp(),
        };

        try {
            const productRef = await addDoc(
                collection(db, 'products'),
                productData
            );

            setProducts((previous) => [
                {
                    ...productData,
                    id: productRef.id,
                    createdAt: new Date(),
                },
                ...previous,
            ]);

            setName('');
            setPrice('');
            setCategory('Vegetables');
            setQuantity('');
            setShowAddForm(false);
            setActiveTab('My Products');
        } catch (error) {
            console.error('Error saving product:', error);

            setProductError(
                'Could not save your product. Check your Firestore rules and try again.'
            );
        } finally {
            setSavingProduct(false);
        }
    };

    // Delete a product from Firestore.
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setDeletingProductId(id);
        setProductError('');

        try {
            await deleteDoc(doc(db, 'products', id));

            setProducts((previous) =>
                previous.filter((item) => item.id !== id)
            );
        } catch (error) {
            console.error('Error deleting product:', error);

            setProductError(
                'Could not delete this product. Check your Firestore rules and try again.'
            );
        } finally {
            setDeletingProductId(null);
        }
    };

    // Update the order status in Firestore.
    const handleStatusUpdate = async (order) => {
        const nextStatus = getNextStatus(order.status || 'Pending');

        if (!nextStatus) return;

        setUpdatingOrderId(order.id);
        setOrderError('');

        try {
            await updateDoc(doc(db, 'orders', order.id), {
                status: nextStatus,
            });

            setOrders((previous) =>
                previous.map((item) =>
                    item.id === order.id
                        ? { ...item, status: nextStatus }
                        : item
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);

            setOrderError(
                'Could not update the order status. Check your Firestore rules and try again.'
            );
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/farmer-login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Could not log out. Please try again.');
        }
    };

    // Change the section displayed when a sidebar button is clicked.
    const handleNavigation = (tab) => {
        setActiveTab(tab);
        setShowAddForm(tab === 'Add Product');
        setSidebarOpen(false);
        setProductError('');
        setOrderError('');
    };

    const activeListings = products.filter(
        (item) => item.status === 'Available'
    ).length;

    const pendingOrders = orders.filter(
        (order) => String(order.status).toLowerCase() === 'pending'
    ).length;

    const completedOrders = orders.filter(
        (order) => String(order.status).toLowerCase() === 'completed'
    ).length;

    const specialties = [
        ...new Set(products.map((item) => item.category).filter(Boolean)),
    ];

    const specialtyText = specialties.length
        ? specialties.join(', ')
        : 'No product categories yet';

    // Original product card layout and styling.
    const renderProductsSection = () => (
        <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-base font-bold text-gray-900">
                    My Products
                </h2>

                <button
                    onClick={() => handleNavigation('Add Product')}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
                >
                    + Add Product
                </button>
            </div>

            {productsLoading ? (
                <p className="text-sm text-gray-500 py-4">
                    Loading your products...
                </p>
            ) : products.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">
                    You have not added any products yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {products.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col justify-between">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-32 w-full object-cover"
                                />
                            ) : (
                                <div className="h-32 bg-green-50 flex items-center justify-center">
                                    <PiPottedPlant className="w-12 h-12 text-green-600" />
                                </div>
                            )}

                            <div className="p-3">
                                <span className="text-[10px] text-green-700 font-bold uppercase">
                                    {item.category}
                                </span>

                                <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>

                                <p className="text-sm font-semibold text-green-800 mt-1">
                                    {formatPrice(item.price)}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {item.quantity} • {item.status}
                                </p>

                                <div className="flex gap-2 mt-3 pt-2 border-t">
                                    <button
                                        onClick={() => alert('Product editing is not connected yet.')}
                                        className="flex-1 py-1 text-xs font-semibold bg-gray-50 hover:bg-gray-100 border rounded flex items-center justify-center gap-1"
                                    >
                                        <PiPencilSimple /> Edit
                                    </button>

                                    <button
                                        onClick={() => handleDeleteProduct(item.id)}
                                        disabled={deletingProductId === item.id}
                                        className="p-1 text-xs text-red-600 hover:bg-red-50 border rounded disabled:opacity-50"
                                        title="Delete product"
                                    >
                                        {deletingProductId === item.id ? 'Deleting...' : <PiTrash />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Reuse the orders table on the Dashboard and Orders sections.
    const renderOrdersSection = () => (
        <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-1">
                Customer Orders
            </h2>

            <p className="text-xs text-gray-500 mb-3">
                Orders containing products from your farm.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b text-xs text-gray-500 uppercase">
                            <th className="pb-2 pr-3">Order ID</th>
                            <th className="pb-2 pr-3">Product</th>
                            <th className="pb-2 pr-3">Buyer</th>
                            <th className="pb-2 pr-3">Date</th>
                            <th className="pb-2 pr-3">Amount</th>
                            <th className="pb-2 pr-3">Status</th>
                            <th className="pb-2">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {!ordersLoading && orders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-gray-500">
                                    No customer orders have been found for your farm yet.
                                </td>
                            </tr>
                        )}

                        {orders.map((order) => {
                            const farmerItems = getOrderItems(order, user?.uid);
                            const productNames = farmerItems
                                .map((item) => item.productName || item.name || 'Product')
                                .join(', ');

                            const status = order.status || 'Pending';
                            const nextStatus = getNextStatus(status);

                            const statusStyle =
                                status.toLowerCase() === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : status.toLowerCase() === 'cancelled'
                                        ? 'bg-red-100 text-red-800'
                                        : status.toLowerCase() === 'processing'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-amber-100 text-amber-800';

                            return (
                                <tr key={order.id}>
                                    <td className="py-2.5 pr-3 font-medium">
                                        ORD-{order.id.slice(0, 6).toUpperCase()}
                                    </td>

                                    <td className="py-2.5 pr-3 font-medium text-gray-800">
                                        {productNames}
                                    </td>

                                    <td className="py-2.5 pr-3 text-gray-600">
                                        {order.buyerName || 'Buyer'}
                                    </td>

                                    <td className="py-2.5 pr-3 text-gray-500 whitespace-nowrap">
                                        {formatDate(order.createdAt)}
                                    </td>

                                    <td className="py-2.5 pr-3 font-semibold text-green-700 whitespace-nowrap">
                                        {formatPrice(getFarmerOrderTotal(order, user?.uid))}
                                    </td>

                                    <td className="py-2.5 pr-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusStyle}`}>
                                            {status}
                                        </span>
                                    </td>

                                    <td className="py-2.5">
                                        {nextStatus ? (
                                            <button
                                                onClick={() => handleStatusUpdate(order)}
                                                disabled={updatingOrderId === order.id}
                                                className="px-2 py-1 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded border border-green-200 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {updatingOrderId === order.id
                                                    ? 'Updating...'
                                                    : `Mark ${nextStatus}`}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                No action
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Product form used by the Dashboard and Add Product sections.
    const renderAddProductForm = () => (
        <div className="bg-white p-5 rounded-xl border border-green-300">
            <h2 className="text-base font-bold text-gray-900 mb-3">
                Enter Product Details
            </h2>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input
                    type="text"
                    required
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded-lg text-sm"
                />

                <input
                    type="text"
                    required
                    placeholder="Price in Naira (e.g. 15,000)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="p-2 border rounded-lg text-sm"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-2 border rounded-lg text-sm bg-white"
                >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Tubers">Tubers</option>
                </select>

                <input
                    type="text"
                    placeholder="Quantity (e.g. 20 crates)"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="p-2 border rounded-lg text-sm"
                />

                <div className="sm:col-span-2 md:col-span-4 flex gap-2">
                    <button
                        type="submit"
                        disabled={savingProduct}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
                    >
                        {savingProduct ? 'Saving...' : 'Save Product'}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowAddForm(false);
                            setActiveTab('Dashboard');
                        }}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <Link to="/" className="font-bold text-lg text-green-800 flex items-center gap-1">
                    <PiPottedPlant className="w-6 h-6 text-green-600" />
                    FarmLink Farmer
                </Link>

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 border rounded text-gray-700"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen
                        ? <PiX className="w-6 h-6" />
                        : <PiList className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 md:fixed md:top-0 md:left-0 md:h-screen md:z-40 md:overflow-y-auto bg-white border-r border-gray-200 p-5 flex flex-col justify-between shrink-0`}
            >
                <div>
                    <div className="mb-6 hidden md:block">
                        <Link to="/" className="text-2xl font-bold text-green-800 flex items-center gap-2">
                            <PiPottedPlant className="w-8 h-8 text-green-600" />
                            Farm<span className="text-green-600">Link</span>
                        </Link>

                        <p className="text-xs text-gray-500 mt-1">
                            Farmer Dashboard
                        </p>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.name)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${activeTab === item.name
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-700 hover:bg-green-50 hover:text-green-800'
                                        }`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 md:p-8 md:ml-64 space-y-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold"
                    >
                        <PiSignOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
                {productError && (
                    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                        {productError}
                    </div>
                )}

                {orderError && (
                    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                        {orderError}
                    </div>
                )}

                {/* Dashboard */}
                {activeTab === 'Dashboard' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                            {justSignedUp
                                ? `Welcome to ${profile.farmName} dashboard!`
                                : `Welcome back to ${profile.farmName} dashboard!`}
                        </h1>

                                <p className="text-gray-600 text-sm mt-1">
                                    Manage your farm produce, view buyer orders, and keep your farm updated.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-lg transition"
                            >
                                {showAddForm ? 'Close Form' : '+ Add New Product'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: 'Total Products', value: products.length, loading: productsLoading },
                                { title: 'Active Listings', value: activeListings, loading: productsLoading },
                                { title: 'Pending Orders', value: pendingOrders, loading: ordersLoading },
                                { title: 'Completed Orders', value: completedOrders, loading: ordersLoading },
                            ].map((stat) => (
                                <div key={stat.title} className="bg-white p-4 rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {stat.loading ? '—' : stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className="w-16 h-16 rounded-full border-2 border-green-500 bg-green-100 text-green-800 flex items-center justify-center text-xl font-bold">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {profile.farmName}
                                    </h2>

                                    <p className="text-sm text-gray-600 font-medium">
                                        {profile.name} • {profile.location}
                                    </p>

                                    <p className="text-xs text-green-700 font-semibold mt-0.5">
                                        Specialty: {specialtyText}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleNavigation('My Farm Profile')}
                                className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold"
                            >
                                Edit Profile
                            </button>
                        </div>

                        {showAddForm && renderAddProductForm()}

                        {renderProductsSection()}

                        {renderOrdersSection()}
                    </>
                )}

                {/* My Products */}
                {activeTab === 'My Products' && (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                My Products
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View and manage the products listed by your farm.
                            </p>
                        </div>

                        {renderProductsSection()}
                    </>
                )}

                {/* Add Product */}
                {activeTab === 'Add Product' && (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Add a New Product
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Enter the details of the produce you want to sell.
                            </p>
                        </div>

                        {renderAddProductForm()}
                    </>
                )}

                {/* Orders */}
                {activeTab === 'Orders' && (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Customer Orders
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View orders containing products from your farm and update their status.
                            </p>
                        </div>

                        {renderOrdersSection()}
                    </>
                )}

                {/* My Farm Profile */}
                {activeTab === 'My Farm Profile' && (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                My Farm Profile
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View the farm details currently available to your dashboard.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full border-2 border-green-500 bg-green-100 text-green-800 flex items-center justify-center text-xl font-bold">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {profile.farmName}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {profile.name}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Farmer Name
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {profile.name}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Farm Name
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {profile.farmName}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Farm Location
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {profile.location}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Product Categories
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {specialtyText}
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                These details are currently displayed from your authentication profile. Editing and saving profile changes requires connecting this section to your farmer profile data in Firestore.
                            </p>
                        </div>
                    </>
                )}

                {/* Messages */}
                {activeTab === 'Messages' && (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Messages
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Keep track of communication with buyers.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-xl border border-gray-200 text-center">
                            <PiChatDots className="w-12 h-12 text-green-600 mx-auto mb-3" />

                            <h2 className="text-lg font-bold text-gray-900">
                                Your Messages
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                No messages are available yet.
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                A messaging collection and buyer messaging feature need to be connected before conversations can appear here.
                            </p>
                        </div>
                    </>
                )}

                {/* Settings */}
                {activeTab === 'Settings' && (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Settings
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View your account information and manage your session.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h2 className="text-base font-bold text-gray-900 mb-4">
                                Account Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Account Name
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {profile.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Email Address
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {user?.email || 'Email unavailable'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Account Role
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {role || 'Unavailable'}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-6 pt-5">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold"
                                >
                                    <PiSignOut className="w-5 h-5" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default FarmerDashboardPage;
