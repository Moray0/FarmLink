import { useAdminDashboard } from './AdminDashboardContext';

const OrdersSection = () => {
    const {
        activeTab, completedOrders, formatDate, formatMoney, getOrderAmount, getOrderFarmers, getOrderId, getOrderProducts, getStatusClass, orders, pendingOrders, renderDataError, renderEmpty,
    } = useAdminDashboard();

    if (activeTab !== 'Orders') return null;

    return (
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
    );
};

export default OrdersSection;
