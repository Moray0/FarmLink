import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { PiPottedPlant } from 'react-icons/pi';

export const AuthBrandPanel = ({ image, title, description, footer }) => (
    <div
        className="w-full lg:w-1/2 relative bg-cover bg-center min-h-75 flex flex-col justify-between p-8 sm:p-12 text-white"
        style={{ backgroundImage: `url('${image}')` }}
    >
        <div className="absolute inset-0 bg-green-950/75"></div>
        <div className="relative z-10">
            <Link to="/" className="inline-flex items-center text-4xl font-bold text-white">
                <PiPottedPlant className="w-14 h-14 text-green-300" />
                Farm<span className="text-green-300">Link</span>
            </Link>
        </div>
        <div className="relative z-10 my-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h2>
            <p className="text-green-100 text-sm sm:text-base leading-relaxed max-w-md">
                {description}
            </p>
        </div>
        <div className="relative z-10 text-xs sm:text-sm text-green-200">
            <PiPottedPlant className="w-10 h-10 inline-block" /> {footer}
        </div>
    </div>
);

export const AuthSwitcher = ({ login, farmer }) => {
    const farmerPath = login ? '/farmer-login' : '/farmer-signup';
    const buyerClass = farmer
        ? 'font-medium text-green-700 hover:text-green-900'
        : 'font-semibold bg-white text-green-800 shadow-sm';
    const farmerClass = farmer
        ? 'font-semibold bg-white text-green-800 shadow-sm'
        : 'font-medium text-green-700 hover:text-green-900';

    return (
        <div className="flex bg-green-50 p-1 rounded-xl border border-green-200 mb-6">
            <Link
                to={login ? '/login' : '/signup'}
                className={`flex-1 py-2 text-center text-sm ${buyerClass} rounded-lg`}
            >
                Buyer
            </Link>
            <Link
                to={farmerPath}
                className={`flex-1 py-2 text-center text-sm ${farmerClass} rounded-lg`}
            >
                Farmer
            </Link>
        </div>
    );
};

export const AuthPageLayout = ({ children, ...brandProps }) => (
    <div className="min-h-[calc(100vh-70px)] flex flex-col lg:flex-row">
        <AuthBrandPanel {...brandProps} />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
            <div className="w-full max-w-md">{children}</div>
        </div>
    </div>
);

export const PasswordInput = ({
    value,
    onChange,
    showPassword,
    onToggle,
    placeholder,
    minLength,
}) => (
    <div className="relative">
        <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={minLength}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
            type="button"
            onClick={onToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 rounded-r-xl"
        >
            {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
        </button>
    </div>
);

export const AuthField = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);
