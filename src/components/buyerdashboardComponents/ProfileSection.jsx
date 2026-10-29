import { useBuyerDashboard } from './BuyerDashboardContext';

const ProfileSection = () => {
    const { activeTab, buyerEmail, buyerName, profile, user } = useBuyerDashboard();
    if (activeTab !== 'Profile') return null;

    return (
        <section className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
                {buyerName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-4">
                <div><p className="text-xs text-gray-500">Full Name</p><p className="font-semibold text-gray-900">{buyerName}</p></div>
                <div><p className="text-xs text-gray-500">Email Address</p><p className="font-semibold text-gray-900">{buyerEmail}</p></div>
                <div><p className="text-xs text-gray-500">Account Role</p><p className="font-semibold capitalize text-gray-900">{profile?.role || 'buyer'}</p></div>
                <div><p className="text-xs text-gray-500">Account UID</p><p className="break-all font-mono text-sm text-gray-700">{user?.uid || 'Unavailable'}</p></div>
            </div>
        </section>
    );
};

export default ProfileSection;
