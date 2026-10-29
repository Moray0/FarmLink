import BuyerDashboard from '../components/buyerdashboardComponents/BuyerDashboard';
import BuyerDashboardShell from '../components/buyerdashboardComponents/BuyerDashboardShell';
import DashboardOverview from '../components/buyerdashboardComponents/DashboardOverview';
import OrdersSection from '../components/buyerdashboardComponents/OrdersSection';
import CartSection from '../components/buyerdashboardComponents/CartSection';
import SavedProductsSection from '../components/buyerdashboardComponents/SavedProductsSection';
import ProfileSection from '../components/buyerdashboardComponents/ProfileSection';

const BuyerDashboardPage = () => (
    <BuyerDashboard>
        <BuyerDashboardShell>
            <DashboardOverview />
            <OrdersSection />
            <CartSection />
            <SavedProductsSection />
            <ProfileSection />
        </BuyerDashboardShell>
    </BuyerDashboard>
);

export default BuyerDashboardPage;
