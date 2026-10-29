import { Link } from 'react-router-dom';
import { EmptyCart } from './BuyerDashboardParts';
import { useBuyerDashboard } from './BuyerDashboardContext';

const CartSection = () => {
    const {
        activeTab, cart, cartCount, cartItemImage, cartTotal, formatPrice, updateCartQuantity,
    } = useBuyerDashboard();
    if (activeTab !== 'My Cart') return null;

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
            {cart.length === 0 ? <EmptyCart /> : (
                <>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4">
                                {cartItemImage(item) ? <img src={cartItemImage(item)} alt={item.name} className="h-16 w-16 rounded-lg object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-green-50">🌾</div>}
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                                    <p className="mt-1 text-sm font-semibold text-green-700">{formatPrice(Number(item.price || 0) * Number(item.quantityInCart || 0))}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => updateCartQuantity(item.id, -1)} className="rounded border px-3 py-1 hover:bg-gray-50" aria-label={`Decrease ${item.name} quantity`}>−</button>
                                    <span className="min-w-4 text-center">{item.quantityInCart}</span>
                                    <button onClick={() => updateCartQuantity(item.id, 1)} className="rounded border px-3 py-1 hover:bg-gray-50" aria-label={`Increase ${item.name} quantity`}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Total ({cartCount} item(s))</p>
                            <p className="text-2xl font-bold text-green-700">{formatPrice(cartTotal)}</p>
                        </div>
                        <Link to="/marketplace?cart=open" state={{ fromBuyerDashboard: true }} className="rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700">Proceed to Checkout</Link>
                    </div>
                </>
            )}
        </section>
    );
};

export default CartSection;
