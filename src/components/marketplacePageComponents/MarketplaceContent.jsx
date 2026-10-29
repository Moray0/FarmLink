import { motion, useScroll } from 'motion/react';
import { PiMagnifyingGlass, PiCaretLeft, PiCaretRight, PiX, PiTrash, PiCheckCircle } from 'react-icons/pi';
import DashboardTopBar from '../dashboardTopBar';
import Footer from '../footer';
import { MarketplaceHero } from '../publicPageSections';
import { useMarketplace } from './MarketplaceContext';
import {
    detectBrand,
    formatCardNumber,
    formatExpiry,
} from '../../utils/payment';

const MarketplaceContent = () => {
    const { scrollYProgress } = useScroll();
    const context = useMarketplace();
    const { addToCart, authLoading, buyerName, buyerPhone, cart, cartError, cartItemImage, cartReady, cardCvv, cardExpiry, cardName, cardNumber, categories, checkoutError, currentPage, currentProducts, deliveryAddress, error, filteredProducts, firestoreProducts, formatPrice, goToPage, isCartOpen, isCheckoutOpen, loading, openCheckout, orderSuccess, paymentMethod, placeOrder, placingOrder, placingStep, removeFromCart, role, searchTerm, selectedCategory, setBuyerName, setBuyerPhone, setCardCvv, setCardExpiry, setCardName, setCardNumber, setCurrentPage, setDeliveryAddress, setIsCartOpen, setIsCheckoutOpen, setPaymentMethod, setSearchTerm, setSelectedCategory, totalCartCount, totalCartPrice, totalPages, user, openedFromBuyerDashboard } = context;

    return (<>
            <motion.div
                id="scroll-indicator"
                style={{
                    scaleY: scrollYProgress,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 5,
                    originY: 0,
                    backgroundColor: '#16a34a',
                    zIndex: 50
                }}
            />

            <div className="min-h-screen bg-gray-50">
                <MarketplaceHero
                    topBar={openedFromBuyerDashboard && <DashboardTopBar />}
                    cartCount={totalCartCount}
                    onOpenCart={() => setIsCartOpen(true)}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    {orderSuccess && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                            <PiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <p className="text-sm">{orderSuccess}</p>
                        </div>
                    )}

                    {cartError && (
                        <div
                            role="alert"
                            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                        >
                            {cartError}
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative w-full max-w-xl mb-6">
                        <PiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                        <input
                            type="text"
                            placeholder="Search products or farmers..."
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                        />

                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(1);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                aria-label="Clear search"
                            >
                                <PiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Product categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    selectedCategory === category
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <div className="text-center py-12 text-gray-500">
                            Loading available products...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>

                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        firestoreProducts.length === 0 && (
                            <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                Showing sample products for now. Sample
                                products cannot be purchased.
                            </p>
                        )}

                    {!loading &&
                        !error &&
                        filteredProducts.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-5xl mb-4">ðŸŒ±</div>

                                <h3 className="text-lg font-bold text-gray-800">
                                    No products found
                                </h3>

                                <p className="text-gray-500 text-sm mt-1">
                                    Try a different search or category.
                                </p>

                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('All');
                                        setCurrentPage(1);
                                    }}
                                    className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                >
                                    View all produce
                                </button>
                            </div>
                        )}

                    {/* Product cards */}
                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                                >
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-green-50 flex items-center justify-center text-5xl">
                                            ðŸŒ¾
                                        </div>
                                    )}

                                    <div className="p-4 space-y-2">
                                        {product.isSample && (
                                            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                                Sample product
                                            </span>
                                        )}

                                        <h3 className="text-lg font-bold text-gray-900">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {product.farmer} Â· {product.location}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Category: {product.category}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Pack size: {product.quantity}
                                        </p>

                                        {typeof product.stock === 'number' && (
                                            <p
                                                className={`text-xs font-semibold ${
                                                    product.stock <= 5
                                                        ? 'text-amber-700'
                                                        : 'text-green-700'
                                                }`}
                                            >
                                                {product.stock <= 5
                                                    ? `Only ${product.stock} left in stock`
                                                    : `${product.stock} in stock`}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                                            <span className="text-lg font-bold text-green-700">
                                                {formatPrice(product.price)}
                                            </span>

                                            <button
                                                onClick={() => addToCart(product)}
                                                disabled={
                                                    product.isSample ||
                                                    authLoading ||
                                                    product.stock === 0 ||
                                                    (user?.uid &&
                                                        role === 'buyer' &&
                                                        !cartReady)
                                                }
                                                className={`px-3 py-1.5 text-sm font-medium text-white rounded-lg ${
                                                    product.isSample
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50'
                                                }`}
                                            >
                                                {product.isSample
                                                    ? 'Sample Only'
                                                    : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:text-gray-300 text-gray-700 hover:bg-green-50"
                            >
                                <PiCaretLeft className="w-4 h-4" />
                                Prev
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => goToPage(index + 1)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium ${
                                            currentPage === index + 1
                                                ? 'bg-green-600 text-white'
                                                : 'text-gray-600 hover:bg-green-50'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:text-gray-300 text-gray-700 hover:bg-green-50"
                            >
                                Next
                                <PiCaretRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Shopping cart drawer */}
                {isCartOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
                        <button
                            aria-label="Close cart overlay"
                            className="absolute inset-0 cursor-default"
                            onClick={() => setIsCartOpen(false)}
                        />

                        <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-green-50">
                                <h2 className="font-bold text-gray-900 text-lg">
                                    Your Cart ({totalCartCount})
                                </h2>

                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-200"
                                    aria-label="Close cart"
                                >
                                    <PiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto">
                                {!user || role !== 'buyer' ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-3">ðŸ”</div>
                                        <p className="font-bold text-gray-800">
                                            Sign in as a buyer
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Sign in to save products to your cart.
                                        </p>
                                    </div>
                                ) : !cartReady ? (
                                    <p className="text-center py-12 text-gray-500">
                                        Loading your saved cart...
                                    </p>
                                ) : cart.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-4xl mb-3">ðŸ›’</div>
                                        <p className="font-bold text-gray-800">
                                            Your cart is empty
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Add some products!
                                        </p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 py-4 border-b border-gray-100"
                                        >
                                            {cartItemImage(item) ? (
                                                <img
                                                    src={cartItemImage(item)}
                                                    alt={item.name}
                                                    className="w-14 h-14 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center">
                                                    ðŸŒ¾
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900">
                                                    {item.name}
                                                </h4>

                                                <p className="text-xs text-gray-500">
                                                    {formatPrice(item.price)} Ã—{' '}
                                                    {item.quantityInCart}
                                                </p>

                                                <p className="text-sm font-medium">
                                                    {formatPrice(
                                                        item.price *
                                                            item.quantityInCart
                                                    )}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                className="text-gray-400 hover:text-red-500"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <PiTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {user &&
                                role === 'buyer' &&
                                cartReady &&
                                cart.length > 0 && (
                                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-gray-500 text-sm">
                                                Total
                                            </span>

                                            <span className="font-bold text-lg text-gray-900">
                                                {formatPrice(totalCartPrice)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={openCheckout}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* Checkout modal */}
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b p-5">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Checkout
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Confirm your delivery and payment details.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!placingOrder) {
                                            setIsCheckoutOpen(false);
                                        }
                                    }}
                                    disabled={placingOrder}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                    aria-label="Close checkout"
                                >
                                    <PiX className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={placeOrder}
                                className="space-y-5 p-5"
                            >
                                <div className="rounded-xl bg-green-50 p-4">
                                    <p className="text-sm text-gray-600">
                                        {totalCartCount} item(s) in your order
                                    </p>

                                    <p className="mt-1 text-2xl font-extrabold text-green-700">
                                        {formatPrice(totalCartPrice)}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Delivery fees, if applicable, are not included.
                                    </p>
                                </div>

                                {!user && (
                                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                        Sign in with your buyer account before placing your order.
                                    </p>
                                )}

                                {role && role !== 'buyer' && (
                                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                        You must use a buyer account to place an order.
                                    </p>
                                )}

                                <div>
                                    <label
                                        htmlFor="buyerName"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Full name
                                    </label>

                                    <input
                                        id="buyerName"
                                        value={buyerName}
                                        onChange={(event) =>
                                            setBuyerName(event.target.value)
                                        }
                                        required
                                        maxLength={100}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="buyerPhone"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Phone number
                                    </label>

                                    <input
                                        id="buyerPhone"
                                        type="tel"
                                        value={buyerPhone}
                                        onChange={(event) =>
                                            setBuyerPhone(event.target.value)
                                        }
                                        required
                                        maxLength={25}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="deliveryAddress"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Delivery address
                                    </label>

                                    <textarea
                                        id="deliveryAddress"
                                        value={deliveryAddress}
                                        onChange={(event) =>
                                            setDeliveryAddress(event.target.value)
                                        }
                                        required
                                        maxLength={500}
                                        rows={3}
                                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter your full delivery address"
                                    />
                                </div>

                                {/* Payment */}
                                <fieldset className="space-y-3">
                                    <legend className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Payment method
                                    </legend>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: 'card', label: 'Pay by card' },
                                            { value: 'cod', label: 'Pay on delivery' }
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                                                    paymentMethod === option.value
                                                        ? 'border-green-600 bg-green-50 text-green-800'
                                                        : 'border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={option.value}
                                                    checked={paymentMethod === option.value}
                                                    onChange={() =>
                                                        setPaymentMethod(option.value)
                                                    }
                                                    disabled={placingOrder}
                                                    className="accent-green-600"
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>

                                    {paymentMethod === 'card' ? (
                                        <div className="space-y-3 rounded-xl border border-gray-200 p-4">
                                            <input
                                                value={cardName}
                                                onChange={(event) =>
                                                    setCardName(event.target.value)
                                                }
                                                autoComplete="cc-name"
                                                maxLength={60}
                                                disabled={placingOrder}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Name on card"
                                                aria-label="Name on card"
                                            />

                                            <div className="relative">
                                                <input
                                                    value={cardNumber}
                                                    onChange={(event) =>
                                                        setCardNumber(
                                                            formatCardNumber(
                                                                event.target.value
                                                            )
                                                        )
                                                    }
                                                    inputMode="numeric"
                                                    autoComplete="cc-number"
                                                    disabled={placingOrder}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-24 font-mono outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="Card number"
                                                    aria-label="Card number"
                                                />

                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                                                    {detectBrand(cardNumber) !== 'Card'
                                                        ? detectBrand(cardNumber)
                                                        : ''}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    value={cardExpiry}
                                                    onChange={(event) =>
                                                        setCardExpiry(
                                                            formatExpiry(
                                                                event.target.value
                                                            )
                                                        )
                                                    }
                                                    inputMode="numeric"
                                                    autoComplete="cc-exp"
                                                    disabled={placingOrder}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="MM/YY"
                                                    aria-label="Expiry date"
                                                />

                                                <input
                                                    value={cardCvv}
                                                    onChange={(event) =>
                                                        setCardCvv(
                                                            event.target.value
                                                                .replace(/\D/g, '')
                                                                .slice(0, 4)
                                                        )
                                                    }
                                                    inputMode="numeric"
                                                    autoComplete="cc-csc"
                                                    type="password"
                                                    disabled={placingOrder}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="CVV"
                                                    aria-label="Security code"
                                                />
                                            </div>

                                            <p className="text-xs text-gray-500">
                                                Demo only: no payment is processed. Any
                                                number with at least one digit is accepted;
                                                only the
                                                card brand and last 4 digits are kept with
                                                your order.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
                                            Pay the farmer when your order is delivered. The
                                            order is marked as paid once the farmer completes
                                            it.
                                        </p>
                                    )}
                                </fieldset>

                                {checkoutError && (
                                    <p
                                        role="alert"
                                        className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                                    >
                                        {checkoutError}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        disabled={placingOrder}
                                        onClick={() =>
                                            setIsCheckoutOpen(false)
                                        }
                                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            placingOrder ||
                                            authLoading ||
                                            !cartReady
                                        }
                                        className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {placingOrder
                                            ? placingStep || 'Placing Order...'
                                            : paymentMethod === 'card'
                                                ? `Pay ${formatPrice(totalCartPrice)}`
                                                : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default MarketplaceContent;
