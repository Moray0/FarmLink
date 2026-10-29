import { useAdminDashboard } from './AdminDashboardContext';
import { ReportsLineChart } from './ReportsLineChart';

const ReportsSection = () => {
    const {
        activeTab, availableProducts, completedOrders, dashboardError, farmers, formatMoney, loading, orders, pendingFarmers, pendingOrders, products, renderDataError, reportTrend, totalOrderValue, users,
    } = useAdminDashboard();

    if (activeTab !== 'Reports') return null;

    return (
        <>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Reports
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Platform summaries calculated from the data
                                currently stored in Firestore.
                            </p>
                        </div>

                        {dashboardError && (
                            <div
                                role="alert"
                                className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm"
                            >
                                Some report figures may be incomplete because
                                a collection could not be read.
                            </div>
                        )}

                        {/* Report Statistic Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[
                                {
                                    title: 'Registered Users',
                                    value: users.length,
                                },
                                {
                                    title: 'Registered Farmers',
                                    value: farmers.length,
                                },
                                {
                                    title: 'Pending Farmer Approvals',
                                    value: pendingFarmers,
                                },
                                {
                                    title: 'Products Listed',
                                    value: products.length,
                                },
                                {
                                    title: 'Available Products',
                                    value: availableProducts,
                                },
                                {
                                    title: 'Total Orders',
                                    value: orders.length,
                                },
                                {
                                    title: 'Completed Orders',
                                    value: completedOrders,
                                },
                                {
                                    title: 'Pending/Processing Orders',
                                    value: pendingOrders,
                                },
                                {
                                    title: 'Total Order Value',
                                    value: formatMoney(totalOrderValue),
                                },
                            ].map((report) => (
                                <div
                                    key={report.title}
                                    className="bg-white p-5 rounded-xl border border-gray-200"
                                >
                                    <p className="text-sm text-gray-500">
                                        {report.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {loading
                                            ? '...'
                                            : typeof report.value === 'number'
                                                ? report.value.toLocaleString()
                                                : report.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* NEW LINE GRAPH */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Platform Activity
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Daily user registrations, product listings,
                                    and orders over the last seven days.
                                </p>
                            </div>

                            {renderDataError('users')}
                            {renderDataError('products')}
                            {renderDataError('orders')}

                            {loading ? (
                                <p className="text-sm text-gray-500 py-8 text-center">
                                    Loading chart data...
                                </p>
                            ) : (
                                <ReportsLineChart data={reportTrend} />
                            )}

                            <p className="text-xs text-gray-500 mt-4">
                                Only records with a valid createdAt timestamp
                                are included. A value of zero means no matching
                                records were found for that day.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <h2 className="font-bold text-gray-900 mb-2">
                                About these figures
                            </h2>
                            <p className="text-sm text-gray-600">
                                Total order value is calculated by adding the
                                totalAmount (or amount) of every order currently
                                stored in Firestore. It is not a verified
                                profit figure.
                            </p>
                        </div>
                    
        </>
    );
};

export default ReportsSection;
