import { PiSignOut } from 'react-icons/pi';
import NotificationBell from '../NotificationBell';
import DashboardLayout from '../dashboardLayout';
import { useBuyerDashboard } from './BuyerDashboardContext';

const BuyerDashboardShell = ({ children }) => {
    const {
        activeTab, buyerName, cartCount, dashboardError, handleLogout, justSignedUp,
        navItems, openTab, setSidebarOpen, sidebarOpen,
    } = useBuyerDashboard();

    return (
        <DashboardLayout
            brandLabel="FarmLink Buyer"
            dashboardLabel="Buyer Dashboard"
            navItems={navItems}
            activeTab={activeTab}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            onNavigate={openTab}
            onLogout={handleLogout}
            cartCount={cartCount}
            linkState={{ fromBuyerDashboard: true }}
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
            <section className="rounded-xl border border-gray-200 bg-white p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'Dashboard'
                        ? `${justSignedUp ? 'Welcome' : 'Welcome back'}, ${buyerName}!`
                        : activeTab}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {activeTab === 'Dashboard'
                        ? 'Discover fresh farm produce directly from farmers and track your orders.'
                        : `Manage your ${activeTab.toLowerCase()} on FarmLink.`}
                </p>
            </section>
            {dashboardError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {dashboardError}
                </div>
            )}
            {children}
        </DashboardLayout>
    );
};

export default BuyerDashboardShell;
