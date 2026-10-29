import NotificationBell from '../NotificationBell';
import DashboardLayout from '../dashboardLayout';
import { PiSignOut } from 'react-icons/pi';
import { useFarmerDashboard } from './FarmerDashboardContext';

const FarmerDashboardShell = ({ children }) => {
    const {
        activeTab, handleLogout, handleNavigation, navItems, productError, orderError,
        setSidebarOpen, sidebarOpen,
    } = useFarmerDashboard();

    return (
        <DashboardLayout
            brandLabel="FarmLink Farmer"
            dashboardLabel="Farmer Dashboard"
            navItems={navItems}
            activeTab={activeTab}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
            headerActions={
                <div className="flex items-center justify-end gap-3">
                    <NotificationBell />
                    <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                        <PiSignOut className="h-5 w-5" />
                        Log Out
                    </button>
                </div>
            }
        >
            {productError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{productError}</div>}
            {orderError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{orderError}</div>}
            {children}
        </DashboardLayout>
    );
};

export default FarmerDashboardShell;
