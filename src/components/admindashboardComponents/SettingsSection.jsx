import { useAdminDashboard } from './AdminDashboardContext';

const SettingsSection = () => {
    const {
        activeTab, formatDate, getRoleLabel, handleLogout, profile, user,
    } = useAdminDashboard();

    if (activeTab !== 'Settings') return null;

    return (
        <>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Settings
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View your signed-in administrator account
                                information.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 max-w-2xl">
                            <h2 className="text-base font-bold text-gray-900 mb-4">
                                Admin Account
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Display Name
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {profile?.displayName ||
                                            user?.displayName ||
                                            'Not provided'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Email Address
                                    </p>
                                    <p className="font-medium text-gray-900 break-all">
                                        {profile?.email ||
                                            user?.email ||
                                            'Not available'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Account Role
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {getRoleLabel(profile?.role || 'admin')}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Account ID
                                    </p>
                                    <p className="text-sm text-gray-700 break-all">
                                        {user?.uid || 'Not available'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Account Created
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(
                                            user?.metadata?.creationTime
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-semibold"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    
        </>
    );
};

export default SettingsSection;
