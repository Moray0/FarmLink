import { BuyerOrdersTable } from './BuyerDashboardParts';
import { useBuyerDashboard } from './BuyerDashboardContext';

const OrdersSection = () => {
    const { activeTab, loading } = useBuyerDashboard();
    if (activeTab !== 'My Orders') return null;

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
            {loading ? <p className="py-6 text-sm text-gray-500">Loading orders...</p> : <BuyerOrdersTable />}
        </section>
    );
};

export default OrdersSection;
