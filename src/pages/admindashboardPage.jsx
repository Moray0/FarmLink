import AdminDashboardState from '../components/admindashboardComponents/AdminDashboard';
import AdminDashboardShell from '../components/admindashboardComponents/AdminDashboardShell';
import DashboardOverview from '../components/admindashboardComponents/DashboardOverview';
import ManageUsersSection from '../components/admindashboardComponents/ManageUsersSection';
import ManageFarmersSection from '../components/admindashboardComponents/ManageFarmersSection';
import ManageProductsSection from '../components/admindashboardComponents/ManageProductsSection';
import OrdersSection from '../components/admindashboardComponents/OrdersSection';
import ReportsSection from '../components/admindashboardComponents/ReportsSection';
import SettingsSection from '../components/admindashboardComponents/SettingsSection';

const AdminDashboardPage = () => {
    return (
        <AdminDashboardState>
            <AdminDashboardShell>
                <DashboardOverview />
                <ManageUsersSection />
                <ManageFarmersSection />
                <ManageProductsSection />
                <OrdersSection />
                <ReportsSection />
                <SettingsSection />
            </AdminDashboardShell>
        </AdminDashboardState>
    );
};

export default AdminDashboardPage;
