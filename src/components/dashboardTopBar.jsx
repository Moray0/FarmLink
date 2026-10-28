import { Link } from 'react-router-dom';
import {PiArrowLeftBold} from 'react-icons/pi';
import { PiPottedPlant } from 'react-icons/pi';

const DashboardTopBar = () => {
    return (
        <div className="flex items-center justify-between px-4 pt-4 mb-6 sm:px-6">
            <Link
                to="/"
                className="my-auto text-2xl font-bold text-white"
            >
                <PiPottedPlant className="inline-block h-9 w-9" />
                Farm<span className="text-green-400">Link</span>
            </Link>

            <Link
                to="/buyerdashboard"
                className="flex items-center rounded-lg border-none px-4 py-2 text-sm font-semibold text-white"
            >
                <PiArrowLeftBold size={18} />
                Return to dashboard
            </Link>
        </div>
    );
};

export default DashboardTopBar;