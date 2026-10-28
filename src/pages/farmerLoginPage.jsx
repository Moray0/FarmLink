import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiPottedPlant } from 'react-icons/pi';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../auth/AuthContext';
import { ROLE_HOME } from '../auth/roles';
import { friendlyError } from '../auth/authErrors';

// Farmer Login Page
const FarmerLoginPage = () => {
    const navigate = useNavigate();
    const { signIn, user, role, loading: authLoading } = useAuth();
    useEffect(() => {
        if (user && role && !authLoading) {
            navigate(ROLE_HOME[role] || '/', {
                replace: true,
            });
        }
    }, [user, role, authLoading, navigate]);

    // State for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form login
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        await signIn(email.trim(), password);
    } catch (error) {
        setError(friendlyError(error));
        setLoading(false);
    }
};
    return (
        <div className="min-h-[calc(100vh-70px)] flex flex-col lg:flex-row">
            {/* Left side: Image and FarmLink intro */}
            <div
                className="w-full lg:w-1/2 relative bg-cover bg-center min-h-75 flex flex-col justify-between p-8 sm:p-12 text-white"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80')`,
                }}
            >
                <div className="absolute inset-0 bg-green-950/75"></div>

                {/* FarmLink Logo */}
                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center text-4xl font-bold text-white">
                        <PiPottedPlant className="w-14 h-14 text-green-300" />
                        Farm<span className="text-green-300">Link</span>
                    </Link>
                </div>

                {/* Intro message */}
                <div className="relative z-10 my-8">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                        Sell Directly to Ready Buyers
                    </h2>
                    <p className="text-green-100 text-sm sm:text-base leading-relaxed max-w-md">
                        FarmLink connects local farmers directly with buyers across Nigeria. Get fair prices for your harvest with zero middlemen.
                    </p>
                </div>

                {/* Bottom note */}
                <div className="relative z-10 text-xs sm:text-sm text-green-200">
                    <PiPottedPlant className="w-10 h-10 inline-block" /> Direct from local fields to Nigerian tables
                </div>
            </div>

            {/* Right side: Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Buyer / Farmer switcher */}
                    <div className="flex bg-green-50 p-1 rounded-xl border border-green-200 mb-6">
                        <Link
                            to="/login"
                            className="flex-1 py-2 text-center text-sm font-medium rounded-lg text-green-700 hover:text-green-900"
                        >
                            Buyer
                        </Link>
                        <Link
                            to="/farmer-login"
                            className="flex-1 py-2 text-center text-sm font-semibold rounded-lg bg-white text-green-800 shadow-sm"
                        >
                            Farmer
                        </Link>
                    </div>

                    {/* Page title */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Log in to your farmer account
                        </p>
                    </div>
                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 rounded-r-xl"
                                >
                                    {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                                </button>
                            </div>
                        </div>

                        {/* Show login errors */}
                        {error && (
                            <p role="alert" className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl cursor-pointer transition"
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    {/* Link to sign up */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don't have an account?{' '}
                        <Link to="/farmer-signup" className="text-green-700 font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FarmerLoginPage;