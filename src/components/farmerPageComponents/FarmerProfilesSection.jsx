import { useFarmerDirectory } from './FarmerDirectoryContext';
import { FarmerDirectoryCard } from '../publicPageSections';

const FarmerProfilesSection = () => {
    const {
        defaultFarmerImage, filteredFarmers, farmingCategories, loading, openContactForm,
        productsError, profilesError, selectedCategory, setSelectedCategory,
    } = useFarmerDirectory();

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Explore Farmer Profiles</h2>
            <p className="mb-8 text-sm text-gray-500">Each profile includes the farmer’s information and available products.</p>
            <div className="mb-8 flex flex-wrap gap-2">
                {farmingCategories.map((category) => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategory === category ? 'bg-green-600 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-green-50'}`}>
                        {category}
                    </button>
                ))}
            </div>
            {loading && <p className="mb-4 text-sm text-gray-500">Loading farmer profiles and products...</p>}
            {profilesError && <p role="alert" className="mb-4 text-sm text-red-600">{profilesError}</p>}
            {productsError && <p role="alert" className="mb-4 text-sm text-amber-700">{productsError}</p>}
            <p className="mb-6 text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">{filteredFarmers.length}</span> farmer{filteredFarmers.length !== 1 ? 's' : ''}
            </p>
            {!loading && !profilesError && filteredFarmers.length === 0 && (
                <div className="py-16 text-center">
                    <div className="mb-4 text-5xl">🧑‍🌾</div>
                    <h3 className="text-lg font-bold text-gray-800">No farmers found</h3>
                    <p className="mt-1 text-sm text-gray-500">No registered farmers match this category.</p>
                    <button onClick={() => setSelectedCategory('All Farmers')} className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm text-white">View all farmers</button>
                </div>
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFarmers.map((farmer) => (
                    <FarmerDirectoryCard key={farmer.id} farmer={farmer} onContact={openContactForm} defaultImage={defaultFarmerImage} />
                ))}
            </div>
        </section>
    );
};

export default FarmerProfilesSection;
