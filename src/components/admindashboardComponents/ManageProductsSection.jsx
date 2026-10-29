import { useAdminDashboard } from './AdminDashboardContext';
import { Link } from 'react-router-dom';

const ManageProductsSection = () => {
    const {
        activeTab, availableProducts, formatDate, formatMoney, getStatusClass, products, renderDataError, renderEmpty,
    } = useAdminDashboard();

    if (activeTab !== 'Manage Products') return null;

    return (
        <>

                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manage Products
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                View products that farmers have saved to the
                                Firestore products collection.
                            </p>
                            <p className="text-sm font-semibold text-green-700 mt-3">
                                Total products: {products.length} · Available:{' '}
                                {availableProducts}
                            </p>
                            <Link
                                to="/marketplace"
                                className="inline-block mt-3 text-sm text-green-700 font-semibold hover:underline"
                            >
                                Open Marketplace
                            </Link>
                        </div>

                        {renderDataError('products')}

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Product</th>
                                            <th className="p-4">Farmer</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Quantity</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.length === 0
                                            ? renderEmpty(
                                                'No products have been saved to Firestore yet.',
                                                6
                                            )
                                            : products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="p-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {product.name || 'Unnamed Product'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(product.createdAt)}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {product.farmName ||
                                                            product.farmerName ||
                                                            'Unknown Farmer'}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {product.category || 'Not specified'}
                                                    </td>
                                                    <td className="p-4 font-semibold text-green-700">
                                                        {formatMoney(product.price)}
                                                    </td>
                                                    <td className="p-4 text-gray-700">
                                                        {product.quantity ?? 'Not specified'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(product.status)}`}
                                                        >
                                                            {product.status || 'Unknown'}
                                                        </span>
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

export default ManageProductsSection;
