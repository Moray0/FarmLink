import { useFarmerDashboard } from './FarmerDashboardContext';

const FarmProfileSection = () => {
    const { activeTab, profile, specialtyText } = useFarmerDashboard();
    if (activeTab !== 'My Farm Profile') return null;

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Farm Profile</h1>
                <p className="mt-1 text-sm text-gray-600">View the farm details currently available to your dashboard.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500 bg-green-100 text-xl font-bold text-green-800">{profile.name.charAt(0).toUpperCase()}</div>
                    <div><h2 className="text-xl font-bold text-gray-900">{profile.farmName}</h2><p className="text-sm text-gray-600">{profile.name}</p></div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                        ['Farmer Name', profile.name],
                        ['Farm Name', profile.farmName],
                        ['Farm Location', profile.location],
                        ['Product Categories', specialtyText],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-gray-50 p-4">
                            <p className="mb-1 text-xs text-gray-500">{label}</p>
                            <p className="font-semibold text-gray-900">{value}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-gray-500">These details are currently displayed from your authentication profile. Editing and saving profile changes requires connecting this section to your farmer profile data in Firestore.</p>
            </div>
        </>
    );
};

export default FarmProfileSection;
