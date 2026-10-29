
import { useEffect, useState } from 'react';
import { AdminDashboardStateProvider } from './AdminDashboardContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import {
    collection,
    getDocs,
    doc,
    query,
    where,
    writeBatch,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase.js';
import {
    PiHouse,
    PiUsers,
    PiPlant,
    PiPackage,
    PiReceipt,
    PiChartBar,
    PiGear,
} from 'react-icons/pi';


const AdminDashboard = ({ children }) => {
    const navigate = useNavigate();
    const { user, profile, logOut } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');

    const [users, setUsers] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [dataErrors, setDataErrors] = useState({});
    const [farmersError, setFarmersError] = useState('');
    const [verifyingId, setVerifyingId] = useState('');

    const navItems = [
        { name: 'Dashboard', icon: PiHouse },
        { name: 'Manage Users', icon: PiUsers },
        { name: 'Manage Farmers', icon: PiPlant },
        { name: 'Manage Products', icon: PiPackage },
        { name: 'Orders', icon: PiReceipt },
        { name: 'Reports', icon: PiChartBar },
        { name: 'Settings', icon: PiGear },
    ];

    const getTimestamp = (value) => {
        if (!value) return 0;

        if (typeof value.toMillis === 'function') {
            return value.toMillis();
        }

        if (typeof value.seconds === 'number') {
            return value.seconds * 1000;
        }

        const date = new Date(value).getTime();
        return Number.isNaN(date) ? 0 : date;
    };

    const formatDate = (value) => {
        const timestamp = getTimestamp(value);

        if (!timestamp) return 'Not available';

        return new Date(timestamp).toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatMoney = (value) => {
        const amount = Number(value);

        if (!Number.isFinite(amount)) return '₦0';

        return `₦${amount.toLocaleString('en-NG')}`;
    };

    const getRoleLabel = (value) => {
        if (!value) return 'Unknown';

        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const getOrderItems = (order) => {
        if (Array.isArray(order.items)) return order.items;
        if (Array.isArray(order.products)) return order.products;

        return [];
    };

    const getOrderAmount = (order) => {
        return Number(order.totalAmount ?? order.amount ?? 0);
    };

    const getOrderProducts = (order) => {
        const items = getOrderItems(order);

        if (items.length === 0) {
            return order.productName || order.product || 'No product details';
        }

        const names = items
            .map((item) => item.productName || item.name || item.product)
            .filter(Boolean);

        return names.length
            ? [...new Set(names)].join(', ')
            : 'No product details';
    };

    const getOrderFarmers = (order) => {
        const items = getOrderItems(order);

        const names = items
            .map((item) => item.farmerName || item.farmName)
            .filter(Boolean);

        if (names.length) return [...new Set(names)].join(', ');

        return order.farmerName || order.farmName || 'Not specified';
    };

    const getOrderId = (order) => {
        return order.orderNumber || `ORD-${order.id.slice(0, 6).toUpperCase()}`;
    };

    const getStatusClass = (status) => {
        const normalized = String(status || 'Pending').toLowerCase();

        if (
            ['completed', 'delivered', 'available', 'verified'].includes(
                normalized
            )
        ) {
            return 'bg-green-100 text-green-800';
        }

        if (
            ['cancelled', 'rejected', 'unavailable'].includes(normalized)
        ) {
            return 'bg-red-100 text-red-800';
        }

        if (['processing', 'shipped'].includes(normalized)) {
            return 'bg-blue-100 text-blue-800';
        }

        return 'bg-amber-100 text-amber-800';
    };

    // Load each Firestore collection independently.
    const loadDashboardData = async () => {
        setLoading(true);
        setDataErrors({});
        setFarmersError('');

        const collections = [
            { name: 'users', collectionName: 'users' },
            { name: 'products', collectionName: 'products' },
            { name: 'orders', collectionName: 'orders' },
        ];

        const results = await Promise.all(
            collections.map(async ({ name, collectionName }) => {
                try {
                    const snapshot = await getDocs(
                        collection(db, collectionName)
                    );

                    return {
                        name,
                        data: snapshot.docs.map((item) => ({
                            id: item.id,
                            ...item.data(),
                        })),
                        error: '',
                    };
                } catch (error) {
                    console.error(
                        `Failed to load ${collectionName}:`,
                        error
                    );

                    return {
                        name,
                        data: [],
                        error: 'Could not load this data. Check Firestore permissions.',
                    };
                }
            })
        );

        const nextErrors = {};

        results.forEach((result) => {
            if (result.error) {
                nextErrors[result.name] = result.error;
            }
        });

        setDataErrors(nextErrors);

        const usersResult = results.find(
            (item) => item.name === 'users'
        );
        const productsResult = results.find(
            (item) => item.name === 'products'
        );
        const ordersResult = results.find(
            (item) => item.name === 'orders'
        );

        const loadedUsers = usersResult?.data || [];
        const loadedProducts = productsResult?.data || [];
        const loadedOrders = ordersResult?.data || [];

        setUsers(
            [...loadedUsers].sort(
                (a, b) =>
                    getTimestamp(b.createdAt) -
                    getTimestamp(a.createdAt)
            )
        );

        setFarmers(
            loadedUsers
                .filter((item) => item.role === 'farmer')
                .sort(
                    (a, b) =>
                        Number(a.verified === true) -
                        Number(b.verified === true)
                )
        );

        setProducts(
            [...loadedProducts].sort(
                (a, b) =>
                    getTimestamp(b.createdAt) -
                    getTimestamp(a.createdAt)
            )
        );

        setOrders(
            [...loadedOrders].sort(
                (a, b) =>
                    getTimestamp(b.createdAt) -
                    getTimestamp(a.createdAt)
            )
        );

        setLoading(false);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Approve a farmer and verify their existing products.
    const handleVerifyFarmer = async (farmer) => {
        if (farmer.verified === true) return;

        const confirmed = window.confirm(
            `Approve ${farmer.farmName || farmer.displayName || 'this farmer'}?`
        );

        if (!confirmed) return;

        setVerifyingId(farmer.id);
        setFarmersError('');

        try {
            const productsQuery = query(
                collection(db, 'products'),
                where('farmerId', '==', farmer.id)
            );

            const productsSnapshot = await getDocs(productsQuery);
            const batch = writeBatch(db);
            const verifiedAt = serverTimestamp();

            batch.update(doc(db, 'users', farmer.id), {
                verified: true,
                verifiedAt,
            });

            productsSnapshot.docs.forEach((productDoc) => {
                batch.update(productDoc.ref, {
                    verified: true,
                    verifiedAt,
                });
            });

            batch.set(
                doc(db, 'farmerProfiles', farmer.id),
                {
                    verified: true,
                    verifiedAt,
                },
                { merge: true }
            );

            await batch.commit();

            setFarmers((current) =>
                current
                    .map((item) =>
                        item.id === farmer.id
                            ? { ...item, verified: true }
                            : item
                    )
                    .sort(
                        (a, b) =>
                            Number(a.verified === true) -
                            Number(b.verified === true)
                    )
            );

            setUsers((current) =>
                current.map((item) =>
                    item.id === farmer.id
                        ? { ...item, verified: true }
                        : item
                )
            );

            setProducts((current) =>
                current.map((item) =>
                    item.farmerId === farmer.id
                        ? { ...item, verified: true }
                        : item
                )
            );
        } catch (error) {
            console.error('Failed to approve farmer:', error);

            setFarmersError(
                'Approval failed. Check your Firestore rules and try again.'
            );
        } finally {
            setVerifyingId('');
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const stats = [
        { title: 'Total Users', value: users.length },
        { title: 'Registered Farmers', value: farmers.length },
        { title: 'Total Products', value: products.length },
        { title: 'Total Orders', value: orders.length },
    ];

    const recentUsers = users.slice(0, 4);
    const recentOrders = orders.slice(0, 4);

    const pendingFarmers = farmers.filter(
        (farmer) => farmer.verified !== true
    ).length;

    const availableProducts = products.filter(
        (product) =>
            String(product.status || '').toLowerCase() === 'available'
    ).length;

    const completedOrders = orders.filter((order) =>
        ['completed', 'delivered'].includes(
            String(order.status || '').toLowerCase()
        )
    ).length;

    const pendingOrders = orders.filter((order) =>
        ['pending', 'processing'].includes(
            String(order.status || '').toLowerCase()
        )
    ).length;

    const totalOrderValue = orders.reduce(
        (total, order) => total + getOrderAmount(order),
        0
    );

    // Count records created on each of the last seven calendar days.
    const reportTrend = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - index));

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const countForDay = (items) =>
            items.filter((item) => {
                const timestamp = getTimestamp(item.createdAt);

                return (
                    timestamp >= date.getTime() &&
                    timestamp < nextDate.getTime()
                );
            }).length;

        return {
            label: date.toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'short',
            }),
            users: countForDay(users),
            products: countForDay(products),
            orders: countForDay(orders),
        };
    });

    const dashboardError = Object.values(dataErrors).length > 0;

    const renderDataError = (name) => {
        if (!dataErrors[name]) return null;

        return (
            <div
                role="alert"
                className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm"
            >
                {dataErrors[name]}
            </div>
        );
    };

    const renderEmpty = (message, columnCount = 6) => (
        <tr>
            <td
                colSpan={columnCount}
                className="py-8 text-center text-gray-500"
            >
                {loading ? 'Loading data...' : message}
            </td>
        </tr>
    );

    const dashboardContext = {
        activeTab, sidebarOpen, setActiveTab, setSidebarOpen, navItems, handleLogout, loadDashboardData,
        availableProducts, completedOrders, dashboardError, dataErrors, farmers, farmersError, formatDate,
        formatMoney, getOrderAmount, getOrderFarmers, getOrderId, getOrderProducts, getRoleLabel, getStatusClass,
        handleVerifyFarmer, loading, orders, pendingFarmers, pendingOrders, products, profile, recentOrders,
        recentUsers, renderDataError, renderEmpty, reportTrend, stats, totalOrderValue, user, users, verifyingId,
    };

    return (
        <AdminDashboardStateProvider value={dashboardContext}>
            {children}
        </AdminDashboardStateProvider>
    );
};

export default AdminDashboard;
