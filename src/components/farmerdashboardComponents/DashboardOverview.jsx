import { useFarmerDashboard } from './FarmerDashboardContext';

const DashboardOverview = () => {
    const {
        activeListings, activeTab, completedOrders, justSignedUp,
        pendingOrders, products, productsLoading, profile, renderOrdersSection,
        renderAddProductForm, renderProductsSection, setShowAddForm, showAddForm, ordersLoading,
    } = useFarmerDashboard();

    if (activeTab !== 'Dashboard') return null;

    return (
        <>
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {justSignedUp ? `Welcome to ${profile.farmName} dashboard!` : `Welcome back to ${profile.farmName} dashboard!`}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">Manage your farm produce, view buyer orders, and keep your farm updated.</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                    {showAddForm ? 'Close Form' : '+ Add New Product'}
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                    { title: 'Total Products', value: products.length, loading: productsLoading },
                    { title: 'Active Listings', value: activeListings, loading: productsLoading },
                    { title: 'Pending Orders', value: pendingOrders, loading: ordersLoading },
                    { title: 'Completed Orders', value: completedOrders, loading: ordersLoading },
                ].map((stat) => (
                    <div key={stat.title} className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">{stat.loading ? '—' : stat.value}</p>
                    </div>
                ))}
            </div>
            {showAddForm && renderAddProductForm()}
            {renderOrdersSection()}
            {renderProductsSection()}
        </>
    );
};

export default DashboardOverview;
