import { useFarmerDashboard } from './FarmerDashboardContext';

const ProductsSection = () => {
    const { activeTab, renderProductsSection } = useFarmerDashboard();
    return activeTab === 'My Products' ? renderProductsSection() : null;
};

export default ProductsSection;
