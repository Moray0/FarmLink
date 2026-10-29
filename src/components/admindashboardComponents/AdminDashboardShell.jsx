import { Link } from 'react-router-dom';
import { PiList, PiPottedPlant, PiSignOut, PiX } from 'react-icons/pi';
import { useAdminDashboard } from './AdminDashboardContext';

const AdminDashboardShell = ({ children }) => {
    const {
        activeTab,
        handleLogout,
        navItems,
        setActiveTab,
        setSidebarOpen,
        sidebarOpen,
        loadDashboardData,
        loading,
    } = useAdminDashboard();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <span className="font-bold text-lg text-green-800 flex items-center gap-1">
                    <PiPottedPlant className="w-6 h-6 text-green-600" />
                    FarmLink Admin
                </span>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 border rounded text-gray-700"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? <PiX className="w-6 h-6" /> : <PiList className="w-6 h-6" />}
                </button>
            </div>

            <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:flex md:flex-col md:justify-between md:fixed md:top-0 md:left-0 md:h-screen md:z-40 md:overflow-y-auto w-full md:w-64 bg-white border-r border-gray-200 p-5 shrink-0`}>
                <div>
                    <div className="mb-6 hidden md:block">
                        <Link to="/" className="text-2xl font-bold text-green-800 flex items-center gap-2">
                            <PiPottedPlant className="w-8 h-8 text-green-600" />
                            Farm<span className="text-green-600">Link</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
                    </div>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setActiveTab(item.name);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${activeTab === item.name ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-50 hover:text-green-800'}`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <main className="flex-1 min-w-0 p-4 md:p-8 md:ml-64 space-y-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 transition"
                    >
                        <PiSignOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
                {children}
                <div className="flex justify-end">
                    <button
                        onClick={loadDashboardData}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardShell;
