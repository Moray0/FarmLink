import { Link } from 'react-router-dom';
import { PiList, PiPottedPlant, PiSignOut, PiX } from 'react-icons/pi';

const DashboardLayout = ({
    brandLabel,
    dashboardLabel,
    navItems,
    activeTab,
    sidebarOpen,
    onToggleSidebar,
    onNavigate,
    onLogout,
    children,
    headerActions,
    cartCount = 0,
    linkState,
}) => (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <div className="md:hidden flex items-center justify-between border-b border-gray-200 bg-white p-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-green-800">
                <PiPottedPlant className="h-6 w-6 text-green-600" />
                {brandLabel}
            </Link>
            <button onClick={onToggleSidebar} className="rounded border p-1" aria-label="Toggle sidebar">
                {sidebarOpen ? <PiX className="h-6 w-6" /> : <PiList className="h-6 w-6" />}
            </button>
        </div>

        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:flex md:flex-col md:justify-between md:fixed md:inset-y-0 md:left-0 md:z-40 md:h-screen md:w-64 md:overflow-y-auto w-full bg-white border-r border-gray-200 p-5 shrink-0`}>
            <div>
                <div className="mb-6 hidden md:block">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-green-800">
                        <PiPottedPlant className="h-8 w-8 text-green-600" />
                        Farm<span className="text-green-600">Link</span>
                    </Link>
                    <p className="mt-1 text-xs text-gray-500">{dashboardLabel}</p>
                </div>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = activeTab === item.name;
                        const handleClick = () => onNavigate(item.name);
                        const className = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-50 hover:text-green-800'}`;

                        if (item.link) {
                            return (
                                <Link key={item.name} to={item.link} state={linkState} onClick={handleClick} className={className}>
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        }

                        return (
                            <button key={item.name} onClick={handleClick} className={className}>
                                <Icon className="h-5 w-5" />
                                {item.name}
                                {item.name === 'My Cart' && cartCount > 0 && (
                                    <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs text-green-800">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-8 md:ml-64 space-y-6">
            {headerActions || (
                <div className="flex justify-end">
                    <button onClick={onLogout} className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                        <PiSignOut className="h-5 w-5" />
                        Log Out
                    </button>
                </div>
            )}
            {children}
        </main>
    </div>
);

export default DashboardLayout;
