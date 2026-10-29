import { useAdminDashboard } from './AdminDashboardContext';

const ManageFarmersSection = () => {
    const {
        activeTab, farmers, farmersError, handleVerifyFarmer, pendingFarmers, renderDataError, renderEmpty, verifyingId,
    } = useAdminDashboard();

    if (activeTab !== 'Manage Farmers') return null;

    return (
        <>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manage Farmers
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Review farmer registrations and approve pending
                                farmers.
                            </p>
                            <p className="text-sm font-semibold text-green-700 mt-3">
                                Registered farmers: {farmers.length} · Pending
                                approval: {pendingFarmers}
                            </p>
                        </div>

                        {farmersError && (
                            <div
                                role="alert"
                                className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm"
                            >
                                {farmersError}
                            </div>
                        )}

                        {renderDataError('users')}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Farmer</th>
                                            <th className="p-4">Farm Name</th>
                                            <th className="p-4">Location</th>
                                            <th className="p-4">Verification</th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {farmers.length === 0
                                            ? renderEmpty(
                                                'No registered farmers found.',
                                                5
                                            )
                                            : farmers.map((farmer) => (
                                                <tr key={farmer.id}>
                                                    <td className="p-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {farmer.displayName || 'Unnamed Farmer'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {farmer.email || 'No email'}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {farmer.farmName || 'Not provided'}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {farmer.location || 'Not provided'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${farmer.verified === true
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-amber-100 text-amber-800'
                                                                }`}
                                                        >
                                                            {farmer.verified === true
                                                                ? 'Verified'
                                                                : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {farmer.verified === true ? (
                                                            <span className="text-sm font-medium text-green-700">
                                                                Verified ✓
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleVerifyFarmer(farmer)
                                                                }
                                                                disabled={verifyingId === farmer.id}
                                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                                                            >
                                                                {verifyingId === farmer.id
                                                                    ? 'Approving...'
                                                                    : 'Approve Farmer'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    
        </>
    );
};

export default ManageFarmersSection;
