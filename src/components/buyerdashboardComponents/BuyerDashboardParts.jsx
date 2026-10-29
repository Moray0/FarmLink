import { Link } from 'react-router-dom';
import { PiShoppingCart } from 'react-icons/pi';
import { useBuyerDashboard } from './BuyerDashboardContext';

export const BuyerOrdersTable = ({ limit = null }) => {
    const {
        cancellingId, formatDate, formatPrice, handleCancelOrder, loading, orders,
    } = useBuyerDashboard();
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
                        <th className="pb-3 pr-4">Payment</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {!loading && visibleOrders.length === 0 && (
                        <tr>
                            <td colSpan="7" className="py-8 text-center text-gray-500">
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
                                : status.toLowerCase() === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800';

                        return (
                            <tr key={order.id}>
                                <td className="py-3 pr-4 font-medium">{order.id.slice(0, 8).toUpperCase()}</td>
                                <td className="py-3 pr-4">{productLabel}</td>
                                <td className="py-3 pr-4 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                                <td className="py-3 pr-4 whitespace-nowrap font-semibold text-green-700">{formatPrice(order.totalAmount)}</td>
                                <td className="py-3 pr-4 text-xs">
                                    <span className="font-semibold text-gray-800 whitespace-nowrap">{order.paymentStatus || 'Not recorded'}</span>
                                    {order.cardLast4 && <span className="block text-gray-500 whitespace-nowrap">{order.cardBrand} •••• {order.cardLast4}</span>}
                                    {order.paymentReference && <span className="block font-mono text-[10px] text-gray-400">{order.paymentReference}</span>}
                                </td>
                                <td className="py-3 pr-4">
                                    <span className={`rounded px-2 py-1 text-xs font-semibold ${statusStyle}`}>{status}</span>
                                </td>
                                <td className="py-3">
                                    {status.toLowerCase() === 'pending' ? (
                                        <button onClick={() => handleCancelOrder(order)} disabled={cancellingId === order.id} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                                            {cancellingId === order.id ? 'Cancelling...' : 'Cancel order'}
                                        </button>
                                    ) : <span className="text-xs text-gray-400">—</span>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const BuyerProductsGrid = ({ items, saved = false }) => {
    const {
        addSavedProductToCart, formatPrice, loading, navigateToMarketplace, removeSavedProduct,
    } = useBuyerDashboard();

    if (!loading && items.length === 0) {
        return (
            <div className="py-10 text-center text-sm text-gray-500">
                {saved ? 'You have no saved products yet.' : 'No products are available right now.'}
                <div className="mt-3">
                    <Link to="/marketplace" state={{ fromBuyerDashboard: true }} className="font-semibold text-green-700 hover:underline">
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
                    {product.image ? <img src={product.image} alt={product.name || 'Farm produce'} className="h-36 w-full object-cover" /> : <div className="flex h-36 items-center justify-center bg-green-50 text-4xl">🌾</div>}
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900">{product.name || 'Unnamed Product'}</h3>
                        <p className="mt-1 text-xs text-gray-500">{product.farmer || product.farmName || product.farmerName || 'Local Farmer'}</p>
                        <p className="mt-2 font-semibold text-green-700">{formatPrice(product.price)}</p>
                        {saved && <button onClick={() => removeSavedProduct(product.id)} className="mt-3 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Remove Saved Product</button>}
                        <button onClick={() => saved ? addSavedProductToCart(product) : navigateToMarketplace()} className="mt-2 w-full rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
                            {saved ? 'Add to Cart' : 'Shop in Marketplace'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const EmptyCart = () => (
    <div className="py-10 text-center">
        <PiShoppingCart className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-3 font-semibold text-gray-800">Your cart is empty.</p>
        <Link to="/marketplace" state={{ fromBuyerDashboard: true }} className="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
            Browse Marketplace
        </Link>
    </div>
);
