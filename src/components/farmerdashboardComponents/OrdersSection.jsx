import { useFarmerDashboard } from './FarmerDashboardContext';

const OrdersSection = () => {
    const { activeTab, renderOrdersSection } = useFarmerDashboard();
    return activeTab === 'Orders' ? renderOrdersSection() : null;
};

export default OrdersSection;
