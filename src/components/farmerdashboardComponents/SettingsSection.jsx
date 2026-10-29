import { useFarmerDashboard } from './FarmerDashboardContext';

const SettingsSection = () => {
    const { activeTab, handleLogout, profile, user } = useFarmerDashboard();
    if (activeTab !== 'Settings') return null;

    return (
        <>
            <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="mt-1 text-sm text-gray-600">View your farmer account information.</p></div>
            <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-base font-bold text-gray-900">Account Details</h2>
                <div className="space-y-4">
                    <div><p className="mb-1 text-xs text-gray-500">Display Name</p><p className="font-medium text-gray-900">{profile.name}</p></div>
                    <div><p className="mb-1 text-xs text-gray-500">Farm Name</p><p className="font-medium text-gray-900">{profile.farmName}</p></div>
                    <div><p className="mb-1 text-xs text-gray-500">Account Role</p><p className="font-medium capitalize text-gray-900">Farmer</p></div>
                    <div><p className="mb-1 text-xs text-gray-500">Account ID</p><p className="break-all text-sm text-gray-700">{user?.uid || 'Not available'}</p></div>
                </div>
                <button onClick={handleLogout} className="mt-6 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Log Out</button>
            </div>
        </>
    );
};

export default SettingsSection;
