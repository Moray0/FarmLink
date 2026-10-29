import { Link } from 'react-router-dom';
import { BuyerOrdersTable, BuyerProductsGrid } from './BuyerDashboardParts';
import { useBuyerDashboard } from './BuyerDashboardContext';

const DashboardOverview = () => {
    const {
        activeTab, cartCount, farmers, loading, openTab, products, stats,
    } = useBuyerDashboard();

    if (activeTab !== 'Dashboard') return null;

    return (
        <>
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{loading ? '—' : stat.value}</p>
                    </div>
                ))}
            </section>
            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="mb-3 font-bold text-gray-900">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Link to="/marketplace" state={{ fromBuyerDashboard: true }} className="rounded-lg bg-green-50 p-3 text-center text-sm font-semibold text-green-800 hover:bg-green-100">Browse Marketplace</Link>
                    <button onClick={() => openTab('My Orders')} className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800 hover:bg-green-100">View My Orders</button>
                    <button onClick={() => openTab('My Cart')} className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-green-800 hover:bg-green-100">View Cart ({cartCount})</button>
                </div>
            </section>
            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Recent Orders</h2>
                    <button onClick={() => openTab('My Orders')} className="text-xs font-semibold text-green-700 hover:underline">View all</button>
                </div>
                {loading ? <p className="py-6 text-sm text-gray-500">Loading orders...</p> : <BuyerOrdersTable limit={5} />}
            </section>
            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Recommended Products</h2>
                    <Link to="/marketplace" state={{ fromBuyerDashboard: true }} className="text-xs font-semibold text-green-700 hover:underline">View all</Link>
                </div>
                {loading ? <p className="text-sm text-gray-500">Loading products...</p> : <BuyerProductsGrid items={products.slice(0, 3)} />}
            </section>
            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Featured Farmers</h2>
                    <Link to="/farmers" state={{ fromBuyerDashboard: true }} className="text-xs font-semibold text-green-700 hover:underline">View all</Link>
                </div>
                {loading ? <p className="text-sm text-gray-500">Loading farmers...</p> : farmers.length === 0 ? <p className="text-sm text-gray-500">No farmer profiles available yet.</p> : (
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
    );
};

export default DashboardOverview;
