import { PiEnvelope, PiMapPin, PiPlant, PiShoppingCart } from 'react-icons/pi';

export const FarmerDirectoryHero = ({ topBar }) => (
    <section className="bg-green-700 text-white px-4 sm:px-6 pb-16">
        {topBar}
        <div className="max-w-4xl mx-auto text-center pt-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Meet the Farmers Behind Your Food
            </h1>
            <p className="text-green-100 text-sm sm:text-base max-w-2xl mx-auto">
                Get to know local farmers and explore the products they currently have available.
            </p>
        </div>
    </section>
);

export const FarmerDirectoryCard = ({ farmer, onContact, defaultImage }) => {
    const products = Array.isArray(farmer.products) ? farmer.products : [];

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative">
                <img src={farmer.image || defaultImage} alt={farmer.name} className="w-full h-48 object-cover" />
                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${farmer.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {farmer.verified ? 'Verified' : 'Pending'}
                </span>
            </div>
            <div className="p-5 flex min-h-70 flex-col">
                <div>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{farmer.name}</h3>
                            <p className="text-sm text-green-700 font-medium mt-1">{farmer.farmName}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            {products.length} product{products.length === 1 ? '' : 's'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-3">
                        <PiMapPin className="w-4 h-4" /> {farmer.location}
                    </p>
                    <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {farmer.specialty}
                    </span>
                </div>
                <div className="mt-auto pt-4">
                    <p className="text-xs text-gray-500 mb-3">
                        {products.length > 0
                            ? `Selling ${products.slice(0, 2).map((product) => product.name || 'fresh produce').join(' and ')}${products.length > 2 ? ' and more' : ''}.`
                            : 'No available products yet.'}
                    </p>
                    <button onClick={() => onContact(farmer)} type="button" aria-label={`Contact ${farmer.farmName}`} className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition">
                        <PiEnvelope className="w-4 h-4" />
                        Contact Farmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MarketplaceHero = ({ topBar, cartCount, onOpenCart }) => (
    <section className="bg-green-700 text-white py-10 pb-14 px-4 sm:px-6">
        {topBar}
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold">Marketplace</h1>
                <p className="text-green-100 mt-2 text-sm sm:text-base max-w-xl">
                    Discover fresh harvest, grains, tubers, and organic produce sourced directly from local farmers.
                </p>
            </div>
            <button onClick={onOpenCart} className="relative bg-white mr-10 text-green-800 p-3 rounded-full shadow-lg hover:bg-green-50 cursor-pointer shrink-0" aria-label="Open shopping cart">
                <PiShoppingCart className="w-6 h-6 text-green-700" />
                {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
        </div>
    </section>
);

export const FarmerDirectoryCta = () => (
    <section className="bg-green-700 text-white py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
            <PiPlant className="w-12 h-12 mx-auto mb-4 text-green-300" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Support Local Farmers</h2>
        </div>
    </section>
);
