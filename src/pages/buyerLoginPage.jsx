import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLE_HOME } from '../auth/roles';
import { friendlyError } from '../auth/authErrors';
import {
    AuthField,
    AuthPageLayout,
    AuthSwitcher,
    PasswordInput,
} from '../components/authPageParts';

const BuyerLoginPage = () => {
    const navigate = useNavigate();
    const { signIn, user, role, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && role && !authLoading) {
            navigate(ROLE_HOME[role] || '/', { replace: true });
        }
    }, [user, role, authLoading, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email.trim(), password);
        } catch (signInError) {
            setError(friendlyError(signInError));
            setLoading(false);
        }
    };

    return (
        <AuthPageLayout
            image="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
            title="Fresh Food Directly From Local Farms"
            description="FarmLink connects you straight to trusted Nigerian farmers. Enjoy healthy, pesticide-free harvest delivered with zero middlemen and fair prices."
            footer="Direct from Nigerian farms to your table"
        >
            <AuthSwitcher login={true} farmer={false} />
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-sm text-gray-500 mt-1">Log in to your buyer account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthField label="Email Address">
                    <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </AuthField>
                <AuthField label="Password">
                    <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} showPassword={showPassword} onToggle={() => setShowPassword((visible) => !visible)} placeholder="Enter your password" />
                </AuthField>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl cursor-pointer transition">
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account? <Link to="/signup" className="text-green-700 font-semibold hover:underline">Sign up</Link>
            </p>
        </AuthPageLayout>
    );
};

export default BuyerLoginPage;
