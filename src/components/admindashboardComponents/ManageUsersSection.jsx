import { useAdminDashboard } from './AdminDashboardContext';

const ManageUsersSection = () => {
    const {
        activeTab, formatDate, getRoleLabel, renderDataError, renderEmpty, users,
    } = useAdminDashboard();

    if (activeTab !== 'Manage Users') return null;

    return (
        <>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manage Users
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View registered FarmLink users and their account
                                roles.
                            </p>
                            <p className="text-sm font-semibold text-green-700 mt-3">
                                Total registered users: {users.length}
                            </p>
                        </div>

                        {renderDataError('users')}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.length === 0
                                            ? renderEmpty(
                                                'No registered users found.',
                                                4
                                            )
                                            : users.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="p-4 font-semibold text-gray-900">
                                                        {item.displayName || 'Unnamed User'}
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {item.email || 'No email'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                                                            {getRoleLabel(item.role)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-600">
                                                        {formatDate(item.createdAt)}
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

export default ManageUsersSection;
