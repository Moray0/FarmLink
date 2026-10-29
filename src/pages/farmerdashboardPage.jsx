import FarmerDashboard from '../components/farmerdashboardComponents/FarmerDashboard';
import FarmerDashboardShell from '../components/farmerdashboardComponents/FarmerDashboardShell';
import DashboardOverview from '../components/farmerdashboardComponents/DashboardOverview';
import ProductsSection from '../components/farmerdashboardComponents/ProductsSection';
import AddProductSection from '../components/farmerdashboardComponents/AddProductSection';
import OrdersSection from '../components/farmerdashboardComponents/OrdersSection';
import FarmProfileSection from '../components/farmerdashboardComponents/FarmProfileSection';
import MessagesSection from '../components/farmerdashboardComponents/MessagesSection';
import SettingsSection from '../components/farmerdashboardComponents/SettingsSection';

const FarmerDashboardPage = () => (
    <FarmerDashboard>
        <FarmerDashboardShell>
            <DashboardOverview />
            <ProductsSection />
            <AddProductSection />
            <OrdersSection />
            <FarmProfileSection />
            <MessagesSection />
            <SettingsSection />
        </FarmerDashboardShell>
    </FarmerDashboard>
);

export default FarmerDashboardPage;
