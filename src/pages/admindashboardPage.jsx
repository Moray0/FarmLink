
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
    collection,
    getDocs,
    doc,
    query,
    where,
    writeBatch,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import {
    PiPottedPlant,
    PiHouse,
    PiUsers,
    PiPlant,
    PiPackage,
    PiReceipt,
    PiChartBar,
    PiGear,
    PiSignOut,
    PiList,
    PiX,
} from 'react-icons/pi';

// Line graph for the Reports page
const ReportsLineChart = ({ data }) => {
    const width = 700;
    const height = 300;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 45;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxValue = Math.max(
        1,
        ...data.flatMap((day) => [
            day.users,
            day.products,
            day.orders,
        ])
    );

    const getX = (index) =>
        paddingLeft +
        (data.length > 1
            ? (index / (data.length - 1)) * chartWidth
            : chartWidth / 2);

    const getY = (value) =>
        paddingTop + chartHeight - (value / maxValue) * chartHeight;

    const lines = [
        { key: 'users', label: 'Users', color: '#2563eb' },
        { key: 'products', label: 'Products', color: '#16a34a' },
        { key: 'orders', label: 'Orders', color: '#9333ea' },
    ];

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-4 mb-4">
                {lines.map((line) => (
                    <div
                        key={line.key}
                        className="flex items-center gap-2 text-sm text-gray-600"
                    >
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: line.color }}
                        />
                        {line.label}
                    </div>
                ))}
            </div>

            <div className="w-full overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full min-w-125"
                    role="img"
                    aria-label="Daily user registrations, product listings, and orders over the last seven days"
                >
                    {Array.from({ length: 5 }, (_, index) => {
                        const value = Math.round((maxValue * index) / 4);
                        const y = getY(value);

                        return (
                            <g key={index}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={width - paddingRight}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={paddingLeft - 10}
                                    y={y + 4}
                                    fontSize="11"
                                    fill="#6b7280"
                                    textAnchor="end"
                                >
                                    {value}
                                </text>
                            </g>
                        );
                    })}

                    {data.map((day, index) => (
                        <text
                            key={day.label}
                            x={getX(index)}
                            y={height - 15}
                            fontSize="10"
                            fill="#6b7280"
                            textAnchor="middle"
                        >
                            {day.label}
                        </text>
                    ))}

                    {lines.map((line) => {
                        const points = data
                            .map(
                                (day, index) =>
                                    `${getX(index)},${getY(day[line.key])}`
                            )
                            .join(' ');

                        return (
                            <g key={line.key}>
                                <polyline
                                    points={points}
                                    fill="none"
                                    stroke={line.color}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {data.map((day, index) => (
                                    <circle
                                        key={`${line.key}-${index}`}
                                        cx={getX(index)}
                                        cy={getY(day[line.key])}
                                        r="4"
                                        fill={line.color}
                                    >
                                        <title>
                                            {`${day.label}: ${line.label}: ${day[line.key]}`}
                                        </title>
                                    </circle>
                                ))}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user, profile, role, logOut } = useAuth();

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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <span className="font-bold text-lg text-green-800 flex items-center gap-1">
                    <PiPottedPlant className="w-6 h-6 text-green-600" />
                    FarmLink Admin
                </span>

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 border rounded text-gray-700"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? (
                        <PiX className="w-6 h-6" />
                    ) : (
                        <PiList className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'block' : 'hidden'
                    } md:block w-full md:w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between shrink-0`}
            >
                <div>
                    <div className="mb-6 hidden md:block">
                        <Link
                            to="/"
                            className="text-2xl font-bold text-green-800 flex items-center gap-2"
                        >
                            <PiPottedPlant className="w-8 h-8 text-green-600" />
                            Farm<span className="text-green-600">Link</span>
                        </Link>

                        <p className="text-xs text-gray-500 mt-1">
                            Admin Dashboard
                        </p>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setActiveTab(item.name);
                                        setSidebarOpen(false);
                                    }}
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

                <div className="pt-6 border-t border-gray-200 mt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <PiSignOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6">
                {/* DASHBOARD */}
                {activeTab === 'Dashboard' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome to the Admin Dashboard
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage platform activities, monitor farm orders,
                                and oversee registered users.
                            </p>
                        </div>

                        {dashboardError && (
                            <div
                                role="alert"
                                className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm"
                            >
                                Some dashboard data could not be loaded. Check
                                the relevant collection's Firestore permissions.
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.title}
                                    className="bg-white p-4 rounded-xl border border-gray-200"
                                >
                                    <p className="text-xs text-gray-500 font-medium">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {loading
                                            ? '...'
                                            : stat.value.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <h2 className="text-base font-bold text-gray-900 mb-3">
                                Quick Actions
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    'Manage Users',
                                    'Manage Farmers',
                                    'Manage Products',
                                    'Orders',
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className="p-3 bg-green-50 text-green-800 font-semibold text-sm rounded-lg hover:bg-green-100"
                                    >
                                        {tab === 'Orders' ? 'View Orders' : tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200">
                                <h2 className="text-base font-bold text-gray-900 mb-3">
                                    Recent Orders
                                </h2>

                                {renderDataError('orders')}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b text-xs text-gray-500 uppercase">
                                                <th className="pb-2 pr-3">Order ID</th>
                                                <th className="pb-2 pr-3">Buyer</th>
                                                <th className="pb-2 pr-3">Farmer</th>
                                                <th className="pb-2 pr-3">Product</th>
                                                <th className="pb-2 pr-3">Amount</th>
                                                <th className="pb-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {recentOrders.length === 0
                                                ? renderEmpty(
                                                    'No orders found in Firestore yet.',
                                                    6
                                                )
                                                : recentOrders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td className="py-2.5 pr-3 font-medium">
                                                            {getOrderId(order)}
                                                        </td>
                                                        <td className="py-2.5 pr-3">
                                                            {order.buyerName || 'Unknown Buyer'}
                                                        </td>
                                                        <td className="py-2.5 pr-3">
                                                            {getOrderFarmers(order)}
                                                        </td>
                                                        <td className="py-2.5 pr-3">
                                                            {getOrderProducts(order)}
                                                        </td>
                                                        <td className="py-2.5 pr-3 font-semibold text-green-700">
                                                            {formatMoney(getOrderAmount(order))}
                                                        </td>
                                                        <td className="py-2.5">
                                                            <span
                                                                className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusClass(order.status)}`}
                                                            >
                                                                {order.status || 'Pending'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-gray-200">
                                <h2 className="text-base font-bold text-gray-900 mb-3">
                                    Recent Users
                                </h2>

                                {renderDataError('users')}

                                <div className="space-y-3">
                                    {recentUsers.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            {loading
                                                ? 'Loading users...'
                                                : 'No users found.'}
                                        </p>
                                    ) : (
                                        recentUsers.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-2"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {item.displayName || 'Unnamed User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 break-all">
                                                        {item.email || 'No email'}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-white border text-gray-700 shrink-0">
                                                    {getRoleLabel(item.role)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* MANAGE USERS */}
                {activeTab === 'Manage Users' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manage Users
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View registered FarmLink users and their account
                                roles.
                            </p>
                            <p className="text-sm font-semibold text-green-700 mt-3">
                                Total registered users: {users.length}
                            </p>
                        </div>

                        {renderDataError('users')}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.length === 0
                                            ? renderEmpty(
                                                'No registered users found.',
                                                4
                                            )
                                            : users.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="p-4 font-semibold text-gray-900">
                                                        {item.displayName || 'Unnamed User'}
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {item.email || 'No email'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                                                            {getRoleLabel(item.role)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {formatDate(item.createdAt)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* MANAGE FARMERS */}
                {activeTab === 'Manage Farmers' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manage Farmers
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Review farmer registrations and approve pending
                                farmers.
                            </p>
                            <p className="text-sm font-semibold text-green-700 mt-3">
                                Registered farmers: {farmers.length} · Pending
                                approval: {pendingFarmers}
                            </p>
                        </div>

                        {farmersError && (
                            <div
                                role="alert"
                                className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm"
                            >
                                {farmersError}
                            </div>
                        )}

                        {renderDataError('users')}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Farmer</th>
                                            <th className="p-4">Farm Name</th>
                                            <th className="p-4">Location</th>
                                            <th className="p-4">Verification</th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {farmers.length === 0
                                            ? renderEmpty(
                                                'No registered farmers found.',
                                                5
                                            )
                                            : farmers.map((farmer) => (
                                                <tr key={farmer.id}>
                                                    <td className="p-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {farmer.displayName || 'Unnamed Farmer'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {farmer.email || 'No email'}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {farmer.farmName || 'Not provided'}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {farmer.location || 'Not provided'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${farmer.verified === true
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-amber-100 text-amber-800'
                                                                }`}
                                                        >
                                                            {farmer.verified === true
                                                                ? 'Verified'
                                                                : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {farmer.verified === true ? (
                                                            <span className="text-sm font-medium text-green-700">
                                                                Verified ✓
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleVerifyFarmer(farmer)
                                                                }
                                                                disabled={verifyingId === farmer.id}
                                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                                                            >
                                                                {verifyingId === farmer.id
                                                                    ? 'Approving...'
                                                                    : 'Approve Farmer'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* MANAGE PRODUCTS */}
                {activeTab === 'Manage Products' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manage Products
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View products that farmers have saved to the
                                Firestore products collection.
                            </p>
                            <p className="text-sm font-semibold text-green-700 mt-3">
                                Total products: {products.length} · Available:{' '}
                                {availableProducts}
                            </p>
                            <Link
                                to="/marketplace"
                                className="inline-block mt-3 text-sm text-green-700 font-semibold hover:underline"
                            >
                                Open Marketplace
                            </Link>
                        </div>

                        {renderDataError('products')}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Product</th>
                                            <th className="p-4">Farmer</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Quantity</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.length === 0
                                            ? renderEmpty(
                                                'No products have been saved to Firestore yet.',
                                                6
                                            )
                                            : products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="p-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {product.name || 'Unnamed Product'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(product.createdAt)}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {product.farmName ||
                                                            product.farmerName ||
                                                            'Unknown Farmer'}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {product.category || 'Not specified'}
                                                    </td>
                                                    <td className="p-4 font-semibold text-green-700">
                                                        {formatMoney(product.price)}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {product.quantity ?? 'Not specified'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(product.status)}`}
                                                        >
                                                            {product.status || 'Unknown'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ORDERS */}
                {activeTab === 'Orders' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Orders
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Review actual orders saved in the Firestore
                                orders collection.
                            </p>
                            <p className="text-sm font-semibold text-green-700 mt-3">
                                Total orders: {orders.length} · Completed:{' '}
                                {completedOrders} · Pending/processing:{' '}
                                {pendingOrders}
                            </p>
                        </div>

                        {renderDataError('orders')}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Order ID</th>
                                            <th className="p-4">Buyer</th>
                                            <th className="p-4">Farmer</th>
                                            <th className="p-4">Products</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.length === 0
                                            ? renderEmpty(
                                                'No orders have been saved to Firestore yet.',
                                                7
                                            )
                                            : orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="p-4 font-medium">
                                                        {getOrderId(order)}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {order.buyerName ||
                                                            order.customerName ||
                                                            'Unknown Buyer'}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {getOrderFarmers(order)}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {getOrderProducts(order)}
                                                    </td>
                                                    <td className="p-4 font-semibold text-green-700">
                                                        {formatMoney(getOrderAmount(order))}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(order.status)}`}
                                                        >
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {formatDate(order.createdAt)}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* REPORTS */}
                {activeTab === 'Reports' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Reports
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Platform summaries calculated from the data
                                currently stored in Firestore.
                            </p>
                        </div>

                        {dashboardError && (
                            <div
                                role="alert"
                                className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm"
                            >
                                Some report figures may be incomplete because
                                a collection could not be read.
                            </div>
                        )}

                        {/* Report Statistic Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[
                                {
                                    title: 'Registered Users',
                                    value: users.length,
                                },
                                {
                                    title: 'Registered Farmers',
                                    value: farmers.length,
                                },
                                {
                                    title: 'Pending Farmer Approvals',
                                    value: pendingFarmers,
                                },
                                {
                                    title: 'Products Listed',
                                    value: products.length,
                                },
                                {
                                    title: 'Available Products',
                                    value: availableProducts,
                                },
                                {
                                    title: 'Total Orders',
                                    value: orders.length,
                                },
                                {
                                    title: 'Completed Orders',
                                    value: completedOrders,
                                },
                                {
                                    title: 'Pending/Processing Orders',
                                    value: pendingOrders,
                                },
                                {
                                    title: 'Total Order Value',
                                    value: formatMoney(totalOrderValue),
                                },
                            ].map((report) => (
                                <div
                                    key={report.title}
                                    className="bg-white p-5 rounded-xl border border-gray-200"
                                >
                                    <p className="text-sm text-gray-500">
                                        {report.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {loading
                                            ? '...'
                                            : typeof report.value === 'number'
                                                ? report.value.toLocaleString()
                                                : report.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* NEW LINE GRAPH */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Platform Activity
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Daily user registrations, product listings,
                                    and orders over the last seven days.
                                </p>
                            </div>

                            {renderDataError('users')}
                            {renderDataError('products')}
                            {renderDataError('orders')}

                            {loading ? (
                                <p className="text-sm text-gray-500 py-8 text-center">
                                    Loading chart data...
                                </p>
                            ) : (
                                <ReportsLineChart data={reportTrend} />
                            )}

                            <p className="text-xs text-gray-500 mt-4">
                                Only records with a valid createdAt timestamp
                                are included. A value of zero means no matching
                                records were found for that day.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <h2 className="font-bold text-gray-900 mb-2">
                                About these figures
                            </h2>
                            <p className="text-sm text-gray-600">
                                Total order value is calculated by adding the
                                totalAmount (or amount) of every order currently
                                stored in Firestore. It is not a verified
                                profit figure.
                            </p>
                        </div>
                    </>
                )}

                {/* SETTINGS */}
                {activeTab === 'Settings' && (
                    <>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Settings
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View your signed-in administrator account
                                information.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-2xl">
                            <h2 className="text-base font-bold text-gray-900 mb-4">
                                Admin Account
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Display Name
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {profile?.displayName ||
                                            user?.displayName ||
                                            'Not provided'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Email Address
                                    </p>
                                    <p className="font-medium text-gray-900 break-all">
                                        {profile?.email ||
                                            user?.email ||
                                            'Not available'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Account Role
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {getRoleLabel(
                                            role || profile?.role || 'admin'
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Account ID
                                    </p>
                                    <p className="text-sm text-gray-700 break-all">
                                        {user?.uid || 'Not available'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Account Created
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(
                                            user?.metadata?.creationTime
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Refresh available from every tab */}
                <div className="flex justify-end">
                    <button
                        onClick={loadDashboardData}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
