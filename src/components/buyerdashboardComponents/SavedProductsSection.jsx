import { BuyerProductsGrid } from './BuyerDashboardParts';
import { useBuyerDashboard } from './BuyerDashboardContext';

const SavedProductsSection = () => {
    const { activeTab, loading, savedProducts } = useBuyerDashboard();
    if (activeTab !== 'Saved Products') return null;

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
            {loading ? <p className="text-sm text-gray-500">Loading saved products...</p> : <BuyerProductsGrid items={savedProducts} saved />}
        </section>
    );
};

export default SavedProductsSection;
