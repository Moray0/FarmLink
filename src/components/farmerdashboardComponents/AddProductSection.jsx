import { useFarmerDashboard } from './FarmerDashboardContext';

const AddProductSection = () => {
    const { activeTab, renderAddProductForm } = useFarmerDashboard();
    return activeTab === 'Add Product' ? renderAddProductForm() : null;
};

export default AddProductSection;
