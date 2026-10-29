import { useAdminDashboard } from './AdminDashboardContext';

const DashboardOverview = () => {
    const {
        activeTab, dashboardError, formatMoney, getOrderAmount, getOrderFarmers, getOrderId, getOrderProducts, getRoleLabel, getStatusClass, loading, recentOrders, recentUsers, renderDataError, renderEmpty, setActiveTab, stats,
    } = useAdminDashboard();

    if (activeTab !== 'Dashboard') return null;

    return (
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
    );
};

export default DashboardOverview;
