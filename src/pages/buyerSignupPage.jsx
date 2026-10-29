import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { friendlyError } from '../auth/authErrors';
import { ROLE_HOME } from '../auth/roles';
import {
    AuthField,
    AuthPageLayout,
    AuthSwitcher,
    PasswordInput,
} from '../components/authPageParts';

const BuyerSignupPage = () => {
    const navigate = useNavigate();
    const { signUp, user, role, loading: authLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && role && !authLoading) navigate(ROLE_HOME[role] || '/', { replace: true });
    }, [user, role, authLoading, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signUp({ name, email, password, role: 'buyer' });
        } catch (signUpError) {
            setError(friendlyError(signUpError));
            setLoading(false);
        }
    };

    return (
        <AuthPageLayout
            image="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
            title="Discover Farm-Fresh Produce"
            description="Join FarmLink today to buy fresh fruits, vegetables, and grains directly from verified Nigerian farmers at fair prices."
            footer="Direct from local fields to Nigerian tables"
        >
            <AuthSwitcher login={false} farmer={false} />
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Join FarmLink Today</h1>
                <p className="text-sm text-gray-500 mt-1">Create your buyer account and start shopping fresh</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthField label="Full Name">
                    <input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your full name" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </AuthField>
                <AuthField label="Email Address">
                    <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </AuthField>
                <AuthField label="Password">
                    <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} showPassword={showPassword} onToggle={() => setShowPassword((visible) => !visible)} placeholder="Create a password" minLength={6} />
                </AuthField>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl cursor-pointer transition">
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account? <Link to="/login" className="text-green-700 font-semibold hover:underline">Log in</Link>
            </p>
        </AuthPageLayout>
    );
};

export default BuyerSignupPage;
